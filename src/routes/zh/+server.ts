import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const redirectToSimplifiedChinese: RequestHandler = ({ url }) => {
	throw redirect(301, `/zhs${url.search}`);
};

export const GET = redirectToSimplifiedChinese;
export const HEAD = redirectToSimplifiedChinese;
