import "./CustomMainButton.scss";
import { TbLoader2 } from "solid-icons/tb";
import type { Component } from "solid-js";

type CustomMainButtonProps = {
	onClick: () => void;
	text: string;
	shine?: boolean;
	disabled?: boolean;
	loading?: boolean;
	backgroundColor?: string;
	textColor?: string;
};

const CustomMainButton: Component<CustomMainButtonProps> = (props) => {
	return (
		<button
			type="button"
			class="main-button"
			onClick={props.onClick}
			disabled={props.disabled}
			classList={{ disabled: props.disabled, progress: props.loading }}
			style={{
				"--btn-bg-color":
					props.backgroundColor ?? "var(--tg-theme-button-color)",
				"--btn-text-color":
					props.textColor ?? "var(--tg-theme-button-text-color)",
			}}
		>
			<span>{props.text}</span>
			<TbLoader2 />
		</button>
	);
};

export default CustomMainButton;
