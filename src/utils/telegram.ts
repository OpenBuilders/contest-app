import {
	backButton,
	bindMiniAppCssVars,
	bindThemeParamsCssVars,
	bindViewportCssVars,
	type ImpactHapticFeedbackStyle,
	init,
	mainButton,
	miniApp,
	type NotificationHapticFeedbackType,
	postEvent as postEventUnsafe,
	retrieveLaunchParams,
	secondaryButton,
	settingsButton,
	themeParams,
	viewport,
} from "@telegram-apps/sdk-solid";
import { Color } from "./colors";
import { navigator } from "./navigator";
import { settings } from "./settings";

const retrieveLaunchParamsSafe = () => {
	try {
		return retrieveLaunchParams();
	} catch (_) {
		return undefined;
	}
};

export const lp = retrieveLaunchParamsSafe();

export const setHeaderColor = (color: `#${string}`) => {
	postEvent("web_app_set_header_color", {
		color: color,
	});
};

export const setBackgroundColor = (
	color: `#${string}`,
	applyBottomBar = true,
) => {
	postEvent("web_app_set_background_color", {
		color: color,
	});

	if (applyBottomBar) {
		postEvent("web_app_set_bottom_bar_color", {
			color: color,
		});
	}
};

export const setBottomBarColor = (color: `#${string}`) => {
	postEvent("web_app_set_bottom_bar_color", {
		color: color,
	});
};

export const setThemeColor = (color: `#${string}`) => {
	setHeaderColor(color);
	setBackgroundColor(color);
};

export const invokeHapticFeedbackImpact = (
	style: ImpactHapticFeedbackStyle,
) => {
	if (settings.haptic.enabled) {
		postEvent("web_app_trigger_haptic_feedback", {
			type: "impact",
			impact_style: style,
		});
	}
};

export const invokeHapticFeedbackNotification = (
	style: NotificationHapticFeedbackType,
) => {
	if (settings.haptic.enabled) {
		postEvent("web_app_trigger_haptic_feedback", {
			type: "notification",
			notification_type: style,
		});
	}
};

export const invokeHapticFeedbackSelectionChanged = () => {
	if (settings.haptic.enabled) {
		postEvent("web_app_trigger_haptic_feedback", {
			type: "selection_change",
		});
	}
};

export const isVersionAtLeast = (version: string) => {
	const v1 = (lp?.tgWebAppVersion ?? "0").replace(/^\s+|\s+$/g, "").split(".");
	const v2 = version.replace(/^\s+|\s+$/g, "").split(".");
	const a = Math.max(v1.length, v2.length);
	let p1: number | undefined;
	let p2: number | undefined;
	for (let i = 0; i < a; i++) {
		p1 = Number.parseInt(v1[i]) || 0;
		p2 = Number.parseInt(v2[i]) || 0;
		if (p1 === p2) continue;
		if (p1 > p2) return true;
		return false;
	}
	return true;
};

export const parseTelegramLink = (url: string): string | null => {
	try {
		// Handle tg:// links separately
		if (url.startsWith("tg://")) {
			const tgUrl = new URL(url.replace(/^tg:/, "https:"));
			return tgUrl.pathname + tgUrl.search + tgUrl.hash;
		}

		const parsed = new URL(url);
		const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

		const telegramDomains = [
			"t.me",
			"telegram.me",
			"telegram.dog",
			"telegram.org",
		];

		if (telegramDomains.includes(host)) {
			return parsed.pathname + parsed.search + parsed.hash;
		}

		return null;
	} catch {
		return null; // Invalid URL
	}
};

export const postEvent = (...args: Parameters<typeof postEventUnsafe<any>>) => {
	try {
		postEventUnsafe(...args);
	} catch (_) {}
};

