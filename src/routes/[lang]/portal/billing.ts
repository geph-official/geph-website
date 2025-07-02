import axios from 'axios';
import { BINDER_ADDR, call_rpc } from '../../helpers';
import { goto } from '$app/navigation';
import { localize } from '../../l10n';

export type Item =
	| 'Plus'
	| 'Basic'
	| {
			Giftcard: { recipient_email: string; sender: string; count: number };
	  };

export interface PaymentBackend {
	name: string;
	icons: string[];
	markup: number;
	pay: (arg0: number, arg1: string, arg2: Item, is_subscription: boolean) => Promise<void>;
}

export function stripeCardBackend(): PaymentBackend {
	return stripeBackendReal('bank-card', ['card', 'paypal']);
}

export function stripePaypalBackend(): PaymentBackend {
	return stripeBackendReal('paypal', ['paypal']);
}

function stripeBackendReal(name: string, payment_methods: string[]): PaymentBackend {
	const STRIPEKEY = 'pk_live_Wk781YzANKGuLBl2NzFkRu5n00YdYjObFY';
	// const STRIPEKEY = "pk_test_O6w7losqr4Z0LrJvvhotXgBO00kog9HPMC";
	return {
		name,
		icons: name == 'paypal' ? ['/paypal.svg', '/unionpay.svg'] : ['/visa.jpg', '/mastercard.svg'],
		markup: 0,
		pay: async (days: number, promo: string, item: Item, is_recurring: boolean) => {
			is_recurring = name != 'paypal' && is_recurring;
			const sid = await call_rpc('start_stripe', [
				sessionStorage.getItem('sessid') || 'RESELLER',
				{ promo, days, item, is_recurring }
			]);
			console.log(sid);
			const stripe = ((window as any)['Stripe'] as any)(STRIPEKEY);
			const { error } = await stripe.redirectToCheckout({
				sessionId: sid
			});
			if (error) {
				alert(error);
			}
		}
	};
}

export function alipayBackend(): PaymentBackend {
	return {
		name: 'alipay',
		icons: ['/alipay.svg'],
		markup: 8,
		pay: async (days: number, promo: string, item: Item) => {
			let url = await call_rpc('start_aliwechat', [
				sessionStorage.getItem('sessid') || 'RESELLER',
				{
					promo,
					days,
					method: 'alipay',
					item
				}
			]);
			goto(url);
		}
	};
}

export function wxpayBackend(): PaymentBackend {
	return {
		name: 'wxpay',
		icons: ['/wxpay.png'],
		markup: 8,
		pay: async (days: number, promo: string, item: Item) => {
			let url = await call_rpc('start_aliwechat', [
				sessionStorage.getItem('sessid') || 'RESELLER',
				{
					promo,
					days,
					method: 'wxpay',
					item,
					mobile: await isMobile()
				}
			]);
			goto(url);
		}
	};
}

async function isMobile() {
	// 1. Check if User-Agent Client Hints are supported
	if (navigator.userAgentData && 'getHighEntropyValues' in navigator.userAgentData) {
		try {
			// getHighEntropyValues returns a promise with more detailed info
			const uaData = await navigator.userAgentData.getHighEntropyValues(['mobile']);
			return uaData.mobile;
		} catch (error) {
			// if there's any error, fallback to user agent string
			console.error(error);
			return fallbackIsMobile();
		}
	} else {
		// 2. Fallback to user agent string detection
		const isMobile = fallbackIsMobile();
		console.log(isMobile);
		return isMobile;
	}
}

function fallbackIsMobile() {
	console.log('fallback!');
	// Common approach: simple regex for known mobile user agents
	return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function cryptoBackend(): PaymentBackend {
	return {
		name: 'crypto',
		icons: ['/bitcoin.png'],
		markup: 0,
		pay: async (days: number, promo: string, item: Item) => {
			sessionStorage.setItem('days', days.toString());
			sessionStorage.setItem('promo', promo);
			sessionStorage.setItem('item', JSON.stringify(item));

			goto('./portal/pay_crypto');
		}
	};
}
