<script lang="ts">
	import axios from 'axios';
	import { page } from '$app/stores';

	import { BINDER_ADDR } from '../../../helpers';
	import { localize } from '../../../l10n';
	import Navbar from '../../Navbar.svelte';
	import Footer from '../../Footer.svelte';
	import { goto } from '$app/navigation';

	const lang = $page.params['lang'];

	export function translateError(e: string, lang: string): string {
		console.log('login page error: ' + e);
		if (e.includes('403')) {
			return localize(lang, 'incorrect-login');
		} else if (e.includes('500')) {
			return localize(lang, 'internal-server-error');
		} else {
			return localize(lang, 'unknown-error') + ': ' + e;
		}
	}

	let username = '';
	let password = '';

	async function handleLoginClick() {
		try {
			let resp = await axios.post(BINDER_ADDR + '/v2/login', {
				uname: username,
				pwd: password
			});

			console.log(resp.status);
			if (resp.status < 400) {
				let session_id = await resp.data;
				console.log(session_id);
				sessionStorage.setItem('sessid', session_id);
				goto(`/${lang}/portal`);
			} else {
				alert(translateError(resp.data, lang));
			}
		} catch (e) {
			alert(translateError(String(e), lang));
		}
	}
</script>

<div lang={localize(lang, 'langcode')}>
	<Navbar />
	<div class="container mt-5 pt-5">
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

				<button type="submit" class="btn btn-primary" on:click={handleLoginClick}>
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
