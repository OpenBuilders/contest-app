import { useNavigate, useParams } from "@solidjs/router";
import { setStore, store } from "../utils/store";
import "./Splash.scss";

import { postEvent, retrieveRawInitData } from "@telegram-apps/sdk-solid";
import { batch, type Component, onMount } from "solid-js";
import { requestAPI } from "../utils/api";
import { urlParseQueryString } from "../utils/auth";
import { lottixWorkers } from "../utils/lottix";
import { setModals } from "../utils/modal";
import { preloadPipeline } from "../utils/preload";
import { lp } from "../utils/telegram";

const PageSplash: Component = () => {
	const navigate = useNavigate();
	const params = useParams();

	if (store.token) {
		// TODO: handle this
		console.log("User has token on splash page!");
		return;
	}

	const authorizeUser = async () => {
		const data = retrieveRawInitData();
		if (!data) return;

		const request = await requestAPI("/auth", {
			initDataUnsafe: JSON.stringify(urlParseQueryString(data)),
		});

		if (request) {
			const { result } = request;

			setStore({
				token: result.token,
				user: result.user,
				limits: result.limits,
				categories: result.categories,
				version: result.version,
			});

			return true;
		}

		return false;
	};

	onMount(() => {
		lottixWorkers.initialize(1);

		const promises = [authorizeUser(), preloadPipeline()];

		Promise.all(promises).then((result) => {
			if (result.filter(Boolean).length === promises.length) {
				if (lp?.tgWebAppStartParam) {
					if (lp.tgWebAppStartParam.startsWith("moderator-join-")) {
						batch(() => {
							setModals(
								"moderatorJoin",
								"slug_moderator",
								lp!.tgWebAppStartParam?.replace("moderator-join-", ""),
							);

							setModals("moderatorJoin", "open", true);
						});
					}
				}

				if (params.slug) {
					if (params.slug.startsWith("contest-")) {
						navigate(
							`/contest/${params.slug.replace("contest-", "").replace(/-/g, "/")}`,
							{
								replace: true,
							},
						);
					} else {
						navigate(`/${params.slug}`, { replace: true });
					}
				} else {
					navigate("/", { replace: true });
				}
			} else {
				postEvent("web_app_close");
			}
		});
	});

	return (
		<div id="container-page-splash" class="page">
			<div id="container-splash-loader" class="shimmer"></div>
		</div>
	);
};

export default PageSplash;
