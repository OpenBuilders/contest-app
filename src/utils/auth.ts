export const urlParseQueryString = (
	queryString: string,
): Record<string, string | null> => {
	const params: Record<string, string | null> = {};
	if (queryString.length === 0) {
		return params;
	}

	const queryStringParams = queryString.split("&");
	for (const param of queryStringParams) {
		const [rawName, rawValue] = param.split("=");
		const paramName = urlSafeDecode(rawName);
		const paramValue = rawValue == null ? null : urlSafeDecode(rawValue);
		params[paramName] = paramValue;
	}

	return params;
};

const urlSafeDecode = (urlencoded: string): string => {
	let finalURLEncoded = urlencoded;
	try {
		finalURLEncoded = finalURLEncoded.replace(/\+/g, "%20");
		return decodeURIComponent(finalURLEncoded);
	} catch {
		return finalURLEncoded;
	}
};
