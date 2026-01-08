"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import esCommon from "../public/locales/es/common.json"
import enCommon from "../public/locales/en/common.json";

i18n.use(initReactI18next).init({
  resources: {
    es: { common: esCommon },
    en: { common: enCommon },
  },
  lng: "es",
  fallbackLng: "es",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
