<script>
	import axios from 'axios';
	import { page } from '$app/stores';

	import { BINDER_ADDR, handleLoginClick } from '../../../helpers';
	import { localize } from '../../../l10n';
	import Navbar from '../../Navbar.svelte';
	import Footer from '../../Footer.svelte';
	import { goto } from '$app/navigation';

	const lang = $page.params['lang'];

	let username = '';
	let password = '';
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
			bind:value={username}
			placeholder={localize(lang, 'username')}
		/>

		<input
			type="password"
			id="password"
			class="form-control"
			bind:value={password}
			placeholder={localize(lang, 'password')}
		/>

		<button type="submit" class="btn" on:click={() => handleLoginClick(lang, username, password)}>
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
