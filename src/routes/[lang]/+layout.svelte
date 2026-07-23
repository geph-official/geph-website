<script lang="ts">
	import { page } from '$app/stores';
	import { localize } from '../l10n';
	import Navbar from './Navbar.svelte';
	import Footer from './Footer.svelte';

	let { children } = $props();

	const lang = $page.params['lang'];
</script>

<div
	lang={localize(lang, 'langcode')}
	dir={localize(lang, 'dir')}
	class="flex min-h-screen flex-col"
>
	<Navbar />
	<main class="frame grow">
		{@render children()}
	</main>
	<Footer />
</div>
