import axios from 'axios';
import { localize } from './l10n';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';



// export const BINDER_ADDR = 'http://localhost:28081';
export const BINDER_ADDR = 'https://staging.web-backend.geph.io';
// export const BINDER_ADDR = 'https://web-backend.geph.io';

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

export async function call_rpc(method: string, params: any[]): Promise<any> {
    let resp = await axios.post(BINDER_ADDR + '/rpc', {
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": params
    });

    // Check if the response contains an error
    if (resp.status >= 400) {
        throw resp.status;
    }
    if (resp.data.error) {
        // If there is an error, throw it
        throw resp.data.error.message;
    }
    // If no error, return the result
    return resp.data.result;
}

export async function handleLoginClick(lang: string, uname: string, pwd: string) {
    try {
        let session_id = await call_rpc("login", [uname, pwd]);
        console.log(session_id);
        sessionStorage.setItem('sessid', session_id);
        goto(`/${lang}/portal`);

    } catch (e) {
        browser && alert(translateError(String(e), lang));
    }
}