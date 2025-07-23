import type { CircularIconPatternLayer } from "../components/CircularIconPattern";

declare const self: Worker;

export type CircularIconPatternWorkerMessage =
	CircularIconPatternWorkerMessageInit;

export type CircularIconPatternWorkerMessageInit = {
	type: "init";
	prefix: string;
	canvas: OffscreenCanvas;
	symbol: ImageBitmap;
	layers: CircularIconPatternLayer[];
	dpi: number;
};

export type CircularIconPatternWorkerResponse =
	CircularIconPatternWorkerResponseCache;

export type CircularIconPatternWorkerResponseCache = {
	type: "cache";
	prefix: string;
	symbol: ImageBitmap;
};

const pointOnCircle = (cx: number, cy: number, r: number, degrees: number) => {
	const radians = degrees * (Math.PI / 180);
	const x = cx + r * Math.cos(radians);
	const y = cy + r * Math.sin(radians);
	return { x, y };
};

const drawCircularIconPattern = (
	canvas: OffscreenCanvas,
	symbol: ImageBitmap,
	layers: CircularIconPatternLayer[],
	dpi: number,
) =>
	new Promise((resolve) => {
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		for (const layer of layers) {
			const { size, alpha, count, distance } = layer;

			for (let i = 0; i < count; i++) {
				const { x, y } = pointOnCircle(
					canvas.width / 2,
					canvas.height / 2,
					distance * dpi,
					i * (360 / count),
				);

				ctx.globalAlpha = alpha;
				ctx.drawImage(
					symbol,
					x - (size * dpi) / 2,
					y - (size * dpi) / 2,
					size * dpi,
					size * dpi,
				);
			}
		}

		resolve(true);
	});

self.addEventListener(
	"message",
	async (message: MessageEvent<CircularIconPatternWorkerMessage>) => {
		const { data } = message;

		switch (data.type) {
			case "init": {
				const { canvas, symbol, prefix, layers, dpi } = data;
				await drawCircularIconPattern(canvas, symbol, layers, dpi);
				symbol.close();
				createImageBitmap(canvas).then((bitmap) => {
					postMessage({
						type: "cache",
						prefix,
						symbol: bitmap,
					} satisfies CircularIconPatternWorkerResponse);

					bitmap.close();
				});
				break;
			}
		}
	},
);
