import { type AnnotatedContest, setStore, store } from "../utils/store";
import "./Home.scss";

import dayjs from "dayjs";
import {
	type Component,
	createEffect,
	createMemo,
	createSignal,
	For,
	on,
	onMount,
	Show,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import ContestThumbnail from "../components/ContestThumbnail";
import CustomMainButton from "../components/CustomMainButton";
import LottiePlayerMotion from "../components/LottiePlayerMotion";
import { SVGSymbol } from "../components/SVG";
import Tabbar from "../components/Tabbar";
import { useTranslation } from "../contexts/TranslationContext";
import { TGS } from "../utils/animations";
import { requestAPI } from "../utils/api";
import { navigator } from "../utils/navigator";
import { formatNumbersInString } from "../utils/number";
import { setSettings, settings } from "../utils/settings";
import { signals } from "../utils/signals";
import { getSymbolSVGString } from "../utils/symbols";
import {
	ContestThemeBackdrops,
	type ContestThemeSymbol,
} from "../utils/themes";

const PageHome: Component = () => {
	if (!store.token) {
		navigator.go("/splash", {
			params: {
				haptic: false,
			},
		});
		return;
	}

	const { t, td } = useTranslation();

	const fetchContests = async () => {
		const request = await requestAPI("/contests/my", {}, "GET");

		if (request) {
			const { result } = request;

			setStore("contests", {
				my: result.contests,
				gallery: result.gallery,
			});
		}
	};

	const onClickButtonCreate = () => {
		navigator.go("/create", {
			backable: true,
		});
	};

	onMount(async () => {
		if (!(store.contests.my && store.contests.gallery)) {
			await fetchContests();
		}
	});

	const SectionContestsLoading = () => {
		return (
			<div id="container-home-contests-loading">
				<span class="shimmer"></span>

				<div>
					<For each={Array.from(new Array(3))}>
						{() => (
							<section>
								<span class="shimmer"></span>

								<div class="shimmer-section-bg">
									<For each={Array.from(new Array(2))}>
										{() => (
											<div>
												<div class="shimmer"></div>

												<div>
													<span class="shimmer"></span>
													<span class="shimmer"></span>
													<span class="shimmer"></span>
													<span class="shimmer"></span>
												</div>
											</div>
										)}
									</For>
								</div>
							</section>
						)}
					</For>
				</div>
			</div>
		);
	};

	const SectionContests = () => {
		const [tabbar, setTabbar] = createSignal(settings.tabs.home.myContests);

		createEffect(
			on(tabbar, () => {
				setSettings("tabs", "home", "myContests", tabbar());
			}),
		);

		const contestsAll = createMemo(() => {
			return store.contests.gallery!.find(
				(i) => i.type === "section" && i.id === "public",
			)!.items as AnnotatedContest[];
		});

		const now = Date.now() / 1000;

		const contestsAllOpen = createMemo(() => {
			return contestsAll().filter(
				(i) => i.contest.date_end > now && !i.contest.announced,
			);
		});

		const contestsAllFinished = createMemo(() => {
			return contestsAll().filter(
				(i) => i.contest.date_end <= now || i.contest.announced,
			);
		});

		const contestsYours = createMemo(() => {
			return store.contests.my!.filter(
				(contest) =>
					contest.metadata.role === "owner" ||
					contest.metadata.role === "participant",
			);
		});

		const contestsSaved = createMemo(() => {
			return store.contests.my!.filter(
				(contest) => contest.metadata.bookmarked,
			);
		});

		const SectionContest: Component<{ contest: AnnotatedContest }> = (
			props,
		) => {
			const { backdrop, symbol } = {
				backdrop: props.contest.contest.theme?.backdrop,
				symbol: {
					id: props.contest.contest.theme?.symbol,
					component: props.contest.contest.theme?.symbol
						? getSymbolSVGString(props.contest.contest.theme?.symbol)
						: "",
				},
			};

			const onClickContest = () => {
				navigator.go(`/contest/${props.contest.contest.slug}`, {
					backable: true,
					params: {
						theme: {
							header: false,
						},
					},
				});
			};

			return (
				<div
					class="container-home-contests-item clickable"
					onClick={onClickContest}
				>
					<ContestThumbnail
						image={props.contest.contest.image}
						backdrop={ContestThemeBackdrops.find((i) => i.id === backdrop)!}
						symbol={symbol as ContestThemeSymbol}
						symbolSize={64}
					/>

					<div>
						<span>
							{props.contest.contest.title}
							<Show when={props.contest.contest.verified}>
								<SVGSymbol id="VsVerifiedFilled" />
							</Show>
						</span>

						<span>
							{td("pages.home.contests.items.reward", {
								reward: formatNumbersInString(
									props.contest.contest.prize ??
										t("pages.contest.header.prize.unknown"),
								),
							})}
						</span>

						<span>
							{td("pages.home.contests.items.participants", {
								count: props.contest.metadata.submissions_count ?? 0,
							})}
						</span>

						<span>
							<Show
								when={
									props.contest.contest.date_end >= Date.now() / 1000 &&
									!props.contest.contest.announced
								}
								fallback={<SVGSymbol id="FinishFlags" class="finish" />}
							>
								<SVGSymbol id="WiTime9" class="open" />
							</Show>

							<span>
								{dayjs(props.contest.contest.date_end * 1000).format("MMM D")}
							</span>
						</span>
					</div>
				</div>
			);
		};

		const SectionContests: Component<{
			contests: AnnotatedContest[];
			title?: string;
		}> = (props) => {
			return (
				<div class="container-home-contests-section">
					<Show when={props.title}>
						<span>{props.title}</span>
					</Show>

					<Show when={props.contests.length > 0}>
						<section>
							<For each={props.contests}>
								{(contest) => <SectionContest contest={contest} />}
							</For>
						</section>
					</Show>
				</div>
			);
		};

		const SectionContestsEmpty = () => {
			return (
				<div class="container-home-contests-empty">
					<LottiePlayerMotion
						src={TGS.duckEgg.url}
						autoplay
						playOnClick
						outline={TGS.duckEgg.outline}
					/>

					<span>{t("pages.home.contests.empty.all.title")}</span>
					<p>{t("pages.home.contests.empty.all.subtitle")}</p>
				</div>
			);
		};

		const SectionHolder: Component<{ sections: Component[] }> = (props) => {
			return (
				<div class="container-home-contests-holder">
					<For each={props.sections}>
						{(component) => <Dynamic component={component} />}
					</For>
				</div>
			);
		};

		return (
			<div id="container-home-contests">
				<Tabbar
					mode="segmented"
					gap={16}
					items={[
						{
							slug: "all",
							title: t("pages.home.contests.tabs.all.title"),
							component: () => (
								<Show
									fallback={<SectionContestsEmpty />}
									when={contestsAll().length > 0}
								>
									<SectionHolder
										sections={[
											() => (
												<Show when={contestsAllOpen().length > 0}>
													<SectionContests
														title={t("pages.home.contests.topics.open")}
														contests={contestsAllOpen()}
													/>
												</Show>
											),
											() => (
												<Show when={contestsAllFinished().length > 0}>
													<SectionContests
														title={t("pages.home.contests.topics.finished")}
														contests={contestsAllFinished()}
													/>
												</Show>
											),
										]}
									/>
								</Show>
							),
						},
						{
							slug: "yours",
							title: t("pages.home.contests.tabs.yours.title"),
							component: () => (
								<Show
									fallback={<SectionContestsEmpty />}
									when={contestsYours().length > 0}
								>
									<SectionHolder
										sections={[
											() => (
												<Show when={contestsYours().length > 0}>
													<SectionContests
														title={t("pages.home.contests.topics.yours")}
														contests={contestsYours()}
													/>
												</Show>
											),
										]}
									/>
								</Show>
							),
						},
						{
							slug: "saved",
							title: t("pages.home.contests.tabs.saved.title"),
							component: () => (
								<Show
									fallback={<SectionContestsEmpty />}
									when={contestsSaved().length > 0}
								>
									<SectionHolder
										sections={[
											() => (
												<Show when={contestsSaved().length > 0}>
													<SectionContests
														title={t("pages.home.contests.topics.saved")}
														contests={contestsSaved()}
													/>
												</Show>
											),
										]}
									/>
								</Show>
							),
						},
					]}
					value={tabbar()}
					setValue={setTabbar}
				/>
			</div>
		);
	};

	createEffect(
		on(
			() => signals.fetchMyContests,
			async () => {
				setStore("contests", {
					gallery: undefined,
					my: undefined,
				});
				await fetchContests();
			},
			{
				defer: true,
			},
		),
	);

	return (
		<div id="container-page-home" class="page">
			<div>
				<Show
					when={store.contests.my && store.contests.gallery && true}
					fallback={<SectionContestsLoading />}
				>
					<SectionContests />
				</Show>

				<footer>
					<CustomMainButton
						text={t("pages.home.contests.create.button")}
						onClick={onClickButtonCreate}
					/>
				</footer>
			</div>
		</div>
	);
};

export default PageHome;
