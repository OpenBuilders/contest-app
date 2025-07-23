import "./Create.scss";
import { type Component, onMount } from "solid-js";
import CustomMainButton from "../components/CustomMainButton";
import LottiePlayerMotion from "../components/LottiePlayerMotion";
import Modal from "../components/Modal";
import { useTranslation } from "../contexts/TranslationContext";
import { TGS } from "../utils/animations";
import { setModals } from "../utils/modal";
import { invokeHapticFeedbackImpact } from "../utils/telegram";

const ModalContestCreateCategory: Component = () => {
	const { t } = useTranslation();

	onMount(() => {
		invokeHapticFeedbackImpact("soft");
	});

	const onClose = () => {
		setModals("createCategory", "open", false);
	};

	return (
		<Modal
			containerClass="container-modal-create-category"
			class="modal-create-category"
			onClose={onClose}
			portalParent={document.querySelector("#modals")!}
		>
			<div>
				<LottiePlayerMotion
					src={TGS.duckHashtags.url}
					outline={TGS.duckHashtags.outline}
					autoplay
					playOnClick
					loop
				/>

				<h1>{t("modals.create.category.title")}</h1>

				<p class="text-secondary">{t("modals.create.category.description")}</p>
			</div>

			<CustomMainButton text={t("general.ok")} onClick={onClose} />
		</Modal>
	);
};

export default ModalContestCreateCategory;
