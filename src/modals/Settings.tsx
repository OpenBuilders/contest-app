import "./Settings.scss";
import type { Component } from "solid-js";
import Modal from "../components/Modal";
import { setModals } from "../utils/modal";

const ModalSettings: Component = () => {
	return (
		<Modal
			class="modal-settings"
			onClose={() => setModals("settings", "open", false)}
		>
			<h1>Settings</h1>
		</Modal>
	);
};

export default ModalSettings;
