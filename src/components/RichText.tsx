import { useTranslation } from "../contexts/TranslationContext";
import { popupManager } from "../utils/popup";
import { linkifyHtml, truncateMiddle } from "../utils/string";
import { invokeHapticFeedbackImpact, postEvent } from "../utils/telegram";
import "./RichText.scss";
import { type Component, onCleanup, onMount } from "solid-js";

type RichTextProps = {
	content: string;
};

const RichText: Component<RichTextProps> = (props) => {
	let container: HTMLDivElement | undefined;

	const { t, td } = useTranslation();

	const onClickLink = async (e: MouseEvent) => {
		e.preventDefault();

		invokeHapticFeedbackImpact("light");

		const link = (e.currentTarget as HTMLAnchorElement).href;

		const popup = await popupManager.openPopup({
			title: t("general.confirmOpenLink.title"),
			message: td("general.confirmOpenLink.prompt", {
				link: truncateMiddle(link, 64, 32),
			}),
			buttons: [
				{
					id: "ok",
					type: "ok",
				},
				{
					id: "cancel",
					type: "cancel",
				},
			],
		});

		if (!popup.button_id || popup.button_id === "cancel") return;

		postEvent("web_app_open_link", {
			url: link,
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

	return (
		<div
			ref={container}
			class="content"
			innerHTML={linkifyHtml(props.content)}
		></div>
	);
};

export default RichText;
