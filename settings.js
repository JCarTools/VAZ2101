const settingsForm = document.getElementById("fuelSettingsForm");
const capacityInput = document.getElementById("tankCapacity");
const previewHalf = document.getElementById("previewHalf");
const previewFull = document.getElementById("previewFull");
const status = document.getElementById("saveStatus");
const statusText = status.querySelector("span:last-child");
const validationMessage = document.getElementById("validationMessage");
const litersFormatter = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });

let saveTimer = null;

function updatePreview(value) {
  const capacity = Number(value);
  if (!Number.isFinite(capacity)) return;
  previewHalf.textContent = litersFormatter.format(capacity / 2);
  previewFull.textContent = litersFormatter.format(capacity);
}

function validate() {
  const capacity = Number(capacityInput.value);
  if (!Number.isFinite(capacity) || capacity < 10 || capacity > 200) {
    validationMessage.textContent = "Введите объём от 10 до 200 литров";
    return null;
  }
  validationMessage.textContent = "";
  return capacity;
}

function showStatus(message, saved) {
  statusText.textContent = message;
  status.classList.toggle("is-saved", saved);
}

function saveCapacity() {
  const capacity = validate();
  if (capacity === null) return false;

  const result = window.VAZSettings.setTankCapacity(capacity);
  showStatus(result.ok ? "Изменения сохранены" : "Не удалось сохранить", result.ok);
  return result.ok;
}

function scheduleSave() {
  window.clearTimeout(saveTimer);
  showStatus("Есть несохранённые изменения", false);
  saveTimer = window.setTimeout(saveCapacity, 350);
}

const initialSettings = window.VAZSettings.load();
capacityInput.value = String(initialSettings.fuel.tankCapacityLiters);
updatePreview(capacityInput.value);

capacityInput.addEventListener("input", () => {
  updatePreview(capacityInput.value);
  if (validate() !== null) scheduleSave();
});

settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  window.clearTimeout(saveTimer);
  saveCapacity();
});
