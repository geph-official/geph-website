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

<div class="flex h-[80vh] items-center justify-center gap-4">
	<div class="spinner" role="status"></div>
	{localize(lang, 'loading')}
</div>
