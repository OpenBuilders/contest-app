import { postEvent } from "../utils/telegram";
import "./RichText.scss";
import { type Component, onCleanup, onMount } from "solid-js";

type RichTextProps = {
	content: string;
};

const RichText: Component<RichTextProps> = (props) => {
	let container: HTMLDivElement | undefined;

	const onClickLink = (e: MouseEvent) => {
		e.preventDefault();
		postEvent("web_app_open_link", {
			url: (e.currentTarget as HTMLAnchorElement).href,
		});
	};

	onMount(() => {
		if (!container) return;

		for (const link of container.querySelectorAll("a")) {
			(link as HTMLElement).addEventListener("click", onClickLink);
		}

		onCleanup(() => {
			for (const link of container.querySelectorAll("a")) {
				(link as HTMLElement).removeEventListener("click", onClickLink);
			}
		});
	});

	return <div ref={container} class="content" innerHTML={props.content}></div>;
};

export default RichText;
