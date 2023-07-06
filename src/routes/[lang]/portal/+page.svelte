<script lang="ts">
	import AccountCircle from 'svelte-material-icons/AccountCircle.svelte';
	import CalendarRange from 'svelte-material-icons/CalendarRange.svelte';
	import Heart from 'svelte-material-icons/Heart.svelte';
	import axios from 'axios';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import Navbar from '../Navbar.svelte';
	import { localize } from '../../../routes/l10n';
	import Footer from '../Footer.svelte';
	import BuyPlus from './BuyPlus.svelte';
	import RedeemGiftcard from './RedeemGiftcard.svelte';
	const lang = $page.params['lang'];

	const errL10n = {
		400: { en: 'Bad request', zhs: '错误的请求', zht: '錯誤的請求' },
		500: { en: 'Internal server error', zhs: '服务器内部错误', zht: '服務器內部錯誤' },
		520: { en: 'Unknown error', zhs: '未知错误', zht: '未知錯誤' }
	};

	function translateError(e: string, lang: 'en' | 'zhs' | 'zht'): string {
		console.log('billing page error: ' + e);
		if (e.includes('400')) {
			return errL10n[400][lang];
		} else if (e.includes('500')) {
			return errL10n[500][lang];
		} else {
			return errL10n[520][lang];
		}
	}

	async function get_user_info() {
		if (!sessionStorage.getItem('sessid')) {
			window.location.replace('./portal/login');
		}
		try {
			let resp = await axios.post('https://web-backend.geph.io/userinfo', {
				sessid: sessionStorage.getItem('sessid')
			});
			console.log(resp.status);
			if (resp.status >= 400) {
				throw resp.status;
			} else {
				return resp.data;
			}
		} catch (e) {
			alert(translateError(String(e), lang));
		}
	}

	let activeTab: 'buy-plus' | 'redeem-giftcard' = 'buy-plus';
</script>

<svelte:head>
	<script src="https://js.stripe.com/v3/"></script>
	<title>{localize(lang, 'user-portal')}</title>
</svelte:head>

<div lang={localize(lang, 'langcode')} dir="auto">
	<Navbar />
	{#await get_user_info()}
		<div class="loading-wrapper">
			<div class="spinner-border" role="status" />
			{localize(lang, 'loading')}
		</div>
	{:then user_info}
		<div class="container mt-5 pt-3" in:fade>
			<div class="row">
				<div class="col">
					<div class="row">
						<div class="col">
							<h2>{localize(lang, 'account-overview')}</h2>
						</div>
					</div>
					<div class="row">
						<div class="col">
							<div class="icon-badge">
								<div class="icon"><AccountCircle width="26" height="22" /></div>
								{user_info['username']}
							</div>
							{#if user_info['plan'] === 'plus'}
								<div class="icon-badge">
									<div class="icon" style="color: #007bbb">
										<CalendarRange width="26" height="22" />
									</div>
									<div>
										{new Date(user_info['expires']).toLocaleDateString(localize(lang, 'langcode'), {
											year: 'numeric',
											month: 'short',
											day: 'numeric'
										})}<br />
										<small>
											{localize(lang, 'remaining-days')}
											<span class="remaining-days">
												{Math.max(
													0,
													(new Date(user_info['expires']).getTime() - new Date().getTime()) /
														(24 * 60 * 60 * 1000)
												).toFixed(0)}
											</span>
										</small>
									</div>
								</div>
								<div>i am in plus??</div>
								<div class="subscription">
									{#if user_info['is_recurring'] === true}
										<div>I am recurring</div>
									{/if}
								</div>
							{:else}
								<div class="icon-badge">
									<div class="icon" style="color: #e80606">
										<Heart width="26" height="22" />
									</div>
									<div>Free</div>
								</div>
							{/if}
						</div>
					</div>
				</div>
				<div class="col-lg" />
				<div class="col">
					<div class="card m-3 m-lg-0">
						<img src="/click_refresh.png" class="card-img-top" alt="" />
						<div class="card-body">
							<h5 class="card-title">{localize(lang, 'missing-days')}</h5>
							<p>{localize(lang, 'click-refresh')}</p>
						</div>
					</div>
				</div>
			</div>

			<div class="row mt-5">
				<div class="col">
					<ul class="nav nav-pills">
						<li class="nav-item">
							<button
								class="nav-link"
								class:active={activeTab === 'buy-plus'}
								on:click={() => (activeTab = 'buy-plus')}>{localize(lang, 'buy-plus')}</button
							>
						</li>
						<li class="nav-item">
							<button
								class="nav-link"
								class:active={activeTab === 'redeem-giftcard'}
								on:click={() => (activeTab = 'redeem-giftcard')}
							>
								{localize(lang, 'redeem-giftcard')}
							</button>
						</li>
					</ul>
				</div>
			</div>
			<div class="row mt-3 box">
				<div class="col">
					{#if activeTab === 'buy-plus'}
						<BuyPlus variant="all" />
					{:else if activeTab === 'redeem-giftcard'}
						<RedeemGiftcard />
					{/if}
				</div>
			</div>
		</div>
	{/await}
	<Footer />
</div>

<style>
	.loading-wrapper {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 80vh;
	}

	.loading-wrapper div {
		margin-inline-end: 1rem;
	}

	.icon-badge {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-top: 1rem;
		line-height: 1.2rem;
	}

	.icon-badge {
		padding-inline-end: 1rem;
	}

	.icon {
		padding-inline-end: 0.5rem;
	}

	.remaining-days {
		font-weight: 600;
		opacity: 0.8;
	}

	.box {
		border: 1px solid #ccc;
		border-radius: 0.5rem;
		padding: 1rem;
		padding-top: 2rem;
		padding-bottom: 3rem;
		margin-inline-start: 0.1rem;
		margin-inline-end: 0.1rem;
	}
</style>
