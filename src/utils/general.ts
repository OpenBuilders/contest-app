export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function canvasToBlob(
	canvas: HTMLCanvasElement,
	type = "image/png",
	quality = 1.0,
) {
	return new Promise<Blob | null>((resolve) => {
		canvas.toBlob(
			(blob) => {
				resolve(blob);
			},
			type,
			quality,
		);
	});
}
