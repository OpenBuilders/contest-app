export function hideKeyboardOnEnter(e: KeyboardEvent) {
	if (e.key === "Enter") {
		e.preventDefault();
		(e.target as HTMLElement)?.blur();
	}
}
