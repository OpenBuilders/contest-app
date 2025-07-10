import "./Profile.scss";
import { useNavigate } from "@solidjs/router";
import type { Component } from "solid-js";
import { store } from "../utils/store";

const PageProfile: Component = () => {
	if (!store.token) {
		const navigate = useNavigate();
		navigate("/splash/profile", {
			replace: true,
		});
		return;
	}

	return (
		<div id="container-page-profile" class="page">
			<div>Profile</div>
		</div>
	);
};

export default PageProfile;
