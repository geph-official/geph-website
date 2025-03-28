<script lang="ts">
	import { page } from '$app/stores';
	import { handleSecretLoginClick } from '../../../routes/helpers';
	import { getLang, localize } from '../../../routes/l10n';
	const secret = $page.url.searchParams.get('secret') as string;
	const lang = getLang();
	handleSecretLoginClick(lang, secret);
</script>

<title>{localize(lang, 'user-portal')}</title>

<div class="loading-wrapper">
	<div class="spinner-border" role="status" />
	{localize(lang, 'loading')}
</div>

<style>
	.loading-wrapper {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 80vh;
	}

	.loading-wrapper div {
		margin-right: 1rem;
	}
</style>