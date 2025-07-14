import "./Settings.scss";
import type { Component } from "solid-js";
import Modal from "../components/Modal";
import { setModals } from "../utils/modal";

const ModalSettings: Component = () => {
	return (
		<Modal
			containerClass="container-modal-settings"
			class="modal-settings"
			onClose={() => setModals("settings", "open", false)}
			portalParent={document.querySelector("#modals")!}
		>
			<h1>Settings</h1>
		</Modal>
	);
};

export default ModalSettings;
