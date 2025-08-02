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

export const getNameInitials = (name: string) => {
	const parts = name
		.trim()
		.split(/\s+/)
		.map((part) => Array.from(part)[0]);

	if (parts.length === 0) {
		return "";
	}

	return parts.length === 1
		? parts[0]
		: `${parts[0]}${parts[parts.length - 1]}`;
};
