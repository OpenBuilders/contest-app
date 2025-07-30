import "./Award.scss";
import type { Component } from "solid-js";
import { SVGSymbol } from "./SVG";

type AwardProps = {
	text: string;
};

const Award: Component<AwardProps> = (props) => {
	return (
		<div class="award">
			<SVGSymbol id="award-wing-left" />
			<span>{props.text}</span>
			<SVGSymbol id="award-wing-right" />
		</div>
	);
};

export default Award;
