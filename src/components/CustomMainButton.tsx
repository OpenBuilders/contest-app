import "./CustomMainButton.scss";
import { TbLoader2 } from "solid-icons/tb";
import { type Component, Show } from "solid-js";
import { Dynamic } from "solid-js/web";

type CustomMainButtonProps = {
	onClick: () => void;
	text: string;
	shine?: boolean;
	disabled?: boolean;
	loading?: boolean;
	backgroundColor?: string;
	textColor?: string;
	secondary?: boolean;
	prepend?: Component;
};

const CustomMainButton: Component<CustomMainButtonProps> = (props) => {
	return (
		<button
			type="button"
			class="main-button"
			onClick={props.onClick}
			disabled={props.disabled}
			classList={{
				disabled: props.disabled,
				progress: props.loading,
				secondary: props.secondary,
			}}
			style={{
				"--btn-bg-color":
					props.backgroundColor ?? "var(--tg-theme-button-color)",
				"--btn-text-color":
					props.textColor ?? "var(--tg-theme-button-text-color)",
			}}
		>
			<Show when={props.prepend}>
				<div class="prepend">
					<Dynamic component={props.prepend} />
				</div>
			</Show>
			<span>{props.text}</span>
			<TbLoader2 />
		</button>
	);
};

export default CustomMainButton;
