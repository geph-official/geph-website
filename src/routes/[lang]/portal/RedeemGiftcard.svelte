<script lang="ts">
	import axios from 'axios';
	import { BINDER_ADDR } from '../../helpers';
	import { page } from '$app/stores';
	import { localize } from '../../../routes/l10n';
	import debounce from 'debounce';
	import { goto } from '$app/navigation';
	const lang = $page.params['lang'];

	$: l = (s: string) => localize(lang, s);

	function translateError(e: string, lang: string): string {
		console.log('login page error: ' + e);
		if (e.includes('403')) {
			return localize(lang, 'incorrect-giftcard');
		} else if (e.includes('500')) {
			return localize(lang, 'internal-server-error');
		} else {
			return localize(lang, 'unknown-error') + ': ' + e;
		}
	}
	let giftcard_id = '';
	let promo = '';
	const redeemGiftcard = async (sessid: any, giftcard_id: string) => {
		try {
			let resp = await axios.post(BINDER_ADDR + '/spend-giftcard', {
				sessid: sessid,
				giftcard_id: giftcard_id,
				promo
			});
			if (resp.status >= 400) {
				throw resp.status;
			}
			alert(l('giftcard-applied'));
			window.location.reload();
		} catch (e) {
			alert(translateError(String(e), lang));
		}
	};

	let days: number | null = null;
	let giftcardError = '';

	const peekGiftcard = debounce(async (sessid: any, giftcard_id: string, promo: string) => {
		giftcardError = '';
		days = null;
		try {
			let resp = await axios.post(BINDER_ADDR + '/peek-giftcard', {
				sessid,
				giftcard_id,
				promo
			});
			if (resp.status >= 400) {
				throw resp.status;
			}
			days = +resp.data;
		} catch (e) {
			giftcardError = translateError(String(e), lang);
			days = null;
		}
	}, 500);

	$: peekGiftcard(sessionStorage.getItem('sessid'), giftcard_id, promo);
</script>

<div class="container-fluid">
	<div class="row">
		<div class="col-lg">
			<h2>{l('redeem-giftcard')}</h2>
			<input
				type="text"
				class="form-control mb-2"
				bind:value={giftcard_id}
				placeholder={l('giftcard-id')}
			/>
			{#if giftcardError != ''}
				<small class="error">{giftcardError}</small>
			{:else if days != null}
				<small class="days">{l('giftcard-days')}<b>{days}</b></small>
			{:else}
				<small>
					<div class="spinner-border spinner-border-sm" role="status" />
				</small>
			{/if}
		</div>
		<div class="col-lg">
			<h2>{l('got-a-promo-code')}</h2>
			<div class="buttons">
				<input
					type="promo"
					class="form-control small-form-control"
					id="promo"
					bind:value={promo}
					placeholder={l('promo-code')}
				/>
			</div>
		</div>
	</div>

	<div class="row mt-3">
		<div class="col">
			<button
				class="btn btn-success "
				on:click={() => {
					redeemGiftcard(sessionStorage.getItem('sessid'), giftcard_id);
				}}
				disabled={days == null}
			>
				{l('redeem')}
			</button>
		</div>
	</div>
</div>

<!-- make the data flow in one direction: from the state to the layout. Mutate only the state from the UI. -->
<style>
	h2 {
		font-size: 1.4rem;
		letter-spacing: -0.02rem;
		font-weight: 550;
		opacity: 0.8;
	}

	.error {
		font-weight: 500;
		color: var(--bs-danger);
	}
</style>
