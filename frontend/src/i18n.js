import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.json';
import hiTranslation from './locales/hi.json';
import teTranslation from './locales/te.json';
import esTranslation from './locales/es.json';
import frTranslation from './locales/fr.json';
import zhTranslation from './locales/zh.json';
import bnTranslation from './locales/bn.json';
import arTranslation from './locales/ar.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslation
            },
            hi: {
                translation: hiTranslation
            },
            te: {
                translation: teTranslation
            },
            es: {
                translation: esTranslation
            },
            fr: {
                translation: frTranslation
            },
            zh: {
                translation: zhTranslation
            },
            bn: {
                translation: bnTranslation
            },
            ar: {
                translation: arTranslation
            }
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
