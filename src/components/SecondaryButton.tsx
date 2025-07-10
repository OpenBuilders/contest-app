import {
	type SecondaryButtonPosition,
	secondaryButton,
} from "@telegram-apps/sdk-solid";
import { type Component, createEffect, onCleanup, onMount } from "solid-js";

type SecondaryButtonProps = {
	onClick: () => void;
	text: string;
	shine?: boolean;
	disabled?: boolean;
	loading?: boolean;
	backgroundColor?: `#${string}`;
	textColor?: `#${string}`;
	position?: SecondaryButtonPosition;
};

const SecondaryButton: Component<SecondaryButtonProps> = (props) => {
	onMount(() => {
		secondaryButton.onClick(props.onClick);

		createEffect(() => {
			secondaryButton.setParams({
				hasShineEffect: props.shine,
				isEnabled: !props.disabled,
				isLoaderVisible: props.loading,
				text: props.text,
				textColor: props.textColor,
				backgroundColor: props.backgroundColor,
				position: props.position,
				isVisible: true,
			});
		});

		onCleanup(() => {
			secondaryButton.offClick(props.onClick);
			secondaryButton.setParams({
				isVisible: false,
			});
		});
	});

	return null;
};

export default SecondaryButton;
