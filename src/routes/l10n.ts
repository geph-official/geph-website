import l10n_data from "./l10n_data.yaml"
import detectNearestBrowserLocale from 'detect-nearest-browser-locale';

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
        const lang = detectNearestBrowserLocale(['en-US', 'zh-CN', 'zh-TW', 'fa-IR']);
        if (lang === 'zh-CN') {
            return 'zhs';
        }
        if (lang === 'zh-TW') {
            return 'zht';
        }
        if (lang === 'fa-IR') {
            return 'fa';
        }
        return 'en';
    } catch (e) {
        return 'en';
    }
};