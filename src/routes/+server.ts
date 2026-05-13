
export const prerender = false;

import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from './[lang]/$types';
import detectNearestLocale from "detect-nearest-locale"

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

const SERVER_LOCALES = ['en-US', 'zh-CN', 'zh-TW', 'fa-IR', 'ru-RU', ...ARABIC_LOCALES];

const parseAcceptLanguage = (header: string | null) =>
    header?.split(",").map((lang) => lang.trim().split(";")[0]).filter(Boolean) || ["en"];

const getLang = (locale: string[]) => {
    try {
        const lang = detectNearestLocale(SERVER_LOCALES, locale);
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
    } catch (e) {
        return 'en';
    }
};


export function GET(event: RequestEvent) {
    throw redirect(308, `/${getLang(parseAcceptLanguage(event.request.headers.get('accept-language')))}`);
}
