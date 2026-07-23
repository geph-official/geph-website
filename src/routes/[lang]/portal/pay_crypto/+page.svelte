<script lang="ts">
	import { fade } from 'svelte/transition';
	import { localize } from '../../../../routes/l10n';
	import { page } from '$app/stores';
	import { tokens } from './SupportedCurrencies';
	import { call_rpc, translateError } from '../../../../routes/helpers';
	import { goto } from '$app/navigation';

	const lang = $page.params['lang'];
	const l = (s: string) => localize(lang, s);

	let spinning = $state(false);

	const selectToken = async (token: string) => {
		spinning = true;
		let item = JSON.parse(sessionStorage.getItem('item') as string);
		try {
			let data = await call_rpc('start_crypto', [
				sessionStorage.getItem('sessid') || 'RESELLER',
				{
					promo: sessionStorage.getItem('promo'),
					days: +(sessionStorage.getItem('days') as any),
					item,
					token
				}
			]);

			let info = btoa(JSON.stringify(data));
			goto(`./pay_crypto/${info}`);
		} catch (e) {
			spinning = false;
			alert(translateError(String(e), lang));
		}
	};
</script>

<svelte:head>
	<title>{l('choose-a-currency')}</title>
</svelte:head>

<div class="mt-12 pt-4" in:fade>
	<h2 class="h3">{l('choose-a-currency')}</h2>
	<div class="mt-8 flex flex-col items-stretch gap-2 lg:items-start">
		{#each tokens as token}
			<button
				class="btn btn-lg variant-ringed-surface justify-start gap-2"
				onclick={() => {
					selectToken(token.name);
				}}
				disabled={spinning}
			>
				<img src={token.icon} alt="" class="h-8" />
				{l(token.name)}
				{#if token.badge}
					<span class="badge variant-filled-surface">{token.badge}</span>
				{/if}
			</button>
		{/each}
	</div>
</div>
