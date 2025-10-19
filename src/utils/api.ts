import { settings } from "./settings";
import { store } from "./store";

export const requestAPI = async (
	path = "/",
	params: { [key: string]: string | Blob | undefined } = {},
	method: "GET" | "POST" = "POST",
	timeoutMs = 30_000,
): Promise<any> => {
	try {
		const headers: { [key: string]: string } = {};

		const FD = new FormData();
		for (const [key, item] of Object.entries(params)) {
			if (item) {
				FD.append(key, item);
			}
		}

		if (store.token) {
			headers.Authorization = `Bearer ${store.token}`;
		}

		headers.locale = settings.language ?? "en";

		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), timeoutMs);

		const request = await fetch(import.meta.env.VITE_BACKEND_BASE_URL + path, {
			method: method,
			body: method === "POST" ? FD : undefined,
			headers: headers,
			signal: controller.signal,
		});
		clearTimeout(timer);

		const result = await request.json();

		if (result.status === "success") {
			return result;
		}
		return false;
	} catch (_) {
		return null;
	}
};
