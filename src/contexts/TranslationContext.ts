import { type Accessor, createContext, useContext } from "solid-js";
import type { dict } from "../i18n/en";
import type { Locale } from "../locale";

type NestedPaths<T> = T extends object
	? {
			[K in keyof T]: K extends string
				? T[K] extends object
					? `${K}.${NestedPaths<T[K]>}` | K
					: K
				: never;
		}[keyof T]
	: never;

export type TranslationContextType = {
	t: (key: NestedPaths<typeof dict>) => any;
	td: (key: NestedPaths<typeof dict>, data: { [key: string]: string }) => any;
	locale: Accessor<Locale>;
	setLocale: (key: any) => void;
};

const TranslationContext = createContext<TranslationContextType | undefined>(
	undefined,
);

export const TranslationProvider = TranslationContext.Provider;

export const useTranslation = () => {
	const context = useContext(TranslationContext);
	if (!context) {
		throw new Error("useTranslation must be used within a TranslationProvider");
	}
	return context;
};
