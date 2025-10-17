import "./ContestThumbnail.scss";
import { type Component, Match, Switch } from "solid-js";
import { cloneObject } from "../utils/general";
import type { ContestThemeBackdrop, ContestThemeSymbol } from "../utils/themes";
import ImageLoader from "./ImageLoader";
import { SVGSymbol } from "./SVG";
import ThemePreview from "./ThemePreview";

type ContestThumbnailProps = {
	image?: string;
	backdrop?: ContestThemeBackdrop;
	symbol?: ContestThemeSymbol;
	symbolSize?: number;
};

const ContestThumbnail: Component<ContestThumbnailProps> = (props) => {
	const backdrop: ContestThemeBackdrop = cloneObject(
		props.backdrop ?? ({} as any),
	);

	if (`colors` in backdrop) {
		backdrop.colors.pattern = backdrop.colors.text;
	}

	return (
		<div class="contest-thumbnail">
			<Switch
				fallback={
					<div
						class="empty"
						style={{ "font-size": `${(props.symbolSize ?? 24) * 1.125}px` }}
					>
						<SVGSymbol id="AiOutlineTrophy" />
					</div>
				}
			>
				<Match when={props.image}>
					<ImageLoader
						src={`${import.meta.env.VITE_BACKEND_BASE_URL}/images/${props.image}`}
					/>
				</Match>

				<Match when={props.backdrop && props.symbol}>
					<ThemePreview
						backdrop={backdrop}
						symbol={props.symbol!}
						layers={[
							{
								count: 1,
								alpha: 1,
								distance: 0,
								size: props.symbolSize ?? 24,
							},
						]}
					/>
				</Match>
			</Switch>
		</div>
	);
};

export default ContestThumbnail;
