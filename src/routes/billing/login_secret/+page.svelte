<script lang="ts">
	import { page } from '$app/stores';
	import { handleSecretLoginClick } from '../../../routes/helpers';
	import { getLang, localize } from '../../../routes/l10n';
	const secret = $page.url.searchParams.get('secret') as string;
	const lang = getLang();
	handleSecretLoginClick(lang, secret);
</script>

<title>{localize(lang, 'user-portal')}</title>

<div class="flex h-[80vh] items-center justify-center gap-4">
	<div class="spinner" role="status"></div>
	{localize(lang, 'loading')}
</div>
