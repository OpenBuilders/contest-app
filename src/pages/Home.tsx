import { A, useNavigate } from "@solidjs/router";
import { type Contest, setStore, store } from "../utils/store";
import "./Home.scss";

import dayjs from "dayjs";
import { AiOutlineTrophy } from "solid-icons/ai";
import { FaSolidPlus } from "solid-icons/fa";
import {
	type Component,
	createEffect,
	createMemo,
	createSignal,
	For,
	Match,
	on,
	onMount,
	Show,
	Switch,
} from "solid-js";
import ImageLoader from "../components/ImageLoader";
import LottiePlayerMotion from "../components/LottiePlayerMotion";
import Tabbar from "../components/Tabbar";
import ThemePreview from "../components/ThemePreview";
import { useTranslation } from "../contexts/TranslationContext";
import { TGS } from "../utils/animations";
import { requestAPI } from "../utils/api";
import { setModals } from "../utils/modal";
import { formatNumbersInString } from "../utils/number";
import { setSettings, settings } from "../utils/settings";
import { signals } from "../utils/signals";
import { getSymbolSVGString } from "../utils/symbols";
import { ContestThemeBackdrops } from "../utils/themes";

const PageHome: Component = () => {
	const navigate = useNavigate();

	if (!store.token) {
		navigate("/splash", {
			replace: true,
		});
		return;
	}

	const { t } = useTranslation();

	const fetchContents = async () => {
		const request = await requestAPI("/contests/my");

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
			await fetchContents();
		}
	});

	const SectionContestsLoading = () => {
		return <div id="container-home-contests-loading">Loading</div>;
	};

	const SectionContestsEmpty: Component<{
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

	const SectionContests = () => {
		const [tabbar, setTabbar] = createSignal(settings.tabs.home.myContests);

		createEffect(
			on(tabbar, () => {
				setSettings("tabs", "home", "myContests", tabbar());
			}),
		);

		const contestsJoined = createMemo(() =>
			store.contests.my!.filter(() => false),
		);

		const contestsCreated = createMemo(() =>
			store.contests.my!.filter((contest) => contest.role === "owner"),
		);

		const ListContests: Component<{ contests: Contest[] }> = (props) => {
			return (
				<div class="container-list-contests">
					<For each={props.contests}>
						{(contest) => {
							const { backdrop, symbol } = {
								backdrop: contest.theme?.backdrop,
								symbol: {
									id: contest.theme?.symbol,
									component: contest.theme?.symbol
										? getSymbolSVGString(contest.theme?.symbol)
										: "",
								},
							};

							return (
								<A href={`/contest/${contest.slug}`}>
									<Switch
										fallback={
											<div class="empty">
												<AiOutlineTrophy />
											</div>
										}
									>
										<Match when={contest.image}>
											<ImageLoader
												src={`${import.meta.env.VITE_BACKEND_BASE_URL}/images/${contest.image}`}
											/>
										</Match>

										<Match when={backdrop && symbol}>
											<ThemePreview
												backdrop={
													ContestThemeBackdrops.find((i) => i.id === backdrop)!
												}
												symbol={symbol as any}
												layers={[
													{
														count: 1,
														alpha: 1,
														distance: 0,
														size: 24,
													},
												]}
											/>
										</Match>
									</Switch>

									<div>
										<h2>{contest.title}</h2>

										<span>{formatNumbersInString(contest.prize ?? "")}</span>
									</div>

									<div>
										<span>{dayjs.unix(contest.date_end).format("MMM D")}</span>

										<Show when={contest.role}>
											<span class={contest.role}>
												{t(`general.roles.${contest.role}` as any)}
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
				await fetchContents();
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

					<FaSolidPlus onClick={onClickButtonCreate} />
				</header>

				<Show when={store.contests?.my} fallback={<SectionContestsLoading />}>
					<SectionContests />
				</Show>
			</div>
		</div>
	);
};

export default PageHome;
