import l10n_data from "./l10n_data.yaml"
import detectNearestBrowserLocale from 'detect-nearest-browser-locale';

const ARABIC_LOCALES = [
    'ar',
    'ar-AE',
    'ar-BH',
    'ar-DZ',
    'ar-EG',
    'ar-IQ',
    'ar-JO',
    'ar-KW',
    'ar-LB',
    'ar-LY',
    'ar-MA',
    'ar-OM',
    'ar-QA',
    'ar-SA',
    'ar-SD',
    'ar-SY',
    'ar-TN',
    'ar-YE'
];

const BROWSER_LOCALES = ['en-US', 'zh-CN', 'zh-TW', 'fa-IR', 'ru-RU', ...ARABIC_LOCALES];

const toSiteLang = (lang: string) => {
    if (lang === 'zh-CN') {
        return 'zhs';
    }
    if (lang === 'zh-TW') {
        return 'zht';
    }
    if (lang === 'fa-IR') {
        return 'fa';
    }
    if (lang === 'ru-RU') {
        return 'ru';
    }
    if (lang.startsWith('ar')) {
        return 'ar';
    }
    return 'en';
};

export const localize = (lang: string, s: string) => {
    if (s in l10n_data) {
        const mapping = (l10n_data as any)[s];
        if (lang in mapping) {
            return mapping[lang]
        }
    }
    return "!!MISSING!!"
};

export const getLang = () => {
    try {
        const lang = detectNearestBrowserLocale(BROWSER_LOCALES);
        return toSiteLang(lang);
    } catch (e) {
        return 'en';
    }
};
