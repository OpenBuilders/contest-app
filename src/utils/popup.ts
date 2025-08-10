import { off, on } from "@telegram-apps/sdk";
import { postEvent } from "./telegram";

type PopupButtonType = "default" | "destructive" | "ok" | "close" | "cancel";

interface PopupButton {
	id: string; // 0-64 chars
	type: PopupButtonType;
	text?: string; // Ignored for ok, close, cancel
}

interface PopupOptions {
	title: string; // 0-64 chars
	message: string; // 1-256 chars
	buttons: PopupButton[]; // 1-3 buttons
}

interface PopupResult {
	button_id?: string;
}

type PopupResolve = (data: PopupResult) => void;
type PopupReject = (error: any) => void;

export class TelegramPopupManager {
	private callbacks = new Map<
		string,
		{ resolve: PopupResolve; reject: PopupReject }
	>();
	private listening = false;

	private ensureListening() {
		if (this.listening) return;
		on("popup_closed", this.handlePopupClosed);
		this.listening = true;
	}

	private handlePopupClosed = (data: PopupResult) => {
		if (!data?.button_id) return;
		const cb = this.callbacks.get(data.button_id);
		if (cb) {
			cb.resolve(data);
			this.callbacks.delete(data.button_id);
		}
	};

	/**
	 * Opens a Telegram popup and resolves when the user closes it.
	 */
	public async openPopup(options: PopupOptions): Promise<PopupResult> {
		// Validate Telegram constraints for safety
		if (!options.title || options.title.length > 64) {
			throw new Error("Popup title must be 0-64 characters");
		}
		if (!options.message || options.message.length > 256) {
			throw new Error("Popup message must be 1-256 characters");
		}
		if (options.buttons.length < 1 || options.buttons.length > 3) {
			throw new Error("Popup must have between 1 and 3 buttons");
		}

		this.ensureListening();

		return new Promise((resolve, reject) => {
			try {
				// Use the first button ID as the unique key
				const key = options.buttons[0].id;
				if (!key) throw new Error("First button must have an ID");

				this.callbacks.set(key, { resolve, reject });

				postEvent("web_app_open_popup", options);
			} catch (err) {
				reject(err);
			}
		});
	}

	public dispose() {
		off("popup_closed", this.handlePopupClosed);
		this.callbacks.clear();
		this.listening = false;
	}
}

export const popupManager = new TelegramPopupManager();
