import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import { skeleton } from '@skeletonlabs/tw-plugin';
import { lightTheme } from './light-theme';
import { darkTheme } from './dark-theme';

export default {
	// yaml is included because l10n_data.yaml embeds HTML with utility classes
	content: ['./src/**/*.{html,js,svelte,ts,yaml}'],
	plugins: [
		forms,
		skeleton({
			themes: { custom: [lightTheme, darkTheme] }
		})
	]
} satisfies Config;
