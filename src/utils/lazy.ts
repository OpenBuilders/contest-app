import type { TonConnectUI } from "@tonconnect/ui";

const status = {
	cropper: false,
};

export const initializeCropper = async () => {
	if (status.cropper) return status.cropper;

	await import("cropperjs");

	status.cropper = true;
	return status.cropper;
};

export const initializeDOMPurify = async () =>
	(await import("dompurify")).default;

export const initializeSortable = async () =>
	(await import("solid-sortablejs")).default;

export let tonConnectUI: TonConnectUI | undefined;

export let parseTONAddress: (
	hexAddress: string,
	testOnly?: boolean,
) => string | undefined;

export const initializeTonConnect = async () => {
	if (tonConnectUI) return true;

	try {
		const { THEME, TonConnectUI, toUserFriendlyAddress } = await import(
			"@tonconnect/ui"
		);
		const darkMode = document.body.getAttribute("data-theme") === "dark";

		parseTONAddress = toUserFriendlyAddress;

		tonConnectUI = new TonConnectUI({
			manifestUrl: `${import.meta.env.VITE_APP_BASE_URL}/tonconnect-manifest.json`,
			uiPreferences: {
				theme: darkMode ? THEME.DARK : THEME.LIGHT,
			},
			restoreConnection: false,
			walletsRequiredFeatures: {
				sendTransaction: {
					minMessages: 2,
				},
			},
		});

		return true;
	} catch (error) {
		console.error("Failed to initialize TonConnectUI:", error);
	}

	return false;
};
