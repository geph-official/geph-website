<script lang="ts">
	import Navbar from '../../Navbar.svelte';
	import Footer from '../../Footer.svelte';
	import { fade } from 'svelte/transition';
	import { localize } from '../../../../routes/l10n';
	import { page } from '$app/stores';
	import { tokens } from './SupportedCurrencies';
	import axios from 'axios';
	import { BINDER_ADDR, call_rpc } from '../../../../routes/helpers';
	import { translateError } from '../billing';
	import { goto } from '$app/navigation';

	const lang = $page.params['lang'];
	$: l = (s: string) => localize(lang, s);

	let spinning = false;

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

<div lang={localize(lang, 'langcode')} dir="auto">
	<Navbar />
	<div class="container mt-5 pt-3" in:fade>
		<div class="row">
			<div class="col">
				<h2>{l('choose-a-currency')}</h2>
			</div>
		</div>
		<div class="row mt-5">
			<div class="col">
				<div class="buttons">
					{#each tokens as token}
						<button
							class="btn btn-outline-dark me-2 btn-lg"
							on:click={() => {
								selectToken(token.name);
							}}
							disabled={spinning}
						>
							<img src={token.icon} alt="" />
							{l(token.name)}
							{#if token.badge}
								<span class="badge bg-secondary">{token.badge}</span>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
	<Footer />
</div>

<style>
	.btn {
		border: 1px solid gray;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.btn img {
		height: 2rem;
		margin-right: 0.4rem;
	}

	.btn .badge {
		margin-inline-start: 0.4rem;
	}

	.buttons {
		display: flex;
		flex-direction: column;
	}

	.buttons .btn {
		margin-bottom: 0.5rem;
	}

	.btn:hover {
		background-color: rgba(0, 0, 255, 0.03);

		color: var(--bs-body-color);
	}
</style>
