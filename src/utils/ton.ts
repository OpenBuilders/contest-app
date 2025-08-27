// User-friendly TON address (base64url, 48 chars)
const tonFriendlyRegex = /^[A-Za-z0-9_-]{48}$/;

// Raw TON address (workchain:hex)
const tonRawRegex = /^-?\d+:[0-9a-fA-F]{64}$/;

export const isTonAddress = (addr: string): boolean =>
	tonFriendlyRegex.test(addr) || tonRawRegex.test(addr);

export const formatTonAddress = (
	addr: string,
	start: number = 6,
	end: number = 6,
): string => {
	if (addr.length <= start + end) return addr;
	return `${addr.slice(0, start)}...${addr.slice(-end)}`;
};
