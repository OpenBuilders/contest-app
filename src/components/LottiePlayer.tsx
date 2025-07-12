import "./LottiePlayer.scss";
import type { Component, JSX } from "solid-js";
import { createSignal, onCleanup, onMount, Show } from "solid-js";

import Lottix from "../utils/lottix";

export type LottiePlayerProps = {
	src: string;
	speed?: number;
	autoplay?: boolean;
	loop?: boolean;
	fallback?: JSX.Element;
	playOnClick?: boolean;
	outline?: string;
};

export const LottiePlayerFileCache: { [key: string]: Uint8Array } = {};

const LottiePlayer: Component<LottiePlayerProps> = (props) => {
	let element: HTMLDivElement | undefined;
	let canvas: HTMLCanvasElement | undefined;

	const [loaded, setLoaded] = createSignal(false);
	let lottix: Lottix | undefined;

	onMount(() => {
		setTimeout(() => {
			if (!canvas) return;

			lottix = new Lottix({
				canvas,
				src: LottiePlayerFileCache[props.src] ?? props.src,
				autoPlay: props.autoplay,
				loop: props.loop,
				renderer: "sw",
				speed: props.speed,
			});

			lottix.on("load", () => {
				setLoaded(true);
			});

			if (!(props.playOnClick || props.loop)) {
				lottix.on("complete", () => {
					if (!lottix) return;
					lottix.destroy();
				});
			}
		});

		onCleanup(() => {
			if (lottix && lottix.state !== "destroyed") {
				lottix.destroy(true);
				lottix = undefined;
			}
		});
	});

	const onClickLottieAnimation = () => {
		if (!(props.playOnClick && lottix)) return;
		if (lottix.state === "complete") {
			lottix.play();
		}
	};

	const Outline = () => {
		return (
			<div
				class="shimmer"
				style={{
					"mask-image": `url("data:image/svg+xml;base64,${btoa(props.outline!)}")`,
				}}
			/>
		);
	};

	return (
		<div
			ref={element}
			class="lottie-animation"
			onClick={onClickLottieAnimation}
		>
			<Show
				when={
					!loaded() && props.fallback && !(props.src in LottiePlayerFileCache)
				}
			>
				{props.fallback}
			</Show>

			<Show when={!loaded()}>
				<Outline />
			</Show>

			<canvas
				ref={canvas}
				style={{ visibility: loaded() ? "visible" : "hidden" }}
			/>
		</div>
	);
};

export default LottiePlayer;
