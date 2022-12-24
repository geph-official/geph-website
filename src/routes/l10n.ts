import l10n_data from "./l10n_data.yaml"

export const localize = (lang: string, s: string) => {
    if (s in l10n_data) {
        const mapping = (l10n_data as any)[s];
        if (lang in mapping) {
            return mapping[lang]
        }
    }
    return "!!MISSING!!"
}; 