import "./Icon.scss";
import type { Component } from "solid-js";
import { Dynamic } from "solid-js/web";

type Icon = {
	component: Component;
	color?: string;
	background?: string;
	fontSize?: string;
};

const Icon: Component<Icon> = (props) => {
	return (
		<div
			class="icon"
			classList={{ background: props.background !== undefined }}
			style={{
				"--icon-color": props.color,
				"--icon-background": props.background,
				"--icon-font-size": props.fontSize,
			}}
		>
			<Dynamic component={props.component} />
		</div>
	);
};

export default Icon;
