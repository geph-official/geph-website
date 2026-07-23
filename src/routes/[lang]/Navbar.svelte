<script lang="ts">
	import { page } from '$app/stores';
	import { localize } from '../l10n';

	const lang = $page.params['lang'];
	const langs = ['en', 'zhs', 'zht', 'fa', 'ar', 'ru'];

	const isUserPortal = $page.url.toString().includes('portal');
	const isPolicies = $page.url.toString().includes('policies');
	const isHome = !isUserPortal && !isPolicies;
	const bannerContent = localize(lang, 'banner');

	const switchLang = (e: Event) => {
		const toLang = (e.currentTarget as HTMLSelectElement).value;
		location.assign($page.url.toString().replace('/' + lang, '/' + toLang));
	};
</script>

<header class="py-3">
	<div class="frame flex flex-wrap items-center gap-x-5 gap-y-2">
		<a href={`/${lang}/`} class="flex items-center gap-2 font-medium no-underline">
			<img src="/gephlogo.png" alt="Geph logo" class="h-8" />
			{localize(lang, 'geph')}
		</a>
		<nav class="ms-auto flex flex-wrap items-center gap-x-5 gap-y-2">
			<a
				href={`/${lang}/`}
				class="no-underline hover:underline {isHome
					? 'font-semibold'
					: 'opacity-60 hover:opacity-100'}"
			>
				{localize(lang, 'home')}
			</a>
			<a
				href={`/${lang}/portal`}
				class="no-underline hover:underline {isUserPortal
					? 'font-semibold'
					: 'opacity-60 hover:opacity-100'}"
			>
				{localize(lang, 'user-portal')}
			</a>
			<a
				href="https://github.com/geph-official/geph5/blob/master/PRIVACY.md"
				target="_blank"
				rel="noopener"
				class="no-underline opacity-60 hover:underline hover:opacity-100"
			>
				{localize(lang, 'policies')}
			</a>
			<select
				class="select w-auto border-0 bg-transparent py-1 opacity-60 hover:opacity-100"
				value={lang}
				onchange={switchLang}
				aria-label="Language"
			>
				{#each langs as l}
					<option value={l}>{localize(l, 'langname')}</option>
				{/each}
			</select>
		</nav>
	</div>
</header>

{#if bannerContent !== '' && bannerContent !== '!!MISSING!!'}
	<div class="frame mt-1">
		<aside class="alert variant-soft-primary justify-center font-medium">
			{@html bannerContent}
		</aside>
	</div>
{/if}
