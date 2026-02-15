import "./Profile.scss";
import { TbOutlineGhost2 } from "solid-icons/tb";
import { type Component, For, Match, onMount, Show, Switch } from "solid-js";
import { createStore } from "solid-js/store";
import { Avatar, AvatarColors } from "../components/Avatar";
import CircularIconPattern from "../components/CircularIconPattern";
import ContestThumbnail from "../components/ContestThumbnail";
import { Section } from "../components/Section";
import { useTranslation } from "../contexts/TranslationContext";
import { requestAPI } from "../utils/api";
import { Color } from "../utils/colors";
import { navigator } from "../utils/navigator";
import { setStore, store } from "../utils/store";
import { stringifySVGSymbol } from "../utils/svg";
import { getSymbolSVGString } from "../utils/symbols";
import { setBackgroundColor, setHeaderColor } from "../utils/telegram";
import {
	type ContestThemeBackdrop,
	ContestThemeBackdrops,
	type ContestThemeSymbol,
	disableThemeSync,
} from "../utils/themes";

const PageProfile: Component = () => {
	if (!store.token) {
		navigator.go("/splash", {
			params: {
				from: "/profile",
				haptic: false,
			},
		});
		return;
	}

	const { t } = useTranslation();

	let header: HTMLElement | undefined;

	const [patternSize, setPatternSize] = createStore<{
		width?: number;
		height?: number;
	}>();

	const profileColor = AvatarColors[store.user?.anonymous_profile[0] ?? 0];

	const fullname = [store.user?.first_name, store.user?.last_name]
		.filter(Boolean)
		.join(" ");

	const anonymous_name = [
		store.user?.anonymous_profile[1][1],
		store.user?.anonymous_profile[2][1],
	]
		.filter(Boolean)
		.join(" ");

	const backdrop: ContestThemeBackdrop = {
		id: -1,
		name: "Custom",
		colors: {
			center: profileColor.from,
			edge: profileColor.to,
			pattern: "#ffffff",
			text: "#ffffff",
		},
	};

	const symbol: ContestThemeSymbol = {
		id: store.user?.anonymous_profile[2][0] ?? "",
		component:
			stringifySVGSymbol(`alias-${store.user?.anonymous_profile[2][0]}`) ?? "",
	};

	const fetchAchievements = async () => {
		const request = await requestAPI("/achievements/my", {}, "GET");

		if (request) {
			const { result } = request;

			setStore("achievements", "my", result.achievements);
		}
	};

	onMount(async () => {
		disableThemeSync();

		setTimeout(() => {
			setHeaderColor(profileColor.to as any);

			if (!header) return;
			setPatternSize({
				height: header.clientHeight,
				width: header.clientWidth,
			});

			const color = new Color(
				getComputedStyle(document.querySelector("#container-bottombar")!)
					.backgroundColor,
			);
			setBackgroundColor(color.toHex() as any);
		});

		if (!store.achievements?.my) {
			await fetchAchievements();
		}
	});

	const onClickAchievement = (slug: string) => {
		navigator.go(`/contest/${slug}`, {
			backable: true,
			params: {
				theme: {
					header: false,
				},
			},
		});
	};

	const SectionAchievementsLoading = () => {
		return (
			<section id="container-section-profile-achievements-loading">
				<span class="shimmer"></span>

				<div class="shimmer-section-bg">
					<For each={Array.from(new Array(6))}>
						{() => (
							<div>
								<div class="shimmer"></div>
								<div>
									<span class="shimmer"></span>
									<span class="shimmer"></span>
								</div>

								<span class="shimmer"></span>
							</div>
						)}
					</For>
				</div>
			</section>
		);
	};

	const SectionAchievementsEmpty = () => {
		return (
			<section id="container-section-profile-achievements-empty">
				<div>
					<TbOutlineGhost2 />
					<p>{t("pages.profile.achievements.empty")}</p>
				</div>
			</section>
		);
	};

	const SectionAchievements = () => {
		const onClickAchievementEvent = (e: MouseEvent) => {
			const slug = (e.currentTarget as HTMLElement).getAttribute("data-slug");
			if (!slug) return;
			onClickAchievement(slug);
		};

		return (
			<section id="container-section-profile-achievements">
				<Section title={t("pages.profile.achievements.title")}>
					<For each={store.achievements.my}>
						{(achievement) => {
							const { backdrop, symbol } = {
								backdrop: achievement.theme?.backdrop,
								symbol: {
									id: achievement.theme?.symbol,
									component: achievement.theme?.symbol
										? getSymbolSVGString(achievement.theme?.symbol)
										: "",
								},
							};

							return (
								<div
									onClick={onClickAchievementEvent}
									data-slug={achievement.slug}
									class="clickable"
								>
									<ContestThumbnail
										image={achievement.image}
										backdrop={
											ContestThemeBackdrops.find((i) => i.id === backdrop)!
										}
										symbol={symbol as ContestThemeSymbol}
									/>

									<div>
										<span>{achievement.title}</span>
										<span>{achievement.placement.name}</span>
									</div>

									<span>{achievement.placement.prize}</span>
								</div>
							);
						}}
					</For>
				</Section>
			</section>
		);
	};

	return (
		<div id="container-page-profile" class="page">
			<div
				style={{
					"--theme-bg": `radial-gradient(${backdrop.colors.center}, ${backdrop.colors.edge})`,
					"--theme-bg-edge": backdrop.colors.edge,
					"--theme-bg-center": backdrop.colors.center,
					"--theme-pattern": backdrop.colors.pattern,
					"--theme-text": backdrop.colors.text,
				}}
			>
				<header ref={header}>
					<Show when={patternSize.width && patternSize.height}>
						<CircularIconPattern
							backdrop={backdrop}
							symbol={symbol}
							size={{
								width: patternSize.width!,
								height: patternSize.height!,
							}}
							layers={[
								{
									count: 6,
									alpha: 0.425,
									distance: patternSize.height! / 3,
									size: patternSize.height! / 10,
								},
								{
									count: 9,
									alpha: 0.25,
									distance: patternSize.height! / 1.875,
									size: patternSize.height! / 15,
								},
								{
									count: 15,
									alpha: 0.125,
									distance: patternSize.height! / 1.325,
									size: patternSize.height! / 18,
								},
							]}
						/>
					</Show>

					<Avatar
						fullname={fullname}
						peerId={store.user?.user_id ?? 0}
						src={store.user?.profile_photo}
					/>

					<div class="info">
						<h1>{fullname}</h1>
						<span>{anonymous_name}</span>
					</div>
				</header>

				<div>
					<Switch fallback={<SectionAchievementsLoading />}>
						<Match when={(store.achievements.my?.length ?? -1) > 0}>
							<SectionAchievements />
						</Match>

						<Match when={(store.achievements.my?.length ?? -1) === 0}>
							<SectionAchievementsEmpty />
						</Match>
					</Switch>
				</div>
			</div>
		</div>
	);
};

export default PageProfile;
