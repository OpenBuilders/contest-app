import "./Submission.scss";
import dayjs from "dayjs";
import { TbOutlineShare3 } from "solid-icons/tb";
import {
	type Component,
	createMemo,
	createSignal,
	onMount,
	Show,
} from "solid-js";
import { produce, reconcile } from "solid-js/store";
import { Avatar, AvatarAlias } from "../components/Avatar";
import ButtonArray from "../components/ButtonArray";
import Counter from "../components/Counter";
import Modal from "../components/Modal";
import RichText from "../components/RichText";
import { SectionList } from "../components/Section";
import { SVGSymbol } from "../components/SVG";
import { useTranslation } from "../contexts/TranslationContext";
import { setData } from "../pages/Contest";
import { requestAPI } from "../utils/api";
import { cloneObject } from "../utils/general";
import { hideKeyboardOnEnter } from "../utils/input";
import { modals, setModals } from "../utils/modal";
import { navigator } from "../utils/navigator";
import {
	invokeHapticFeedbackImpact,
	invokeHapticFeedbackNotification,
	isVersionAtLeast,
	lp,
	postEvent,
} from "../utils/telegram";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const VoteIcons = {
	like: "thumb-up",
	dislike: "thumb-down",
	raise: "fire",
};

const ModalSubmission: Component = () => {
	const { t, td } = useTranslation();

	const onClose = () => {
		setModals(
			"submission",
			produce((data) => {
				data.submission = undefined;
				data.open = false;
			}),
		);
	};

	if (!(modals.submission.submission && modals.submission.slug)) {
		onClose();
		return;
	}

	const [processing, setProcessing] = createSignal<
		"like" | "dislike" | "raise" | boolean
	>(false);

	const [comment, setComment] = createSignal("");

	onMount(() => {
		invokeHapticFeedbackImpact("soft");

		navigator.modal(() => {
			invokeHapticFeedbackImpact("soft");
			onClose();
		});

		for (const item of [
			...modals.submission.submission!.submission.liked_by,
			...modals.submission.submission!.submission.disliked_by,
			...modals.submission.submission!.submission.raised_by,
		]) {
			if (
				Number.parseInt(item.user_id as any, 10) === lp?.tgWebAppData?.user?.id
			) {
				setComment(item.comment ?? "");
			}
		}
	});

	const fullname = modals.submission.submission.submission.user_id
		? [
				modals.submission.submission.submission.first_name,
				modals.submission.submission.submission.last_name,
			]
				.filter(Boolean)
				.join(" ")
		: [
				modals.submission.submission.submission.anonymous_profile[1][1],
				modals.submission.submission.submission.anonymous_profile[2][1],
			]
				.filter(Boolean)
				.join(" ");

	const onClickAction = async (type: "like" | "dislike" | "raise") => {
		if (processing()) return;
		setProcessing(type);
		invokeHapticFeedbackImpact("soft");

		const currentSubmission = cloneObject(modals.submission.submission!);

		setData(
			"submissions",
			produce((data) => {
				const item = data?.find(
					(item) =>
						item.submission.id === modals.submission.submission?.submission.id,
				);

				if (item) {
					if (type === "like") {
						if (item.metadata.liked_by_viewer) {
							item.submission.likes--;
							item.metadata.liked_by_viewer = false;
						} else {
							item.submission.likes++;
							item.metadata.liked_by_viewer = true;
						}

						if (item.metadata.disliked_by_viewer) {
							item.metadata.disliked_by_viewer = false;
							item.submission.dislikes--;
						}

						if (item.metadata.raised_by_viewer) {
							item.metadata.raised_by_viewer = false;
							item.submission.raises--;
						}
					} else if (type === "dislike") {
						if (item.metadata.disliked_by_viewer) {
							item.submission.dislikes--;
							item.metadata.disliked_by_viewer = false;
						} else {
							item.submission.dislikes++;
							item.metadata.disliked_by_viewer = true;
						}

						if (item.metadata.liked_by_viewer) {
							item.metadata.liked_by_viewer = false;
							item.submission.likes--;
						}

						if (item.metadata.raised_by_viewer) {
							item.metadata.raised_by_viewer = false;
							item.submission.raises--;
						}
					} else if (type === "raise") {
						if (item.metadata.raised_by_viewer) {
							item.submission.raises--;
							item.metadata.raised_by_viewer = false;
						} else {
							item.submission.raises++;
							item.metadata.raised_by_viewer = true;
						}

						if (item.metadata.liked_by_viewer) {
							item.metadata.liked_by_viewer = false;
							item.submission.likes--;
						}

						if (item.metadata.disliked_by_viewer) {
							item.metadata.disliked_by_viewer = false;
							item.submission.dislikes--;
						}
					}
				}
			}),
		);

		const request = await requestAPI(
			`/contest/${modals.submission.slug}/submissions/${modals.submission.submission?.submission.id}/vote`,
			{
				type,
				comment: comment(),
			},
			"POST",
		);

		if (request) {
			const { result, status } = request;

			if (status === "success") {
				invokeHapticFeedbackNotification("success");

				setData("submissions", reconcile(result.submissions));
			}
		} else {
			setData(
				"submissions",
				produce((data) => {
					const item = data?.find(
						(item) =>
							item.submission.id ===
							modals.submission.submission?.submission.id,
					);

					if (item) {
						item.metadata.liked_by_viewer =
							currentSubmission.metadata.liked_by_viewer;
						item.metadata.disliked_by_viewer =
							currentSubmission.metadata.disliked_by_viewer;
						item.submission.likes = currentSubmission.submission.likes;
						item.submission.dislikes = currentSubmission.submission.dislikes;
					}
				}),
			);
		}

		setProcessing(false);
	};

	const updateComment = async () => {
		if (processing()) return;
		setProcessing(true);
		invokeHapticFeedbackImpact("soft");

		const request = await requestAPI(
			`/contest/${modals.submission.slug}/submissions/${modals.submission.submission?.submission.id}/comment`,
			{
				comment: comment(),
			},
			"POST",
		);

		if (request) {
			const { result, status } = request;

			if (status === "success") {
				invokeHapticFeedbackNotification("success");

				setData("submissions", reconcile(result.submissions));
			}
		}

		setProcessing(false);
	};

	const created_at = new Date(
		modals.submission.submission.submission.created_at!,
	);

	const votes = createMemo(() => {
		return [
			...modals.submission.submission!.submission.liked_by.map((i) => ({
				...i,
				type: "like" satisfies keyof typeof VoteIcons,
			})),
			...modals.submission.submission!.submission.disliked_by.map((i) => ({
				...i,
				type: "dislike" satisfies keyof typeof VoteIcons,
			})),
			...modals.submission.submission!.submission.raised_by.map((i) => ({
				...i,
				type: "raise" satisfies keyof typeof VoteIcons,
			})),
		].sort(
			(a, b) =>
				new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime(),
		);
	});

	const onClickShare = () => {
		invokeHapticFeedbackImpact("light");

		if (isVersionAtLeast("6.1")) {
			postEvent("web_app_open_tg_link", {
				path_full: `/share/url?url=https://t.me/${import.meta.env.VITE_BOT_USERNAME}/${import.meta.env.VITE_MINIAPP_SLUG}?startapp=submission-${modals.submission.slug}-${modals.submission.submission?.submission.id}`,
			});
		}
	};

	return (
		<Modal
			containerClass="container-modal-submission"
			class="modal-submission"
			onClose={onClose}
			portalParent={document.querySelector("#modals")!}
			withCloseButton={true}
			fullscreen={true}
		>
			<div>
				<ButtonArray
					items={[
						{
							component: TbOutlineShare3,
							fontSize: "1.625rem",
							class: "clickable",
							onClick: onClickShare,
						},
					]}
				/>

				<div>
					<Show
						when={modals.submission.submission.submission.user_id}
						fallback={
							<AvatarAlias
								colorIndex={
									modals.submission.submission.submission.anonymous_profile[0]
								}
								symbol={
									modals.submission.submission.submission
										.anonymous_profile[2][0]
								}
							/>
						}
					>
						<Avatar
							fullname={fullname}
							peerId={modals.submission.submission.submission.user_id}
							src={modals.submission.submission.submission.profile_photo}
						/>
					</Show>

					<header>
						<h1>{fullname}</h1>

						<span>
							{td("modals.submission.date", {
								date: dayjs.utc(created_at).format("MMM D"),
								time: dayjs.utc(created_at).format("HH:mm"),
							})}
						</span>
					</header>

					<div>
						<section>
							<div>
								{/*<span>
									{t("modals.submission.submission.description.label")}
								</span>*/}

								<div>
									<RichText
										content={
											modals.submission.submission.submission.submission
												.description || t("modals.submission.description.empty")
										}
									/>
								</div>
							</div>
						</section>

						<Show when={votes().length > 0}>
							<SectionList
								class="container-list-voted"
								title={t("modals.submission.voters.title")}
								items={votes().map((vote) => {
									const fullname = [vote.first_name, vote.last_name]
										.filter(Boolean)
										.join(" ");

									const created_at = new Date(vote.created_at!);

									return {
										class: "item-list-voted",
										label: () => (
											<>
												<div>
													<Avatar
														fullname={fullname}
														peerId={vote.user_id}
														src={vote.profile_photo}
													/>
													<span>{fullname}</span>
													<span>
														{td("modals.submission.date", {
															date: dayjs.utc(created_at).format("MMM D"),
															time: dayjs.utc(created_at).format("HH:mm"),
														})}
													</span>
													<SVGSymbol
														id={VoteIcons[vote.type as keyof typeof VoteIcons]}
													/>
												</div>

												<Show when={vote.comment}>
													<div>
														<span>{vote.comment}</span>
													</div>
												</Show>
											</>
										),
									};
								})}
							/>
						</Show>
					</div>
				</div>

				<footer>
					<ul>
						<li
							class="clickable"
							classList={{
								fill:
									modals.submission.submission.metadata.disliked_by_viewer ||
									processing() === "dislike",
								empty:
									!modals.submission.submission.metadata.disliked_by_viewer,
							}}
							onClick={() => onClickAction("dislike")}
						>
							<SVGSymbol id="thumb-down" />
							<span>{t("modals.submission.actions.bad")}</span>
							<div>
								<Counter
									value={modals.submission.submission.submission.dislikes}
									initialValue={0}
									durationMs={250}
								/>
							</div>
						</li>

						<li
							class="clickable"
							classList={{
								fill:
									modals.submission.submission.metadata.liked_by_viewer ||
									processing() === "like",
								empty: !modals.submission.submission.metadata.liked_by_viewer,
							}}
							onClick={() => onClickAction("like")}
						>
							<SVGSymbol id="thumb-up" />
							<span>{t("modals.submission.actions.ok")}</span>
							<div>
								<Counter
									value={modals.submission.submission.submission.likes}
									initialValue={0}
									durationMs={250}
								/>
							</div>
						</li>

						<li
							class="clickable"
							classList={{
								fill:
									modals.submission.submission.metadata.raised_by_viewer ||
									processing() === "raise",
								empty: !modals.submission.submission.metadata.raised_by_viewer,
							}}
							onClick={() => onClickAction("raise")}
						>
							<SVGSymbol id="fire" />
							<span>{t("modals.submission.actions.great")}</span>
							<div>
								<Counter
									value={modals.submission.submission.submission.raises}
									initialValue={0}
									durationMs={250}
								/>
							</div>
						</li>
					</ul>

					<div>
						<input
							min={0}
							maxLength={128}
							placeholder={t("modals.submission.actions.comment")}
							value={comment()}
							onInput={(e) => {
								setComment(e.currentTarget.value);
							}}
							onChange={(e) => {
								setComment(e.currentTarget.value.trim());

								if (
									modals.submission.submission!.metadata.liked_by_viewer ||
									modals.submission.submission!.metadata.disliked_by_viewer ||
									modals.submission.submission!.metadata.raised_by_viewer
								) {
									updateComment();
								}
							}}
							onKeyUp={hideKeyboardOnEnter}
						/>
					</div>
				</footer>
			</div>
		</Modal>
	);
};

export default ModalSubmission;
