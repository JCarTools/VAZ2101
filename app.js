const TOKEN = "SECURE_TOKEN_2025";
const MIN_SPEED = 0;
const MAX_SPEED = 160;
const MIN_ANGLE = -64;
const MAX_ANGLE = 64;

const scale = document.getElementById("speedScale");
const needle = document.getElementById("needle");
const needleLine = needle.querySelector(".needle");
const speedometer = document.querySelector(".speedometer");

let targetSpeed = 0;
let displaySpeed = 0;
let lastFrame = performance.now();

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
  if (type === "speed") setSpeed(data.value);
};

// Удобный ручной вызов из WebView или консоли: window.setDashboardSpeed(80)
window.setDashboardSpeed = setSpeed;

document.addEventListener("DOMContentLoaded", () => {
  buildScale();
  requestAnimationFrame(animate);

  if (window.androidApi && typeof window.androidApi.onJsReady === "function") {
    window.androidApi.onJsReady(TOKEN);
  }

  // Для предпросмотра в браузере: index.html?demo=1
  const previewParams = new URLSearchParams(window.location.search);
  if (previewParams.has("demo")) {
    let direction = 1;
    setInterval(() => {
      if (targetSpeed >= 145) direction = -1;
      if (targetSpeed <= 5) direction = 1;
      setSpeed(targetSpeed + direction * 10);
    }, 550);
  } else if (previewParams.has("speed")) {
    setSpeed(previewParams.get("speed"));
  }
});
