const TOKEN = "SECURE_TOKEN_2025";
const MIN_SPEED = 0;
const MAX_SPEED = 160;
const MIN_ANGLE = -64;
const MAX_ANGLE = 64;

const scale = document.getElementById("speedScale");
const needle = document.getElementById("needle");
const needleLine = needle.querySelector(".needle");
const speedometer = document.querySelector(".speedometer");
const fuelNeedle = document.getElementById("fuelNeedle");
const fuelLiters = document.getElementById("fuelLiters");
const fuelScaleFull = document.getElementById("fuelScaleFull");
const litersFormatter = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });
const FUEL_EMPTY_ANGLE = -149;
const FUEL_FULL_ANGLE = -31;

let targetSpeed = 0;
let displaySpeed = 0;
let lastFrame = performance.now();
let tankCapacityLiters = window.VAZSettings.load().fuel.tankCapacityLiters;
let fuelPercent = null;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function speedToAngle(speed) {
  return MIN_ANGLE + (clamp(speed, MIN_SPEED, MAX_SPEED) / MAX_SPEED) * (MAX_ANGLE - MIN_ANGLE);
}

function speedToNeedleGeometry(speed) {
  const angle = speedToAngle(speed) * Math.PI / 180;
  const width = speedometer.clientWidth || 1;
  const height = speedometer.clientHeight || 1;

  // Стрелка направляется в реальную координату деления на эллиптической шкале.
  // Точка вращения находится по центру, на 8% выше нижней границы.
  const markX = (0.5 + Math.sin(angle) * 0.43) * width;
  const markY = (0.31 + (1 - Math.cos(angle)) * 0.55) * height;
  const pivotX = 0.5 * width;
  const pivotY = 0.92 * height;
  const dx = markX - pivotX;
  const dy = markY - pivotY;
  const scaleGap = clamp(height * 0.05, 10, 18);

  // Полотно стрелки в CSS изначально направлено влево от точки вращения.
  return {
    angle: Math.atan2(-dy, -dx) * 180 / Math.PI,
    length: Math.max(40, Math.hypot(dx, dy) - scaleGap)
  };
}

function speedToNeedleAngle(speed) {
  return speedToNeedleGeometry(speed).angle;
}

function buildScale() {
  const fragment = document.createDocumentFragment();

  for (let value = 0; value <= MAX_SPEED; value += 5) {
    const angle = speedToAngle(value);
    const radians = angle * Math.PI / 180;
    const radialAngle = speedToNeedleAngle(value) - 90;
    const tickX = 50 + Math.sin(radians) * 43;
    const tickY = 31 + (1 - Math.cos(radians)) * 55;
    const tick = document.createElement("span");
    tick.className = value % 20 === 0 ? "tick tick--major" : "tick";
    tick.style.setProperty("--tick-angle", `${radialAngle}deg`);
    tick.style.setProperty("--tick-x", `${tickX}%`);
    tick.style.setProperty("--tick-y", `${tickY}%`);
    fragment.appendChild(tick);

    if (value % 20 === 0) {
      // Цифра продолжает ту же радиальную линию от оси через деление.
      const labelDistance = 1.14;
      const labelX = 50 + (tickX - 50) * labelDistance;
      const labelY = 92 + (tickY - 92) * labelDistance;
      const label = document.createElement("span");
      label.className = "tick-label";
      label.textContent = value;
      label.style.setProperty("--label-x", `${labelX}%`);
      label.style.setProperty("--label-y", `${labelY}%`);
      fragment.appendChild(label);
    }
  }

  scale.appendChild(fragment);
}

function setSpeed(value) {
  const numeric = Number(value);
  targetSpeed = Number.isFinite(numeric) ? clamp(numeric, MIN_SPEED, MAX_SPEED) : 0;
}

function formatLiters(value) {
  return litersFormatter.format(value);
}

function renderFuel() {
  fuelScaleFull.textContent = formatLiters(tankCapacityLiters);

  if (fuelPercent === null) {
    fuelLiters.textContent = "—";
    fuelNeedle.style.transform = `rotate(${FUEL_EMPTY_ANGLE}deg)`;
    return;
  }

  const ratio = fuelPercent / 100;
  fuelLiters.textContent = formatLiters(tankCapacityLiters * ratio);
  const fuelAngle = FUEL_EMPTY_ANGLE + ratio * (FUEL_FULL_ANGLE - FUEL_EMPTY_ANGLE);
  fuelNeedle.style.transform = `rotate(${fuelAngle}deg)`;
}

function setFuelPercent(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return;
  fuelPercent = clamp(numeric, 0, 100);
  renderFuel();
}

function animate(frameTime) {
  const elapsed = Math.min((frameTime - lastFrame) / 1000, 0.1);
  lastFrame = frameTime;

  const smoothing = 1 - Math.exp(-8 * elapsed);
  displaySpeed += (targetSpeed - displaySpeed) * smoothing;
  if (Math.abs(targetSpeed - displaySpeed) < 0.03) displaySpeed = targetSpeed;

  const needleGeometry = speedToNeedleGeometry(displaySpeed);
  needle.style.transform = `rotate(${needleGeometry.angle}deg)`;
  needleLine.style.width = `${needleGeometry.length}px`;
  requestAnimationFrame(animate);
}

// Android → JS. Совместимо с форматом виджетов NaviStart.
window.onAndroidEvent = function onAndroidEvent(type, data = {}) {
  const normalizedType = String(type).toLowerCase();
  if (normalizedType === "speed") setSpeed(data.value);
  if (["fuel", "fuellevel", "fuel_level", "tank"].includes(normalizedType)) {
    setFuelPercent(data.percent ?? data.value);
  }
};

// Удобный ручной вызов из WebView или консоли: window.setDashboardSpeed(80)
window.setDashboardSpeed = setSpeed;
window.setDashboardFuelPercent = setFuelPercent;

document.addEventListener("DOMContentLoaded", () => {
  buildScale();
  renderFuel();
  requestAnimationFrame(animate);

  window.VAZSettings.subscribe((settings) => {
    tankCapacityLiters = settings.fuel.tankCapacityLiters;
    renderFuel();
  });

  if (window.androidApi && typeof window.androidApi.onJsReady === "function") {
    window.androidApi.onJsReady(TOKEN);
  }

  // Для предпросмотра в браузере: index.html?demo=1
  const previewParams = new URLSearchParams(window.location.search);
  if (previewParams.has("demo")) {
    let speedDirection = 1;
    let demoFuelPercent = 15;
    let fuelDirection = 1;

    setFuelPercent(demoFuelPercent);

    setInterval(() => {
      if (targetSpeed >= 145) speedDirection = -1;
      if (targetSpeed <= 5) speedDirection = 1;
      setSpeed(targetSpeed + speedDirection * 10);

      if (demoFuelPercent >= 95) fuelDirection = -1;
      if (demoFuelPercent <= 5) fuelDirection = 1;
      demoFuelPercent += fuelDirection * 5;
      setFuelPercent(demoFuelPercent);
    }, 550);
  } else if (previewParams.has("speed")) {
    setSpeed(previewParams.get("speed"));
  }

  if (previewParams.has("fuel")) {
    setFuelPercent(previewParams.get("fuel"));
  }
});
