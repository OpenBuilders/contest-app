import { useNavigate } from "@solidjs/router";
import { setStore, store } from "../utils/store";
import "./Home.scss";

import { type Component, createEffect, on, onMount, Show } from "solid-js";
import LottiePlayerMotion from "../components/LottiePlayerMotion";
import { useTranslation } from "../contexts/TranslationContext";
import { TGS } from "../utils/animations";
import { requestAPI } from "../utils/api";
import { setModals } from "../utils/modal";
import { signals } from "../utils/signals";

const PageHome: Component = () => {
	const navigate = useNavigate();

	if (!store.token) {
		navigate("/splash", {
			replace: true,
		});
		return;
	}

	const { t } = useTranslation();

	const fetchContents = async () => {
		const request = await requestAPI("/contests/my");

		if (request) {
			const { result } = request;

			setStore("contests", "my", result.contests);
		}
	};

	const onClickButtonCreate = () => {
		setModals("create", "open", true);
		// navigate("/create", {
		// 	replace: true,
		// });
	};

	onMount(async () => {
		if (!store.contests?.my) {
			await fetchContents();
		}
	});

	const SectionContestsLoading = () => {
		return <div id="container-home-contests-loading">Loading</div>;
	};

	const SectionContestsEmpty = () => {
		return (
			<div id="container-home-contests-empty">
				<LottiePlayerMotion
					src={TGS.duckEgg.url}
					outline={TGS.duckEgg.outline}
					autoplay
					playOnClick
				/>

				<span class="text-secondary">
					{t("pages.home.contests.empty.title")}
				</span>

				<button type="button" onClick={onClickButtonCreate}>
					{t("pages.home.contests.empty.create")}
				</button>
			</div>
		);
	};

	const SectionContests = () => {
		return (
			<div id="container-home-contests">
				{JSON.stringify(store.contests?.my)}
			</div>
		);
	};

	createEffect(
		on(
			() => signals.fetchMyContests,
			async () => {
				setStore("contests", "my", undefined);
				await fetchContents();
			},
			{
				defer: true,
			},
		),
	);

	return (
		<div id="container-page-home" class="page">
			<div>
				<Show when={store.contests?.my} fallback={<SectionContestsLoading />}>
					<Show
						when={store.contests.my!.length > 0}
						fallback={<SectionContestsEmpty />}
					>
						<SectionContests />
					</Show>
				</Show>
			</div>
		</div>
	);
};

export default PageHome;
