import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from './[lang]/$types';
import detectNearestLocale from "detect-nearest-locale"

const getLang = (locale: string[]) => {
    try {
        const lang = detectNearestLocale(['en-US', 'zh-CN', 'zh-TW', 'fa-IR'], locale);
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


export function GET(event: RequestEvent) {
    throw redirect(308, `/${getLang(event.request.headers.get('accept-language')?.split(",") || ["en"])}`);
}