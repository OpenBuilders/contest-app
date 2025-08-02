export const symbolizeSVG = (
	id: string,
	content: string,
	keepFills?: boolean,
) => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(content, "image/svg+xml");
	const svg = doc.querySelector("svg");

	if (!svg) return false;

	let innerHTML = svg.innerHTML;
	const viewBox = svg.getAttribute("viewBox") || "0 0 32 32";

	if (!keepFills) {
		innerHTML = innerHTML.replace(
			/fill="(?!none)[^"]*"/gi,
			'fill="currentColor"',
		);
	}

	const symbol = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"symbol",
	);
	symbol.id = id;
	symbol.setAttribute("viewBox", viewBox);
	symbol.innerHTML = innerHTML;

	document.querySelector("svg#symbols")?.appendChild(symbol);

	return true;
};
