import "./CustomMainButton.scss";
import { TbLoader2 } from "solid-icons/tb";
import type { Component } from "solid-js";

type CustomMainButtonProps = {
	onClick: () => void;
	text: string;
	shine?: boolean;
	disabled?: boolean;
	loading?: boolean;
};

const CustomMainButton: Component<CustomMainButtonProps> = (props) => {
	return (
		<button
			type="button"
			class="main-button"
			onClick={props.onClick}
			disabled={props.disabled}
			classList={{ disabled: props.disabled, progress: props.loading }}
		>
			<span>{props.text}</span>
			<TbLoader2 />
		</button>
	);
};

export default CustomMainButton;
