import * as i18n from "@solid-primitives/i18n";
import { Route, Router } from "@solidjs/router";
import {
	bindMiniAppCssVars,
	bindThemeParamsCssVars,
	bindViewportCssVars,
	init,
	isTMA,
	miniApp,
	on,
	retrieveLaunchParams,
	themeParams,
	themeParamsBackgroundColor,
	viewport,
} from "@telegram-apps/sdk-solid";
import {
	createEffect,
	createResource,
	createSignal,
	ErrorBoundary,
	For,
	onCleanup,
	onMount,
	Show,
} from "solid-js";
import { Dynamic, Portal } from "solid-js/web";
import {
	type TranslationContextType,
	TranslationProvider,
} from "./contexts/TranslationContext.ts";
import { dict as en_dict } from "./i18n/en.ts";
import { fetchDictionary, type Locale, localeDirections } from "./locale";
import PageContests from "./pages/Contests.tsx";
import PageCreate from "./pages/Create.tsx";
import PageError from "./pages/Error";
import PageHome from "./pages/Home.tsx";
import PageProfile from "./pages/Profile.tsx";
import PageSplash from "./pages/Splash.tsx";
import { setIsRTL } from "./utils/i18n.ts";
import { modals, setModals } from "./utils/modal.ts";
import { initializeSettings, settings } from "./utils/settings.ts";
import {
	invokeHapticFeedbackImpact,
	isVersionAtLeast,
	postEvent,
	setThemeColor,
} from "./utils/telegram.ts";

const App = () => {
	const [locale, setLocale] = createSignal<Locale>("en");

	const [dict] = createResource(locale, fetchDictionary, {
		initialValue: i18n.flatten(en_dict),
	});

	dict();

	const t: TranslationContextType["t"] = i18n.translator(dict);
	const td: TranslationContextType["td"] = (path, data) => {
		let text = t(path);
		for (const [key, value] of Object.entries(data)) {
			text = text.replace(`%${key}%`, value);
		}
		return text;
	};

	const channel = new BroadcastChannel(
		`${import.meta.env.VITE_PROJECT_NAME}-launch`,
	);

	channel.addEventListener("message", (event) => {
		const { data } = event;

		switch (data.type) {
			case "launch":
				postEvent("web_app_close");
				break;
		}
	});

	createEffect(() => {
		const dir = localeDirections[(locale() ?? "en") as Locale] ?? "ltr";
		document.querySelector("html")?.setAttribute("dir", dir);
		setIsRTL(dir === "rtl");
	});

	const initializeTMA = async () => {
		init();
		const lp = retrieveLaunchParams();

		channel.postMessage({
			type: "launch",
		});

		postEvent("web_app_ready");
		postEvent("iframe_ready");
		postEvent("web_app_expand");

		postEvent("web_app_setup_back_button", {
			is_visible: false,
		});

		postEvent("web_app_setup_main_button", {
			is_visible: false,
		});

		postEvent("web_app_setup_secondary_button", {
			is_visible: false,
		});

		postEvent("web_app_setup_settings_button", {
			is_visible: false,
		});

		if (
			viewport.mount.isAvailable() &&
			!(viewport.isMounted() || viewport.isMounting())
		) {
			await viewport.mount();
			bindViewportCssVars();
		}

		if (themeParams.mountSync.isAvailable() && !themeParams.isMounted()) {
			themeParams.mountSync();
			bindThemeParamsCssVars();
		}

		if (miniApp.mountSync.isAvailable() && !miniApp.isMounted()) {
			miniApp.mountSync();
			bindMiniAppCssVars();

			const handleTheme = (isDark: boolean) => {
				document.body.setAttribute("data-theme", isDark ? "dark" : "light");

				setTimeout(() => {
					setThemeColor(themeParamsBackgroundColor()!);
				});
			};

			handleTheme(miniApp.isDark());
			miniApp.isDark.sub(handleTheme);
		}

		setTimeout(() => {
			const persistVariables = [
				"tg-viewport-height",
				"tg-viewport-safe-area-inset-top",
				"tg-viewport-content-safe-area-inset-top",
				"tg-viewport-safe-area-inset-bottom",
				"tg-viewport-content-safe-area-inset-bottom",
			];

			for (const name of persistVariables) {
				(document.querySelector(":root") as HTMLElement).style.setProperty(
					`--p${name}`,
					(
						document.querySelector(":root") as HTMLElement
					).style.getPropertyValue(`--${name}`),
				);
			}
		});

		if (isVersionAtLeast("6.1")) {
			postEvent("web_app_setup_settings_button", {
				is_visible: true,
			});

			on("settings_button_pressed", () => {
				setModals("settings", "open", true);
			});
		}

		if (isVersionAtLeast("6.2")) {
			postEvent("web_app_setup_closing_behavior", {
				need_confirmation: false,
			});
		}

		if (isVersionAtLeast("7.7")) {
			postEvent("web_app_setup_swipe_behavior", {
				allow_vertical_swipe: false,
			});
		}

		if (isVersionAtLeast("8.0")) {
			postEvent("web_app_toggle_orientation_lock", {
				locked: true,
			});

			if (["ios", "android"].includes(lp.tgWebAppPlatform.toLowerCase())) {
				postEvent("web_app_request_fullscreen");
			}
		}

		invokeHapticFeedbackImpact("heavy");
	};

	onMount(async () => {
		if (!isTMA()) return;

		await initializeTMA();

		initializeSettings();

		if (settings.language !== locale()) {
			setLocale((settings.language ?? "en") as Locale);
		}

		document.addEventListener("contextmenu", (event) => {
			event.preventDefault();
		});
	});

	onCleanup(() => {
		channel.close();
	});

	return (
		<TranslationProvider value={{ t, td, locale, setLocale }}>
			<Show
				when={isTMA()}
				fallback={
					<PageError
						title="Invalid Environment"
						description="This app is designed to run in Telegram Environment."
					/>
				}
			>
				<ErrorBoundary fallback={<PageError />}>
					<Router
						root={(props) => (
							<>
								{props.children}

								<Portal mount={document.body}>
									<For
										each={Object.values(modals).filter((modal) => modal.open)}
									>
										{(modal) => <Dynamic component={modal.component} />}
									</For>
								</Portal>
							</>
						)}
					>
						<Route path="/" component={PageHome} />
						<Route path="/splash/:slug?" component={PageSplash} />
						<Route path="/profile" component={PageProfile} />
						<Route path="/contests" component={PageContests} />
						<Route path="/create" component={PageCreate} />
					</Router>
				</ErrorBoundary>
			</Show>
		</TranslationProvider>
	);
};

export default App;
