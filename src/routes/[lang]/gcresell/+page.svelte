<script lang="ts">
	import BuyPlus from '../portal/BuyPlus.svelte';
	import { localize } from '../../../routes/l10n';
	import { page } from '$app/stores';
	const lang = $page.params['lang'];
</script>

<svelte:head>
	<script src="https://js.stripe.com/v3/"></script>
	<title>{localize(lang, 'user-portal')}</title>
</svelte:head>

<h2 class="h2 my-12">Reseller portal</h2>
<BuyPlus variant="reseller" is_recurring={false} />
