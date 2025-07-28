import "./Contest.scss";
import { useNavigate, useParams } from "@solidjs/router";
import { type Component, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";
import BackButton from "../components/BackButton";
import { requestAPI } from "../utils/api";
import { store } from "../utils/store";
import { invokeHapticFeedbackImpact } from "../utils/telegram";

const PageContest: Component = () => {
	const navigate = useNavigate();
	const params = useParams();

	const [contest, setContest] = createStore({
		contest: undefined,
	});

	if (!store.token) {
		navigate(`/splash/contest-${params.slug}`, {
			replace: true,
		});
		return;
	}

	onMount(async () => {
		invokeHapticFeedbackImpact("light");

		if (!contest.contest) {
			await fetchContest();
		}
	});

	const fetchContest = async () => {
		const request = await requestAPI(`/contest/${params.slug}`);

		if (request) {
			const { result } = request;

			setContest("contest", result.contest);
		}
	};

	const onBackButton = () => {
		navigate("/", {
			replace: true,
		});
	};

	return (
		<>
			<div id="container-page-contest" class="page">
				<Show when={contest.contest} fallback={<div>Loading</div>}>
					<div>Contest</div>
				</Show>
			</div>

			<BackButton onClick={onBackButton} />
		</>
	);
};

export default PageContest;
