import "./Contests.scss";
import { useNavigate } from "@solidjs/router";
import type { Component } from "solid-js";
import { store } from "../utils/store";

const PageContests: Component = () => {
	if (!store.token) {
		const navigate = useNavigate();
		navigate("/splash/contests", {
			replace: true,
		});
		return;
	}

	return (
		<div id="container-page-contests" class="page">
			<div>Contests</div>
		</div>
	);
};

export default PageContests;
