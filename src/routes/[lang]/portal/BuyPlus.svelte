<script lang="ts">
	import debounce from 'debounce';
	import { page } from '$app/stores';
	import { cryptoBackend, stripeCardBackend, wxpayBackend, type PaymentBackend } from './billing';
	import type { Item } from './billing';
	import { localize } from '../../l10n';
	import { call_rpc, translateError } from '../../../routes/helpers';
	import { onMount } from 'svelte';

	let { is_recurring, variant }: { is_recurring: boolean; variant: 'all' | 'reseller' } = $props();

	// svelte-ignore state_referenced_locally -- variant is static configuration
	const isReseller = variant === 'reseller';

	const lang = $page.params['lang'];
	const to_local = (s: string) => localize(lang, s);

	const paymentBackends: Map<string, PaymentBackend> = new Map();
	paymentBackends.set('bank-card', stripeCardBackend());
	paymentBackends.set('crypto', cryptoBackend());
	if (!isReseller) {
		paymentBackends.set('wxpay', wxpayBackend());
	}

	let days = $state(30);
	let promo = $state('');
	let item: 'plus' | 'giftcard' = $state(isReseller ? 'giftcard' : 'plus');
	let plan: 'basic' | 'unlimited' = $state('unlimited');
	let basicAvailable = $state(false);

	let recipientEmail = $state('');
	let sender = $state(isReseller ? 'Reseller' : '');
	let giftcards_number = $state(isReseller ? 20 : 1);
	let payMethod = $state('bank-card');
	const MIN_CRYPTO_TOTAL_EUR = 20;

	onMount(async () => {
		try {
			await call_rpc('calculate_basic_price', [
				sessionStorage.getItem('sessid'),
				'bank-card',
				'',
				30
			]);
			basicAvailable = true;
		} catch (e) {
			basicAvailable = false;
		}
	});

	const makeItem = (item: 'plus' | 'giftcard', email: string, sender: string, count: number) => {
		let enum_item: Item;
		if (item == 'giftcard') {
			enum_item = {
				Giftcard: { recipient_email: email, sender: sender, count: count }
			};
		} else {
			enum_item = plan === 'basic' ? 'Basic' : 'Plus';
		}
		return enum_item;
	};

	let cost: number | null = $state(null);
	const recalcCost = debounce(async (obj: any) => {
		for (;;) {
			try {
				cost = null;
				const rpc = plan === 'basic' ? 'calculate_basic_price' : 'calculate_price';
				const response = await call_rpc(rpc, [
					obj['sessid'],
					obj['method'],
					obj['promo'],
					obj['days']
				]);
				cost = response / 100;
				return;
			} catch (e) {
				alert(translateError(String(e), lang));
			}
		}
	}, 100);

	$effect(() => {
		recalcCost({
			sessid: sessionStorage.getItem('sessid'),
			promo: item === 'giftcard' && !isReseller ? '' : promo,
			days: item === 'giftcard' ? days * giftcards_number : days,
			method: payMethod,
			plan
		});
	});

	const change_days = (d: number) => {
		days = Math.floor(Math.min(10000, Math.max(isReseller ? 1 : 7, d)));
	};

	const onDaysChange = (e: any) => {
		if (e.target.value) {
			days = Math.floor(Math.min(10000, Math.max(isReseller ? 1 : 7, e.target.value)));
			e.target.value = days;
		}
	};

	const onGiftcardsNumberChange = (e: any) => {
		if (e.target.value) {
			giftcards_number = Math.floor(Math.max(isReseller ? 20 : 1, e.target.value));
			e.target.value = giftcards_number;
		}
	};

	const onPromoChange = (e: any) => {
		if (e.target.value) {
			promo = e.target.value.toUpperCase().trim();
			e.target.value = days;
		}
	};

	const senderValid = $derived(sender.length > 0);
	const recipientValid = $derived(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(recipientEmail));

	let autorenewChecked = $state(!isReseller);

	const autorenew = $derived(autorenewChecked && item === 'plus');
	const cryptoTotalTooSmall = $derived(
		payMethod === 'crypto' && cost !== null && cost <= MIN_CRYPTO_TOTAL_EUR
	);

	let checkingOut = $state(false);

	const segBtn = (active: boolean) =>
		`btn gap-2 ${active ? 'variant-ringed-primary bg-primary-500/10' : 'variant-ringed-surface'}`;
</script>

