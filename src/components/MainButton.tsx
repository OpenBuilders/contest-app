import { mainButton } from "@telegram-apps/sdk-solid";
import { type Component, createEffect, onCleanup, onMount } from "solid-js";

type MainButtonProps = {
	onClick: () => void;
	text: string;
	shine?: boolean;
	disabled?: boolean;
	loading?: boolean;
	backgroundColor?: `#${string}`;
	textColor?: `#${string}`;
};

const MainButton: Component<MainButtonProps> = (props) => {
	onMount(() => {
		mainButton.onClick(props.onClick);

		createEffect(() => {
			mainButton.setParams({
				hasShineEffect: props.shine,
				isEnabled: !props.disabled,
				isLoaderVisible: props.loading,
				text: props.text,
				textColor: props.textColor,
				backgroundColor: props.backgroundColor,
				isVisible: true,
			});
		});

		onCleanup(() => {
			mainButton.offClick(props.onClick);
			mainButton.setParams({
				isVisible: false,
			});
		});
	});

	return null;
};

export default MainButton;
