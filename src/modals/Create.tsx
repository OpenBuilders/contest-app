import "./Create.scss";
import type { Component } from "solid-js";
import Modal from "../components/Modal";
import { SectionCreateForm } from "../pages/Create";
import { setModals } from "../utils/modal";

const ModalContestCreate: Component = () => {
	return (
		<Modal
			class="modal-create"
			onClose={() => setModals("create", "open", false)}
		>
			<SectionCreateForm />
		</Modal>
	);
};

export default ModalContestCreate;
