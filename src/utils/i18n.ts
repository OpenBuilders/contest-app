import { createSignal } from "solid-js";
import { useTranslation } from "../contexts/TranslationContext";

export const serverI18N: any = {};

export const [isRTL, setIsRTL] = createSignal(false);

export const ts = (pathString: string): string => {
	const { locale } = useTranslation();

	if (serverI18N) {
		const path = pathString.split(".");
		let i = 0;
		let target = serverI18N[locale()];

		do {
			const index = path[i];
			if (index in target) {
				if (typeof target[index] === "string") {
					return target[index];
				}
				target = target[index];
			}
			i++;
		} while (i < path.length);
	}

	return "UNDEFINED";
};
