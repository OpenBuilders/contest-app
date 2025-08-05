import "./Badge.scss";
import { type Component, Show } from "solid-js";
import { Dynamic } from "solid-js/web";

type BadgeProps = {
	label: string | Component;
	onClick?: (e: MouseEvent) => void;
	class?: string;
};

const Badge: Component<BadgeProps> = (props) => {
	return (
		<div class={["badge", props.class].filter(Boolean).join(" ")}>
			<Show
				when={typeof props.label === "object"}
				fallback={props.label as string}
			>
				<Dynamic component={props.label} />
			</Show>
		</div>
	);
};

export default Badge;
