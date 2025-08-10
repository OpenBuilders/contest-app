import type { Component } from "solid-js";
import { Dynamic, render } from "solid-js/web";
import { symbolizeSVG } from "../utils/svg";

type SVGSymbolProps = {
	id: string;
	onClick?: (e: MouseEvent) => void;
	class?: string;
};

export const SVGSymbol: Component<SVGSymbolProps> = (props) => {
	return (
		<svg
			stroke-width="0"
			color="currentColor"
			fill="currentColor"
			height="1em"
			width="1em"
			xmlns="http://www.w3.org/2000/svg"
			onClick={props.onClick}
			class={props.class}
		>
			<use href={`#${props.id}`}></use>
		</svg>
	);
};

export const symbolizeSVGComponent = async (id: string, component: Component) =>
	new Promise((resolve) => {
		const container = document.createElement("div");
		render(() => <Dynamic component={component} />, container);

		setTimeout(() => {
			const svg = container.innerHTML;
			container.remove();
			resolve(symbolizeSVG(id, svg));
		});
	});
