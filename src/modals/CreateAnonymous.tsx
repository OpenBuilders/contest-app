import "./Create.scss";
import { type Component, onMount } from "solid-js";
import LottiePlayerMotion from "../components/LottiePlayerMotion";
import Modal from "../components/Modal";
import { useTranslation } from "../contexts/TranslationContext";
import { TGS } from "../utils/animations";
import { setModals } from "../utils/modal";
import { invokeHapticFeedbackImpact } from "../utils/telegram";

const ModalContestCreateAnonymous: Component = () => {
	const { t } = useTranslation();

	onMount(() => {
		invokeHapticFeedbackImpact("soft");
	});

	const onClose = () => {
		setModals("createAnonymous", "open", false);
	};

	return (
		<Modal
			containerClass="container-modal-create-anonymous"
			class="modal-create-anonymous"
			onClose={onClose}
			portalParent={document.querySelector("#modals")!}
		>
			<div>
				<LottiePlayerMotion
					src={TGS.duckCustomize.url}
					outline={TGS.duckCustomize.outline}
					autoplay
					playOnClick
					loop
				/>

				<h1>{t("modals.create.anonymous.title")}</h1>

				<p class="text-secondary">{t("modals.create.anonymous.description")}</p>
			</div>
		</Modal>
	);
};

export default ModalContestCreateAnonymous;
