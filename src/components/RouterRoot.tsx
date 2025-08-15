import {
	type RouteSectionProps,
	useLocation,
	useNavigate,
} from "@solidjs/router";
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
import {
	invokeHapticFeedbackImpact,
	lp,
	setThemeColor,
} from "../utils/telegram";
import BottomBar, { bottomBarValidPaths } from "./BottomBar";
import PlausibleTracker from "./PlausibleTracker";
import SettingsButton from "./SettingsButton";

const RouterRoot: Component<RouteSectionProps<unknown>> = (props) => {
	const navigate = useNavigate();
	const location = useLocation();

	createEffect(
		onEffect(
			() => location.pathname,
			() => {
				if (
					location.pathname.match(
						/^\/contest\/[0-9a-fA-F]{32}((\/)?(manage|normal)?)?$/,
					)
				)
					return;

				invokeHapticFeedbackImpact("soft");

				setTimeout(() => {
					const page = document.querySelector(".page");
					if (!page) return;

					const color = new Color(getComputedStyle(page).backgroundColor);

					setThemeColor(color.toHex() as any);
				});
			},
		),
	);

	onMount(() => {
		if (lp?.tgWebAppStartParam) {
			if (lp.tgWebAppStartParam.match(/^contest-[a-f0-9]{32}$/i)) {
				navigate(`/splash/${lp.tgWebAppStartParam}`, {
					replace: true,
				});
				return;
			} else if (
				lp.tgWebAppStartParam.match(/^submission-[a-f0-9]{32}-\d+$/i)
			) {
				navigate(`/splash/${lp.tgWebAppStartParam}`, {
					replace: true,
				});
				return;
			}
		}
	});

	return (
		<>
			{props.children}

			<Show when={bottomBarValidPaths.includes(location.pathname)}>
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
