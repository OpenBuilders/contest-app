import { useParams } from "@solidjs/router";
import "./Submissions.scss";
import { trackDeep } from "@solid-primitives/deep";
import { TbSortAscending, TbSortDescending } from "solid-icons/tb";
import {
	type Component,
	createEffect,
	createSignal,
	For,
	Match,
	onCleanup,
	onMount,
	Show,
	Switch,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import { Avatar, AvatarAlias } from "../../../components/Avatar";
import BackButton from "../../../components/BackButton";
import ButtonArray from "../../../components/ButtonArray";
import LottiePlayerMotion from "../../../components/LottiePlayerMotion";
import { SVGSymbol } from "../../../components/SVG";
import { useTranslation } from "../../../contexts/TranslationContext";
import { TGS } from "../../../utils/animations";
import { requestAPI } from "../../../utils/api";
import { setModals } from "../../../utils/modal";
import { navigator } from "../../../utils/navigator";
import { type AnnotatedSubmission, store } from "../../../utils/store";
import {
	invokeHapticFeedbackImpact,
	invokeHapticFeedbackNotification,
} from "../../../utils/telegram";

export const [data, setData] = createStore<{
	submissions?: AnnotatedSubmission[];
}>({});

export const SectionSubmissionsEmpty = () => {
	const { t } = useTranslation();

	return (
		<div id="container-contest-submissions-empty">
			<LottiePlayerMotion
				src={TGS.duckCraft.url}
				outline={TGS.duckCraft.outline}
				autoplay
				playOnClick
			/>

			<span class="text-secondary">
				{t("pages.contest.manage.submissions.empty.text")}
			</span>
		</div>
	);
};

const PageContestManageSubmissions: Component = () => {
	const params = useParams();
	const { t } = useTranslation();

	setData({
		submissions: undefined,
	});

	if (!store.token) {
		navigator.go("/splash", {
			params: {
				from: `/contest/${params.slug}/manage/submissions`,
				haptic: false,
			},
		});
		return;
	}

	const [sort, setSort] = createSignal<"date" | "score">("date");

	createEffect(() => {
		trackDeep(data);

		setData(
			produce((data) => {
				if (sort() === "score") {
					data.submissions?.sort(
						(a, b) =>
							b.submission.likes -
							b.submission.dislikes -
							(a.submission.likes - a.submission.dislikes),
					);
				} else {
					data.submissions?.sort((a, b) => b.submission.id - a.submission.id);
				}
			}),
		);
	});

	const onClickSort = () => {
		invokeHapticFeedbackImpact("medium");
		setSort(sort() === "date" ? "score" : "date");
	};

	const onBackButton = () => {
		navigator.go(`/contest/${params.slug}/manage`, {
			params: {
				theme: false,
			},
		});
	};

	const fetchData = async () => {
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
			}
		}
	};

	onMount(async () => {
		if (!data.submissions) {
			await fetchData();
		}

		if (data.submissions && params.id) {
			const submission = data.submissions.find(
				(item) => item.submission.id === Number.parseInt(params.id),
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

	onCleanup(() => {
		setData({
			submissions: undefined,
		});
	});

	const SectionSubmissionsLoading = () => {
		return (
			<div
				id="container-contest-submissions-loading"
				class="shimmer-section-bg"
			>
				<For each={Array.from(new Array(8))}>
					{() => (
						<div>
							<div class="shimmer"></div>

							<div>
								<span class="shimmer"></span>

								<div>
									<span class="shimmer"></span>
									<span class="shimmer"></span>
								</div>
							</div>

							<span class="shimmer"></span>
						</div>
					)}
				</For>
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

		const onClickSubmissionEvent = (e: MouseEvent) => {
			const id = (e.currentTarget as HTMLElement).getAttribute(
				"data-submission-id",
			);
			if (!id) return;
			const submission_id = Number.parseInt(id);
			const submission = data.submissions?.find(
				(i) => i.submission.id === submission_id,
			);
			if (!submission) return;
			onClickSubmission(submission);
		};

		return (
			<div id="container-contest-submissions" class="shimmer-section-bg">
				<For each={data.submissions}>
					{(submission) => {
						const fullname = submission.submission.user_id
							? [
									submission.submission.first_name,
									submission.submission.last_name,
								]
									.filter(Boolean)
									.join(" ")
							: [
									submission.submission.anonymous_profile[1][1],
									submission.submission.anonymous_profile[2][1],
								]
									.filter(Boolean)
									.join(" ");

						return (
							<div
								onClick={onClickSubmissionEvent}
								data-submission-id={submission.submission.id}
							>
								<Show
									when={submission.submission.user_id}
									fallback={
										<AvatarAlias
											colorIndex={submission.submission.anonymous_profile[0]}
											symbol={submission.submission.anonymous_profile[2][0]}
										/>
									}
								>
									<Avatar
										fullname={fullname}
										peerId={submission.submission.user_id}
										src={submission.submission.profile_photo}
									/>
								</Show>

								<div>
									<span>{fullname}</span>

									<ul>
										<li
											classList={{
												fill: submission.metadata.liked_by_viewer,
												empty: !submission.metadata.liked_by_viewer,
											}}
										>
											<SVGSymbol
												id={
													submission.metadata.liked_by_viewer
														? "AiFillLike"
														: "AiOutlineLike"
												}
											/>
											<span>{submission.submission.likes}</span>
										</li>

										<li
											classList={{
												fill: submission.metadata.disliked_by_viewer,
												empty: !submission.metadata.disliked_by_viewer,
											}}
										>
											<SVGSymbol
												id={
													submission.metadata.disliked_by_viewer
														? "AiFillDislike"
														: "AiOutlineDislike"
												}
											/>
											<span>{submission.submission.dislikes}</span>
										</li>
									</ul>
								</div>

								<SVGSymbol id="FaSolidChevronRight" />
							</div>
						);
					}}
				</For>
			</div>
		);
	};

	return (
		<>
			<div id="container-page-contest-manage-submissions" class="page">
				<div>
					<header>
						<h1>{t("pages.contest.manage.submissions.title")}</h1>

						<Show when={(data.submissions?.length ?? 0) > 0}>
							<ButtonArray
								items={[
									{
										component: () => (
											<Show
												when={sort() === "date"}
												fallback={<TbSortAscending />}
											>
												<TbSortDescending />
											</Show>
										),
										fontSize: "1.3125rem",
										class: "clickable",
										onClick: onClickSort,
									},
								]}
							/>
						</Show>
					</header>

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
			</div>

			<BackButton onClick={onBackButton} />
		</>
	);
};

export default PageContestManageSubmissions;
