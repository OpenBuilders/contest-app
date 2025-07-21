import ThemePreview from "../components/ThemePreview";
import { ContestThemeBackdrops } from "../utils/themes";
import "./Debug.scss";
import type { Component } from "solid-js";
import { getSymbolSVGString } from "../utils/symbols";

const PageDebug: Component = () => {
	return (
		<div id="container-page-debug" class="page">
			<div>
				<ThemePreview
					backdrop={ContestThemeBackdrops[1]}
					symbol={{ id: "icon", component: getSymbolSVGString("symbol-3") }}
					size={390}
				/>
			</div>
		</div>
	);
};

export default PageDebug;
