<script lang="ts">
	import QRCode from 'qrcode';
	import { page } from '$app/stores';
	import { localize } from '../../../../../routes/l10n';
	import { onDestroy } from 'svelte';
	import { call_rpc } from '../../../../../routes/helpers';

	const lang = $page.params['lang'];
	const info = atob($page.params['info']);
	const paymentInfo = JSON.parse(info);
	const networkKeyByToken: Record<string, string> = {
		btc: 'bitcoin-mainnet',
		eth: 'ethereum-mainnet',
		xmr: 'monero-mainnet',
		usdttrc20: 'tron-trc20',
		doge: 'dogecoin-mainnet',
		trx: 'tron-mainnet'
	};

	const l = (s: string) => localize(lang, s);
	const networkKey =
		networkKeyByToken[String(paymentInfo.ticker || '').toLowerCase()] || 'crypto-network-unknown';

	let status: string | null = $state(null);
	const refresh = async () => {
		try {
			let new_status = await call_rpc('check_crypto', [paymentInfo.id]);
			if (new_status !== status) {
				status = new_status;
			}
		} catch (e) {
			console.error(e);
		}
	};
	const refresher = setInterval(refresh, 1000);
	refresh();
	onDestroy(() => clearInterval(refresher));
</script>

<svelte:head>
	<title>{l('send-crypto')}</title>
</svelte:head>

<div class="pt-12 lg:mt-12">
	<h2 class="h3">{l('please-send-funds')}</h2>

	<div class="card mt-4 flex flex-col gap-6 break-words p-4 pb-8 font-medium lg:w-fit lg:flex-row">
		<div class="lg:max-w-[50vw]">
			<span>{l('amount')}</span><br />
			<span class="big-text">
				{paymentInfo.amount}
				<span class="font-medium opacity-80">{paymentInfo.ticker.toUpperCase()}</span>
			</span><br />
			<br />
			<span>{l('to-this-address')}</span><br />
			<span class="big-text">{paymentInfo.payin_address}</span>
		</div>
		<div class="text-center">
			{#await QRCode.toDataURL(paymentInfo.payin_address) then qrcode}
				<img src={qrcode} alt="" height="200" class="inline-block" />
			{/await}
		</div>
	</div>

	<aside class="alert variant-ghost-warning mt-6" role="alert">
		<div class="alert-message">
			{l('send-only-on-network')} <strong>{l(networkKey)}</strong>.
		</div>
	</aside>

	<aside class="alert variant-ghost-error mt-4" role="alert">
		<div class="alert-message">
			{@html l('crypto-irreversible-warning')}
		</div>
	</aside>

	<div class="mt-6">
		{#if status}
			{#if status == 'refunded' || status == 'failed'}
				<aside class="alert variant-ghost-error med-text">{l(status)}!</aside>
			{:else if status == 'finished'}
				<aside class="alert variant-ghost-success med-text">
					{l(status)}! <a href="../">{l('return-to-portal')}</a>
				</aside>
			{:else}
				<div class="flex items-center justify-center gap-4 lg:justify-start">
					<div class="spinner h-8 w-8" role="status">
						<span class="sr-only">{l('loading')}</span>
					</div>
					<span class="med-text">{l(status)}...</span>
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	.big-text {
		font-size: 1.6rem;
		font-weight: 600;
	}

	.med-text {
		font-size: 1.2rem;
		font-weight: 500;
	}
</style>
