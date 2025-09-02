export const truncateMiddle = (
	text: string,
	startLen = 64,
	endLen = 32,
): string => {
	if (text.length <= startLen + endLen) {
		return text;
	}
	const start = text.slice(0, startLen);
	const end = text.slice(-endLen);
	return `${start}...${end}`;
};
