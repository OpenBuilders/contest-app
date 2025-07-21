export const SymbolsModule = import.meta.glob("../assets/symbols/*.svg", {
	eager: true,
	import: "default",
	query: "?raw",
});

export const getSymbolSVGString = (id: string): string => {
	return SymbolsModule[`../assets/symbols/${id}.svg`] as string;
};
