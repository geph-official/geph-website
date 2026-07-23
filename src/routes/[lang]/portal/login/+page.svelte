<script>
	import { page } from '$app/stores';

	import { call_rpc, translateError } from '../../../helpers';
	import { localize } from '../../../l10n';
	import { goto } from '$app/navigation';

	const lang = $page.params['lang'];

	let secret = $state('');
	let redirecting = $state(false);

	async function handleLoginClick() {
		try {
			let session_id = await call_rpc('login_secret', [secret.replaceAll(' ', '')]);
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

<div class="flex flex-col items-start gap-4 lg:mt-12">
	<h2 class="h2">{localize(lang, 'login')}</h2>

	<input
		type="text"
		class="input"
		inputmode="numeric"
		bind:value={secret}
		placeholder={localize(lang, 'account-secret')}
	/>

	<button
		disabled={redirecting}
		type="submit"
		class="btn variant-filled-primary"
		onclick={async () => {
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
