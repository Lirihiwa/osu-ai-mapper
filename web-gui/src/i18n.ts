import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Импортируем словари
import enTranslation from './locales/en.json';
import ruTranslation from './locales/ru.json';

i18n
    .use(initReactI18next) // Передаем инстанс i18n в react-i18next
    .init({
        resources: {
            en: { translation: enTranslation },
            ru: { translation: ruTranslation },
        },
        lng: 'ru', // Язык по умолчанию
        fallbackLng: 'en', // Если перевода нет в RU, покажет EN
        interpolation: {
            escapeValue: false, // React сам защищает от XSS атак, отключаем
        },
    });

export default i18n;