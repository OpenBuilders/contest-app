import type { RouteSectionProps } from "@solidjs/router";
import {
	type Component,
	createEffect,
	For,
	on as onEffect,
	onMount,
	Show,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { Color } from "../utils/colors";
import { modals, setModals } from "../utils/modal";
import { navigator } from "../utils/navigator";
import {
	invokeHapticFeedbackImpact,
	lp,
	setBackgroundColor,
	setBottomBarColor,
	setHeaderColor,
} from "../utils/telegram";
import BottomBar, { bottomBarValidPaths } from "./BottomBar";
import PlausibleTracker from "./PlausibleTracker";
import SettingsButton from "./SettingsButton";

const RouterRoot: Component<RouteSectionProps<unknown>> = (props) => {
	navigator.initialize();
	navigator.history.push({
		id: 0,
		path: navigator.location!.pathname,
	});

	createEffect(
		onEffect(
			() => navigator.location!.pathname,
			() => {
				const current = navigator.getCurrentHistory();
				if (!current) return;

				if (current.options?.params?.haptic !== false) {
					invokeHapticFeedbackImpact("soft");
				}

				setTimeout(() => {
					const page = document.querySelector(".page");
					if (!page) return;

					const color = new Color(getComputedStyle(page).backgroundColor);

					const apply = {
						header: true,
						background: true,
						bottombar: true,
					};

					if (typeof current.options?.params?.theme === "object") {
						apply.header = current.options.params.theme.header ?? true;
						apply.background = current.options.params.theme.background ?? true;
						apply.bottombar = current.options.params.theme.bottombar ?? true;
					}

					if (apply.header) {
						setHeaderColor(color.toHex() as any);
					}

					if (apply.background) {
						setBackgroundColor(color.toHex() as any, false);
					}

					if (apply.bottombar) {
						setBottomBarColor(color.toHex() as any);
					}
				});
			},
		),
	);

	onMount(() => {
		if (lp?.tgWebAppStartParam) {
			if (lp.tgWebAppStartParam.match(/^contest-[a-f0-9]{32}$/i)) {
				navigator.go(`/splash`, {
					params: {
						from: `/contest/${lp.tgWebAppStartParam.replace("contest-", "")}`,
						fromParams: {
							theme: {
								header: false,
							},
						},
					},
				});
			}

			if (lp.tgWebAppStartParam.match(/^submission-[a-f0-9]{32}-\d+$/i)) {
				const chunks = lp.tgWebAppStartParam.split("-");

				navigator.go(`/splash`, {
					params: {
						from: `/contest/${chunks[1]}/submissions/${chunks[2]}`,
						fromParams: {
							theme: {
								header: false,
							},
						},
					},
				});
			}
		}
	});

	return (
		<>
			{props.children}

			<Show when={bottomBarValidPaths.includes(navigator.location!.pathname)}>
				<BottomBar />
			</Show>

			<For each={Object.values(modals).filter((modal) => modal.open)}>
				{(modal) => <Dynamic component={modal.component} />}
			</For>

			<SettingsButton
				onClick={() => {
					setModals("settings", "open", true);
				}}
			/>

			<PlausibleTracker />
		</>
	);
};

export default RouterRoot;
