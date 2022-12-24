import { redirect } from '@sveltejs/kit';
import detectNearestBrowserLocale from 'detect-nearest-browser-locale';

export function load() {
    const getLang = () => {
        try {
            const lang = detectNearestBrowserLocale(['en-US', 'zh-CN', 'zh-TW']);
            if (lang === 'zh-CN') {
                return 'zhs';
            }
            if (lang === 'zh-TW') {
                return 'zht';
            }
            return 'en';
        } catch (e) {
            return 'en';
        }
    };

    throw redirect(308, `/${getLang()}`);
}