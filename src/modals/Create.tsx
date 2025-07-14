import "./Create.scss";
import type { Component } from "solid-js";
import Modal from "../components/Modal";
import { SectionCreateForm } from "../pages/Create";
import { setModals } from "../utils/modal";

const ModalContestCreate: Component = () => {
	return (
		<Modal
			containerClass="container-modal-create"
			class="modal-create"
			onClose={() => setModals("create", "open", false)}
			portalParent={document.querySelector("#modals")!}
		>
			<SectionCreateForm />
		</Modal>
	);
};

export default ModalContestCreate;
