import cloudflare from '@sveltejs/adapter-cloudflare';
import node from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: process.env.CF_PAGES === '1' ? cloudflare() : node()
	}
};

export default config;
