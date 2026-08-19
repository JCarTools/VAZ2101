const settingsForm = document.getElementById("fuelSettingsForm");
const capacityInput = document.getElementById("tankCapacity");
const previewHalf = document.getElementById("previewHalf");
const previewFull = document.getElementById("previewFull");
const languageSelect = document.getElementById("languageSelect");
const rightGaugeOptions = document.querySelectorAll("[data-right-gauge-mode]");
const status = document.getElementById("saveStatus");
const statusText = status.querySelector("span:last-child");
const validationMessage = document.getElementById("validationMessage");
const navigationItems = document.querySelectorAll("[data-settings-panel]");

let language = "ru";
let litersFormatter = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });
let saveTimer = null;
let statusKey = "settings.loaded";
let validationKey = null;

function translate(key) {
  return window.VAZI18n.t(key, language);
}

function updatePreview(value) {
  const capacity = Number(value);
  if (!Number.isFinite(capacity)) return;
  previewHalf.textContent = litersFormatter.format(capacity / 2);
  previewFull.textContent = litersFormatter.format(capacity);
}

function renderMessages() {
  statusText.textContent = translate(statusKey);
  validationMessage.textContent = validationKey ? translate(validationKey) : "";
}

function applyLanguage(nextLanguage) {
  language = window.VAZI18n.apply(document, nextLanguage);
  litersFormatter = new Intl.NumberFormat(language === "en" ? "en-US" : "ru-RU", { maximumFractionDigits: 1 });
  languageSelect.value = language;
  updatePreview(capacityInput.value);
  renderMessages();
}

function validate() {
  const capacity = Number(capacityInput.value);
  if (!Number.isFinite(capacity) || capacity < 10 || capacity > 200) {
    validationKey = "settings.validation.capacity";
    renderMessages();
    return null;
  }
  validationKey = null;
  renderMessages();
  return capacity;
}

function showStatus(key, saved) {
  statusKey = key;
  renderMessages();
  status.classList.toggle("is-saved", saved);
}

function saveCapacity() {
  const capacity = validate();
  if (capacity === null) return false;

  const result = window.VAZSettings.setTankCapacity(capacity);
  showStatus(result.ok ? "settings.status.saved" : "settings.status.failed", result.ok);
  return result.ok;
}

function scheduleSave() {
  window.clearTimeout(saveTimer);
  showStatus("settings.status.unsaved", false);
  saveTimer = window.setTimeout(saveCapacity, 350);
}

function openPanel(panelId) {
  navigationItems.forEach((item) => {
    const active = item.dataset.settingsPanel === panelId;
    item.classList.toggle("is-active", active);
    if (active) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });

  document.querySelectorAll(".settings-panel").forEach((panel) => {
    const active = panel.id === panelId;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });
}

function renderRightGaugeMode(mode) {
  rightGaugeOptions.forEach((option) => {
    const active = option.dataset.rightGaugeMode === mode;
    option.classList.toggle("is-active", active);
    option.setAttribute("aria-pressed", String(active));
  });
}

const initialSettings = window.VAZSettings.load();
capacityInput.value = String(initialSettings.fuel.tankCapacityLiters);
renderRightGaugeMode(initialSettings.display.rightGaugeMode);
applyLanguage(initialSettings.ui.language);

capacityInput.addEventListener("input", () => {
  updatePreview(capacityInput.value);
  if (validate() !== null) scheduleSave();
});

settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  window.clearTimeout(saveTimer);
  saveCapacity();
});

languageSelect.addEventListener("change", () => {
  const result = window.VAZSettings.setLanguage(languageSelect.value);
  applyLanguage(result.settings.ui.language);
  showStatus(result.ok ? "settings.status.languageSaved" : "settings.status.failed", result.ok);
});

rightGaugeOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const result = window.VAZSettings.setRightGaugeMode(option.dataset.rightGaugeMode);
    renderRightGaugeMode(result.settings.display.rightGaugeMode);
    showStatus(result.ok ? "settings.status.displaySaved" : "settings.status.failed", result.ok);
  });
});

navigationItems.forEach((item) => {
  item.addEventListener("click", () => openPanel(item.dataset.settingsPanel));
});
