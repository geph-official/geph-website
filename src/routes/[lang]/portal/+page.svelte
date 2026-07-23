<script lang="ts">
	import UserCircle from 'phosphor-svelte/lib/UserCircle';
	import CalendarDots from 'phosphor-svelte/lib/CalendarDots';
	import Heart from 'phosphor-svelte/lib/Heart';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import { localize } from '../../../routes/l10n';
	import BuyPlus from './BuyPlus.svelte';
	import RedeemGiftcard from './RedeemGiftcard.svelte';
	import { call_rpc, translateError } from '../../../routes/helpers';

	const lang = $page.params['lang'];

	async function get_user_info() {
		if (!sessionStorage.getItem('sessid')) {
			window.location.replace('./portal/login');
		}
		try {
			return await call_rpc('user_info', [sessionStorage.getItem('sessid')]);
		} catch (e) {
			alert(translateError(String(e), lang));
			window.location.replace('./portal/login');
		}
	}

	async function cancel_autorenew() {
		if (!sessionStorage.getItem('sessid')) {
			window.location.replace('./portal/login');
		}
		return call_rpc('cancel_recurring', [sessionStorage.getItem('sessid')]);
	}

	let activeTab: 'buy-plus' | 'redeem-giftcard' = $state('buy-plus');

	let showCancellationModal = $state(false);
	let showResultModal = $state(false);
	let cancellationResult = $state('');

	const toggleCancellationModal = () => (showCancellationModal = !showCancellationModal);
	const confirmCancellation = async () => {
		toggleCancellationModal();
		try {
			await cancel_autorenew();
			cancellationResult = localize(lang, 'cancel-recurring-success');
		} catch (e) {
			cancellationResult = translateError(String(e), lang);
		}
		showResultModal = true;
	};
	const closeResultModal = () => {
		showResultModal = false;
		location.reload();
	};
</script>

<svelte:head>
	<script src="https://js.stripe.com/v3/"></script>
	<title>{localize(lang, 'user-portal')}</title>
</svelte:head>

{#await get_user_info()}
	<div class="flex h-[80vh] items-center justify-center gap-4">
		<div class="spinner" role="status"></div>
		{localize(lang, 'loading')}
	</div>
{:then user_info}
	<div class="mt-12" in:fade>
		<h2 class="h2">{localize(lang, 'account-overview')}</h2>
		<div class="mt-6 grid gap-x-8 gap-y-6 lg:grid-cols-2">
			<div class="space-y-3">
				<div class="flex items-center gap-2">
					<UserCircle size="1.4rem" />
					{user_info['username'].replace('!!secret!!-', '')}
				</div>
				{#if user_info['plan']['type'] === 'plus'}
					<div class="flex items-center gap-2 leading-snug">
						<CalendarDots size="1.4rem" class="flex-none text-tertiary-600" />
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
								<span class="font-semibold opacity-80">
									{Math.max(
										0,
										(new Date(user_info['plan']['expires']).getTime() - new Date().getTime()) /
											(24 * 60 * 60 * 1000)
									).toFixed(0)}
								</span>
							</small>
							{#if user_info['plan']['is_recurring'] === true}
								<br />
								<span class="text-xs font-semibold text-success-600">
									{localize(lang, 'auto-renewing')}
									<button class="anchor" onclick={toggleCancellationModal}>
										{localize(lang, 'cancel')}
									</button>
								</span>
							{/if}
						</div>
					</div>
				{:else}
					<div class="flex items-center gap-2">
						<Heart size="1.4rem" weight="fill" class="text-error-500" />
						<div>Free</div>
					</div>
				{/if}
			</div>
			<aside class="alert variant-soft-primary self-start text-inherit">
				<div class="alert-message">
					<p class="font-semibold">{localize(lang, 'missing-days')}</p>
					<p>{localize(lang, 'click-refresh')}</p>
				</div>
			</aside>
		</div>

		<nav class="mt-16 flex flex-wrap gap-2">
			<button
				class="btn {activeTab === 'buy-plus' ? 'variant-filled-primary' : 'variant-ringed-surface'}"
				onclick={() => (activeTab = 'buy-plus')}
			>
				{localize(lang, 'buy-plus')}
			</button>
			<button
				class="btn {activeTab === 'redeem-giftcard'
					? 'variant-filled-primary'
					: 'variant-ringed-surface'}"
				onclick={() => (activeTab = 'redeem-giftcard')}
			>
				{localize(lang, 'redeem-giftcard')}
			</button>
		</nav>
		<div class="mt-4">
			{#if activeTab === 'buy-plus'}
				<BuyPlus is_recurring={user_info['plan']['is_recurring']} variant="all" />
			{:else if activeTab === 'redeem-giftcard'}
				<RedeemGiftcard />
			{/if}
		</div>

		{#if showCancellationModal}
			<div
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
				transition:fade
			>
				<div class="card space-y-4 p-6">
					<p>{localize(lang, 'are-you-sure')}</p>
					<div class="flex gap-2">
						<button class="btn variant-filled-primary" onclick={confirmCancellation}>
							{localize(lang, 'yes')}
						</button>
						<button class="btn variant-ghost-surface" onclick={toggleCancellationModal}>
							{localize(lang, 'no')}
						</button>
					</div>
				</div>
			</div>
		{/if}
		{#if showResultModal}
			<div
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
				transition:fade
			>
				<div class="card space-y-4 p-6">
					<p>{cancellationResult}</p>
					<button class="btn variant-filled-primary" onclick={closeResultModal}>
						{localize(lang, 'ok')}
					</button>
				</div>
			</div>
		{/if}
	</div>
{/await}
