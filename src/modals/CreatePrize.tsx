import "./Create.scss";
import { type Component, onMount } from "solid-js";
import LottiePlayerMotion from "../components/LottiePlayerMotion";
import Modal from "../components/Modal";
import { useTranslation } from "../contexts/TranslationContext";
import { TGS } from "../utils/animations";
import { setModals } from "../utils/modal";
import { invokeHapticFeedbackImpact } from "../utils/telegram";

const ModalContestCreatePrize: Component = () => {
	const { t } = useTranslation();

	onMount(() => {
		invokeHapticFeedbackImpact("soft");
	});

	const onClose = () => {
		setModals("createPrize", "open", false);
	};

	return (
		<Modal
			containerClass="container-modal-create-prize"
			class="modal-create-prize"
			onClose={onClose}
			portalParent={document.querySelector("#modals")!}
		>
			<div>
				<LottiePlayerMotion
					src={TGS.duckMoney.url}
					outline={TGS.duckMoney.outline}
					autoplay
					playOnClick
					loop
				/>

				<h1>{t("modals.create.prize.title")}</h1>

				<p class="text-secondary">{t("modals.create.prize.description")}</p>
			</div>
		</Modal>
	);
};

export default ModalContestCreatePrize;
