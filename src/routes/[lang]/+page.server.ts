import YAML from 'yaml';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch('https://dl.geph.io/geph-releases/metadata.yaml');
	if (!response.ok) {
		throw new Error(`Unable to fetch release metadata: ${response.status}`);
	}
	const obj = YAML.parse(await response.text());
	return {
		download: {
			windows: `https://dl.geph.io/geph-releases/windows-stable/${obj['windows-stable'].version}/${obj['windows-stable'].filename}`,
			mac: `https://dl.geph.io/geph-releases/macos-stable/${obj['macos-stable'].version}/${obj['macos-stable'].filename}`,
			linux: `https://dl.geph.io/geph-releases/linux-stable/${obj['linux-stable'].version}/${obj['linux-stable'].filename}`,
			android_apk: `https://dl.geph.io/geph-releases/android-stable/${obj['android-stable'].version}/${obj['android-stable'].filename}`,
			android_gplay: 'https://play.google.com/store/apps/details?id=io.geph.android'
		}
	};
};
