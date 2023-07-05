import axios from 'axios';
import { localize } from './l10n';
import { goto } from '$app/navigation';

export const BINDER_ADDR = 'http://central.geph.io:28081';
// export const BINDER_ADDR = 'http://localhost:28080';

export function translateError(e: string, lang: string): string {
    console.log('login page error: ' + e);
    if (e.includes('403')) {
        return localize(lang, 'incorrect-login');
    } else if (e.includes('500')) {
        return localize(lang, 'internal-server-error');
    } else {
        return localize(lang, 'unknown-error') + ': ' + e;
    }
}

export async function handleLoginClick(lang: string, uname: string, pwd: string) {
    try {
        let resp = await axios.post(BINDER_ADDR + '/v2/login', {
            uname,
            pwd,
        });

        console.log(resp.status);
        if (resp.status < 400) {
            let session_id = await resp.data;
            console.log(session_id);
            sessionStorage.setItem('sessid', session_id);
            goto(`/${lang}/portal`);
        } else {
            process.browser && alert(translateError(resp.data, lang));
        }
    } catch (e) {
        process.browser && alert(translateError(String(e), lang));
    }
}