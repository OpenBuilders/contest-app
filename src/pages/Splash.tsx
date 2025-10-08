import { setStore } from "../utils/store";
import "./Splash.scss";

import { postEvent, retrieveRawInitData } from "@telegram-apps/sdk-solid";
import { type Component, onMount } from "solid-js";
import { produce } from "solid-js/store";
import { requestAPI } from "../utils/api";
import { urlParseQueryString } from "../utils/auth";
import { lottixWorkers } from "../utils/lottix";
import { setModals } from "../utils/modal";
import { navigator } from "../utils/navigator";
import { preloadPipeline } from "../utils/preload";
import { lp } from "../utils/telegram";

const PageSplash: Component = () => {
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
				wallets: result.wallets,
				limits: result.limits,
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
						setModals(
							"moderatorJoin",
							produce((data) => {
								data.slug_moderator = lp!.tgWebAppStartParam?.replace(
									"moderator-join-",
									"",
								);
								data.open = true;
							}),
						);
					}
				}

				if (navigator.history.length >= 2) {
					const current = navigator.getCurrentHistory();

					if (
						typeof current?.options?.params === "object" &&
						"from" in current.options.params
					) {
						const params =
							"fromParams" in current.options.params
								? current.options.params.fromParams
								: {};

						navigator.go(current.options.params.from, {
							...params,
						});
					} else {
						navigator.go("/");
					}
				} else {
					navigator.go("/");
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
