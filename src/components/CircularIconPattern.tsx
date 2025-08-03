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
	size: number | { width: number; height: number };
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
				for (const item of document.querySelectorAll(`#${prefix}`)) {
					item.classList.add("loaded");
				}
				break;
			}
		}
	},
);

const processSVGString = async (
	svgData: string,
	props: CircularIconPatternProps,
	offscreen: OffscreenCanvas,
	dpi: number,
	prefix: string,
) => {
	const image = new Image();

	image.addEventListener("load", async () => {
		const [width, height] = [
			(typeof props.size === "number" ? props.size : props.size.height) * dpi,
			(typeof props.size === "number" ? props.size : props.size.width) * dpi,
		];

		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;

		const ctx = canvas.getContext("2d");

		if (ctx) {
			ctx.drawImage(image, 0, 0, width, height);
			const imageData = await createImageBitmap(canvas);

			worker.postMessage(
				{
					type: "init",
					canvas: offscreen,
					symbol: imageData,
					prefix,
					layers: props.layers,
					dpi,
				} satisfies CircularIconPatternWorkerMessage,
				[offscreen, imageData],
			);
		}

		canvas.remove();
	});

	image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
		svgData.replace(/fill="[^"]*"/g, `fill="${props.backdrop.colors.pattern}"`),
	)}`;
};

const observer = new IntersectionObserver(async (entries) => {
	for (const entry of entries) {
		const target = entry.target as HTMLCanvasElement;

		if (entry.isIntersecting) {
			observer.unobserve(target);

			const prefix = target.id;
			const props = properties[prefix];

			const dpi = window.devicePixelRatio || 1;

			target.width =
				(typeof props.size === "number" ? props.size : props.size.width) * dpi;
			target.height =
				(typeof props.size === "number" ? props.size : props.size.height) * dpi;

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
					await processSVGString(
						props.symbol.component,
						props,
						offscreen,
						dpi,
						prefix,
					);
				} else {
					const container = document.createElement("div");
					render(
						() => <Dynamic component={props.symbol.component} />,
						container,
					);

					setTimeout(async () => {
						await processSVGString(
							container.innerHTML,
							props,
							offscreen,
							dpi,
							prefix,
						);
						container.remove();
					});
				}
			}
		}
	}
});

const CircularIconPattern: Component<CircularIconPatternProps> = (props) => {
	let canvas: HTMLCanvasElement | undefined;

	const prefix = `${props.context ?? "default"}-${props.symbol.id}-${props.backdrop.colors.pattern.replace("#", "")}-${typeof props.size === "number" ? props.size : `${props.size.width}-${props.size.height}`}`;

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
