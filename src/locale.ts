import * as i18n from "@solid-primitives/i18n";
import { dict_ar } from "./i18n/ar.ts";
import { dict_de } from "./i18n/de.ts";
import type * as en from "./i18n/en.ts";
import { dict as dict_en } from "./i18n/en.ts";
import { dict_fa } from "./i18n/fa.ts";
import { dict_hi } from "./i18n/hi.ts";
import { dict_ru } from "./i18n/ru.ts";

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
		case "fa":
			dict = dict_fa;
			break;
		case "ar":
			dict = dict_ar;
			break;
		case "de":
			dict = dict_de;
			break;
		case "ru":
			dict = dict_ru;
			break;
		case "hi":
			dict = dict_hi;
			break;
		default:
			dict = dict_en;
			break;
	}

	return i18n.flatten(dict);
}

export type Locale = (typeof locales)[number];
export type RawDictionary = typeof en.dict;
export type Dictionary = i18n.Flatten<RawDictionary>;

export { locales, localeFlags, localeDirections, fetchDictionary };
