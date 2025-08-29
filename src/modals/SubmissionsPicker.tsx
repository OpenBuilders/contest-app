import "./SubmissionsPicker.scss";
import { type Component, onMount, Show } from "solid-js";
import { produce } from "solid-js/store";
import { Avatar, AvatarAlias } from "../components/Avatar";
import Modal from "../components/Modal";
import { SectionList } from "../components/Section";
import { SVGSymbol } from "../components/SVG";
import { useTranslation } from "../contexts/TranslationContext";
import { SectionSubmissionsEmpty } from "../pages/Contest/Manage/Submissions";
import { modals, setModals } from "../utils/modal";
import {
	invokeHapticFeedbackImpact,
	invokeHapticFeedbackSelectionChanged,
} from "../utils/telegram";
import { setForm } from "./Placement";

const ModalSubmissionsPicker: Component = () => {
	const { t } = useTranslation();

	onMount(() => {
		invokeHapticFeedbackImpact("light");
	});

	const onClose = () => {
		setModals(
			"submissionsPicker",
			produce((store) => {
				store.picked = undefined;
				store.submissions = undefined;
				store.open = false;
			}),
		);
	};

	const onClickSubmission = (id: number) => {
		invokeHapticFeedbackSelectionChanged();

		if (modals.submissionsPicker.picked?.includes(id)) {
			setForm(
				"submissions",
				produce((store) => {
					store.splice(
						store.findIndex((i) => i === id),
						1,
					);
				}),
			);
		} else {
			setForm(
				"submissions",
				produce((store) => {
					store.push(id as any);
				}),
			);
		}
	};

	return (
		<Modal
			containerClass="container-modal-submissions-picker"
			class="modal-submissions-picker"
			onClose={onClose}
			portalParent={document.querySelector("#modals")!}
		>
			<div>
				<Show
					when={(modals.submissionsPicker.submissions?.length ?? 0) > 0}
					fallback={<SectionSubmissionsEmpty />}
				>
					<SectionList
						class="container-section-included-submissions"
						title={t("modals.placement.submissions.title")}
						items={modals.submissionsPicker.submissions!.map((submission) => {
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

							return {
								label: fullname,
								// clickable: true,
								prepend: () => (
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
								),
								placeholder: () => (
									<Show
										when={modals.submissionsPicker.picked?.includes(
											submission.submission.id,
										)}
										fallback={<SVGSymbol id="BsCircle" class="empty" />}
									>
										<SVGSymbol id="BsCheckCircleFill" class="filled" />
									</Show>
								),
								onClick: () => onClickSubmission(submission.submission.id),
							};
						})}
					/>
				</Show>
			</div>
		</Modal>
	);
};

export default ModalSubmissionsPicker;