<div class="mt-4 space-y-8">
	{#if !isReseller}
		<section>
			<h2>{to_local('who-is-the-plus-for')}</h2>
			<div class="option-row">
				<button class={segBtn(item === 'plus')} onclick={() => (item = 'plus')}>
					{to_local('myself')}
				</button>
				<button class={segBtn(item === 'giftcard')} onclick={() => (item = 'giftcard')}>
					{to_local('someone-else')}
				</button>
			</div>
		</section>
	{/if}

	{#if item != 'giftcard'}
		<section>
			<h2>{to_local('what-plan-buying')}</h2>
			<div class="option-row">
				<button
					class={segBtn(plan === 'unlimited')}
					onclick={() => (plan = 'unlimited')}
					disabled={!basicAvailable}
				>
					{to_local('unlimited')}
				</button>
				<button
					class={segBtn(plan === 'basic')}
					onclick={() => (plan = 'basic')}
					disabled={!basicAvailable}
				>
					{to_local('basic')}<span class="badge variant-filled-error ms-1">{to_local('beta')}</span>
				</button>
			</div>
			{#if basicAvailable}
				<small class="opacity-70">{to_local('basic-beta-blurb')}</small>
			{/if}
		</section>
	{/if}

	{#if item == 'giftcard'}
		<section class="grid gap-4 lg:grid-cols-2">
			{#if !isReseller}
				<div>
					<input
						type="text"
						class="input"
						bind:value={sender}
						placeholder={to_local('sender')}
						class:input-error={!senderValid}
					/>
					{#if !senderValid}
						<small class="font-medium text-error-600">{to_local('sender-invalid-blurb')}</small>
					{/if}
				</div>
			{/if}
			<div>
				<input
					type="email"
					class="input"
					bind:value={recipientEmail}
					placeholder={to_local('recipient-email')}
					class:input-error={!recipientValid}
				/>
				{#if !recipientValid}
					<small class="font-medium text-error-600">{to_local('recipient-invalid-blurb')}</small>
				{/if}
			</div>
		</section>

		<section>
			<h2>{to_local('how-many-giftcards')}</h2>
			<input
				type="number"
				class="input w-auto"
				value={giftcards_number}
				onchange={onGiftcardsNumberChange}
			/>
		</section>
	{/if}

	{#if !is_recurring || item == 'giftcard'}
		<section>
			{#if item !== 'giftcard'}
				<h2>{to_local('choose-a-plan-length')}</h2>
			{:else}
				<h2>{to_local('how-many-days-in-each-giftcard')}</h2>
			{/if}
			<div class="option-row mb-2">
				<button class={segBtn(days == 30)} onclick={() => change_days(30)}>
					{to_local('1-month')}
				</button>
				<button class={segBtn(days === 90)} onclick={() => change_days(90)}>
					{to_local('3-months')}
				</button>
				<button class={segBtn(days === 365)} onclick={() => change_days(365)}>
					{to_local('1-year')}
					{#if !isReseller}
						<span class="badge variant-filled-success">{to_local('10-off')}</span>
					{/if}
				</button>
				<button class={segBtn(days === 730)} onclick={() => change_days(730)}>
					{to_local('2-year')}
					{#if !isReseller}
						<span class="badge variant-filled-success">{to_local('15-off')}</span>
					{/if}
				</button>
			</div>
			<input
				type="number"
				class="input w-auto"
				value={days}
				onchange={onDaysChange}
				placeholder={to_local('custom')}
			/>
		</section>

		{#if item !== 'giftcard'}
			<section>
				<h2>{to_local('got-a-promo-code')}</h2>
				<input
					type="text"
					class="input w-auto"
					onchange={onPromoChange}
					value={promo}
					placeholder={to_local('promo-code')}
				/>
			</section>
		{/if}

		<section>
			<h2>{to_local('choose-a-payment-method')}</h2>
			<div class="option-row">
				{#each [...paymentBackends] as [_, backend]}
					<button
						class={segBtn(payMethod === backend.name)}
						onclick={() => {
							payMethod = backend.name;
							change_days(days);
						}}
					>
						{#each backend.icons as icon}
							<img src={icon} alt="" class="h-5" />
						{/each}
						{to_local(backend.name)}
						{#if backend.markup > 0}
							<span class="badge variant-filled-warning">+{backend.markup}%</span>
						{/if}
					</button>
				{/each}
			</div>

			{#if payMethod === 'bank-card' && item == 'plus'}
				<label class="mt-3 flex items-center gap-2">
					<input type="checkbox" class="checkbox" bind:checked={autorenewChecked} />
					<span>{to_local('autorenew')}</span>
				</label>
			{/if}

			{#if isReseller}
				<input
					type="text"
					class="input mt-2 w-auto"
					onchange={onPromoChange}
					value={promo}
					placeholder="Reseller code"
				/>
			{/if}
		</section>

		<section>
			<h2 class="flex items-center gap-2">
				{to_local('total')}
				{#if cost !== null}
					{'€' + cost.toFixed(2)}
				{:else}
					<span class="spinner h-4 w-4"></span>
				{/if}
			</h2>
			{#if item == 'giftcard'}
				<h3>{to_local('giftcard-promotion')}</h3>
			{/if}
		</section>

		{#if payMethod == 'alipay' || payMethod == 'wxpay'}
			<aside class="alert variant-ghost-error">
				<div class="alert-message">{@html to_local('bad-aliwechat')}</div>
			</aside>
		{/if}

		<section>
			{#if cryptoTotalTooSmall}
				<aside class="alert variant-ghost-warning mb-4" role="alert">
					<div class="alert-message">{to_local('crypto-minimum-total')}</div>
				</aside>
			{/if}
			<button
				class="btn btn-lg variant-filled-success"
				onclick={async () => {
					checkingOut = true;
					try {
						if (item === 'giftcard') {
							if (recipientEmail == '') {
								alert(localize(lang, 'email_required'));
								return;
							}
							if (sender == '') {
								alert(localize(lang, 'sender_required'));
								return;
							}
						}
						try {
							let ready_item = makeItem(item, recipientEmail, sender, giftcards_number);
							await paymentBackends.get(payMethod)?.pay(days, promo, ready_item, autorenew);
						} catch (e) {
							alert(translateError(String(e), lang));
						}
					} finally {
						checkingOut = false;
					}
				}}
				disabled={checkingOut ||
					cost == null ||
					(item == 'giftcard' && (!senderValid || !recipientValid)) ||
					cryptoTotalTooSmall}
			>
				{to_local('pay')}
			</button>
		</section>
	{:else}
		<p class="mt-4">{localize(lang, 'already-autorenew')}</p>
	{/if}
</div>

<style>
	h2 {
		font-size: 1.4rem;
		letter-spacing: -0.02rem;
		font-weight: 550;
		opacity: 0.8;
		margin-bottom: 0.75rem;
	}

	h3 {
		font-size: 1rem;
		font-weight: 400;
		opacity: 0.7;
	}

	.option-row {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	@media (min-width: 1024px) {
		.option-row {
			flex-direction: row;
			flex-wrap: wrap;
			align-items: center;
		}
	}
</style>
