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

export const stringifySVGSymbol = (id: string): string | null => {
	const symbol = document.getElementById(id) as SVGSymbolElement | null;
	if (!symbol) return null;

	const clone = symbol.cloneNode(true) as SVGSymbolElement;

	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

	for (let i = 0; i < clone.attributes.length; i++) {
		const attr = clone.attributes[i];
		if (attr.name !== "id") {
			svg.setAttribute(attr.name, attr.value);
		}
	}

	while (clone.firstChild) {
		svg.appendChild(clone.firstChild);
	}

	return new XMLSerializer().serializeToString(svg);
};
