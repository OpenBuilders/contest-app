import "./Create.scss";
import { type Component, onMount } from "solid-js";
import LottiePlayerMotion from "../components/LottiePlayerMotion";
import Modal from "../components/Modal";
import { useTranslation } from "../contexts/TranslationContext";
import { TGS } from "../utils/animations";
import { setModals } from "../utils/modal";
import { invokeHapticFeedbackImpact } from "../utils/telegram";

const ModalContestCreatePublic: Component = () => {
	const { t } = useTranslation();

	onMount(() => {
		invokeHapticFeedbackImpact("soft");
	});

	const onClose = () => {
		setModals("createPublic", "open", false);
	};

	return (
		<Modal
			containerClass="container-modal-create-public"
			class="modal-create-public"
			onClose={onClose}
			portalParent={document.querySelector("#modals")!}
		>
			<div>
				<LottiePlayerMotion
					src={TGS.duckEnterPrivate.url}
					outline={TGS.duckEnterPrivate.outline}
					autoplay
					playOnClick
					loop
				/>

				<h1>{t("modals.create.public.title")}</h1>

				<p class="text-secondary">{t("modals.create.public.description")}</p>
			</div>
		</Modal>
	);
};

export default ModalContestCreatePublic;
