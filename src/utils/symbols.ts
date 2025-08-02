export const SymbolsModule = import.meta.glob("../assets/icons/symbols/*.svg", {
	eager: true,
	import: "default",
	query: "?raw",
});

export const getSymbolSVGString = (id: string): string => {
	return SymbolsModule[`../assets/icons/symbols/${id}.svg`] as string;
};

export const AnimalSymbolsModule = import.meta.glob(
	"../assets/icons/animals/*.svg",
	{
		eager: true,
		import: "default",
		query: "?raw",
	},
);

export const getAnimalSymbolSVGString = (id: string): string => {
	return SymbolsModule[`../assets/icons/animals/${id}.svg`] as string;
};
