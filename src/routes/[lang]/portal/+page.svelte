<script lang="ts">
	import AccountCircle from 'svelte-material-icons/AccountCircle.svelte';
	import CalendarRange from 'svelte-material-icons/CalendarRange.svelte';
	import AccountCreditCard from 'svelte-material-icons/AccountCreditCard.svelte';
	import Heart from 'svelte-material-icons/Heart.svelte';
	import axios from 'axios';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import Navbar from '../Navbar.svelte';
	import { localize } from '../../../routes/l10n';
	import Footer from '../Footer.svelte';
	import BuyPlus from './BuyPlus.svelte';
	import RedeemGiftcard from './RedeemGiftcard.svelte';
	import { BINDER_ADDR, call_rpc, translateError } from '../../../routes/helpers';
	const lang = $page.params['lang'];

	async function get_user_info() {
		if (!sessionStorage.getItem('sessid')) {
			window.location.replace('./portal/login');
		}
		try {
			let user_info = await call_rpc('user_info', [sessionStorage.getItem('sessid')]);
			console.log('USER INFO: ', user_info);
			return user_info;
		} catch (e) {
			alert(translateError(String(e), lang));
			window.location.replace('./portal/login');
		}
	}

	async function cancel_autorenew() {
		console.log('cancelling subscription!');
		if (!sessionStorage.getItem('sessid')) {
			window.location.replace('./portal/login');
		}
		try {
			let resp = await call_rpc('cancel_recurring', [sessionStorage.getItem('sessid')]);
			console.log('success response: ', resp);
			window.location.replace('./portal/login');
		} catch (e) {
			alert(translateError(String(e), lang));
		}
	}

	let activeTab: 'buy-plus' | 'redeem-giftcard' = 'buy-plus';

	let showCancellationModal = false;
	$: toggleCancellationModal = () => (showCancellationModal = !showCancellationModal);
	$: confirmCancellation = async () => {
		await cancel_autorenew();
		toggleCancellationModal();
		location.reload();
	};
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
								{user_info['username'].replace('!!secret!!-', '')}
							</div>
							{#if user_info['plan']['type'] === 'plus'}
								<div class="icon-badge">
									<div class="icon" style="color: #007bbb">
										<CalendarRange width="26" height="22" />
									</div>
									<div>
										{new Date(user_info['plan']['expires']).toLocaleDateString(
											localize(lang, 'langcode'),
											{
												year: 'numeric',
												month: 'short',
												day: 'numeric'
											}
										)}<br />
										<small>
											{localize(lang, 'remaining-days')}
											<span class="remaining-days">
												{Math.max(
													0,
													(new Date(user_info['plan']['expires']).getTime() -
														new Date().getTime()) /
														(24 * 60 * 60 * 1000)
												).toFixed(0)}
											</span>
										</small>
										{#if user_info['plan']['is_recurring'] === true}
											<br />
											<span class="auto-renewing">
												{localize(lang, 'auto-renewing')}
												<a href="javascript:void(0);" on:click={toggleCancellationModal}>
													{localize(lang, 'cancel')}
												</a>
											</span>
										{/if}
									</div>
								</div>
								{#if showCancellationModal}
									<div class="cancel-modal-background" transition:fade>
										<div class="cancel-modal">
											<p>{localize(lang, 'are-you-sure')}</p>
											<button on:click={confirmCancellation}>{localize(lang, 'yes')}</button>
											<button on:click={toggleCancellationModal}>{localize(lang, 'no')}</button>
										</div>
									</div>
								{/if}
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
						<BuyPlus is_recurring={user_info['plan']['is_recurring']} variant="all" />
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

	.auto-renewing {
		font-size: x-small;
		font-weight: 600;
		opacity: 0.8;
		color: green;
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

	.cancel-modal {
		background-color: white;
		padding: 1em;
		border-radius: 8px;
	}

	.cancel-modal-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
