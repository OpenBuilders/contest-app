import { useNavigate, useParams } from "@solidjs/router";
import "./Submissions.scss";
import { TbSortAscending, TbSortDescending } from "solid-icons/tb";
import {
	type Component,
	createMemo,
	createSignal,
	For,
	Match,
	onMount,
	Show,
	Switch,
} from "solid-js";
import { createStore } from "solid-js/store";
import { Avatar, AvatarAlias } from "../../../components/Avatar";
import BackButton from "../../../components/BackButton";
import ButtonArray from "../../../components/ButtonArray";
import LottiePlayerMotion from "../../../components/LottiePlayerMotion";
import { SVGSymbol } from "../../../components/SVG";
import { useTranslation } from "../../../contexts/TranslationContext";
import { TGS } from "../../../utils/animations";
import { requestAPI } from "../../../utils/api";
import { type AnnotatedSubmission, store } from "../../../utils/store";
import { invokeHapticFeedbackImpact } from "../../../utils/telegram";

const PageContestManageSubmissions: Component = () => {
	const navigate = useNavigate();
	const params = useParams();
	const { t } = useTranslation();

	if (!store.token) {
		navigate(`/splash/contest-${params.slug}-manage-submissions`, {
			replace: true,
		});
		return;
	}

	const [sort, setSort] = createSignal<"date" | "score">("date");

	const [data, setData] = createStore<{
		submissions?: AnnotatedSubmission[];
	}>({});

	const submissions = createMemo(() => {
		if (sort() === "score") {
			return data.submissions?.sort(
				(a, b) => a.submission.likes - b.submission.likes,
			);
		}

		return data.submissions;
	});

	const onClickSort = () => {
		invokeHapticFeedbackImpact("medium");
		setSort(sort() === "date" ? "score" : "date");
	};

	const onBackButton = () => {
		navigate(`/contest/${params.slug}/manage`, {
			replace: true,
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
				setData({
					submissions: result.submissions,
				});
			}
		}
	};

	onMount(async () => {
		invokeHapticFeedbackImpact("light");

		if (!data.submissions) {
			await fetchData();
		}
	});

	const SectionSubmissionsLoading = () => {
		return (
			<div id="container-contest-submissions-loading">
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

	const SectionSubmissionsEmpty = () => {
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

	const SectionSubmissions = () => {
		return (
			<div id="container-contest-submissions">
				<For each={submissions()}>
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
							<div>
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
											class={
												submission.metadata.liked_by_viewer ? "fill" : "empty"
											}
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
											class={
												submission.metadata.disliked_by_viewer
													? "fill"
													: "empty"
											}
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

						<Show when={(submissions()?.length ?? 0) > 0}>
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
