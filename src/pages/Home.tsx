import { A, useNavigate } from "@solidjs/router";
import { type AnnotatedContest, setStore, store } from "../utils/store";
import "./Home.scss";

import dayjs from "dayjs";
import { FaSolidPlus } from "solid-icons/fa";
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
import ButtonArray from "../components/ButtonArray";
import ContestThumbnail from "../components/ContestThumbnail";
import LottiePlayerMotion from "../components/LottiePlayerMotion";
import { SVGSymbol } from "../components/SVG";
import Tabbar from "../components/Tabbar";
import { useTranslation } from "../contexts/TranslationContext";
import { TGS } from "../utils/animations";
import { requestAPI } from "../utils/api";
import { setModals } from "../utils/modal";
import { formatNumbersInString } from "../utils/number";
import { setSettings, settings } from "../utils/settings";
import { signals } from "../utils/signals";
import { getSymbolSVGString } from "../utils/symbols";
import {
	ContestThemeBackdrops,
	type ContestThemeSymbol,
} from "../utils/themes";

export const SectionContestsEmpty: Component<{
	title: string;
	iconIndex: keyof typeof TGS;
	buttonText?: string;
	onClickButton?: () => void;
}> = (props) => {
	return (
		<div class="container-home-contests-empty">
			<LottiePlayerMotion
				src={TGS[props.iconIndex].url}
				outline={TGS[props.iconIndex].outline}
				autoplay
				playOnClick
			/>

			<span class="text-secondary">{props.title}</span>

			<Show when={props.buttonText}>
				<button type="button" onClick={props.onClickButton}>
					{props.buttonText}
				</button>
			</Show>
		</div>
	);
};

const PageHome: Component = () => {
	const navigate = useNavigate();

	if (!store.token) {
		navigate("/splash", {
			replace: true,
		});
		return;
	}

	const { t } = useTranslation();

	const fetchContests = async () => {
		const request = await requestAPI("/contests/my", {}, "GET");

		if (request) {
			const { result } = request;

			setStore("contests", "my", result.contests);
		}
	};

	const onClickButtonCreate = () => {
		setModals("create", "open", true);
	};

	onMount(async () => {
		if (!store.contests?.my) {
			await fetchContests();
		}
	});

	const SectionContestsLoading = () => {
		return (
			<div id="container-home-contests-loading">
				<ul>
					<For each={Array.from(new Array(3))}>
						{() => <li class="shimmer"></li>}
					</For>
				</ul>

				<section>
					<For each={Array.from(new Array(20))}>
						{() => (
							<div>
								<div class="shimmer"></div>

								<div>
									<span class="shimmer"></span>
									<span class="shimmer"></span>
								</div>

								<div>
									<span class="shimmer"></span>
									<span class="shimmer"></span>
								</div>
							</div>
						)}
					</For>
				</section>
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

		const contestsJoined = createMemo(() =>
			store.contests.my!.filter(
				(contest) => contest.metadata.role === "participant",
			),
		);

		const contestsCreated = createMemo(() =>
			store.contests.my!.filter((contest) => contest.metadata.role === "owner"),
		);

		const ListContests: Component<{ contests: AnnotatedContest[] }> = (
			props,
		) => {
			return (
				<div class="container-list-contests">
					<For each={props.contests}>
						{(contest) => {
							const { backdrop, symbol } = {
								backdrop: contest.contest.theme?.backdrop,
								symbol: {
									id: contest.contest.theme?.symbol,
									component: contest.contest.theme?.symbol
										? getSymbolSVGString(contest.contest.theme?.symbol)
										: "",
								},
							};

							return (
								<A href={`/contest/${contest.contest.slug}`}>
									<ContestThumbnail
										image={contest.contest.image}
										backdrop={
											ContestThemeBackdrops.find((i) => i.id === backdrop)!
										}
										symbol={symbol as ContestThemeSymbol}
									/>

									<div>
										<h2>
											{contest.contest.title}
											<Show when={contest.contest.verified}>
												<SVGSymbol id="VsVerifiedFilled" />
											</Show>
										</h2>

										<span>
											{[
												formatNumbersInString(contest.contest.prize ?? ""),
												(contest.contest.announced
													? t("pages.home.contests.ended")
													: ""
												).toUpperCase(),
											]
												.filter(Boolean)
												.join(" | ")}
										</span>
									</div>

									<div>
										<span>
											{dayjs.unix(contest.contest.date_end).format("MMM D")}
										</span>

										<Show when={contest.metadata.role}>
											<span class={contest.metadata.role}>
												{t(`general.roles.${contest.metadata.role}` as any)}
											</span>
										</Show>
									</div>
								</A>
							);
						}}
					</For>
				</div>
			);
		};

		return (
			<div id="container-home-contests">
				<Tabbar
					items={[
						{
							slug: "all",
							title: t("pages.home.contests.tabs.all.title"),
							component: () => (
								<Show
									when={store.contests.my!.length > 0}
									fallback={
										<SectionContestsEmpty
											title={t("pages.home.contests.empty.all.title")}
											iconIndex="duckEgg"
										/>
									}
								>
									<ListContests contests={store.contests.my!} />
								</Show>
							),
						},
						{
							slug: "joined",
							title: t("pages.home.contests.tabs.joined.title"),
							component: () => (
								<Show
									when={contestsJoined().length > 0}
									fallback={
										<SectionContestsEmpty
											title={t("pages.home.contests.empty.joined.title")}
											iconIndex="duckCry"
											buttonText={t("pages.home.contests.empty.joined.button")}
											onClickButton={() => {
												navigate("/contests", {
													replace: true,
												});
											}}
										/>
									}
								>
									<ListContests contests={contestsJoined()} />
								</Show>
							),
						},
						{
							slug: "created",
							title: t("pages.home.contests.tabs.created.title"),
							component: () => (
								<Show
									when={contestsCreated().length > 0}
									fallback={
										<SectionContestsEmpty
											title={t("pages.home.contests.empty.created.title")}
											iconIndex="duckCraft"
											buttonText={t("pages.home.contests.empty.created.button")}
											onClickButton={onClickButtonCreate}
										/>
									}
								>
									<ListContests contests={contestsCreated()} />
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
				setStore("contests", "my", undefined);
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
				<header>
					<h1>{t("pages.home.contests.title")}</h1>

					<ButtonArray
						items={[
							{
								component: FaSolidPlus,
								fontSize: "1.1875rem",
								class: "clickable",
								onClick: onClickButtonCreate,
							},
						]}
					/>
				</header>

				<Show when={store.contests?.my} fallback={<SectionContestsLoading />}>
					<SectionContests />
				</Show>
			</div>
		</div>
	);
};

export default PageHome;
