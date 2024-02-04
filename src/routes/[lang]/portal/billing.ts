import axios from "axios";
import { BINDER_ADDR, call_rpc } from "../../helpers";
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
  "Giftcard": { recipient_email: string, sender: string, count: number }
}

export interface PaymentBackend {
  name: string,
  icons: string[],
  markup: number,
  pay: (arg0: number, arg1: string, arg2: Item, is_subscription: boolean) => Promise<void>
}

export function stripeCardBackend(): PaymentBackend {
  return stripeBackendReal("bank-card", ["card"])
}

export function stripePaypalBackend(): PaymentBackend {
  return stripeBackendReal("paypal", ["paypal"])
}

function stripeBackendReal(name: string, payment_methods: string[]): PaymentBackend {
  // const STRIPEKEY = "pk_live_Wk781YzANKGuLBl2NzFkRu5n00YdYjObFY";
  const STRIPEKEY = "pk_test_O6w7losqr4Z0LrJvvhotXgBO00kog9HPMC";
  return {
    name: 'bank-card',
    icons: ["/visa.jpg", "/mastercard.svg"],
    markup: 0,
    pay: async (days: number, promo: string, item: Item, is_recurring: boolean) => {
      is_recurring = name != 'paypal' && is_recurring;
      const sid = await call_rpc("start_stripe", [sessionStorage.getItem("sessid") || "RESELLER", { promo, days, item, is_recurring }])
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
    markup: 9,
    pay: async (days: number, promo: string, item: Item) => {
      let url = await call_rpc("start_aliwechat", [sessionStorage.getItem("sessid") || "RESELLER", {
        promo,
        days,
        method: 'alipay',
        item
      }]);
      goto(url);
    }
  }
}

export function wxpayBackend(): PaymentBackend {
  return {
    name: 'wxpay',
    icons: ["/wxpay.png"],
    markup: 9,
    pay: async (days: number, promo: string, item: Item) => {
      let url = await call_rpc("start_aliwechat", [sessionStorage.getItem("sessid") || "RESELLER", {
        promo,
        days,
        method: 'wxpay',
        item
      }]);
      goto(url);
    }
  }
}

export function paypalBackend(): PaymentBackend {
  return {
    name: 'paypal',
    icons: ['/paypal.svg', "/unionpay.svg"],
    markup: 0,
    pay: async (days: number, promo: string, item: Item, is_subscription: boolean) => {
      const resp = await axios.post(
        BINDER_ADDR + '/v2/paypal',
        {
          sessid: sessionStorage.getItem('sessid') || 'RESELLER',
          promo,
          days,
          item,
          is_subscription
        },
        { responseType: 'text' }
      );

      console.log(resp);
      if (is_subscription) {
        const approvalUrl = resp.data;
        window.location.href = approvalUrl;
      } else {
        let orderId = resp.data;
        console.log(orderId);
        const approvalUrl = `https://www.paypal.com/checkoutnow?token=${orderId}`;
        window.location.href = approvalUrl;
      }
    },
  };
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
