import { redirect } from '@sveltejs/kit';
import { getLang } from './l10n';

export function load() {


    throw redirect(308, `/${getLang()}`);
}