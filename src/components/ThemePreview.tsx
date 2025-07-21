import "./ThemePreview.scss";
import type { Component } from "solid-js";
import type { ContestThemeBackdrop, ContestThemeSymbol } from "../utils/themes";
import CircularIconPattern, {
	type CircularIconPatternLayer,
} from "./CircularIconPattern";

type ThemePreviewProps = {
	backdrop: ContestThemeBackdrop;
	symbol: ContestThemeSymbol;
	size?: number;
	layers?: CircularIconPatternLayer[];
	onClick?: (e: MouseEvent) => void;
	classList?: { [k: string]: boolean };
};
const ThemePreview: Component<ThemePreviewProps> = (props) => {
	const size = props.size ?? 96;

	return (
		<div
			class="theme-preview"
			classList={props.classList}
			data-backdrop={props.backdrop.id}
			data-symbol={props.symbol.id}
			style={{
				"background-image": `radial-gradient(${props.backdrop.colors.center}, ${props.backdrop.colors.edge})`,
			}}
			onClick={props.onClick}
		>
			<CircularIconPattern
				backdrop={props.backdrop}
				symbol={props.symbol}
				size={size}
				layers={
					props.layers ?? [
						{
							count: 1,
							alpha: 1,
							distance: 0,
							size: size / 3,
						},
						{
							count: 6,
							alpha: 0.5,
							distance: size / 3,
							size: size / 8,
						},
						{
							count: 12,
							alpha: 0.325,
							distance: size / 1.875,
							size: size / 12,
						},
					]
				}
			/>
		</div>
	);
};

export default ThemePreview;
