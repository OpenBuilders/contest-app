import { isTMA } from "@telegram-apps/sdk-solid";
import { createStore, type SetStoreFunction } from "solid-js/store";
import type { Locale } from "../locale";
import { setMotionMultipler } from "./motion";
import { isVersionAtLeast, lp } from "./telegram";

type SettingsStorage = "DeviceStorage" | "LocalStorage";

let settingsStorage: SettingsStorage = "LocalStorage";
let settingsInitialized = false;

export type Settings = {
	language: Locale;
	reduce_motion: {
		enabled: boolean;
	};
	haptic: {
		enabled: boolean;
	};
	tabs: {
		home: {
			myContests: "all" | "joined" | "created";
		};
	};
};

export const [settings, setSettingsStore] = createStore<Settings>({
	language: "en",
	reduce_motion: {
		enabled: false,
	},
	haptic: {
		enabled: true,
	},
	tabs: {
		home: {
			myContests: "all",
		},
	},
});

export const waitForSettings = () =>
	new Promise((resolve) => {
		if (settingsInitialized) {
			resolve(settingsInitialized);
		} else {
			const interval = setInterval(() => {
				if (settingsInitialized) {
					clearInterval(interval);
					resolve(settingsInitialized);
				}
			}, 10);
		}
	});

export const initializeSettings = () => {
	// biome-ignore lint/correctness/noConstantCondition: <explanation>
	if (isTMA() && isVersionAtLeast("9.0") && false) {
		settingsStorage = "DeviceStorage";
		// TODO: Implement DeviceStorage Support when TMA SDK supports it
	} else {
		settingsStorage = "LocalStorage";

		const localSettings = localStorage.getItem(
			`settings_${lp?.tgWebAppData?.user?.id}`,
		);

		if (localSettings) {
			setSettingsStore(JSON.parse(localSettings));
		}
	}

	if (settings.reduce_motion.enabled) {
		setMotionMultipler(0);
	}

	document.documentElement.setAttribute(
		"prefer-reduced-motion",
		settings.reduce_motion.enabled.toString(),
	);

	settingsInitialized = true;
};

export const setSettings: SetStoreFunction<Settings> = (...args: any) => {
	// @ts-ignore
	setSettingsStore(...args);

	if (settingsStorage === "DeviceStorage") {
	} else if (settingsStorage === "LocalStorage") {
		localStorage.setItem(
			`settings_${lp?.tgWebAppData?.user?.id}`,
			JSON.stringify(settings),
		);
	}
};
