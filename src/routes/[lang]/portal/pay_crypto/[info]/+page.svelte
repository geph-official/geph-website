<script lang="ts">
	import QRCode from 'qrcode';
	import { page } from '$app/stores';
	import Navbar from '../../../../../routes/[lang]/Navbar.svelte';
	import Footer from '../../../../../routes/[lang]/Footer.svelte';
	import { localize } from '../../../../../routes/l10n';
	import { onDestroy } from 'svelte';
	import axios from 'axios';
	import { BINDER_ADDR, call_rpc } from '../../../../../routes/helpers';

	const lang = $page.params['lang'];
	const info = atob($page.params['info']);
	const paymentInfo = JSON.parse(info);

	$: l = (s: string) => localize(lang, s);
	let status: string | null = null;
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

<div lang={localize(lang, 'langcode')} dir="auto">
	<Navbar />
	<div class="container mt-lg-5 pt-5">
		<div class="row">
			<div class="col">
				<h2>{l('please-send-funds')}</h2>
			</div>
		</div>
		<div class="row">
			<div class="col-lg">
				<div class="deposit-info">
					<div class="deposit-left">
						<span>{l('amount')}</span><br />
						<span class="big-text"
							>{paymentInfo.amount}
							<span class="ticker">{paymentInfo.ticker.toUpperCase()}</span></span
						><br />
						<br />
						<span>{l('to-this-address')}</span><br />
						<span class="big-text">{paymentInfo.payin_address}</span>
					</div>
					<div class="deposit-right">
						{#await QRCode.toDataURL(paymentInfo.payin_address) then qrcode}
							<img src={qrcode} alt="" height="200" />
						{/await}
					</div>
				</div>
			</div>
		</div>
		<div class="row mt-4">
			<div class="col-lg">
				{#if status}
					{#if status == 'refunded' || status == 'failed'}
						<div class="med-text alert alert-danger">{l(status)}!</div>
					{:else if status == 'finished'}
						<div class="med-text alert alert-success">
							{l(status)}! <a href="../">{l('return-to-portal')}</a>
						</div>
					{:else}
						<div class="spinner">
							<div
								class="spinner-border text-primary"
								style="width: 2rem; height: 2rem;"
								role="status"
							>
								<span class="visually-hidden">{l('loading')}</span>
							</div>
							<span class="med-text ms-3">{l(status)}...</span>
						</div>
					{/if}
				{/if}
			</div>
			<div class="col-lg" />
		</div>
	</div>
	<Footer />
</div>

<style>
	h2 {
		font-size: 1.6rem;
		letter-spacing: -0.02rem;
		font-weight: 550;
	}

	.deposit-info {
		border: 1px solid #ddd;
		border-radius: 0.5rem;
		margin-top: 1rem;
		padding: 1rem;
		padding-bottom: 2rem;
		display: flex;
		flex-direction: column;

		align-items: top;

		overflow-wrap: break-word;

		font-weight: 500;
	}

	.deposit-right {
		text-align: center;
	}

	.big-text {
		font-size: 1.6rem;
		font-weight: 600;
	}

	.med-text {
		font-size: 1.2rem;
		font-weight: 500;
	}

	.spinner {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.spinner-border {
		animation-duration: 2s;
	}

	.ticker {
		opacity: 0.8;
		font-weight: 500;
	}

	@media (min-width: 992px) {
		.deposit-info {
			flex-direction: row;
			width: fit-content;
		}

		.deposit-left {
			max-width: 50vw;
			padding-right: 3rem;
		}
		.spinner {
			justify-content: left;
		}
	}
</style>
