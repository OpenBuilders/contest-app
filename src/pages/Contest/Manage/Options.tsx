import { useParams } from "@solidjs/router";
import "./Options.scss";
import { FaSolidCircleExclamation } from "solid-icons/fa";
import {
	type Component,
	createMemo,
	createSignal,
	Match,
	onCleanup,
	onMount,
	Show,
	Switch,
} from "solid-js";
import { createStore } from "solid-js/store";
import BackButton from "../../../components/BackButton";
import CustomMainButton from "../../../components/CustomMainButton";
import { toast } from "../../../components/Toast";
import { useTranslation } from "../../../contexts/TranslationContext";
import { requestAPI } from "../../../utils/api";
import {
	canvasToBlob,
	cloneObject,
	compareObjects,
} from "../../../utils/general";
import { initializeCropper, initializeDOMPurify } from "../../../utils/lazy";
import { navigator } from "../../../utils/navigator";
import { popupManager } from "../../../utils/popup";
import { setStore, store } from "../../../utils/store";
import { getSymbolSVGString } from "../../../utils/symbols";
import {
	invokeHapticFeedbackImpact,
	invokeHapticFeedbackNotification,
} from "../../../utils/telegram";
import {
	ContestThemeBackdrops,
	type ContestThemeSymbol,
} from "../../../utils/themes";
import { DEFAULT_SYMBOL, SectionInformation } from "../../Create";

type FormStore = {
	slug?: string;
	title?: string;
	description?: string;
	instruction?: string;
	image?: HTMLCanvasElement;
	prize?: string;
	date?: {
		end: number;
	};
	theme?: {
		backdrop?: number;
		symbol?: string;
	};
	fee?: number;
	anonymous?: boolean;
};

