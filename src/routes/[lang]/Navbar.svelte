<script lang="ts">
	import { page } from '$app/stores';

	import { localize } from '../l10n';

	const lang = $page.params['lang'];

	const isUserPortal = $page.url.toString().includes('portal');
	const isPolicies = $page.url.toString().includes('policies');
	const isHome = !isUserPortal && !isPolicies;
	const bannerContent = localize(lang, 'banner');
	$: replaceLanguage = (path: string, toLang: string) => path.replace('/' + lang, '/' + toLang);
</script>

{#if bannerContent !== '' && bannerContent !== '!!MISSING!!'}
	<div class="alert alert-primary" role="alert">{@html bannerContent}</div>
{/if}
<nav class="navbar navbar-expand-lg bg-light">
	<div class="container">
		<a href={`/${lang}/`} class="navbar-brand">
			<img src="/gephlogo.png" height="32" alt="Geph logo" class="me-1" />
			{localize(lang, 'geph')}
		</a>
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarSupportedContent"
			aria-controls="navbarSupportedContent"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon" />
		</button>
		<div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
			<ul class="navbar-nav mb-2 mb-lg-0">
				<li class="nav-item">
					<a class="nav-link" class:active={isHome} href={`/${lang}/`}>
						{localize(lang, 'home')}
					</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" class:active={isUserPortal} href={`/${lang}/portal`}>
						{localize(lang, 'user-portal')}
					</a>
				</li>
				<li class="nav-item">
					<a
						class="nav-link"
						class:active={isPolicies}
						href="https://github.com/geph-official/geph4-client/wiki/Policies-and-terms"
						target="_blank"
					>
						{localize(lang, 'policies')}
					</a>
				</li>
				<li class="nav-item dropdown">
					<a
						class="nav-link dropdown-toggle"
						role="button"
						data-bs-toggle="dropdown"
						aria-expanded="false"
					>
						{localize(lang, 'langname')}
					</a>
					<ul class="dropdown-menu">
						{#each ['en', 'zhs', 'zht'] as l}
							<li>
								<a
									data-sveltekit-reload
									class="dropdown-item"
									href={replaceLanguage($page.url.toString(), l)}
								>
									{localize(l, 'langname')}
								</a>
							</li>
						{/each}
					</ul>
				</li>
			</ul>
		</div>
	</div>
</nav>

<style>
	.navbar-brand {
		font-weight: 500;
	}

	.navbar-brand {
		text-decoration: none !important;
	}

	.active {
		font-weight: 500;
	}
	.alert-primary {
		margin: 0rem;
		padding: 0.1rem;
		border: 0rem;
		border-radius: 0;
		opacity: 1;
		font-weight: 600;
		text-align: center;
	}
</style>
