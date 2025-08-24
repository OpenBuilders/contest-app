import "./Contests.scss";
import { useNavigate } from "@solidjs/router";
import { type Component, For, Match, onMount, Switch } from "solid-js";
import ContestThumbnail from "../components/ContestThumbnail";
import ImageLoader from "../components/ImageLoader";
import { useTranslation } from "../contexts/TranslationContext";
import { requestAPI } from "../utils/api";
import {
	type GallerySection,
	type GallerySlider,
	setStore,
	store,
} from "../utils/store";
import { getSymbolSVGString } from "../utils/symbols";
import {
	invokeHapticFeedbackImpact,
	parseTelegramLink,
	postEvent,
} from "../utils/telegram";
import {
	ContestThemeBackdrops,
	type ContestThemeSymbol,
} from "../utils/themes";
import { SectionContestsEmpty } from "./Home";

const SectionGallerySlider: Component<{ item: GallerySlider }> = (props) => {
	const onClickSlide = (e: MouseEvent) => {
		const url = (e.currentTarget as HTMLElement).getAttribute("data-url");
		if (!url) return;
		invokeHapticFeedbackImpact("light");

		const path = parseTelegramLink(url);

		if (path) {
			postEvent("web_app_open_tg_link", {
				path_full: path,
			});
		} else {
			postEvent("web_app_open_link", {
				url: url,
			});
		}
	};

	return (
		<section class="section-gallery-slider">
			<swiper-container
				slides-per-view={props.item.items_per_view ?? "1.125"}
				space-between="12"
				grab-cursor={true}
				centered-slides={true}
			>
				<For each={props.item.items}>
					{(item) => (
						<swiper-slide class="container-slide-image">
							<div class="clickable" onClick={onClickSlide} data-url={item.url}>
								<ImageLoader src={item.image} />
							</div>
						</swiper-slide>
					)}
				</For>
			</swiper-container>
		</section>
	);
};

const SectionGallerySection: Component<{ item: GallerySection }> = (props) => {
	const navigate = useNavigate();

	const onClickItem = (e: MouseEvent) => {
		const slug = (e.currentTarget as HTMLElement).getAttribute("data-slug");
		if (!slug) return;

		navigate(`/contest/${slug}`, {
			replace: true,
		});
	};

	return (
		<section class="section-gallery-section">
			<h2>{props.item.title}</h2>

			<swiper-container
				slides-per-view={"4"}
				slides-offset-before="12"
				slides-offset-after="12"
				space-between="12"
				grab-cursor={true}
			>
				<For each={props.item.items}>
					{(item) => {
						const { backdrop, symbol } = {
							backdrop: item.theme?.backdrop,
							symbol: {
								id: item.theme?.symbol,
								component: item.theme?.symbol
									? getSymbolSVGString(item.theme?.symbol)
									: "",
							},
						};

						return (
							<swiper-slide class="container-slide-section">
								<div
									class="clickable"
									onClick={onClickItem}
									data-slug={item.slug}
								>
									<ContestThumbnail
										image={item.image}
										backdrop={
											ContestThemeBackdrops.find((i) => i.id === backdrop)!
										}
										symbol={symbol as ContestThemeSymbol}
										symbolSize={32}
									/>

									<h3>{item.title}</h3>
								</div>
							</swiper-slide>
						);
					}}
				</For>
			</swiper-container>
		</section>
	);
};

const PageContests: Component = () => {
	if (!store.token) {
		const navigate = useNavigate();
		navigate("/splash/contests", {
			replace: true,
		});
		return;
	}

	const { t } = useTranslation();

	const fetchGallery = async () => {
		const request = await requestAPI("/contests/gallery", {}, "GET");

		if (request) {
			const { result } = request;

			setStore("contests", "gallery", result.gallery);
		}
	};

	onMount(async () => {
		if (!store.contests?.gallery) {
			await fetchGallery();
		}
	});

	const SectionGalleryLoading = () => {
		return (
			<div id="container-gallery-loading">
				<div class="shimmer"></div>

				<For each={Array.from(new Array(6))}>
					{() => (
						<section>
							<span class="shimmer"></span>

							<div>
								<div class="shimmer"></div>
								<div class="shimmer"></div>
								<div class="shimmer"></div>
								<div class="shimmer"></div>
							</div>
						</section>
					)}
				</For>
			</div>
		);
	};

	const SectionGalleryEmpty = () => {
		return (
			<div id="container-gallery-empty">
				<SectionContestsEmpty
					title={t("pages.contests.empty")}
					iconIndex="duckEgg"
				/>
			</div>
		);
	};

	const SectionGallery = () => {
		return (
			<div id="container-gallery">
				<For each={store.contests.gallery}>
					{(item) => (
						<Switch>
							<Match when={item.type === "slider"}>
								<SectionGallerySlider item={item as GallerySlider} />
							</Match>

							<Match when={item.type === "section"}>
								<SectionGallerySection item={item as GallerySection} />
							</Match>
						</Switch>
					)}
				</For>
			</div>
		);
	};

	return (
		<div id="container-page-contests" class="page">
			<div>
				<Switch fallback={<SectionGalleryLoading />}>
					<Match when={(store.contests.gallery?.length ?? -1) > 0}>
						<SectionGallery />
					</Match>

					<Match when={(store.contests.gallery?.length ?? -1) === 0}>
						<SectionGalleryEmpty />
					</Match>
				</Switch>
			</div>
		</div>
	);
};

export default PageContests;
