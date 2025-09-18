export const truncateMiddle = (
	text: string,
	startLen = 64,
	endLen = 32,
): string => {
	if (text.length <= startLen + endLen) {
		return text;
	}
	const start = text.slice(0, startLen);
	const end = text.slice(-endLen);
	return `${start}...${end}`;
};

export const stripURLProtocol = (url: string) => {
	return url.replace(/http(s?):\/\//i, "");
};

export function linkifyHtml(input: string): string {
	if (!input) return "";

	// Create DOM parser
	const parser = new DOMParser();
	const doc = parser.parseFromString(`<div>${input}</div>`, "text/html");

	const urlRegex =
		/\b((https?:\/\/)?(([\w-]+\.)+[a-z]{2,})([/\w\-.?=&%+]*)?)/gi;

	function processNode(node: Node) {
		// Skip existing links
		if (
			node.nodeType === Node.ELEMENT_NODE &&
			(node as HTMLElement).tagName === "A"
		) {
			return;
		}

		if (node.nodeType === Node.TEXT_NODE) {
			const text = node.nodeValue ?? "";
			const frag = doc.createDocumentFragment();

			let lastIndex = 0;
			text.replace(urlRegex, (match, _p1, _p2, _p3, _p4, _p5, offset) => {
				// Text before match
				if (offset > lastIndex) {
					frag.appendChild(
						document.createTextNode(text.slice(lastIndex, offset)),
					);
				}

				let href = match;
				if (!/^https?:\/\//i.test(href)) {
					href = `https://${href}`;
				}

				const a = doc.createElement("a");
				a.href = href;
				a.target = "_blank";
				a.rel = "noopener noreferrer";
				a.textContent = match;

				frag.appendChild(a);

				lastIndex = offset + match.length;
				return match;
			});

			if (lastIndex < text.length) {
				frag.appendChild(document.createTextNode(text.slice(lastIndex)));
			}

			if (frag.childNodes.length > 0) {
				node.parentNode?.replaceChild(frag, node);
			}
		} else {
			node.childNodes.forEach(processNode);
		}
	}

	doc.body.firstChild?.childNodes.forEach(processNode);

	return (doc.body.firstChild as HTMLElement).innerHTML;
}