const PageContestManageOptions: Component = () => {
	const params = useParams();

	if (!store.token) {
		navigator.go("/splash", {
			params: {
				from: `/contest/${params.slug}/manage/options`,
				haptic: false,
				fromParams: {
					theme: {
						header: false,
					},
				},
			},
		});
		return;
	}

	const { t } = useTranslation();

	const [processing, setProcessing] = createSignal(false);
	const [form, setForm] = createStore<FormStore>({});
	const [formData, setFormData] = createStore(cloneObject(form));

	const buttonDisabled = createMemo(() => {
		if (form.description) {
			const {
				body: { textContent },
			} = new DOMParser().parseFromString(form.description, "text/html");

			if (
				(textContent?.length ?? 0) >
				store.limits!.form.create.description.maxLength
			) {
				return true;
			}
		}

		if (form.instruction) {
			if (
				(form.instruction?.length ?? 0) >
				store.limits!.form.create.instruction.maxLength
			) {
				return true;
			}
		}

		if ((form.date?.end ?? 0) <= Date.now()) {
			return true;
		}

		if ((form.prize ?? "").length > store.limits!.form.create.prize.maxLength) {
			return true;
		}

		if (
			form.fee &&
			(form.fee < store.limits!.form.create.fee.min ||
				form.fee > store.limits!.form.create.fee.max)
		) {
			return true;
		}

		if (
			(form.title ?? "").trim().length <
				store.limits!.form.create.title.minLength ||
			(form.title ?? "").trim().length >
				store.limits!.form.create.title.maxLength
		) {
			return true;
		}

		if (compareObjects(form, formData)) {
			return true;
		}

		return false;
	});

	const [dependencies, setDependencies] = createStore({
		cropper: false,
		tonconnect: false,
	});

	const theme = createMemo(() => {
		if (!form.theme?.backdrop) return;

		const backdrop = ContestThemeBackdrops.find(
			(i) => i.id === form!.theme!.backdrop,
		);
		if (!backdrop) return;

		const symbol: ContestThemeSymbol = {
			id: form.theme.symbol ?? DEFAULT_SYMBOL,
			component: getSymbolSVGString(form.theme.symbol ?? DEFAULT_SYMBOL),
		};

		return {
			backdrop,
			symbol,
		};
	});

	const onBackButton = () => {
		navigator.go(`/contest/${params.slug}`, {
			params: {
				theme: {
					header: false,
				},
			},
		});
	};

	const onClickButton = async () => {
		if (processing()) return;
		setProcessing(true);

		invokeHapticFeedbackImpact("soft");

		const request = await requestAPI(
			`/contest/${params.slug}/options/update`,
			{
				title: form.title,
				description: form.description,
				instruction: form.instruction,
				prize: form.prize,
				date: JSON.stringify(form.date),
				theme: JSON.stringify(form.theme),
				anonymous: form.anonymous ? "true" : "false",
				fee: form.fee?.toString(),
				image: form.image
					? ((await canvasToBlob(form.image, "image/webp", 0.95)) ?? undefined)
					: undefined,
			},
			"POST",
		);

		if (request) {
			const { status } = request;

			if (status === "success") {
				invokeHapticFeedbackNotification("success");
				setStore("contests", "my", undefined);
				onBackButton();
				return;
			}
		}

		toast({
			icon: FaSolidCircleExclamation,
			text: t("errors.options.update"),
		});
		setProcessing(false);
	};

	const onClickDelete = async () => {
		if (processing()) return;

		invokeHapticFeedbackImpact("rigid");

		const data = await popupManager.openPopup({
			title: t("pages.contest.manage.delete.title"),
			message: t("pages.contest.manage.delete.prompt"),
			buttons: [
				{
					id: params.slug,
					type: "destructive",
					text: t("pages.contest.manage.delete.confirm"),
				},
				{
					id: "cancel",
					type: "cancel",
				},
			],
		});

		if (!data.button_id || data.button_id === "cancel") return;
		setProcessing(true);

		const request = await requestAPI(`/contest/${params.slug}/delete`);

		if (request) {
			const { status } = request;
			if (status === "success") {
				setProcessing(false);

				invokeHapticFeedbackImpact("heavy");

				setStore("contests", {
					gallery: undefined,
					my: undefined,
				});

				navigator.go("/");
				return;
			}
		}

		toast({
			icon: FaSolidCircleExclamation,
			text: t("errors.options.delete"),
		});
		setProcessing(false);
	};

	const fetchData = async () => {
		const request = await requestAPI(
			`/contest/${params.slug}/options`,
			{},
			"GET",
		);

		if (request) {
			const { result, status } = request;

			if (status === "success") {
				invokeHapticFeedbackNotification("success");

				setForm({
					description: result.contest.description,
					instruction: result.contest.instruction,
					fee: result.contest.fee,
					prize: result.contest.prize,
					title: result.contest.title,
					anonymous: result.contest.anonymous,
					date: {
						end: result.contest.date_end * 1_000,
					},
					image: result.contest.image,
					slug: result.contest.slug,
					theme: result.contest.theme,
				});
				setFormData({
					...form,
					date: form.date ? cloneObject(form.date) : undefined,
					theme: form.theme ? cloneObject(form.theme) : undefined,
				});
				return;
			}
		}

		toast({
			icon: FaSolidCircleExclamation,
			text: t("errors.fetch"),
		});
	};

	const initialHeight = window.visualViewport?.height || window.innerHeight;

	const handleVisualViewport = () => {
		const currentHeight = window.visualViewport?.height || window.innerHeight;
		if (currentHeight < initialHeight) {
			const activeEl = document.activeElement as HTMLElement | null;
			if (activeEl) {
				setTimeout(() => {
					activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
				}, 250);
			}
		}
	};

	onMount(async () => {
		if (window.visualViewport) {
			window.visualViewport.addEventListener("resize", handleVisualViewport, {
				passive: true,
			});
		} else {
			window.addEventListener("resize", handleVisualViewport, {
				passive: true,
			});
		}

		if (!form.slug) {
			await fetchData();
		}

		setDependencies("cropper", await initializeCropper());
		await initializeDOMPurify();
	});

	onCleanup(() => {
		if (window.visualViewport) {
			window.visualViewport.removeEventListener("resize", handleVisualViewport);
		} else {
			window.removeEventListener("resize", handleVisualViewport);
		}
	});

	const SectionOptionsLoading = () => {
		return (
			<div id="container-contest-options-loading">
				<div class="shimmer"></div>

				<section>
					<div class="shimmer"></div>
				</section>

				<footer>
					<div class="shimmer"></div>
				</footer>
			</div>
		);
	};

	return (
		<>
			<div id="container-page-contest-manage-options" class="page">
				<div
					classList={{
						theme: theme() !== undefined,
						empty: theme() === undefined,
					}}
					style={{
						"--theme-bg": theme()
							? `radial-gradient(${theme()!.backdrop.colors.center}, ${theme()!.backdrop.colors.edge})`
							: "var(--accent)",
						"--theme-bg-edge": theme()
							? theme()!.backdrop.colors.edge
							: "var(--accent)",
						"--theme-bg-center": theme()
							? theme()!.backdrop.colors.center
							: "var(--accent)",
						"--theme-pattern": theme()
							? theme()!.backdrop.colors.pattern
							: "white",
						"--theme-text": theme() ? theme()!.backdrop.colors.text : "white",
					}}
				>
					<Switch>
						<Match when={!form.slug}>
							<SectionOptionsLoading />
						</Match>

						<Match when={form.slug}>
							<SectionInformation
								form={form as any}
								setForm={setForm as any}
								dependencies={dependencies}
								setDependencies={setDependencies}
								theme={theme}
								mode="update"
							/>

							<div id="container-page-contest-manage-options-delete">
								<button type="button" class="clickable" onClick={onClickDelete}>
									{t("pages.contest.manage.list.delete")}
								</button>
							</div>
						</Match>
					</Switch>
				</div>

				<Show when={form.slug}>
					<footer>
						<CustomMainButton
							text={t("pages.contest.manage.options.button")}
							onClick={onClickButton}
							disabled={buttonDisabled() || processing()}
							loading={processing()}
						/>
					</footer>
				</Show>
			</div>

			<BackButton onClick={onBackButton} />
		</>
	);
};

export default PageContestManageOptions;
