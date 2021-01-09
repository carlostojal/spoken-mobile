import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../assets/locales/en/translation.json";
import pt from "../assets/locales/pt/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    en: en,
    pt: pt
  },
  lng: 'pt',
  fallbackLng: 'pt',
  debug: false,
  interpolation: {
    escapeValue: false
  }
});

export default i18n;