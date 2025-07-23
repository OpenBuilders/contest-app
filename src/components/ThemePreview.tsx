import "./ThemePreview.scss";
import { type Component, createSignal, onMount, Show } from "solid-js";
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
	let container: HTMLDivElement | undefined;
	const [size, setSize] = createSignal(props.size);

	onMount(() => {
		if (!container) return;
		setSize(container.clientWidth ?? 96);
	});

	return (
		<div
			ref={container}
			class="theme-preview"
			classList={props.classList}
			data-backdrop={props.backdrop.id}
			data-symbol={props.symbol.id}
			style={{
				"background-image": `radial-gradient(${props.backdrop.colors.center}, ${props.backdrop.colors.edge})`,
			}}
			onClick={props.onClick}
		>
			<Show when={size()}>
				<CircularIconPattern
					backdrop={props.backdrop}
					symbol={props.symbol}
					size={size()!}
					layers={
						props.layers ?? [
							{
								count: 1,
								alpha: 1,
								distance: 0,
								size: size()! / 3,
							},
							{
								count: 6,
								alpha: 0.5,
								distance: size()! / 3,
								size: size()! / 8,
							},
							{
								count: 12,
								alpha: 0.325,
								distance: size()! / 1.875,
								size: size()! / 12,
							},
						]
					}
				/>
			</Show>
		</div>
	);
};

export default ThemePreview;
