import "./ClickableText.scss";
import { createMemo, type JSX, onCleanup, onMount } from "solid-js";

interface ClickableTextProps {
	text: string;
	listeners?: Record<string, () => void>;
}

export default function ClickableText(props: ClickableTextProps): JSX.Element {
	let clickable: HTMLParagraphElement | undefined;

	const sanitizedHtml = createMemo(() => {
		const parser = new DOMParser();
		const doc = parser.parseFromString(`<p>${props.text}</p>`, "text/html");
		const container = doc.body.firstChild as HTMLElement;

		const clickables = container.querySelectorAll("clickable");

		clickables.forEach((el) => {
			const id = el.getAttribute("id") || "";
			const span = document.createElement("span");

			span.textContent = el.textContent;
			span.classList.add("clickable");
			span.id = id;

			el.replaceWith(span);
		});

		return container.innerHTML;
	});

	const empty = () => {};

	onMount(() => {
		setTimeout(() => {
			if (!clickable) return;

			for (const item of clickable.querySelectorAll("span.clickable")) {
				item.addEventListener("click", props.listeners?.[item.id] ?? empty);
			}
		});
	});

	onCleanup(() => {
		if (!clickable) return;

		for (const item of clickable.querySelectorAll("span.clickable")) {
			item.removeEventListener("click", props.listeners?.[item.id] ?? empty);
		}
	});

	return (
		<p
			class="container-clickable-text"
			ref={clickable}
			innerHTML={sanitizedHtml()}
		/>
	);
}
