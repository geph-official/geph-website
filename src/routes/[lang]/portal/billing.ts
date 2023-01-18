import axios from "axios";
import { BINDER_ADDR } from "../../helpers";
import { goto } from "$app/navigation";
import { localize } from '../../l10n';

export function translateError(e: string, lang: string): string {
    console.log('billing page error: ' + e);
    if (e.includes('400')) {
        return localize(lang, 'bad-request');
    } else if (e.includes('500')) {
        return localize(lang, 'internal-server-error');
    } else {
        return localize(lang, 'unknown-error');
    }
}


export type Item = "Plus" | {
    "Giftcard": { recipient_email: string, sender: string, number: number }
}

export interface PaymentBackend {
    name: string,
    icons: string[],
    markup: number,
    pay: (arg0: number, arg1: string, arg2: Item) => Promise<void>
}

export function stripeBackend(): PaymentBackend {
    const STRIPEKEY = "pk_live_Wk781YzANKGuLBl2NzFkRu5n00YdYjObFY";
    return {
        name: 'bank-card',
        icons: ["/visa.jpg", "/mastercard.svg"],
        markup: 0,
        pay: async (days: number, promo: string, item: Item) => {
            console.log(sessionStorage.getItem("sessid"));
            const resp = await axios.post(
                BINDER_ADDR + "/v2/stripe",
                {
                    sessid: sessionStorage.getItem("sessid"),
                    promo,
                    days,
                    item,
                },
                { responseType: "text" }
            );
            let sid = resp.data;
            console.log(sid);
            const stripe = ((window as any)["Stripe"] as any)(STRIPEKEY);
            const { error } = await stripe.redirectToCheckout({
                sessionId: sid,
            });
            if (error) {
                alert(error);
            }
        },
    }
}

export function alipayBackend(): PaymentBackend {
    return {
        name: 'alipay',
        icons: ["/alipay.svg"],
        markup: 10,
        pay: async (days: number, promo: string, item: Item) => {
            const resp = await axios.post(
                BINDER_ADDR + "/v2/aliwechat",
                {
                    sessid: sessionStorage.getItem("sessid"),
                    promo,
                    days,
                    method: 'alipay',
                    item,
                },
            );
            let url = resp.data.pay_url;
            goto(url);
        }
    }
}

export function wxpayBackend(): PaymentBackend {
    return {
        name: 'wxpay',
        icons: ["/wxpay.png"],
        markup: 10,
        pay: async (days: number, promo: string, item: Item) => {
            const resp = await axios.post(
                BINDER_ADDR + "/v2/aliwechat",
                {
                    sessid: sessionStorage.getItem("sessid"),
                    promo,
                    days,
                    method: 'wxpay',
                    item,
                },
            );
            let url = resp.data.pay_url;
            goto(url);
        }
    }
}

export function cryptoBackend(): PaymentBackend {
    return {
        name: 'crypto',
        icons: ["/bitcoin.png"],
        markup: 0,
        pay: async (days: number, promo: string, item: Item) => {
            sessionStorage.setItem("days", days.toString());
            sessionStorage.setItem("promo", promo);
            sessionStorage.setItem("item", JSON.stringify(item));

            goto("./portal/pay_crypto");
        }
    }
}