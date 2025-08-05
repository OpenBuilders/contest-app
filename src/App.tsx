import * as i18n from "@solid-primitives/i18n";
import { Route, Router } from "@solidjs/router";
import { isTMA } from "@telegram-apps/sdk-solid";
import {
	createEffect,
	createResource,
	createSignal,
	ErrorBoundary,
	lazy,
	onCleanup,
	onMount,
	Show,
} from "solid-js";
import { register as registerSwiper } from "swiper/element";
import RouterRoot from "./components/RouterRoot.tsx";
import {
	type TranslationContextType,
	TranslationProvider,
} from "./contexts/TranslationContext.ts";
import { dict as en_dict } from "./i18n/en.ts";
import { fetchDictionary, type Locale, localeDirections } from "./locale";
import PageContestManageModerators from "./pages/Contest/Manage/Moderators.tsx";
import PageContestManageOptions from "./pages/Contest/Manage/Options.tsx";
import PageContestManageResults from "./pages/Contest/Manage/Results.tsx";
import PageContestManageSubmissions from "./pages/Contest/Manage/Submissions.tsx";
import PageContest from "./pages/Contest.tsx";
import PageContests from "./pages/Contests.tsx";
import PageCreate from "./pages/Create.tsx";
import PageError from "./pages/Error";
import PageHome from "./pages/Home.tsx";
import PageProfile from "./pages/Profile.tsx";
import PageSplash from "./pages/Splash.tsx";
import { setIsRTL } from "./utils/i18n.ts";
import { initializeSettings, settings } from "./utils/settings.ts";
import { initializeTMA, postEvent } from "./utils/telegram.ts";

declare module "solid-js" {
	namespace JSX {
		interface IntrinsicElements {
			"swiper-container": any;
			"swiper-slide": any;
		}
	}
}

const App = () => {
	registerSwiper();

	const [locale, setLocale] = createSignal<Locale>("en");

	const [dict] = createResource(locale, fetchDictionary, {
		initialValue: i18n.flatten(en_dict),
	});

	dict();

	const t: TranslationContextType["t"] = i18n.translator(dict) as any;
	const td: TranslationContextType["td"] = (path, data) => {
		let text = t(path);
		if (data) {
			for (const [key, value] of Object.entries(data)) {
				text = text.replace(`{${key}}`, value);
			}
		}
		return text;
	};

	// Prevent Multiple Instances
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

	// Handle Document Direction
	createEffect(() => {
		const dir = localeDirections[(locale() ?? "en") as Locale] ?? "ltr";
		document.querySelector("html")?.setAttribute("dir", dir);
		setIsRTL(dir === "rtl");
	});

	onMount(async () => {
		if (!isTMA()) return;

		channel.postMessage({
			type: "launch",
		});

		await initializeTMA();

		initializeSettings();

		if (settings.language !== locale()) {
			setLocale((settings.language ?? "en") as Locale);
		}

		let debugPageAttemps: number[] = [];
		document.addEventListener("contextmenu", (event) => {
			event.preventDefault();

			if (import.meta.env.DEV) {
				const now = Date.now();

				debugPageAttemps.push(now);

				debugPageAttemps = debugPageAttemps.filter(
					(timestamp) => now - timestamp <= 5_000,
				);

				if (debugPageAttemps.length >= 5) {
					debugPageAttemps = [];
					location.href = "/debug";
				}
			}
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
					<Router root={RouterRoot}>
						<Show when={import.meta.env.DEV}>
							<Route
								path="/debug"
								component={lazy(() => import("./pages/Debug"))}
							/>
						</Show>

						<Route path="/" component={PageHome} />
						<Route path="/splash/:slug?" component={PageSplash} />
						<Route path="/profile" component={PageProfile} />
						<Route path="/contests" component={PageContests} />
						<Route path="/create" component={PageCreate} />

						<Route path="/contest/:slug/:state?" component={PageContest} />

						<Route
							path="/contest/:slug/manage/submissions"
							component={PageContestManageSubmissions}
						/>
						<Route
							path="/contest/:slug/manage/moderators"
							component={PageContestManageModerators}
						/>
						<Route
							path="/contest/:slug/manage/options"
							component={PageContestManageOptions}
						/>
						<Route
							path="/contest/:slug/manage/results"
							component={PageContestManageResults}
						/>
					</Router>
				</ErrorBoundary>
			</Show>
		</TranslationProvider>
	);
};

export default App;
