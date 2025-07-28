export const profileAccentColors: { [key: number]: string[] } = {
	0: ["#FF5269", "#FF865D"], // Red
	1: ["#FFA95C", "#FFCC68"], // Orange
	2: ["#6862FF", "#83AFFF"], // Purple
	3: ["#56CC69", "#9EDD7D"], // Green
	4: ["#2ACAB8", "#50ECD5"], // Cyan
	5: ["#2BA0F2", "#72D4FD"], // Blue
	6: ["#D66BED", "#E0A1F3"], // Pink
};

type RGB = [number, number, number];
type RGBA = [number, number, number, number];
type HSL = [number, number, number];
type HSLA = [number, number, number, number];
type CMYK = [number, number, number, number];

export class Color {
	private r: number = 0;
	private g: number = 0;
	private b: number = 0;
	private a: number = 1;

	constructor(input: string | number[]) {
		if (typeof input === "string") {
			this.parseString(input.trim());
		} else if (Array.isArray(input)) {
			this.parseArray(input);
		}
	}

	private parseArray(arr: number[]) {
		[this.r, this.g, this.b] = arr;
		this.a = arr.length === 4 ? arr[3] : 1;
	}

	private parseString(str: string) {
		if (str.startsWith("#")) {
			const hex = str.slice(1);
			if (hex.length === 3) {
				this.r = parseInt(hex[0] + hex[0], 16);
				this.g = parseInt(hex[1] + hex[1], 16);
				this.b = parseInt(hex[2] + hex[2], 16);
			} else if (hex.length === 6) {
				this.r = parseInt(hex.slice(0, 2), 16);
				this.g = parseInt(hex.slice(2, 4), 16);
				this.b = parseInt(hex.slice(4, 6), 16);
			}
			this.a = 1;
		} else if (str.startsWith("rgb")) {
			const parts = str.match(/[\d.]+/g)?.map(Number) || [];
			[this.r, this.g, this.b] = parts;
			this.a = parts.length === 4 ? parts[3] : 1;
		} else if (str.startsWith("hsl")) {
			const parts = str.match(/[\d.]+/g)?.map(Number) || [];
			const h = parts[0];
			const s = parts[1] / 100;
			const l = parts[2] / 100;
			const a = parts.length === 4 ? parts[3] : 1;
			const [r, g, b] = Color.hslToRgb(h, s, l);
			[this.r, this.g, this.b, this.a] = [r, g, b, a];
		} else if (str.startsWith("cmyk")) {
			const parts = str.match(/[\d.]+/g)?.map(Number) || [];
			const [r, g, b] = Color.cmykToRgb(parts as CMYK);
			[this.r, this.g, this.b, this.a] = [r, g, b, 1];
		}
	}

	// --- Getters in various formats ---
	toRGB(): RGBA {
		return [this.r, this.g, this.b, this.a];
	}

	toRGBString(): string {
		return this.a === 1
			? `rgb(${this.r}, ${this.g}, ${this.b})`
			: `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
	}

	toHex(): string {
		const hex = (n: number) => n.toString(16).padStart(2, "0");
		return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
	}

	toHSL(): HSLA {
		return [...Color.rgbToHsl(this.r, this.g, this.b), this.a];
	}

	toHSLString(): string {
		const [h, s, l, a] = this.toHSL();
		return a === 1
			? `hsl(${h}, ${s}%, ${l}%)`
			: `hsla(${h}, ${s}%, ${l}%, ${a})`;
	}

	toCMYK(): CMYK {
		return Color.rgbToCmyk(this.r, this.g, this.b);
	}

	toCMYKString(): string {
		return `cmyk(${this.toCMYK().map((x) => Math.round(x))})`;
	}

	// --- Static Converters ---

	static hslToRgb(h: number, s: number, l: number): RGB {
		const c = (1 - Math.abs(2 * l - 1)) * s;
		const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
		const m = l - c / 2;
		let [r, g, b] = [0, 0, 0];

		if (h < 60) [r, g, b] = [c, x, 0];
		else if (h < 120) [r, g, b] = [x, c, 0];
		else if (h < 180) [r, g, b] = [0, c, x];
		else if (h < 240) [r, g, b] = [0, x, c];
		else if (h < 300) [r, g, b] = [x, 0, c];
		else [r, g, b] = [c, 0, x];

		return [
			Math.round((r + m) * 255),
			Math.round((g + m) * 255),
			Math.round((b + m) * 255),
		];
	}

	static rgbToHsl(r: number, g: number, b: number): HSL {
		r /= 255;
		g /= 255;
		b /= 255;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		const d = max - min;
		let h = 0;

		if (d !== 0) {
			if (max === r) h = ((g - b) / d) % 6;
			else if (max === g) h = (b - r) / d + 2;
			else h = (r - g) / d + 4;
		}

		h = Math.round((h * 60 + 360) % 360);
		const l = (max + min) / 2;
		const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

		return [h, Math.round(s * 100), Math.round(l * 100)];
	}

	static rgbToCmyk(r: number, g: number, b: number): CMYK {
		const c = 1 - r / 255;
		const m = 1 - g / 255;
		const y = 1 - b / 255;
		const k = Math.min(c, m, y);

		if (k === 1) return [0, 0, 0, 100];

		return [
			Math.round(((c - k) / (1 - k)) * 100),
			Math.round(((m - k) / (1 - k)) * 100),
			Math.round(((y - k) / (1 - k)) * 100),
			Math.round(k * 100),
		];
	}

	static cmykToRgb([c, m, y, k]: CMYK): RGB {
		const kNorm = k / 100;
		return [
			Math.round(255 * (1 - c / 100) * (1 - kNorm)),
			Math.round(255 * (1 - m / 100) * (1 - kNorm)),
			Math.round(255 * (1 - y / 100) * (1 - kNorm)),
		];
	}
}
