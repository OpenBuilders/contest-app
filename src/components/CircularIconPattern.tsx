import { type Component, onCleanup, onMount } from "solid-js";
import { Dynamic, render } from "solid-js/web";
import { sleep } from "../utils/general";
import type { ContestThemeBackdrop, ContestThemeSymbol } from "../utils/themes";
import type {
	CircularIconPatternWorkerMessage,
	CircularIconPatternWorkerResponse,
} from "../workers/circularIconPattern";
import CircularIconPatternWorker from "../workers/circularIconPattern?worker";

export type CircularIconPatternLayer = {
	count: number;
	size: number;
	distance: number;
	alpha: number;
};

type CircularIconPatternProps = {
	backdrop: ContestThemeBackdrop;
	symbol: ContestThemeSymbol;
	size: number;
	layers: CircularIconPatternLayer[];
	context?: string;
};

const bitmaps: { [key: string]: ImageBitmap | null } = {};

const properties: { [key: string]: CircularIconPatternProps } = {};

const worker = new CircularIconPatternWorker();
worker.addEventListener(
	"message",
	(message: MessageEvent<CircularIconPatternWorkerResponse>) => {
		const { data } = message;

		switch (data.type) {
			case "cache": {
				const { prefix, symbol } = data;
				bitmaps[prefix] = symbol;
				document.querySelector(`#${prefix}`)?.classList.add("loaded");
				break;
			}
		}
	},
);

const observer = new IntersectionObserver(async (entries) => {
	for (const entry of entries) {
		const target = entry.target as HTMLCanvasElement;

		if (entry.isIntersecting) {
			observer.unobserve(target);

			const prefix = target.id;
			const props = properties[prefix];
			delete properties[prefix];
			const dpi = window.devicePixelRatio || 1;

			target.width = props.size * dpi;
			target.height = props.size * dpi;

			if (prefix in bitmaps) {
				do {
					await sleep(50);
				} while (bitmaps[prefix] === null);

				target.getContext("2d")?.drawImage(bitmaps[prefix], 0, 0);
				target.classList.add("loaded");
			} else {
				bitmaps[prefix] = null;

				const offscreen = target.transferControlToOffscreen();

				if (typeof props.symbol.component === "string") {
					const image = new Image();

					image.addEventListener("load", () => {
						createImageBitmap(image, {
							resizeHeight: props.size * dpi,
							resizeWidth: props.size * dpi,
						}).then((bitmap) => {
							worker.postMessage(
								{
									type: "init",
									canvas: offscreen,
									symbol: bitmap,
									prefix,
									layers: props.layers,
									dpi,
								} satisfies CircularIconPatternWorkerMessage,
								[offscreen],
							);
						});
					});

					image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
						props.symbol.component.replace(
							/fill="[^"]*"/g,
							`fill="${props.backdrop.colors.pattern}"`,
						),
					)}`;
				} else {
					const container = document.createElement("div");
					render(
						() => <Dynamic component={props.symbol.component} />,
						container,
					);

					setTimeout(() => {
						const image = new Image();

						image.addEventListener("load", () => {
							createImageBitmap(image, {
								resizeHeight: props.size * dpi,
								resizeWidth: props.size * dpi,
							}).then((bitmap) => {
								worker.postMessage(
									{
										type: "init",
										canvas: offscreen,
										symbol: bitmap,
										prefix,
										layers: props.layers,
										dpi,
									} satisfies CircularIconPatternWorkerMessage,
									[offscreen],
								);
							});
						});

						image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
							container.innerHTML.replace(
								/fill="[^"]*"/g,
								`fill="${props.backdrop.colors.pattern}"`,
							),
						)}`;
						container.remove();
					});
				}
			}
		}
	}
});

const CircularIconPattern: Component<CircularIconPatternProps> = (props) => {
	let canvas: HTMLCanvasElement | undefined;

	const prefix = `${props.context ?? "default"}-${props.symbol.id}-${props.backdrop.colors.pattern.replace("#", "")}-${props.size}`;

	properties[prefix] = props;

	onMount(() => {
		if (!canvas) return;

		observer.observe(canvas);

		onCleanup(() => {
			observer.unobserve(canvas);
		});
	});

	return <canvas ref={canvas} id={prefix} />;
};

export default CircularIconPattern;
