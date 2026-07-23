<script>
	import { page } from '$app/stores';
	import { localize } from '../l10n';

	const lang = $page.params['lang'];

	let { data } = $props();
</script>

<svelte:head>
	<title>{localize(lang, 'geph')}</title>
</svelte:head>

<section class="hero my-12 py-12">
	<h1>{@html localize(lang, 'hero')}</h1>
	{@html localize(lang, 'sub_hero')}
</section>

<section>
	<div class="divider">{localize(lang, 'download')}</div>
	<div class="link-grid">
		<div class="link-item">
			<img src="/windows.png" alt="windows logo" class="link-icon" />
			<a href={data.download.windows}>Windows <span class="link-subtext">10+ (exe)</span></a>
		</div>

		<div class="link-item">
			<img src="/macos.png" alt="mac logo" class="link-icon dark-invert" />
			<a href={data.download.mac}>macOS <span class="link-subtext">10.15+ (pkg)</span></a>
		</div>

		<div class="link-item">
			<img src="/appstore.png" alt="app store logo" class="link-icon" />
			<a href="https://apps.apple.com/us/app/geph/id1638148282?platform=iphone">
				iOS <span class="link-subtext">App Store</span>
			</a>
		</div>

		<div class="link-item">
			<img src="/linux.png" alt="linux logo" class="link-icon" />
			<a href={data.download.linux}>Linux <span class="link-subtext">amd64 (flatpak)</span></a>
		</div>

		<div class="link-item">
			<img src="/android.png" alt="android logo" class="link-icon" />
			<a href={data.download.android_apk}>Android <span class="link-subtext">5.0+ (APK)</span></a>
		</div>

		<div class="link-item">
			<img src="/googleplay.png" alt="play logo" class="link-icon" />
			<a href={data.download.android_gplay}>Android <span class="link-subtext">5.0+ (Play)</span></a
			>
		</div>
	</div>
</section>

<section>
	<div class="divider">{localize(lang, 'community')}</div>
	<div class="link-grid">
		<div class="link-item">
			<img src="/twitter.png" alt="twitter logo" class="link-icon dark-invert" />
			<a href="https://x.com/GephOfficial">X</a>
		</div>

		<div class="link-item">
			<img src="/telegram.svg" alt="telegram logo" class="link-icon" />
			<a href="https://t.me/gephusers">Telegram</a>
		</div>

		<div class="link-item">
			<img src="/forum.png" alt="forum logo" class="link-icon" />
			<a href="https://community.geph.io">{localize(lang, 'forum')}</a>
		</div>
	</div>
</section>

<section>
	<div class="divider">FAQ</div>
	{@html localize(lang, 'faq_content')}
</section>

<style>
	.hero h1 {
		font-size: min(4rem, 13vw);
		line-height: 1.15;
		letter-spacing: -0.03rem;
		text-align: end;
		margin-bottom: 2rem;
		font-weight: 450;
	}

	.hero :global(p) {
		font-size: min(1.5rem, 6vw);
		margin-block: 1rem;
	}

	.link-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1.5rem;
		padding: 1rem 0;
	}

	.link-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.5rem;
	}

	.link-icon {
		width: 1.9rem;
	}

	.link-item a {
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}

	.link-item a:hover {
		text-decoration: underline;
	}

	.link-subtext {
		font-size: 0.75rem;
		opacity: 0.7;
		font-weight: 400;
	}

	:global(.faq-item) {
		margin-bottom: 2.5rem;
	}

	:global(.faq-question) {
		font-size: 1.12rem;
		font-weight: 500;
		margin-bottom: 0.5rem;
		letter-spacing: -0.01em;
	}

	:global(.faq-answer) {
		font-size: 1rem;
		line-height: 1.6;
		max-width: 95%;
		font-weight: 400;
	}

	:global(.faq-answer p) {
		margin-block: 0.75rem;
	}

	@media (max-width: 768px) {
		.link-grid {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
			gap: 1rem;
		}
	}
</style>
