<script lang="ts">
	import axios from 'axios';
	import debounce from 'debounce';
	import { page } from '$app/stores';
	import {
		alipayBackend,
		cryptoBackend,
		stripeBackend,
		translateError,
		wxpayBackend,
		type PaymentBackend
	} from './billing';
	import type { Item } from './billing';
	import { localize } from '../../l10n';
	import { BINDER_ADDR } from '../../../routes/helpers';

	export let variant: 'all' | 'reseller';

	const lang = $page.params['lang'];

	const paymentBackends: Map<string, PaymentBackend> = new Map();
	paymentBackends.set('bank-card', stripeBackend());
	paymentBackends.set('crypto', cryptoBackend());
	if (variant !== 'reseller') {
		paymentBackends.set('alipay', alipayBackend());
		paymentBackends.set('wxpay', wxpayBackend());
	}

	let days = 30;
	let promo = '';
	let item: 'plus' | 'giftcard' = variant === 'reseller' ? 'giftcard' : 'plus';
	let recipientEmail = '';
	let sender = variant === 'reseller' ? 'Reseller' : '';
	let giftcards_number = variant === 'reseller' ? 50 : 1;
	let payMethod: string = 'bank-card';

	const toQueryString = (params: any) => {
		const esc = encodeURIComponent;
		return Object.keys(params)
			.map((k) => esc(k) + '=' + esc(params[k]))
			.join('&');
	};

	const makeItem = (
		item: 'plus' | 'giftcard',
		email: string,
		sender: string,
		giftcards_number: number
	) => {
		var enum_item: Item = 'Plus';
		if (item == 'giftcard') {
			enum_item = {
				Giftcard: { recipient_email: email, sender: sender, number: giftcards_number }
			};
		}
		return enum_item;
	};

	let cost: number | null = null;
	const recalcCost = debounce(async (obj: any) => {
		for (;;) {
			try {
				cost = null;
				const response = await axios.get(
					BINDER_ADDR + '/v2/calculate-price?' + toQueryString(obj),
					{ responseType: 'text' }
				);
				cost = response.data / 100;
				if (response.status >= 400) {
					throw response.status;
				}
				return;
			} catch (e) {
				alert(translateError(String(e), lang));
			}
		}
	}, 100);
	$: recalcCost({
		promo: item === 'giftcard' && variant != 'reseller' ? '' : promo,
		days: item === 'giftcard' ? days * giftcards_number : days,
		method: payMethod
	});

	const onDaysChange = (e: any) => {
		if (e.target.value) {
			days = Math.floor(Math.min(10000, Math.max(variant == 'reseller' ? 1 : 7, e.target.value)));
			e.target.value = days;
		}
	};

	const onGiftcardsNumberChange = (e: any) => {
		if (e.target.value) {
			giftcards_number = Math.floor(Math.max(variant == 'reseller' ? 50 : 1, e.target.value));
			e.target.value = giftcards_number;
		}
	};

	const onPromoChange = (e: any) => {
		if (e.target.value) {
			promo = e.target.value.toUpperCase().trim();
			e.target.value = days;
		}
	};

	$: l = (s: string) => localize(lang, s);

	$: senderValid = sender.length > 0;
	$: recipientValid = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(recipientEmail);

	let checkingOut = false;
</script>

