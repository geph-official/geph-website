<script>
	import axios from 'axios';
	import { page } from '$app/stores';

	import { call_rpc, translateError } from '../../../helpers';
	import { localize } from '../../../l10n';
	import Navbar from '../../Navbar.svelte';
	import Footer from '../../Footer.svelte';
	import { goto } from '$app/navigation';

	const lang = $page.params['lang'];

	let secret = '';
	let password = '';
	let redirecting = false;

	async function handleLoginClick() {
		try {
			let session_id = await call_rpc('login_secret', [secret]);
			console.log(session_id);
			sessionStorage.setItem('sessid', session_id);
			goto(`/${lang}/portal`);
		} catch (e) {
			alert(translateError(String(e), lang));
		}
	}
</script>

<svelte:head>
	<title>{localize(lang, 'login')}</title>
</svelte:head>

<div lang={localize(lang, 'langcode')} dir="auto">
	<Navbar />
	<div class="container mt-lg-5">
		<h2>{localize(lang, 'login')}</h2>

		<input
			type="username"
			id="username"
			class="form-control"
			bind:value={secret}
			placeholder={localize(lang, 'account-secret')}
		/>

		<button
			disabled={redirecting}
			type="submit"
			class="btn"
			on:click={async () => {
				redirecting = true;
				try {
					await handleLoginClick();
				} finally {
					redirecting = false;
				}
			}}
		>
			{localize(lang, 'login')}
		</button>
	</div>
	<Footer />
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	input {
		height: 2.5rem;
	}
	.btn {
		background-color: var(--bs-primary);
		color: var(--bs-light);
	}
</style>
