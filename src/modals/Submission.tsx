import "./Submission.scss";
import { type Component, createSignal, onMount, Show } from "solid-js";
import { produce } from "solid-js/store";
import { Avatar, AvatarAlias } from "../components/Avatar";
import Counter from "../components/Counter";
import CustomMainButton from "../components/CustomMainButton";
import Modal from "../components/Modal";
import { Section } from "../components/Section";
import { SVGSymbol } from "../components/SVG";
import { useTranslation } from "../contexts/TranslationContext";
import { setData } from "../pages/Contest/Manage/Submissions";
import { requestAPI } from "../utils/api";
import { modals, setModals } from "../utils/modal";
import {
	invokeHapticFeedbackImpact,
	invokeHapticFeedbackNotification,
	parseTelegramLink,
	postEvent,
} from "../utils/telegram";

const ModalSubmission: Component = () => {
	const { t } = useTranslation();

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

	const [processing, setProcessing] = createSignal<"like" | "dislike" | false>(
		false,
	);

	onMount(() => {
		invokeHapticFeedbackImpact("soft");
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

	const onClickButton = () => {
		const path = parseTelegramLink(
			modals.submission.submission!.submission.submission.link,
		);

		invokeHapticFeedbackImpact("light");

		if (path) {
			postEvent("web_app_open_tg_link", {
				path_full: path,
			});
		} else {
			postEvent("web_app_open_link", {
				url: modals.submission.submission!.submission.submission.link,
			});
		}
	};

	const onClickAction = async (type: "like" | "dislike") => {
		if (processing()) return;
		setProcessing(type);
		invokeHapticFeedbackImpact("soft");

		const request = await requestAPI(
			`/contest/${modals.submission.slug}/submissions/${modals.submission.submission?.submission.id}/vote`,
			{
				type,
			},
			"POST",
		);

		if (request) {
			const { result, status } = request;

			if (status === "success") {
				invokeHapticFeedbackNotification("success");

				setData(
					"submissions",
					produce((data) => {
						const item = data?.find(
							(item) =>
								item.submission.id ===
								modals.submission.submission?.submission.id,
						);

						if (item) {
							item.submission.likes = result.likes;
							item.submission.dislikes = result.dislikes;
							item.metadata.liked_by_viewer = result.liked_by_viewer;
							item.metadata.disliked_by_viewer = result.disliked_by_viewer;
						}
					}),
				);
			}
		}

		setProcessing(false);
	};

	return (
		<Modal
			containerClass="container-modal-submission"
			class="modal-submission"
			onClose={onClose}
			portalParent={document.querySelector("#modals")!}
		>
			<div>
				<Show
					when={modals.submission.submission.submission.user_id}
					fallback={
						<AvatarAlias
							colorIndex={
								modals.submission.submission.submission.anonymous_profile[0]
							}
							symbol={
								modals.submission.submission.submission.anonymous_profile[2][0]
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

				<h1>{fullname}</h1>

				<Section title={t("modals.submission.description.title")}>
					<div
						class="content"
						innerHTML={
							modals.submission.submission.submission.submission.description ||
							t("modals.submission.description.empty")
						}
					></div>
				</Section>

				<ul>
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
						<SVGSymbol
							id={
								modals.submission.submission.metadata.liked_by_viewer ||
								processing() === "like"
									? "AiFillLike"
									: "AiOutlineLike"
							}
						/>
						<Counter
							value={modals.submission.submission.submission.likes}
							initialValue={modals.submission.submission.submission.likes}
							durationMs={250}
						/>
					</li>

					<li
						class="clickable"
						classList={{
							fill:
								modals.submission.submission.metadata.disliked_by_viewer ||
								processing() === "dislike",
							empty: !modals.submission.submission.metadata.disliked_by_viewer,
						}}
						onClick={() => onClickAction("dislike")}
					>
						<SVGSymbol
							id={
								modals.submission.submission.metadata.disliked_by_viewer ||
								processing() === "dislike"
									? "AiFillDislike"
									: "AiOutlineDislike"
							}
						/>
						<Counter
							value={modals.submission.submission.submission.dislikes}
							initialValue={modals.submission.submission.submission.dislikes}
							durationMs={250}
						/>
					</li>
				</ul>

				<CustomMainButton
					onClick={onClickButton}
					text={t("modals.submission.button")}
				/>
			</div>
		</Modal>
	);
};

export default ModalSubmission;
