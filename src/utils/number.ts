export const clamp = (value: number, min: number, max: number): number =>
	Math.min(Math.max(value, min), max);

export const formatNumbersInString = (str: string) => {
	return str.replace(/\b\d{4,}\b/g, (match) => {
		if (/,/.test(match)) return match;
		return Number(match).toLocaleString();
	});
};
