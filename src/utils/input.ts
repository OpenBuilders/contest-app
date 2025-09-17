export function hideKeyboardOnEnter(e: KeyboardEvent) {
	if (e.key === "Enter") {
		e.preventDefault();
		(e.target as HTMLElement)?.blur();
	}
}

export const isValidURL = (str: string): boolean => {
	const value = str.trim();
	if (!value) return false;

	try {
		const url = new URL(value);
		// Only http/https and host must contain a dot + TLD of at least 2 chars
		return (
			(url.protocol === "http:" || url.protocol === "https:") &&
			/\.[a-zA-Z]{2,}$/.test(url.hostname)
		);
	} catch {
		// Check bare domains like "google.com" or "t.me/path"
		return /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([/?#].*)?$/.test(value);
	}
};

export const normalizeURL = (str: string): string | null => {
	const value = str.trim();

	if (!value) return null;

	try {
		// Try parsing as-is
		const url = new URL(value);

		// Force https for http/https/ftp/etc.
		return `https://${url.host}${url.pathname}${url.search}${url.hash}`;
	} catch {
		// If failed, try prepending https://
		try {
			const url = new URL(`https://${value}`);
			return `https://${url.host}${url.pathname}${url.search}${url.hash}`;
		} catch {
			return null;
		}
	}
};

export const isValidTelegramUsername = (username: string): boolean => {
	const regex = /^@[a-zA-Z][a-zA-Z0-9_]{3,31}$/;
	return regex.test(username);
};

export const normalizeTelegramUsernameToURL = (username: string) => {
	return `https://t.me/${username.replace("@", "")}`;
};
