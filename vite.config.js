import { sveltekit } from '@sveltejs/kit/vite';
import ViteYaml from '@modyfi/vite-plugin-yaml';
import legacy from '@vitejs/plugin-legacy'


/** @type {import('vite').UserConfig} */
const config = {
	plugins: [ViteYaml(), sveltekit(), legacy({
		targets: ['defaults', 'IE 11'],
	  })]
};

export default config;
