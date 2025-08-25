export const clamp = (value: number, min: number, max: number): number =>
	Math.min(Math.max(value, min), max);

export const formatNumbersInString = (str: string) => {
	return str.replace(/\b\d{4,}\b/g, (match) => {
		if (/,/.test(match)) return match;
		return Number(match).toLocaleString();
	});
};

export const getRandomIntInclusive = (min: number, max: number): number => {
	const lower = Math.ceil(min);
	const upper = Math.floor(max);
	return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

export const randomLong = () => {
	const min = Number.MIN_SAFE_INTEGER;
	const max = Number.MAX_SAFE_INTEGER;
	return Math.abs(Math.floor(Math.random() * (max - min + 1)) + min);
};
