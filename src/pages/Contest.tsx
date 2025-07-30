import "./Contest.scss";
import { useNavigate, useParams } from "@solidjs/router";
import dayjs from "dayjs";
import {
	type Component,
	createMemo,
	Match,
	onCleanup,
	onMount,
	Show,
	Switch,
} from "solid-js";
import { createStore } from "solid-js/store";
import Award from "../components/Award";
import BackButton from "../components/BackButton";
import CircularIconPattern from "../components/CircularIconPattern";
import CustomMainButton from "../components/CustomMainButton";
import ImageLoader from "../components/ImageLoader";
import { Section } from "../components/Section";
import { SVGSymbol } from "../components/SVG";
import { useTranslation } from "../contexts/TranslationContext";
import { requestAPI } from "../utils/api";
import { Color } from "../utils/colors";
import { formatNumbersInString } from "../utils/number";
import { type Contest, store } from "../utils/store";
import { getSymbolSVGString } from "../utils/symbols";
import {
	invokeHapticFeedbackImpact,
	postEvent,
	setHeaderColor,
} from "../utils/telegram";
import {
	ContestThemeBackdrops,
	type ContestThemeSymbol,
} from "../utils/themes";

const PageContest: Component = () => {
	const { t } = useTranslation();

	const navigate = useNavigate();
	const params = useParams();

	const [contest, setContest] = createStore<{
		contest?: Partial<Contest>;
	}>({});

	let header: HTMLElement | undefined;

	const [patternSize, setPatternSize] = createStore<{
		width?: number;
		height?: number;
	}>();

	if (!store.token) {
		navigate(`/splash/contest-${params.slug}`, {
			replace: true,
		});
		return;
	}

	const theme = createMemo(() => {
		if (!contest.contest?.theme) return;

		const backdrop = ContestThemeBackdrops.find(
			(i) => i.id === contest.contest?.theme?.backdrop,
		);
		if (!backdrop) return;

		const symbol: ContestThemeSymbol = {
			id: contest.contest.theme.symbol!,
			component: getSymbolSVGString(contest.contest.theme.symbol!),
		};

		return {
			backdrop,
			symbol,
		};
	});

	onMount(async () => {
		invokeHapticFeedbackImpact("light");

		if (!contest.contest) {
			await fetchContest();
		}

		if (contest.contest?.theme?.backdrop) {
			setHeaderColor(
				ContestThemeBackdrops.find(
					(i) => i.id === contest.contest!.theme!.backdrop!,
				)!.colors.edge as any,
			);
		} else {
			const color = new Color(
				getComputedStyle(
					document.querySelector(":root") as HTMLElement,
				).getPropertyValue("--accent"),
			);

			setHeaderColor(color.toHex() as any);
		}

		setTimeout(() => {
			if (!header) return;
			setPatternSize({
				height: header.clientHeight,
				width: header.clientWidth,
			});
		});

		for (const link of document.querySelectorAll(".content a")) {
			(link as HTMLElement).addEventListener("click", onClickLink);
		}
	});

	onCleanup(() => {
		for (const link of document.querySelectorAll(".content a")) {
			(link as HTMLElement).removeEventListener("click", onClickLink);
		}
	});

	const onClickLink = (e: MouseEvent) => {
		e.preventDefault();
		postEvent("web_app_open_link", {
			url: (e.currentTarget as HTMLAnchorElement).href,
		});
	};

	const fetchContest = async () => {
		const request = await requestAPI(`/contest/${params.slug}`);

		if (request) {
			const { result } = request;

			setContest("contest", result.contest);
		}
	};

	const onBackButton = () => {
		navigate("/", {
			replace: true,
		});
	};

	return (
		<>
			<div id="container-page-contest" class="page">
				<Show
					when={contest.contest}
					fallback={
						<div id="container-contest-shimmer">
							<header class="shimmer"></header>

							<div>
								<ul>
									<li>
										<span class="shimmer"></span>
										<div class="shimmer"></div>
									</li>

									<li>
										<span class="shimmer"></span>
										<div class="shimmer"></div>
									</li>

									<li>
										<span class="shimmer"></span>
										<div class="shimmer"></div>
									</li>
								</ul>

								<div>
									<span class="shimmer"></span>
									<div class="shimmer"></div>
								</div>
							</div>

							<footer>
								<span class="shimmer"></span>
							</footer>
						</div>
					}
				>
					<div
						id="container-contest"
						classList={{
							theme: theme() !== undefined,
							empty: theme() === undefined,
						}}
						style={{
							"--theme-bg": theme()
								? `radial-gradient(${theme()!.backdrop.colors.center}, ${theme()!.backdrop.colors.edge})`
								: "var(--accent)",
							"--theme-bg-edge": theme()
								? theme()!.backdrop.colors.edge
								: "var(--accent)",
							"--theme-bg-center": theme()
								? theme()!.backdrop.colors.center
								: "var(--accent)",
							"--theme-pattern": theme()
								? theme()!.backdrop.colors.pattern
								: "white",
							"--theme-text": theme() ? theme()!.backdrop.colors.text : "white",
						}}
					>
						<header
							ref={header}
							classList={{
								theme: theme() !== undefined,
								empty: theme() === undefined,
							}}
						>
							<Show
								when={
									theme()?.symbol && patternSize.width && patternSize.height
								}
							>
								<CircularIconPattern
									backdrop={theme()!.backdrop}
									symbol={theme()!.symbol}
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

							<Show
								when={contest.contest?.image}
								fallback={
									<div class="empty">
										<Show
											when={theme()?.symbol}
											fallback={
												<div>
													<SVGSymbol id="AiOutlineTrophy" />
												</div>
											}
										>
											<div
												innerHTML={theme()!.symbol.component as string}
											></div>
										</Show>
									</div>
								}
							>
								<ImageLoader
									src={`${import.meta.env.VITE_BACKEND_BASE_URL}/images/${contest.contest!.image!}`}
								/>
							</Show>

							<h1>{contest.contest?.title}</h1>
						</header>

						<div>
							<ul>
								<li>
									<span>{t("pages.contest.header.entry.title")}</span>
									<div>
										<Show
											when={(contest.contest?.fee ?? 0) > 0}
											fallback={
												<span>{t("pages.contest.header.entry.free")}</span>
											}
										>
											<span>{contest.contest!.fee?.toLocaleString()}</span>
											<span>TON</span>
										</Show>
									</div>
								</li>

								<li>
									<span>{t("pages.contest.header.prize.title")}</span>
									<Award
										text={formatNumbersInString(
											contest.contest?.prize ||
												t("pages.contest.header.prize.unknown"),
										)}
									/>
								</li>

								<li>
									<span>{t("pages.contest.header.deadline.title")}</span>
									<div>
										<span>
											{dayjs.unix(contest.contest!.date_end!).format("MMM D")}
										</span>
										<span>
											{dayjs.unix(contest.contest!.date_end!).format("YYYY")}
										</span>
									</div>
								</li>
							</ul>

							<Section title={t("pages.contest.description.title")}>
								<div
									class="content"
									innerHTML={
										contest.contest?.description ||
										t("pages.contest.description.empty")
									}
								></div>
							</Section>
						</div>

						<footer>
							<Switch>
								<Match when={Date.now() / 1000 < contest.contest?.date_end!}>
									<CustomMainButton
										text={t("pages.contest.footer.participate.text")}
										onClick={() => {}}
										backgroundColor="var(--theme-bg-edge)"
									/>
								</Match>

								<Match when={Date.now() / 1000 >= contest.contest?.date_end!}>
									<p class="text-hint">
										{t("pages.contest.footer.closed.text")}
									</p>
								</Match>
							</Switch>
						</footer>
					</div>
				</Show>
			</div>

			<BackButton onClick={onBackButton} />
		</>
	);
};

export default PageContest;
