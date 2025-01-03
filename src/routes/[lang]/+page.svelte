<script lang="ts">
	import { page } from '$app/stores';
	import { xlink_attr } from 'svelte/internal';
	import { localize } from '../l10n';
	import Navbar from './Navbar.svelte';
	import Footer from './Footer.svelte';

	const lang = $page.params['lang'];

	export let data: any;
</script>

<svelte:head>
	<title>{localize(lang, 'geph')}</title>
</svelte:head>

<div lang={localize(lang, 'langcode')} dir="auto">
	<Navbar />
	<div class="container hero my-5 py-5 pb-4">
		<h1>🚀 {localize(lang, 'hero')}</h1>
		<p>{localize(lang, 'sub_hero')}</p>
	</div>

	<div class="container">
		<div class="row">
			<div class="col-lg">
				<div class="blurb">
					<h3>🔒 {localize(lang, 'robust-zk-privacy')}</h3>
					<p>
						{@html localize(lang, 'robust-zk-privacy-blurb')}
					</p>
				</div>
			</div>
			<div class="col-lg">
				<div class="blurb">
					<h3>🏛️ {localize(lang, 'resilient-anti-censorship')}</h3>
					<p>
						{@html localize(lang, 'resilient-anti-censorship-blurb')}
					</p>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-lg">
				<div class="blurb">
					<h3>😊 {localize(lang, 'accessible-to-all')}</h3>
					<p>
						{@html localize(lang, 'accessible-to-all-blurb')}
					</p>
				</div>
			</div>
			<div class="col-lg">
				<div class="blurb">
					<h3>🔍 {localize(lang, 'transparent-and-accountable')}</h3>
					<p>
						{@html localize(lang, 'transparent-and-accountable-blurb')}
					</p>
				</div>
			</div>
		</div>

		<div class="container my-5">
			<div class="row pt-3">
				<div class="col">
					<h3>📥 {localize(lang, 'download')}</h3>
				</div>
			</div>
			<div class="row mt-4">
				<div class="col-lg col-6">
					<a class="download-box" href={data.download.windows}>
						<div class="download-box-icon">
							<img src="/windows.png" alt="windows logo" />
						</div>
						<div class="dl-desc">
							<div>Windows</div>
							<small>10+ (exe)</small>
						</div>
					</a>
				</div>
				<div class="col-lg col-6">
					<a class="download-box" href={data.download.mac}>
						<div class="download-box-icon">
							<img src="/macos.png" alt="mac logo" />
						</div>
						<div class="dl-desc">
							<div>macOS</div>
							<small>10.10+ (dmg)</small>
						</div>
					</a>
				</div>
				<div class="col-lg col-6">
					<a
						class="download-box"
						href="https://apps.apple.com/us/app/geph/id1638148282?platform=iphone"
					>
						<div class="download-box-icon">
							<img src="/appstore.png" alt="linux logo" />
						</div>
						<div class="dl-desc">
							<div>iOS</div>
							<small>App Store</small>
						</div>
					</a>
				</div>
				<div class="col-lg col-6">
					<a class="download-box" href={data.download.linux}>
						<div class="download-box-icon">
							<img src="/linux.png" alt="linux logo" />
						</div>
						<div class="dl-desc">
							<div>Linux</div>
							<small>amd64 (flatpak)</small>
						</div>
					</a>
				</div>
				<div class="col-lg col-6">
					<a class="download-box" href={data.download.android_apk}>
						<div class="download-box-icon">
							<img src="/android.png" alt="android logo" />
						</div>
						<div class="dl-desc">
							<div>Android</div>
							<small>5.0+ (APK)</small>
						</div>
					</a>
				</div>

				<div class="col-lg col-6">
					<a class="download-box" href={data.download.android_gplay}>
						<div class="download-box-icon">
							<img src="/googleplay.png" alt="play logo" />
						</div>
						<div class="dl-desc">
							<div>Android</div>
							<small>5.0+ (Play)</small>
						</div>
					</a>
				</div>
			</div>
		</div>

		<div class="container my-5">
			<div class="row pt-4">
				<div class="col">
					<h3>🌎 {localize(lang, 'community')}</h3>
				</div>
			</div>
			<div class="row mt-4">
				<div class="col-lg">
					<a class="download-box" href="https://x.com/GephOfficial">
						<div class="download-box-icon">
							<img src="/twitter.png" alt="twitter logo" />
						</div>
						<div class="dl-desc">
							<div>{"X"}</div>
						</div>
					</a>
				</div>
				<div class="col-lg">
					<a class="download-box" href="https://t.me/gephannounce">
						<div class="download-box-icon">
							<img src="/telegram.svg" alt="telegram logo" />
						</div>
						<div class="dl-desc">
							<div>Telegram</div>
						</div>
					</a>
				</div>
				<div class="col-lg">
					<a class="download-box" href="https://community.geph.io">
						<div class="download-box-icon">
							<img src="/forum.png" alt="forum logo" />
						</div>
						<div class="dl-desc">
							<div>{localize(lang, 'forum')}</div>
						</div>
					</a>
				</div>
				<div class="col-lg">
					<a class="download-box" href="https://github.com/geph-official">
						<div class="download-box-icon">
							<img src="/github.svg" alt="github logo" />
						</div>
						<div class="dl-desc">
							<div>GitHub</div>
						</div>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>

<Footer />

<style>
	.navbar-brand {
		font-weight: 550;
		letter-spacing: -0.02rem;
	}

	.navbar-brand img {
		margin-inline-end: 0.3rem;
	}

	.hero {
		/* background-color: rgba(0, 0, 0, 0.05); */
		/* border-radius: 0.5rem; */

		padding-inline-start: 2rem;
	}

	.hero h1 {
		font-weight: 500;
		letter-spacing: -0.03rem;
		opacity: 0.8;
	}

	.hero p {
		font-size: 120%;
	}

	.blurb {
		border: 1px solid #ddd;
		border-radius: 0.5rem;
		background-color: rgba(var(--bs-light-rgb), 0.5);
		padding: 1.5rem;
		padding-bottom: 3rem;
		height: calc(100% - 1.6rem);

		font-size: 95%;
	}

	.blurb h3 {
		font-size: 1.3rem;
		font-weight: 500;
		letter-spacing: -0.02rem;
		opacity: 0.8;
	}

	.download-box {
		border: 1px solid #ddd;
		border-radius: 0.5rem;
		background-color: rgba(var(--bs-light-rgb), 0.5);

		padding: 0.8rem;
		margin-bottom: 0.5rem;

		display: flex;
		flex-direction: row;
		align-items: center;

		text-decoration: none;
		color: var(--bs-body-color);
		font-size: 95%;
	}

	.download-box small {
		font-size: 70%;
		font-weight: 500;
		opacity: 0.8;
	}

	.download-box img {
		height: 2rem;
	}

	.download-box-icon {
		margin-inline-end: 1rem;
	}

	.dl-desc {
		display: flex;
		flex-direction: column;
	}
</style>
