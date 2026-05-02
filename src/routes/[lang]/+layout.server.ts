import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

const supportedLanguages = new Set(['en', 'zhs', 'zht', 'fa']);

export const load: LayoutServerLoad = ({ params }) => {
	if (!supportedLanguages.has(params.lang)) {
		throw error(404, 'Not found');
	}
};
