<script lang="ts">
	import BuyPlus from '../portal/BuyPlus.svelte';
	import { localize } from '../../../routes/l10n';
	import { page } from '$app/stores';
	import Navbar from '../Navbar.svelte';
	import Footer from '../Footer.svelte';
	const lang = $page.params['lang'];
</script>

<svelte:head>
	<script src="https://js.stripe.com/v3/"></script>
	<title>{localize(lang, 'user-portal')}</title>
</svelte:head>

<div lang={localize(lang, 'langcode')} dir="auto">
	<Navbar />
	<div class="container">
		<div class="row my-5">
			<div class="col">
				<div class="container-fluid">
					<h2>Reseller portal</h2>
				</div>
			</div>
		</div>
		<BuyPlus />
	</div>
	<Footer />
</div>
