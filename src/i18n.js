import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from './locales/en/translation.json';
import translationDE from './locales/de/translation.json';
import LanguageDetector from 'i18next-browser-languagedetector';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
    de: {
        translation: translationDE
    },
    en: {
        translation: translationEN
    }
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .use(LanguageDetector)
    .init({
        resources,
        // lng: "de",
        fallbackLng: "en",

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;