<div class="container-fluid mt-3">
	{#if variant !== 'reseller'}
		<div class="row">
			<div class="col">
				<h2>{l('who-is-the-plus-for')}</h2>
				<div class="d-flex">
					<button
						class="btn btn-outline-dark me-2"
						on:click={() => {
							item = 'plus';
						}}
						class:selected={item === 'plus'}>{l('myself')}</button
					>
					<button
						class="btn btn-outline-dark"
						class:selected={item === 'giftcard'}
						on:click={() => {
							item = 'giftcard';
						}}>{l('someone-else')}</button
					>
				</div>
			</div>
		</div>
	{/if}
	{#if item == 'giftcard'}
		<div class="row mt-3">
			{#if variant !== 'reseller'}
				<div class="col-lg">
					<input
						type="text"
						class="form-control"
						id="sender"
						bind:value={sender}
						placeholder={l('sender')}
						class:invalid={!senderValid}
					/>
					{#if !senderValid}
						<small class="invalid-blurb">{l('sender-invalid-blurb')}</small>
					{/if}
				</div>
			{/if}
			<div class="col-lg">
				<input
					type="email"
					class="form-control"
					id="giftcard-email"
					bind:value={recipientEmail}
					placeholder={l('recipient-email')}
					class:invalid={!recipientValid}
				/>
				{#if !recipientValid}
					<small class="invalid-blurb">{l('recipient-invalid-blurb')}</small>
				{/if}
			</div>
		</div>

		<div class="row mt-5">
			<div class="col">
				<h2>{l('how-many-giftcards')}</h2>
				<input
					type="number"
					class="form-control small-form-control"
					id="giftcards_number"
					value={giftcards_number}
					on:change={onGiftcardsNumberChange}
				/>
			</div>
		</div>
	{/if}

	<div class="row mt-5">
		<div class="col">
			{#if item !== 'giftcard'}
				<h2>{l('choose-a-plan-length')}</h2>
			{:else}
				<h2>{l('how-many-days-in-each-giftcard')}</h2>
			{/if}
			<div class="buttons">
				<button
					class="btn btn-outline-dark me-2"
					class:selected={days == 30}
					on:click={() => {
						days = 30;
					}}
				>
					{l('1-month')}
				</button>
				<button
					class="btn btn-outline-dark me-2"
					class:selected={days === 90}
					on:click={() => {
						days = 90;
					}}
				>
					{l('3-months')}
				</button>
				<button
					class="btn btn-outline-dark me-2"
					class:selected={days === 365}
					on:click={() => {
						days = 365;
					}}
				>
					{l('1-year')}
					{#if variant !== 'reseller'}
						<span class="badge rounded-pill bg-success">{l('10-off')}</span>
					{/if}
				</button>
				<button
					class="btn btn-outline-dark me-2"
					class:selected={days === 730}
					on:click={() => {
						days = 730;
					}}
				>
					{l('2-year')}
					{#if variant !== 'reseller'}
						<span class="badge rounded-pill bg-success">{l('15-off')}</span>
					{/if}
				</button>
			</div>
			<div class="buttons">
				<button
					class="btn btn-outline-dark me-2"
					class:selected={days === 1095}
					on:click={() => {
						days = 1095;
					}}
				>
					{l('3-year')}
					{#if variant !== 'reseller'}
						<span class="badge rounded-pill bg-success">{l('17.5-off')}</span>
					{/if}
				</button>
				<input
					type="number"
					class="form-control small-form-control"
					id="length"
					value={days == 30 || days == 90 || days == 365 || days == 730 || days == 1095 ? '' : days}
					on:change={onDaysChange}
					placeholder={l('custom')}
				/>
			</div>
		</div>
	</div>

	{#if item !== 'giftcard'}
		<div class="row mt-5">
			<div class="col">
				<h2>{l('got-a-promo-code')}</h2>
				<div class="buttons">
					<input
						type="promo"
						class="form-control small-form-control"
						id="promo"
						on:change={onPromoChange}
						value={promo}
						placeholder={l('promo-code')}
					/>
				</div>
			</div>
		</div>
	{/if}

	<div class="row mt-5">
		<div class="col">
			<h2>{l('choose-a-payment-method')}</h2>
			<div class="buttons">
				{#each [...paymentBackends] as [_, backend]}
					<button
						class="btn btn-outline-dark me-2"
						class:selected={payMethod === backend.name}
						on:click={() => {
							payMethod = backend.name;
						}}
					>
						{#each backend.icons as icon}
							<img src={icon} alt="" />
						{/each}
						{l(backend.name)}
						{#if backend.markup > 0}
							<span class="badge rounded-pill bg-danger">+{backend.markup}%</span>
						{/if}
					</button>
				{/each}
			</div>
			{#if variant == 'reseller'}
				<div class="buttons">
					<input
						type="promo"
						class="form-control small-form-control"
						id="promo"
						on:change={onPromoChange}
						value={promo}
						placeholder="Reseller code"
					/>
				</div>
			{/if}
		</div>

		<div class="row mt-5">
			<div class="col">
				<h2>
					{l('total')}
					{#if cost !== null}
						{'???' + cost.toFixed(2)}
					{:else}
						<div class="spinner-grow spinner-grow-sm" />
					{/if}
				</h2>
			</div>
		</div>

		{#if item == 'giftcard'}
			<div class="row">
				<div class="col">
					<h3>
						{l('giftcard-promotion')}
					</h3>
				</div>
			</div>
		{/if}

		<div class="row mt-3">
			<div class="col">
				<button
					class="btn btn-success btn-lg"
					on:click={async () => {
						checkingOut = true;
						try {
							console.log(item);
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
								await paymentBackends.get(payMethod)?.pay(days, promo, ready_item);
							} catch (e) {
								alert(translateError(String(e), lang));
							}
						} finally {
							console.log('checkout done');
							checkingOut = false;
						}
					}}
					disabled={checkingOut ||
						cost == null ||
						(item == 'giftcard' && (!senderValid || !recipientValid))}
				>
					{l('pay')}
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.btn {
		border: 1px solid gray;
	}

	.selected {
		border: 1px solid var(--bs-primary);
		background-color: rgba(0, 0, 255, 0.03);
	}

	.badge.bg-danger {
		margin-left: 0.3rem;
	}

	.invalid {
		border: 1px solid rgb(176, 0, 0);
	}

	.invalid-blurb {
		color: rgb(176, 0, 0);
		font-size: 0.8rem;
		font-weight: 500;
	}

	h2 {
		font-size: 1.4rem;
		letter-spacing: -0.02rem;
		font-weight: 550;
		opacity: 0.8;
	}

	h3 {
		font-size: 1rem;
		font-weight: 400;
		opacity: 0.7;
	}

	.small-form-control {
		width: auto;
		display: inline-block;
	}

	.btn img {
		height: 1.2rem;
	}

	.buttons {
		display: flex;
		flex-direction: column;
	}

	.buttons .btn {
		margin-bottom: 0.5rem;
	}

	.buttons input {
		margin-bottom: 0.5rem;
		margin-right: 0.5rem;
	}

	.btn:hover {
		background-color: rgba(0, 0, 255, 0.03);

		color: var(--bs-body-color);
	}

	@media (min-width: 992px) {
		.buttons {
			flex-direction: row;
			width: 100%;
			height: 3rem;
			align-items: center;
		}
	}
</style>
