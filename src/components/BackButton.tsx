import { backButton } from "@telegram-apps/sdk-solid";
import { type Component, onCleanup, onMount } from "solid-js";

type BackButtonProps = {
	onClick: () => void;
};

const BackButton: Component<BackButtonProps> = (props) => {
	onMount(() => {
		backButton.show();
		backButton.onClick(props.onClick);

		onCleanup(() => {
			backButton.hide();
			backButton.offClick(props.onClick);
		});
	});

	return null;
};

export default BackButton;
