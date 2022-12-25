<script lang="ts">
	import { page } from '$app/stores';
	import { handleLoginClick } from '../../../routes/helpers';
	import { getLang, localize } from '../../../routes/l10n';
	const uname = $page.url.searchParams.get('uname') as string;
	const pwd = $page.url.searchParams.get('pwd') as string;
	const lang = getLang();
	handleLoginClick(lang, uname, pwd);
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
