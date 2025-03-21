<script>
	import { page } from '$app/stores';
	import { localize } from '../l10n';
	import Navbar from './Navbar.svelte';
	import Footer from './Footer.svelte';

	const lang = $page.params['lang'];

	export let data;
</script>

<svelte:head>
	<title>{localize(lang, 'geph')}</title>
</svelte:head>

<div lang={localize(lang, 'langcode')} dir="auto">
	<Navbar />
	<div class="container hero my-5 py-5">
		<h1>{localize(lang, 'hero')}</h1>
		{@html localize(lang, 'sub_hero')}
	</div>

	<div class="container">
		<div class="divider">{localize(lang, 'download')}</div>
		<div class="download-links-container mt-4">
			<div class="download-link">
				<img src="/windows.png" alt="windows logo" class="download-icon" />
				<div class="download-text">
					<a href={data.download.windows}>Windows <span class="download-subtext">10+ (exe)</span></a
					>
				</div>
			</div>

			<div class="download-link">
				<img src="/macos.png" alt="mac logo" class="download-icon" />
				<div class="download-text">
					<a href={data.download.mac}>macOS <span class="download-subtext">10.10+ (dmg)</span></a>
				</div>
			</div>

			<div class="download-link">
				<img src="/appstore.png" alt="app store logo" class="download-icon" />
				<div class="download-text">
					<a href="https://apps.apple.com/us/app/geph/id1638148282?platform=iphone"
						>iOS <span class="download-subtext">App Store</span></a
					>
				</div>
			</div>

			<div class="download-link">
				<img src="/linux.png" alt="linux logo" class="download-icon" />
				<div class="download-text">
					<a href={data.download.linux}
						>Linux <span class="download-subtext">amd64 (flatpak)</span></a
					>
				</div>
			</div>

			<div class="download-link">
				<img src="/android.png" alt="android logo" class="download-icon" />
				<div class="download-text">
					<a href={data.download.android_apk}
						>Android <span class="download-subtext">5.0+ (APK)</span></a
					>
				</div>
			</div>

			<div class="download-link">
				<img src="/googleplay.png" alt="play logo" class="download-icon" />
				<div class="download-text">
					<a href={data.download.android_gplay}
						>Android <span class="download-subtext">5.0+ (Play)</span></a
					>
				</div>
			</div>
		</div>
	</div>

	<div class="container">
		<div class="divider">{localize(lang, 'community')}</div>

		<div class="community-links-container mt-4">
			<div class="community-link">
				<img src="/twitter.png" alt="twitter logo" class="community-icon" />
				<div class="community-text">
					<a href="https://x.com/GephOfficial">X</a>
				</div>
			</div>

			<div class="community-link">
				<img src="/telegram.svg" alt="telegram logo" class="community-icon" />
				<div class="community-text">
					<a href="https://t.me/gephusers">Telegram</a>
				</div>
			</div>

			<div class="community-link">
				<img src="/forum.png" alt="forum logo" class="community-icon" />
				<div class="community-text">
					<a href="https://community.geph.io">{localize(lang, 'forum')}</a>
				</div>
			</div>

			<!-- <div class="community-link">
				<img src="/github.svg" alt="github logo" class="community-icon" />
				<div class="community-text">
					<a href="https://github.com/geph-official">GitHub</a>
				</div>
			</div> -->
		</div>
	</div>
	<div class="container">
		<div class="divider">FAQ</div>
		{@html localize(lang, 'faq_content')}
	</div>
</div>

<Footer />

<style>
	.hero h1 {
		font-size: min(4rem, 13vw);
		letter-spacing: -0.03rem;
		text-align: right;
		margin-bottom: 2rem;
		font-weight: 450;
	}

	:global(.hero p) {
		font-size: min(1.5rem, 6vw);
	}

	.divider {
		display: flex;
		align-items: center;
		text-transform: uppercase;
		font-weight: 600;
		letter-spacing: 0.2em;
		font-style: italic;
		color: var(--bs-primary);

		margin-top: 5rem;
		margin-bottom: 3rem;
	}

	.divider::before {
		content: '';
		background-color: var(--bs-primary);
		height: 1px;
		width: 5rem;
		margin-right: 1rem;
	}

	.divider::after {
		content: '';
		background-color: var(--bs-primary);
		height: 1px;
		width: 5rem;
		margin-left: 1rem;
	}

	.download-links-container,
	.community-links-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1.5rem;
		padding: 1rem 0;
	}

	.download-link,
	.community-link {
		display: flex;
		align-items: center;
		padding: 0.5rem;
	}

	.download-icon,
	.community-icon {
		height: 2rem;
		margin-right: 1rem;
	}

	.download-text,
	.community-text {
		display: flex;
		flex-direction: column;
	}

	.download-text a,
	.community-text a {
		text-decoration: none;
		color: var(--bs-body-color);
		font-weight: 500;
		transition: color 0.2s;
	}

	.download-text a:hover,
	.community-text a:hover {
		color: var(--bs-primary);
		text-decoration: underline;
	}

	.download-subtext {
		font-size: 0.75rem;
		color: #666;
		font-weight: 400;
	}

	:global(.faq-item) {
		margin-bottom: 2.5rem;
	}

	:global(.faq-item:last-child) {
		border-bottom: none;
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
		color: var(--bs-body-color);
		max-width: 95%;
		font-weight: 400;
	}

	@media (max-width: 768px) {
		.download-links-container,
		.community-links-container {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
			gap: 1rem;
		}

		:global(.faq-question) {
			font-size: 1.2rem;
		}

		:global(.faq-answer) {
			font-size: 0.95rem;
		}
	}
</style>
