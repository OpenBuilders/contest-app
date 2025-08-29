import "./ContestDescription.scss";
import { type Component, onMount } from "solid-js";
import { produce } from "solid-js/store";
import Modal from "../components/Modal";
import RichText from "../components/RichText";
import { Section } from "../components/Section";
import { useTranslation } from "../contexts/TranslationContext";
import { modals, setModals } from "../utils/modal";
import { invokeHapticFeedbackImpact } from "../utils/telegram";

const ModalContestDescription: Component = () => {
	const { t } = useTranslation();

	const onClose = () => {
		setModals(
			"contestDescription",
			produce((data) => {
				data.contest = undefined;
				data.open = false;
			}),
		);
	};

	if (!modals.contestDescription.contest) {
		onClose();
		return;
	}

	onMount(() => {
		invokeHapticFeedbackImpact("soft");
	});

	return (
		<Modal
			containerClass="container-modal-contest-description"
			class="modal-contest-description"
			onClose={onClose}
			portalParent={document.querySelector("#modals")!}
		>
			<div>
				<Section title={t("pages.contest.description.title")}>
					<RichText
						content={
							modals.contestDescription.contest?.contest?.description ||
							t("pages.contest.description.empty")
						}
					/>
				</Section>
			</div>
		</Modal>
	);
};

export default ModalContestDescription;
