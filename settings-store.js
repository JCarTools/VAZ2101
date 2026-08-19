(function initVAZSettings(global) {
  "use strict";

  const STORAGE_KEY = "vaz2101Settings";
  const CHANGE_EVENT = "vaz2101-settings-change";
  const DEFAULTS = Object.freeze({
    version: 1,
    fuel: Object.freeze({
      tankCapacityLiters: 39
    })
  });

  function isObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function merge(base, incoming) {
    const result = {};
    Object.keys(base).forEach((key) => {
      result[key] = isObject(base[key]) ? merge(base[key], {}) : base[key];
    });
    if (!isObject(incoming)) return result;

    Object.keys(incoming).forEach((key) => {
      result[key] = isObject(base[key]) && isObject(incoming[key])
        ? merge(base[key], incoming[key])
        : incoming[key];
    });
    return result;
  }

  function normalize(value) {
    const settings = merge(DEFAULTS, value);
    if (!isObject(settings.fuel)) settings.fuel = { ...DEFAULTS.fuel };
    const capacity = Number(settings.fuel.tankCapacityLiters);

    settings.version = 1;
    settings.fuel.tankCapacityLiters = Number.isFinite(capacity)
      ? Math.min(200, Math.max(10, capacity))
      : DEFAULTS.fuel.tankCapacityLiters;

    return settings;
  }

  function load() {
    try {
      return normalize(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
    } catch (_error) {
      return normalize({});
    }
  }

  function save(value) {
    const settings = normalize(value);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (_error) {
      return { ok: false, settings };
    }

    global.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: settings }));
    return { ok: true, settings };
  }

  function setTankCapacity(liters) {
    const settings = load();
    settings.fuel.tankCapacityLiters = liters;
    return save(settings);
  }

  function subscribe(listener) {
    const onLocalChange = (event) => listener(event.detail || load());
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) listener(load());
    };

    global.addEventListener(CHANGE_EVENT, onLocalChange);
    global.addEventListener("storage", onStorage);
    return () => {
      global.removeEventListener(CHANGE_EVENT, onLocalChange);
      global.removeEventListener("storage", onStorage);
    };
  }

  global.VAZSettings = Object.freeze({
    STORAGE_KEY,
    defaults: DEFAULTS,
    load,
    save,
    setTankCapacity,
    subscribe
  });
})(window);
