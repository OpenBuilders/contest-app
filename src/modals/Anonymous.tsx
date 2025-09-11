import "./Anonymous.scss";
import { type Component, onMount } from "solid-js";
import CustomMainButton from "../components/CustomMainButton";
import LottiePlayerMotion from "../components/LottiePlayerMotion";
import Modal from "../components/Modal";
import { useTranslation } from "../contexts/TranslationContext";
import { TGS } from "../utils/animations";
import { setModals } from "../utils/modal";
import { invokeHapticFeedbackImpact } from "../utils/telegram";

const ModalAnonymous: Component = () => {
	const { t } = useTranslation();

	onMount(() => {
		invokeHapticFeedbackImpact("soft");
	});

	const onClose = () => {
		setModals("anonymous", "open", false);
	};

	return (
		<Modal
			containerClass="container-modal-anonymous"
			class="modal-anonymous"
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

				<h1>{t("modals.anonymous.title")}</h1>

				<p class="text-secondary">{t("modals.anonymous.description")}</p>
			</div>

			<CustomMainButton text={t("general.ok")} onClick={onClose} />
		</Modal>
	);
};

export default ModalAnonymous;
