import { defineConfig, type UserConfig } from "vite";
import solid from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import solidSvg from "vite-plugin-solid-svg";
import pluginPurgeCss from "vite-plugin-purgecss";
import devtools from "solid-devtools/vite";

export default defineConfig((config) => {
	const isDevMode = config.mode === "development";

	const userConfig: UserConfig = {
		plugins: [
			tailwindcss(),
			solid(),
			solidSvg(),
			pluginPurgeCss({
				variables: true,
				keyframes: true,
				content: ["./src/**/*.tsx"],
				safelist: {
					standard: [
						":root",
						"body",
						"html",
						"#root",
						"a",
						"button",
						"div",
						"span",
						"ul",
						"ol",
						"svg",
					],
					greedy: [/container\-/, /sb\-/],
				},
				defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
			}) as any,
		],
		server: {
			cors: {
				allowedHeaders: "*",
				origin: "*",
			},
		},
		envDir: "./",
		build: {
			rollupOptions: {
				output: {
					manualChunks: {
						svgAssets: ["solid-icons"],
					},
				},
			},
		},
	};

	if (!isDevMode) {
		userConfig.plugins?.push(devtools());
	}

	return userConfig;
});
