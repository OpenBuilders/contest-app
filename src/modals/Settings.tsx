import "./Settings.scss";
import { type Component, onMount } from "solid-js";
import Modal from "../components/Modal";
import { setModals } from "../utils/modal";
import { invokeHapticFeedbackImpact } from "../utils/telegram";

const ModalSettings: Component = () => {
	onMount(() => {
		invokeHapticFeedbackImpact("soft");
	});

	const onClose = () => {
		setModals("settings", "open", false);
	};

	return (
		<Modal
			containerClass="container-modal-settings"
			class="modal-settings"
			onClose={onClose}
			portalParent={document.querySelector("#modals")!}
		>
			<h1>Settings</h1>
		</Modal>
	);
};

export default ModalSettings;
