import { settings } from "./settings";
import { store } from "./store";

export const requestAPI = async (
	path = "/",
	params: { [key: string]: string } = {},
	method: "GET" | "POST" = "POST",
): Promise<any> => {
	try {
		const headers: { [key: string]: string } = {};

		const FD = new FormData();
		for (const [key, item] of Object.entries(params)) {
			FD.append(key, item);
		}

		if (store.token) {
			headers.Authorization = `Bearer ${store.token}`;
		}

		headers.locale = settings.language ?? "en";

		const request = await fetch(import.meta.env.VITE_BACKEND_BASE_URL + path, {
			method: method,
			body: FD,
			headers: headers,
		});

		const result = await request.json();

		if (result.status === "success") {
			return result;
		}
		return false;
	} catch (e) {
		return null;
	}
};
