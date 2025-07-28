export const symbolizeSVG = (id: string, content: string) => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(content, "image/svg+xml");
	const svg = doc.querySelector("svg");

	if (!svg) return false;

	const innerHTML = svg.innerHTML;
	const viewBox = svg.getAttribute("viewBox") || "0 0 32 32";

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
