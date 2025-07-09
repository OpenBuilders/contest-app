import "./Create.scss";
import { useNavigate } from "@solidjs/router";
import { off, on } from "@telegram-apps/sdk-solid";
import { type Component, onCleanup, onMount } from "solid-js";
import { store } from "../utils/store";
import { postEvent } from "../utils/telegram";

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

	onMount(async () => {
		postEvent("web_app_setup_back_button", {
			is_visible: true,
		});

		on("back_button_pressed", onBackButton);
	});

	onCleanup(() => {
		off("back_button_pressed", onBackButton);
	});

	const SectionCreateForm = () => {
		return <div>Section Create Form</div>;
	};

	return (
		<div id="container-page-create" class="page">
			<div>
				<SectionCreateForm />
			</div>
		</div>
	);
};

export default PageCreate;
