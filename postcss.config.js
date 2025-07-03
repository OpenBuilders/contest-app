import autoprefixer from "autoprefixer";

const remChecker = (opts = { baseFontSize: 16 }) => ({
	postcssPlugin: "postcss-whole-pixel-rem-checker",
	Declaration(decl) {
		const remRegex = /([\d.]+)rem/g;
		let match;
		// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
		while ((match = remRegex.exec(decl.value))) {
			const remValue = Number.parseFloat(match[1]);
			const px = remValue * opts.baseFontSize;
			if (px % 1 !== 0) {
				console.warn(
					`⚠️ Non-whole pixel: ${decl.prop} = ${decl.value} (${px}px)`,
				);
			}
		}
	},
});
remChecker.postcss = true;

export default {
	plugins: [autoprefixer(), remChecker({ baseFontSize: 16 })],
};
