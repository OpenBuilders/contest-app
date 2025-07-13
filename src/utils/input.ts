export function hideKeyboardOnEnter(e: KeyboardEvent) {
	if (e.key === "Enter") {
		e.preventDefault();
		(e.target as HTMLElement)?.blur();
	}
}

export const isValidURL = (str: string) => {
	try {
		new URL(str);
		return true;
	} catch {
		return false;
	}
};
