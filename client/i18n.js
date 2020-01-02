import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translation_fr from "./translations/fr/translation.json";
import translation_en from "./translations/en/translation.json";

// Initialize configurations for translation
i18n.use(initReactI18next).init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: "fr", // language to use
  resources: {
    en: {
      translation: translation_en
    },
    fr: {
      translation: translation_fr
    }
  }
});

export default i18n;
