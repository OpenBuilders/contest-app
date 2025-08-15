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

export const isValidUrl = (str: string) => {
	try {
		new URL(str);
		return true;
	} catch {
		return false;
	}
};

export const cloneObject = <T extends Record<string, any>>(object: T): T => {
	return JSON.parse(JSON.stringify(object));
};

export const compareObjects = (a: any, b: any): boolean => {
	if (a === b) return true;

	if (typeof a !== typeof b) return false;

	if (typeof a !== "object" || a === null || b === null) return false;

	if (Array.isArray(a) !== Array.isArray(b)) return false;

	const keysA = Object.keys(a);
	const keysB = Object.keys(b);

	if (keysA.length !== keysB.length) return false;

	for (const key of keysA) {
		if (!Object.hasOwn(b, key)) return false;
		if (!compareObjects(a[key], b[key])) return false;
	}

	return true;
};
