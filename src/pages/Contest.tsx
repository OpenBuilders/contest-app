import "./Contest.scss";
import { useParams } from "@solidjs/router";
import dayjs from "dayjs";
import { FaSolidCircleExclamation } from "solid-icons/fa";
import { OcBookmark2, OcBookmarkfill3 } from "solid-icons/oc";
import { TbSettings, TbShare3 } from "solid-icons/tb";
import {
	batch,
	type Component,
	createEffect,
	createMemo,
	createSignal,
	For,
	Match,
	onCleanup,
	on as onEffect,
	onMount,
	Show,
	Switch,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import { Avatar, AvatarAlias } from "../components/Avatar";
import Award from "../components/Award";
import BackButton from "../components/BackButton";
import ButtonArray, { type ButtonArrayItem } from "../components/ButtonArray";
import CircularIconPattern from "../components/CircularIconPattern";
import CustomMainButton from "../components/CustomMainButton";
import ImageLoader from "../components/ImageLoader";
import RichText from "../components/RichText";
import { Section, SectionList } from "../components/Section";
import { SVGSymbol } from "../components/SVG";
import Tabbar, { type TabbarItem } from "../components/Tabbar";
import { toast } from "../components/Toast";
import { useTranslation } from "../contexts/TranslationContext";
import { requestAPI } from "../utils/api";
import { Color } from "../utils/colors";
import { initializeSortable } from "../utils/lazy";
import { setModals } from "../utils/modal";
import { navigator } from "../utils/navigator";
import { formatNumbersInString } from "../utils/number";
import { signals } from "../utils/signals";
import {
	type AnnotatedContest,
	type AnnotatedSubmission,
	type Result,
	setStore,
	store,
} from "../utils/store";
import { stripURLProtocol, truncateMiddle } from "../utils/string";
import { getSymbolSVGString } from "../utils/symbols";
import {
	invokeHapticFeedbackImpact,
	invokeHapticFeedbackNotification,
	isVersionAtLeast,
	postEvent,
	setHeaderColor,
} from "../utils/telegram";
import {
	ContestThemeBackdrops,
	type ContestThemeSymbol,
	disableThemeSync,
} from "../utils/themes";
import { SectionSubmissionsEmpty } from "./Contest/Manage/Submissions";

export const [data, setData] = createStore<{
	submissions?: AnnotatedSubmission[];
}>({});

const PageContest: Component = () => {
	const { t, td } = useTranslation();

	const params = useParams();

	const [contest, setContest] = createStore<Partial<AnnotatedContest>>({});

	let header: HTMLElement | undefined;

	const [patternSize, setPatternSize] = createStore<{
		width?: number;
		height?: number;
	}>();

	setData({
		submissions: undefined,
	});

	if (!store.token) {
		navigator.go(`/splash`, {
			params: {
				from: `/contest/${params.slug}`,
				haptic: false,
				fromParams: {
					theme: {
						header: false,
					},
				},
			},
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

	createEffect(
		onEffect(
			() => signals.fetchContest,
			async () => {
				setContest({});
				await fetchContest();
			},
			{
				defer: true,
			},
		),
	);

	const handleTheme = () => {
		if (contest.contest?.theme?.backdrop) {
			setHeaderColor(
				ContestThemeBackdrops.find(
					(i) => i.id === contest.contest!.theme!.backdrop!,
				)!.colors.edge as any,
			);
		} else {
			const color = new Color(
				getComputedStyle(document.body as HTMLElement).getPropertyValue(
					"--bg-color",
				),
			);

			setHeaderColor(color.toHex() as any);
		}
	};

	onMount(async () => {
		disableThemeSync();

		if (!contest.contest) {
			await fetchContest();
		}

		handleTheme();

		setTimeout(() => {
			if (!header) return;
			setPatternSize({
				height: header.clientHeight,
				width: header.clientWidth,
			});
		});

		setTimeout(() => {
			initializeSortable();
		});
	});

	const fetchContest = async () => {
		const request = await requestAPI(`/contest/${params.slug}`, {}, "GET");

		if (request) {
			const { result } = request;

			setContest({
				contest: result.contest,
				metadata: result.metadata,
			});

			return;
		}

		toast({
			icon: FaSolidCircleExclamation,
			text: t("errors.fetch"),
		});
		navigator.go("/");
	};

	const onBackButton = () => {
		setModals(
			"participate",
			produce((data) => {
				data.contest = undefined;
				data.metadata = undefined;
				data.open = false;
			}),
		);

		if (navigator.isBackable()) {
			navigator.back();
		} else {
			navigator.go("/");
		}
	};

	const ContestLoading = () => {
		return (
			<div id="container-contest-shimmer">
				<header class="shimmer"></header>

				<div>
					{/*<ul>
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
					</ul>*/}

					<div>
						<span class="shimmer"></span>
						<div class="shimmer"></div>
					</div>
				</div>

				<footer>
					<span class="shimmer"></span>
				</footer>
			</div>
		);
	};

	const Contest = () => {
		const [submissionsCount, setSubmissionsCount] = createSignal<
			string | undefined
		>(undefined);

		const ContestHeader = () => {
			const [bookmarkProgress, setBookmarkProgress] = createSignal(false);

			const onClickBookmark = async () => {
				if (bookmarkProgress()) return;

				batch(() => {
					setBookmarkProgress(true);
					setContest("metadata", "bookmarked", !contest.metadata?.bookmarked);
				});

				invokeHapticFeedbackImpact("soft");

				const request = await requestAPI(
					`/contest/${contest.contest?.slug}/bookmark`,
				);

				if (request) {
					const { result } = request;

					invokeHapticFeedbackNotification("success");

					batch(() => {
						setContest("metadata", "bookmarked", result.bookmarked);
						setBookmarkProgress(false);
						setStore("contests", {
							gallery: undefined,
							my: undefined,
						});
					});
				} else {
					setBookmarkProgress(false);
					navigator.go(`/contest/${params.slug}/manage`, {
						params: {
							theme: {
								header: false,
							},
						},
					});
				}
			};

			const onClickShare = () => {
				invokeHapticFeedbackImpact("light");

				if (isVersionAtLeast("6.1")) {
					postEvent("web_app_open_tg_link", {
						path_full: `/share/url?url=https://t.me/${import.meta.env.VITE_BOT_USERNAME}/${import.meta.env.VITE_MINIAPP_SLUG}?startapp=contest-${params.slug}&text=${encodeURI(
							td("pages.contest.header.share.text", {
								name: contest.contest!.title,
							}),
						)}`,
					});
				}
			};

			const onClickSettings = () => {
				navigator.go(`/contest/${params.slug}/manage/settings`);
			};

			const headerMenuButtons: ButtonArrayItem[] = [
				{
					component: TbShare3,
					fontSize: "1.625rem",
					class: "clickable",
					onClick: onClickShare,
				},
			];

			if (contest.metadata?.role === "owner") {
				headerMenuButtons.unshift({
					component: TbSettings,
					fontSize: "1.625rem",
					class: "clickable",
					onClick: onClickSettings,
				});
			} else {
				headerMenuButtons.unshift({
					component: () => (
						<Show
							when={contest.metadata?.bookmarked}
							fallback={<OcBookmark2 />}
						>
							<OcBookmarkfill3 />
						</Show>
					),
					fontSize: "1.5rem",
					class: "clickable",
					onClick: onClickBookmark,
				});
			}

			return (
				<header
					ref={header}
					classList={{
						theme: theme() !== undefined,
						empty: theme() === undefined,
					}}
				>
					<Show
						when={theme()?.symbol && patternSize.width && patternSize.height}
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
									alpha: 0.325,
									distance: patternSize.height! / 3.5,
									size: patternSize.height! / 10,
								},
								{
									count: 9,
									alpha: 0.125,
									distance: patternSize.height! / 2,
									size: patternSize.height! / 15,
								},
								{
									count: 14,
									alpha: 0.0625,
									distance: patternSize.height! / 1.5,
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
											<SVGSymbol id="AiOutlineTrophy" class="empty" />
										</div>
									}
								>
									<div innerHTML={theme()!.symbol.component as string}></div>
								</Show>
							</div>
						}
					>
						<ImageLoader
							src={`${import.meta.env.VITE_BACKEND_BASE_URL}/images/${contest.contest!.image!}`}
						/>
					</Show>

					<ButtonArray items={headerMenuButtons} />

					<h1>
						{contest.contest?.title}
						<Show when={contest.contest?.verified}>
							<SVGSymbol id="VsVerifiedFilled" />
						</Show>
					</h1>

					<ContestMetadata />
				</header>
			);
		};

		const ContestMetadata = () => {
			const winnersCount = createMemo(() => {
				if (contest.contest?.results) {
					return contest.contest.results.reduce(
						(prev, item) => prev + item.submissions.length,
						0,
					);
				}

				return 0;
			});

			return (
				<ul id="container-contest-metadata">
					<Switch
						fallback={
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
						}
					>
						<Match when={contest.contest?.announced}>
							<li>
								<span>{t("pages.contest.header.results.label")}</span>
								<div>
									<span>{winnersCount()}</span>
									<span>{t("pages.contest.header.results.winners")}</span>
								</div>
							</li>
						</Match>

						<Match when={Date.now() / 1000 >= contest.contest?.date_end!}>
							<li>
								<span>{t("pages.contest.header.status.label")}</span>
								<div>
									<span>{t("pages.contest.header.status.closed")}</span>
								</div>
							</li>
						</Match>
					</Switch>

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
			);
		};

		const ContestInfo = () => {
			const onClickParticipate = () => {
				setModals(
					"participate",
					produce((data) => {
						data.contest = contest.contest as any;
						data.metadata = contest.metadata;
						data.open = true;
					}),
				);
			};

			return (
				<div id="container-contest-info">
					{/*<ContestMetadata />*/}

					<Section
						class="section-content"
						title={t("pages.contest.description.title")}
					>
						<RichText
							content={
								contest.contest?.description ||
								t("pages.contest.description.empty")
							}
						/>
					</Section>

					<footer>
						<Switch>
							<Match
								when={
									contest.metadata?.role === "participant" &&
									!contest.contest?.announced &&
									Date.now() / 1000 < contest.contest?.date_end!
								}
							>
								<p class="text-hint">
									{t("pages.contest.footer.submitted.text")}
								</p>
							</Match>

							<Match
								when={
									contest.metadata?.role === undefined &&
									!contest.contest?.announced &&
									Date.now() / 1000 < contest.contest?.date_end!
								}
							>
								<CustomMainButton
									text={td("pages.contest.footer.participate.text", {
										price: contest.contest?.fee
											? `${formatNumbersInString(contest.contest.fee.toString())} TON`
											: t("pages.contest.header.entry.free"),
									})}
									onClick={onClickParticipate}
									backgroundColor="var(--theme-bg-edge)"
								/>
							</Match>

							<Match
								when={
									!contest.contest?.announced &&
									Date.now() / 1000 >= contest.contest?.date_end!
								}
							>
								<p class="text-hint">{t("pages.contest.footer.closed.text")}</p>
							</Match>
						</Switch>
					</footer>
				</div>
			);
		};

		const ContestAdminSubmissions = () => {
			const submissions = createMemo(() => {
				if (!data.submissions) return undefined;

				const submissions: { [key: number]: AnnotatedSubmission[] } = {};

				for (const submission of data.submissions) {
					const day =
						Math.floor(
							new Date(submission.submission.created_at!).getTime() /
								1000 /
								86400,
						) * 86400;

					if (!(day in submissions)) {
						submissions[day] = [];
					}

					submissions[day].push(submission);
				}

				return Object.fromEntries(
					Object.keys(submissions)
						.map(Number)
						.sort((a, b) => a - b)
						.map((key) => [key, submissions[key]]),
				);
			});

			const fetchSubmissions = async () => {
				const request = await requestAPI(
					`/contest/${params.slug}/submissions`,
					{},
					"GET",
				);

				if (request) {
					const { result, status } = request;

					if (status === "success") {
						invokeHapticFeedbackNotification("success");

						setData({
							submissions: result.submissions,
						});

						setSubmissionsCount(data.submissions?.length.toString());

						return;
					}
				}

				toast({
					icon: FaSolidCircleExclamation,
					text: t("errors.fetch"),
				});

				navigator.go(`/contest/${params.slug}`, {
					params: {
						theme: {
							header: false,
						},
					},
				});
			};

			onCleanup(() => {
				setData({
					submissions: undefined,
				});
			});

			onMount(async () => {
				if (!data.submissions) {
					await fetchSubmissions();
				}

				if (data.submissions && params.id) {
					const submission = data.submissions.find(
						(item) => item.submission.id === Number.parseInt(params.id, 10),
					);

					if (submission) {
						setModals(
							"submission",
							produce((data) => {
								data.submission = submission;
								data.slug = params.slug;
								data.open = true;
							}),
						);
					}
				}
			});

			const SectionSubmissionsLoading = () => {
				return (
					<div
						id="container-contest-admin-submissions-list-loading"
						class="shimmer-section-bg"
					>
						<div>
							<For each={Array.from(new Array(2))}>
								{() => (
									<div>
										<span class="shimmer"></span>

										<SectionList
											class="container-submission-entries-shimmer"
											items={Array.from(new Array(3)).map(() => ({
												label: () => (
													<>
														<span class="shimmer"></span>
														<span class="shimmer"></span>
													</>
												),
												prepend: () => <div class="shimmer"></div>,
												placeholder: () => (
													<ul>
														<li class="shimmer"></li>
														<li class="shimmer"></li>
													</ul>
												),
											}))}
										/>
									</div>
								)}
							</For>
						</div>

						<Show when={contest.metadata?.role === "owner"}>
							<span class="shimmer"></span>
						</Show>
					</div>
				);
			};

			const SectionSubmissions = () => {
				const onClickSubmission = (submission: AnnotatedSubmission) => {
					setModals(
						"submission",
						produce((data) => {
							data.slug = params.slug;
							data.submission = submission;
							data.open = true;
						}),
					);
				};

				onMount(() => {
					if (data.submissions && params.extra) {
						const submission = data.submissions.find(
							(item) => item.submission.id === Number.parseInt(params.extra),
						);

						if (submission) {
							setModals(
								"submission",
								produce((data) => {
									data.submission = submission;
									data.slug = params.slug;
									data.open = true;
								}),
							);
						}
					}
				});

				return (
					<>
						<div
							id="container-contest-admin-submissions-list"
							class="shimmer-section-bg"
						>
							<For each={Object.entries(submissions()!).reverse()}>
								{(entry) => {
									const [timeString, items] = entry;
									const time = Number.parseInt(timeString, 10);

									const today = Math.floor(Date.now() / 1000 / 86400) * 86400;

									let dateString = dayjs(time * 1000).format("MMM D");

									if (time === today) {
										dateString = t("pages.contest.admin.submissions.today");
									}

									return (
										<SectionList
											class="container-submission-entries"
											title={dateString}
											items={items.map((item) => {
												const fullname = item.submission.user_id
													? [
															item.submission.first_name,
															item.submission.last_name,
														]
															.filter(Boolean)
															.join(" ")
													: [
															item.submission.anonymous_profile[1][1],
															item.submission.anonymous_profile[2][1],
														]
															.filter(Boolean)
															.join(" ");

												return {
													onClick: () => {
														onClickSubmission(item);
													},
													clickable: true,
													label: () => (
														<>
															<span>{fullname}</span>
															<span>
																{truncateMiddle(
																	stripURLProtocol(
																		item.submission.submission.link,
																	),
																)}
															</span>
														</>
													),
													prepend: () => (
														<Show
															when={item.submission.user_id}
															fallback={
																<AvatarAlias
																	colorIndex={
																		item.submission.anonymous_profile[0]
																	}
																	symbol={
																		item.submission.anonymous_profile[2][0]
																	}
																/>
															}
														>
															<Avatar
																fullname={fullname}
																peerId={item.submission.user_id}
																src={item.submission.profile_photo}
															/>
														</Show>
													),
													placeholder: () => (
														<ul>
															<li
																classList={{
																	fill: item.metadata.liked_by_viewer,
																	empty: !item.metadata.liked_by_viewer,
																}}
															>
																<SVGSymbol id="HiSolidHandThumbUp" />
																<span>{item.submission.likes}</span>
															</li>

															<li
																classList={{
																	fill: item.metadata.disliked_by_viewer,
																	empty: !item.metadata.disliked_by_viewer,
																}}
															>
																<SVGSymbol id="HiSolidHandThumbDown" />
																<span>{item.submission.dislikes}</span>
															</li>
														</ul>
													),
												};
											})}
										/>
									);
								}}
							</For>
						</div>

						<Switch>
							<Match when={contest.metadata?.role === "owner"}>
								<footer>
									<CustomMainButton
										text={
											contest.contest?.announced
												? t("pages.contest.footer.placements.announced")
												: t("pages.contest.footer.placements.unannounced")
										}
										onClick={() => {
											navigator.go(`/contest/${params.slug}/manage/results`);
										}}
										backgroundColor="var(--theme-bg-edge)"
									/>
								</footer>
							</Match>
						</Switch>
					</>
				);
			};

			return (
				<div id="container-contest-admin-submissions">
					<Switch>
						<Match when={!data.submissions}>
							<SectionSubmissionsLoading />
						</Match>

						<Match when={data.submissions?.length === 0}>
							<SectionSubmissionsEmpty />
						</Match>

						<Match when={(data.submissions?.length ?? 0) > 0}>
							<SectionSubmissions />
						</Match>
					</Switch>
				</div>
			);
		};

		const ContestAdminView = () => {
			const items: TabbarItem[] = [
				{
					slug: "submissions",
					title: t("pages.contest.admin.submissions.title"),
					subtitle: submissionsCount,
					component: ContestAdminSubmissions,
				},
				{
					slug: "about",
					title: t("pages.contest.admin.about.title"),
					component: () => (
						<div class="container-section-about">
							<Section
								class="section-content"
								title={t("pages.contest.description.title")}
							>
								<RichText
									content={
										contest.contest?.description ||
										t("pages.contest.description.empty")
									}
								/>
							</Section>
						</div>
					),
				},
			];

			if (contest.contest?.announced) {
				items.unshift({
					title: t("pages.contest.admin.results.title"),
					slug: "results",
					component: ContestResults,
				});
			}

			const [tab, setTab] = createSignal(
				params.state ??
					(contest.contest?.announced ? "results" : "submissions"),
			);

			return (
				<div id="container-contest-view-admin">
					{/*<ContestMetadata />*/}

					<Tabbar
						items={items}
						value={tab()}
						setValue={setTab}
						mode="segmented"
						gap={16}
					/>
				</div>
			);
		};

		const ContestAnnouncedView = () => {
			const items: TabbarItem[] = [
				{
					title: t("pages.contest.admin.results.title"),
					slug: "results",
					component: ContestResults,
				},
				{
					slug: "about",
					title: t("pages.contest.admin.about.title"),
					component: () => (
						<div class="container-section-about">
							<Section
								class="section-content"
								title={t("pages.contest.description.title")}
							>
								<RichText
									content={
										contest.contest?.description ||
										t("pages.contest.description.empty")
									}
								/>
							</Section>
						</div>
					),
				},
			];

			if (contest.contest?.announced) {
				items.unshift();
			}

			const [tab, setTab] = createSignal(params.state ?? "results");

			return (
				<div id="container-contest-results">
					{/*<ContestMetadata />*/}

					<Tabbar
						items={items}
						value={tab()}
						setValue={setTab}
						mode="segmented"
						gap={16}
					/>
				</div>
			);
		};

		const ContestResults = () => {
			const ContestResultEntry: Component<{ placement: Result }> = (props) => {
				return (
					<SectionList
						title={props.placement.name}
						class="container-result-entries"
						items={
							props.placement.submissions.length > 0
								? props.placement.submissions.map((entry) => {
										const fullname = entry.user_id
											? [entry.first_name, entry.last_name]
													.filter(Boolean)
													.join(" ")
											: [
													entry.anonymous_profile[1][1],
													entry.anonymous_profile[2][1],
												]
													.filter(Boolean)
													.join(" ");

										return {
											label: () => (
												<>
													<span>{fullname}</span>
													<Show when={entry.self}>
														<span class="self">
															{t("pages.contest.results.self")}
														</span>
													</Show>
												</>
											),
											placeholder: () => (
												<span>
													{formatNumbersInString(props.placement.prize ?? "")}
												</span>
											),
											prepend: () => (
												<Show
													when={entry.user_id}
													fallback={
														<AvatarAlias
															colorIndex={entry.anonymous_profile[0]}
															symbol={entry.anonymous_profile[2][0]}
														/>
													}
												>
													<Avatar
														fullname={fullname}
														peerId={entry.user_id}
														src={entry.profile_photo}
													/>
												</Show>
											),
										};
									})
								: [
										{
											label: t("pages.contest.results.empty"),
										},
									]
						}
					/>
				);
			};

			return (
				<div id="container-contest-results-items">
					<div>
						<For each={contest.contest?.results}>
							{(placement) => <ContestResultEntry placement={placement} />}
						</For>
					</div>
				</div>
			);
		};

		return (
			<div
				id="container-contest"
				classList={{
					theme: theme() !== undefined,
					empty: theme() === undefined,
				}}
				style={{
					"--theme-bg": theme()
						? `radial-gradient(${theme()!.backdrop.colors.center}, ${theme()!.backdrop.colors.edge})`
						: "var(--bg-color)",
					"--theme-bg-edge": theme()
						? theme()!.backdrop.colors.edge
						: "var(--accent)",
					"--theme-bg-center": theme()
						? theme()!.backdrop.colors.center
						: "var(--accent)",
					"--theme-pattern": theme()
						? theme()!.backdrop.colors.pattern
						: "white",
					"--theme-text": theme()
						? theme()!.backdrop.colors.text
						: "var(--text-color)",
				}}
			>
				<ContestHeader />

				<Switch fallback={<ContestInfo />}>
					<Match
						when={["owner", "moderator"].includes(contest.metadata?.role ?? "")}
					>
						<ContestAdminView />
					</Match>

					<Match when={contest.contest?.announced}>
						<ContestAnnouncedView />
					</Match>
				</Switch>
			</div>
		);
	};

	return (
		<>
			<div id="container-page-contest" class="page">
				<Show when={contest.contest} fallback={<ContestLoading />}>
					<Contest />
				</Show>
			</div>

			<BackButton onClick={onBackButton} />
		</>
	);
};

export default PageContest;
