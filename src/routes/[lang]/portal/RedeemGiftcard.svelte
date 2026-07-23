<script lang="ts">
	import { call_rpc } from '../../helpers';
	import { page } from '$app/stores';
	import { localize } from '../../../routes/l10n';
	import debounce from 'debounce';
	const lang = $page.params['lang'];

	const l = (s: string) => localize(lang, s);

	function translateRedeemGiftcardError(e: string, lang: string): string {
		if (e.includes('no such giftcard')) {
			return localize(lang, 'incorrect-giftcard');
		}
		if (e.includes('400')) {
			return localize(lang, 'bad-request');
		} else if (e.includes('500')) {
			return localize(lang, 'internal-server-error');
		} else {
			return localize(lang, 'error');
		}
	}

	let gc_id = $state('');
	let promo = $state('');
	const redeemGiftcard = async (sessid: any, gc_id: string) => {
		try {
			await call_rpc('spend_giftcard', [
				sessid,
				{
					gc_id,
					promo
				}
			]);
			alert(l('giftcard-applied'));
			window.location.reload();
		} catch (e) {
			alert(translateRedeemGiftcardError(String(e), lang));
		}
	};

	let days: number | null = $state(null);
	let giftcardError = $state('');

	const peekGiftcard = debounce(async (sessid: any, gc_id: string, promo: string) => {
		giftcardError = '';
		days = null;
		try {
			days = await call_rpc('peek_giftcard', [
				sessid,
				{
					gc_id,
					promo
				}
			]);
		} catch (e) {
			giftcardError = translateRedeemGiftcardError(String(e), lang);
			days = null;
		}
	}, 500);

	$effect(() => {
		peekGiftcard(sessionStorage.getItem('sessid'), gc_id, promo);
	});
</script>

<div class="space-y-8">
	<div class="grid gap-6 lg:grid-cols-2">
		<div>
			<h2>{l('redeem-giftcard')}</h2>
			<input type="text" class="input mb-2" bind:value={gc_id} placeholder={l('giftcard-id')} />
			{#if giftcardError != ''}
				<small class="font-medium text-error-600">{giftcardError}</small>
			{:else if days != null}
				<small>{l('giftcard-days')}<b>{days}</b></small>
			{:else}
				<span class="spinner h-4 w-4" role="status"></span>
			{/if}
		</div>
		<div>
			<h2>{l('got-a-promo-code')}</h2>
			<input type="text" class="input w-auto" bind:value={promo} placeholder={l('promo-code')} />
		</div>
	</div>

	<button
		class="btn variant-filled-success"
		onclick={() => {
			redeemGiftcard(sessionStorage.getItem('sessid'), gc_id);
		}}
		disabled={days == null}
	>
		{l('redeem')}
	</button>
</div>

<style>
	h2 {
		font-size: 1.4rem;
		letter-spacing: -0.02rem;
		font-weight: 550;
		opacity: 0.8;
		margin-bottom: 0.75rem;
	}
</style>
