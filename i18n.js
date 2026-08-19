(function initVAZI18n(global) {
  "use strict";

  const translations = {
    ru: {
      "dashboard.title": "ВАЗ-2101 — ретро приборка",
      "dashboard.aria": "Ретро приборная панель ВАЗ-2101",
      "dashboard.fuelAria": "Уровень топлива",
      "dashboard.fuel": "БЕНЗИН",
      "dashboard.literShort": "л",
      "dashboard.speedUnit": "км/ч",
      "dashboard.tempAria": "Температура охлаждающей жидкости",
      "dashboard.water": "ВОДА",
      "dashboard.miniMapAria": "Мини-карта навигации",
      "dashboard.mapWaiting": "ОЖИДАНИЕ КАРТЫ",
      "dashboard.warningAria": "Контрольные лампы",
      "dashboard.reserve": "РЕЗЕРВ",
      "dashboard.highBeam": "ДАЛЬНИЙ",
      "dashboard.charge": "ЗАРЯД",
      "dashboard.turn": "ПОВОРОТ",
      "dashboard.reserveOn": "Топливо в резерве",
      "dashboard.reserveOff": "Резерв топлива не активен",
      "dashboard.highBeamOn": "Дальний свет включён",
      "dashboard.highBeamOff": "Дальний свет выключен",
      "dashboard.turnOff": "Поворотники выключены",
      "dashboard.turnLeft": "Включён левый поворотник",
      "dashboard.turnRight": "Включён правый поворотник",
      "dashboard.hazardOn": "Аварийная сигнализация включена",

      "settings.title": "Жигули — настройки приборки",
      "settings.subtitle": "настройка приборной панели",
      "settings.loaded": "Настройки загружены",
      "settings.navAria": "Разделы настроек",
      "settings.sections": "Разделы",
      "settings.fuelNav": "Топливо",
      "settings.fuelNavHint": "бак и шкала",
      "settings.languageNav": "Язык",
      "settings.languageNavHint": "язык интерфейса",
      "settings.displayNav": "Экран",
      "settings.displayNavHint": "правый индикатор",
      "settings.future": "Здесь появятся следующие настройки приборки",
      "settings.fuelEyebrow": "Топливная система",
      "settings.fuelTitle": "Объём топливного бака",
      "settings.fuelDescription": "Приборка получает остаток топлива в процентах и пересчитывает его в литры по заданному объёму.",
      "settings.capacityTitle": "Полный объём бака",
      "settings.capacityHint": "Используется для цифр шкалы и расчёта оставшихся литров",
      "settings.literShort": "л",
      "settings.previewAria": "Предварительный вид шкалы топлива",
      "settings.previewTitle": "Шкала в приборке",
      "settings.liters": "литры",
      "settings.save": "Сохранить",
      "settings.languageEyebrow": "Интерфейс",
      "settings.languageTitle": "Язык приборной панели",
      "settings.languageDescription": "Выбранный язык применяется к приборке и этой странице настроек сразу после выбора.",
      "settings.languageField": "Язык интерфейса",
      "settings.languageHint": "Можно изменить в любое время без перезапуска приборки",
      "settings.displayEyebrow": "Отображение",
      "settings.displayTitle": "Правый индикатор",
      "settings.displayDescription": "Выберите, что показывать вместо стандартного индикатора температуры воды.",
      "settings.rightGaugeField": "Содержимое правого блока",
      "settings.rightGaugeHint": "Мини-карта работает через навигационный источник Android",
      "settings.rightGaugeAria": "Режим правого индикатора",
      "settings.rightGaugeTemperature": "Температура воды",
      "settings.rightGaugeMiniMap": "Мини-карта",
      "settings.status.saved": "Изменения сохранены",
      "settings.status.languageSaved": "Язык изменён",
      "settings.status.displaySaved": "Отображение изменено",
      "settings.status.unsaved": "Есть несохранённые изменения",
      "settings.status.failed": "Не удалось сохранить",
      "settings.validation.capacity": "Введите объём от 10 до 200 литров"
    },
    en: {
      "dashboard.title": "VAZ-2101 — retro dashboard",
      "dashboard.aria": "VAZ-2101 retro instrument cluster",
      "dashboard.fuelAria": "Fuel level",
      "dashboard.fuel": "FUEL",
      "dashboard.literShort": "L",
      "dashboard.speedUnit": "km/h",
      "dashboard.tempAria": "Coolant temperature",
      "dashboard.water": "WATER",
      "dashboard.miniMapAria": "Navigation mini-map",
      "dashboard.mapWaiting": "WAITING FOR MAP",
      "dashboard.warningAria": "Warning indicators",
      "dashboard.reserve": "RESERVE",
      "dashboard.highBeam": "HIGH BEAM",
      "dashboard.charge": "CHARGE",
      "dashboard.turn": "TURN",
      "dashboard.reserveOn": "Fuel reserve is active",
      "dashboard.reserveOff": "Fuel reserve is inactive",
      "dashboard.highBeamOn": "High beam is on",
      "dashboard.highBeamOff": "High beam is off",
      "dashboard.turnOff": "Turn signals are off",
      "dashboard.turnLeft": "Left turn signal is on",
      "dashboard.turnRight": "Right turn signal is on",
      "dashboard.hazardOn": "Hazard lights are on",

      "settings.title": "Zhiguli — dashboard settings",
      "settings.subtitle": "instrument cluster settings",
      "settings.loaded": "Settings loaded",
      "settings.navAria": "Settings sections",
      "settings.sections": "Sections",
      "settings.fuelNav": "Fuel",
      "settings.fuelNavHint": "tank and gauge",
      "settings.languageNav": "Language",
      "settings.languageNavHint": "interface language",
      "settings.displayNav": "Display",
      "settings.displayNavHint": "right gauge",
      "settings.future": "More dashboard settings will appear here",
      "settings.fuelEyebrow": "Fuel system",
      "settings.fuelTitle": "Fuel tank capacity",
      "settings.fuelDescription": "The dashboard receives fuel level as a percentage and converts it to liters using the selected tank capacity.",
      "settings.capacityTitle": "Full tank capacity",
      "settings.capacityHint": "Used for the gauge labels and remaining fuel calculation",
      "settings.literShort": "L",
      "settings.previewAria": "Fuel gauge preview",
      "settings.previewTitle": "Dashboard gauge",
      "settings.liters": "liters",
      "settings.save": "Save",
      "settings.languageEyebrow": "Interface",
      "settings.languageTitle": "Dashboard language",
      "settings.languageDescription": "The selected language is applied to the dashboard and this settings page immediately.",
      "settings.languageField": "Interface language",
      "settings.languageHint": "You can change it at any time without restarting the dashboard",
      "settings.displayEyebrow": "Display",
      "settings.displayTitle": "Right gauge",
      "settings.displayDescription": "Choose what to show instead of the standard coolant temperature gauge.",
      "settings.rightGaugeField": "Right block content",
      "settings.rightGaugeHint": "The mini-map uses the Android navigation source",
      "settings.rightGaugeAria": "Right gauge mode",
      "settings.rightGaugeTemperature": "Water temperature",
      "settings.rightGaugeMiniMap": "Mini-map",
      "settings.status.saved": "Changes saved",
      "settings.status.languageSaved": "Language changed",
      "settings.status.displaySaved": "Display changed",
      "settings.status.unsaved": "There are unsaved changes",
      "settings.status.failed": "Could not save changes",
      "settings.validation.capacity": "Enter a capacity between 10 and 200 liters"
    }
  };

  function normalizeLanguage(language) {
    return Object.prototype.hasOwnProperty.call(translations, language) ? language : "ru";
  }

  function t(key, language) {
    const selected = normalizeLanguage(language || "ru");
    return translations[selected][key] || translations.ru[key] || key;
  }

  function apply(root, language) {
    const selected = normalizeLanguage(language);
    document.documentElement.lang = selected;
    root.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.i18n, selected);
    });
    root.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel, selected));
    });
    const titleKey = document.documentElement.dataset.i18nTitle;
    if (titleKey) document.title = t(titleKey, selected);
    return selected;
  }

  global.VAZI18n = Object.freeze({ translations, normalizeLanguage, t, apply });
})(window);