export const initializeTMA = async () => {
	init();

	postEvent("web_app_ready");
	postEvent("iframe_ready");
	postEvent("web_app_expand");

	if (!mainButton.isMounted()) {
		mainButton.mount();
		mainButton.setParams({
			isVisible: false,
		});
	}

	if (!secondaryButton.isMounted()) {
		secondaryButton.mount();
		secondaryButton.setParams({
			isVisible: false,
		});
	}

	if (settingsButton.isSupported() && !settingsButton.isMounted()) {
		settingsButton.mount();
		settingsButton.hide();
	}

	if (backButton.isSupported() && !backButton.isMounted()) {
		backButton.mount();
		backButton.hide();
	}

	if (
		viewport.mount.isAvailable() &&
		!(viewport.isMounted() || viewport.isMounting())
	) {
		await viewport.mount();
		bindViewportCssVars();
	}

	if (themeParams.mountSync.isAvailable() && !themeParams.isMounted()) {
		themeParams.mountSync();
		bindThemeParamsCssVars();
	}

	if (miniApp.mountSync.isAvailable() && !miniApp.isMounted()) {
		miniApp.mountSync();
		bindMiniAppCssVars();

		const handleTheme = (isDark: boolean) => {
			document.body.setAttribute("data-theme", isDark ? "dark" : "light");

			const current = navigator.getCurrentHistory();
			if (!current) return;

			if (current.options?.params?.theme !== false) {
				setTimeout(() => {
					const page = document.querySelector(".page");
					if (!page) return;

					const color = new Color(getComputedStyle(page).backgroundColor);

					setThemeColor(color.toHex() as any);
				});
			}
		};

		handleTheme(miniApp.isDark());
		miniApp.isDark.sub(handleTheme);
	}

	setTimeout(() => {
		const persistVariables = [
			"tg-viewport-height",
			"tg-viewport-safe-area-inset-top",
			"tg-viewport-content-safe-area-inset-top",
			"tg-viewport-safe-area-inset-bottom",
			"tg-viewport-content-safe-area-inset-bottom",
		];

		for (const name of persistVariables) {
			(document.querySelector(":root") as HTMLElement).style.setProperty(
				`--p${name}`,
				(document.querySelector(":root") as HTMLElement).style.getPropertyValue(
					`--${name}`,
				),
			);
		}
	});

	if (isVersionAtLeast("6.2")) {
		postEvent("web_app_setup_closing_behavior", {
			need_confirmation: false,
		});
	}

	if (isVersionAtLeast("7.7")) {
		postEvent("web_app_setup_swipe_behavior", {
			allow_vertical_swipe: false,
		});
	}

	if (isVersionAtLeast("8.0")) {
		postEvent("web_app_toggle_orientation_lock", {
			locked: true,
		});

		if (["ios", "android"].includes(lp?.tgWebAppPlatform.toLowerCase() ?? "")) {
			postEvent("web_app_request_fullscreen");
		}
	}
};

export const normalizeTelegramPath = (input: string): string | null => {
	let value = input.trim();

	// Handle @username
	if (value.startsWith("@")) {
		return `/${value.slice(1)}`;
	}

	// Handle tg:// scheme
	if (value.startsWith("tg://")) {
		try {
			const url = new URL(value);

			if (url.hostname === "resolve") {
				const domain = url.searchParams.get("domain");
				if (!domain) return null;

				const rest = new URLSearchParams(url.searchParams);
				rest.delete("domain");

				const query = rest.toString();
				return `/${domain}${query ? "?" + query : ""}`;
			}

			if (url.hostname === "join") {
				const invite = url.searchParams.get("invite");
				if (!invite) return null;

				const rest = new URLSearchParams(url.searchParams);
				rest.delete("invite");

				const query = rest.toString();
				return `/joinchat/${invite}${query ? "?" + query : ""}`;
			}

			return null;
		} catch {
			return null;
		}
	}

	// Add protocol if missing
	if (!/^[a-z]+:\/\//i.test(value)) {
		value = `https://${value}`;
	}

	try {
		const url = new URL(value);

		const telegramHosts = new Set([
			"t.me",
			"telegram.me",
			"telegram.dog",
			"www.t.me",
			"www.telegram.me",
			"www.telegram.dog",
		]);

		if (!telegramHosts.has(url.hostname)) return null;

		const path = url.pathname.replace(/\/+$/, "");
		if (!path || path === "/") return null;

		return `${path}${url.search}`;
	} catch {
		return null;
	}
};

export const openLink = (url: string) => {
	const path = normalizeTelegramPath(url);

	if (path && isVersionAtLeast("6.1")) {
		postEvent("web_app_open_tg_link", {
			path_full: path,
		});
	} else {
		postEvent("web_app_open_link", {
			url,
		});
	}
};
