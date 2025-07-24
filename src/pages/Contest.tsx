import "./Contest.scss";
import { useNavigate, useParams } from "@solidjs/router";
import { type Component, onMount } from "solid-js";
import BackButton from "../components/BackButton";
import { store } from "../utils/store";
import { invokeHapticFeedbackImpact } from "../utils/telegram";

const PageContest: Component = () => {
	const navigate = useNavigate();

	if (!store.token) {
		const params = useParams();

		navigate(`/splash/contest-${params.slug}`, {
			replace: true,
		});
		return;
	}

	onMount(async () => {
		invokeHapticFeedbackImpact("light");
	});

	const onBackButton = () => {
		navigate("/", {
			replace: true,
		});
	};

	return (
		<>
			<div id="container-page-contest" class="page">
				<div>Contest SLUG</div>
			</div>

			<BackButton onClick={onBackButton} />
		</>
	);
};

export default PageContest;
