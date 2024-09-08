import axios from "axios";
import YAML from 'yaml'
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const y = await axios.get("https://dl.geph.io/geph-releases/metadata.yaml", {responseType: "text"});
    let obj = YAML.parse(y.data);
    return {
        download: {
            windows: `https://dl.geph.io/geph-releases/windows-stable/${obj["windows-stable"].version}/${obj["windows-stable"].filename}`,
            mac: `https://dl.geph.io/geph-releases/macos-stable/${obj["macos-stable"].version}/${obj["macos-stable"].filename}`,
            linux: `https://dl.geph.io/geph-releases/linux-stable/${obj["linux-stable"].version}/${obj["linux-stable"].filename}`,
            android_apk: `https://dl.geph.io/geph-releases/android-stable/${obj["android-stable"].version}/${obj["android-stable"].filename}`,
            android_gplay: "https://play.google.com/store/apps/details?id=io.geph.android"
         }
    };
}