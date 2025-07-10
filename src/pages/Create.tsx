import "./Create.scss";
import { useNavigate } from "@solidjs/router";
import type { Component } from "solid-js";
import BackButton from "../components/BackButton";
import { store } from "../utils/store";

const PageCreate: Component = () => {
	const navigate = useNavigate();

	if (!store.token) {
		const navigate = useNavigate();
		navigate("/splash/create", {
			replace: true,
		});
		return;
	}

	const onBackButton = () => {
		navigate("/", {
			replace: true,
		});
	};

	const SectionCreateForm = () => {
		return <div>Section Create Form</div>;
	};

	return (
		<>
			<div id="container-page-create" class="page">
				<div>
					<SectionCreateForm />
				</div>
			</div>

			<BackButton onClick={onBackButton} />
		</>
	);
};

export default PageCreate;
