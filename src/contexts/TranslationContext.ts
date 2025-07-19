import { type Accessor, createContext, useContext } from "solid-js";
import type { dict } from "../i18n/en";
import type { Locale } from "../locale";

type TranslationKey = NestedPaths<typeof dict>;

type NestedPaths<T, Prev extends string = ""> = {
	[K in keyof T]: T[K] extends string
		? `${Prev}${K & string}`
		: NestedPaths<T[K], `${Prev}${K & string}.`>;
}[keyof T];

type ExtractParams<S extends string> =
	S extends `${string}{${infer Param}}${infer Rest}`
		? { [K in Param | keyof ExtractParams<Rest>]: string }
		: {};

type GetTranslation<K extends TranslationKey> = K extends keyof any
	? K extends NestedPaths<typeof dict>
		? GetPathValue<typeof dict, K>
		: never
	: never;

type GetPathValue<
	T,
	Path extends string,
> = Path extends `${infer Head}.${infer Tail}`
	? Head extends keyof T
		? GetPathValue<T[Head], Tail>
		: never
	: Path extends keyof T
		? T[Path]
		: never;

export type TranslationContextType = {
	t: <K extends TranslationKey>(key: K) => any;
	td: <K extends TranslationKey>(
		key: K,
		params?: ExtractParams<GetTranslation<K>>,
	) => any;
	locale: Accessor<Locale>;
	setLocale: (key: Locale) => void;
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
