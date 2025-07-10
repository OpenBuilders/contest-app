import { settingsButton } from "@telegram-apps/sdk-solid";
import { type Component, onCleanup, onMount } from "solid-js";

type SettingsButtonProps = {
	onClick: () => void;
};

const SettingsButton: Component<SettingsButtonProps> = (props) => {
	onMount(() => {
		settingsButton.show();
		settingsButton.onClick(props.onClick);

		onCleanup(() => {
			settingsButton.hide();
			settingsButton.offClick(props.onClick);
		});
	});

	return null;
};

export default SettingsButton;
