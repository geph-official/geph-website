<script lang="ts">
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
	<div class="container mt-lg-5 pt-5">
		<div class="row mb-3">
			<div class="col-lg" />
			<div class="col-lg">
				<h2>{localize(lang, 'login')}</h2>
			</div>
			<div class="col-lg" />
		</div>
		<form class="row">
			<div class="col-lg" />
			<div class="col-lg">
				<input
					type="username"
					class="form-control"
					id="username"
					bind:value={username}
					placeholder={localize(lang, 'username')}
				/>

				<input
					type="password"
					class="form-control"
					id="password"
					bind:value={password}
					placeholder={localize(lang, 'password')}
				/>

				<button
					type="submit"
					class="btn btn-primary"
					on:click={() => handleLoginClick(lang, username, password)}
				>
					{localize(lang, 'login')}
				</button>
			</div>
			<div class="col-lg" />
		</form>
	</div>
	<Footer />
</div>

<style>
	input {
		margin-bottom: 0.7rem;
	}
</style>
