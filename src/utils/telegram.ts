import {
	type ImpactHapticFeedbackStyle,
	type NotificationHapticFeedbackType,
	postEvent as postEventUnsafe,
	retrieveLaunchParams,
} from "@telegram-apps/sdk-solid";
import { settings } from "./settings";

export const setHeaderColor = (color: `#${string}`) => {
	postEvent("web_app_set_header_color", {
		color: color,
	});
};

export const setBackgroundColor = (color: `#${string}`) => {
	postEvent("web_app_set_background_color", {
		color: color,
	});
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
	const v1 = (retrieveLaunchParams().tgWebAppVersion ?? "0")
		.replace(/^\s+|\s+$/g, "")
		.split(".");
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

export const postEvent = (...args: Parameters<typeof postEventUnsafe<any>>) => {
	try {
		postEventUnsafe(...args);
	} catch (e) {}
};
