import * as i18n from "@solid-primitives/i18n";
import type * as en from "./i18n/en.ts";

import { dict as en_dict } from "./i18n/en.ts";

const locales = ["en", "ru", "fa", "ar", "de", "hi"] as const;

const localeFlags: { [key in Locale]: string } = {
	en: "🇺🇸",
	fa: "🇮🇷",
	ru: "🇷🇺",
	ar: "🇦🇪",
	de: "🇩🇪",
	hi: "🇮🇳",
};

const localeDirections: { [key in Locale]: string } = {
	en: "ltr",
	fa: "rtl",
	ru: "ltr",
	ar: "rtl",
	de: "ltr",
	hi: "ltr",
};

function fetchDictionary(locale: Locale): Dictionary {
	let dict: RawDictionary;

	switch (locale) {
		// case "fa":
		// 	dict = fa_dict;
		// 	break;
		// case "ar":
		// 	dict = ar_dict;
		// 	break;
		// case "de":
		// 	dict = de_dict;
		// 	break;
		// case "ru":
		// 	dict = ru_dict;
		// 	break;
		// case "hi":
		// 	dict = hi_dict;
		// 	break;
		default:
			dict = en_dict;
			break;
	}

	return i18n.flatten(dict);
}

export type Locale = (typeof locales)[number];
export type RawDictionary = typeof en.dict;
export type Dictionary = i18n.Flatten<RawDictionary>;

export { locales, localeFlags, localeDirections, fetchDictionary };
