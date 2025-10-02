import { createStore } from "solid-js/store";
import BackButton from "../components/BackButton";
import MainButton from "../components/MainButton";
import { useTranslation } from "../contexts/TranslationContext";
import { navigator } from "../utils/navigator";
import { setStore, store } from "../utils/store";
import "./Create.scss";
import { FaSolidCircleExclamation } from "solid-icons/fa";
import { FiInfo } from "solid-icons/fi";
import { HiSolidPlus } from "solid-icons/hi";
import {
	batch,
	type Component,
	createEffect,
	createMemo,
	createSignal,
	For,
	Match,
	on,
	onCleanup,
	onMount,
	Show,
	Switch,
} from "solid-js";
import { Portal } from "solid-js/web";
import CircularIconPattern from "../components/CircularIconPattern";
import CustomMainButton from "../components/CustomMainButton";
import Editor from "../components/Editor";
import LottiePlayerMotion from "../components/LottiePlayerMotion";
import Modal from "../components/Modal";
import {
	Section,
	SectionList,
	SectionListInput,
	SectionListSelect,
	SectionListSwitch,
} from "../components/Section";
import { SVGSymbol } from "../components/SVG";
import SymbolPicker from "../components/SymbolPicker";
import ThemePreview from "../components/ThemePreview";
import { toast } from "../components/Toast";
import WheelPicker from "../components/WheelPicker";
import { TGS } from "../utils/animations";
import { requestAPI } from "../utils/api";
import { canvasToBlob } from "../utils/general";
import { isRTL } from "../utils/i18n";
import { hideKeyboardOnEnter } from "../utils/input";
import {
	initializeCropper,
	initializeDOMPurify,
	initializeTonConnect,
	parseTONAddress,
	tonConnectUI,
} from "../utils/lazy";
import { setModals } from "../utils/modal";
import { clamp, formatNumbersInString } from "../utils/number";
import { getSymbolSVGString } from "../utils/symbols";
import {
	invokeHapticFeedbackImpact,
	invokeHapticFeedbackNotification,
	invokeHapticFeedbackSelectionChanged,
} from "../utils/telegram";
import {
	ContestThemeBackdrops,
	type ContestThemeSymbol,
} from "../utils/themes";
import { formatTonAddress, isTonAddress } from "../utils/ton";

declare module "solid-js" {
	namespace JSX {
		interface IntrinsicElements {
			"cropper-canvas": any;
			"cropper-image": any;
			"cropper-shade": any;
			"cropper-handle": any;
			"cropper-selection": any;
			"cropper-grid": any;
			"cropper-crosshair": any;
		}
	}
}

type FormCreateStore = {
	title: string;
	description: string;
	instruction: string;
	image?: HTMLCanvasElement;
	prize: string;
	date: {
		end: number;
	};
	theme: {
		backdrop?: number;
		symbol?: string;
	};
	fee: number;
	fee_wallet?: string;
	anonymous: boolean;
	slug?: string;
};

export const DEFAULT_SYMBOL = "symbol-55";

const PageCreate: Component = () => {
	const { t, td } = useTranslation();

	if (!store.token) {
		navigator.go(`/splash`, {
			params: {
				from: `/create`,
				haptic: false,
			},
		});
		return;
	}

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

		setDependencies("cropper", await initializeCropper());
		await initializeDOMPurify();
		await initializeTonConnect();
	});

	onCleanup(() => {
		if (window.visualViewport) {
			window.visualViewport.removeEventListener("resize", handleVisualViewport);
		} else {
			window.removeEventListener("resize", handleVisualViewport);
		}

		setModals("anonymous", "open", false);
	});

	const [step, setStep] = createSignal<"information" | "wallet" | "done">(
		"information",
	);

	const [form, setForm] = createStore<FormCreateStore>({
		title: "",
		description: "",
		instruction: "",
		prize: "",
		date: {
			end: Math.trunc((Date.now() + 7 * 86400 * 1000) / 86400) * 86400,
		},
		theme: {},
		fee: 0,
		anonymous: false,
	});

	const [dependencies, setDependencies] = createStore({
		cropper: false,
		tonconnect: false,
	});

	const theme = createMemo(() => {
		if (!form.theme.backdrop) return;

		const backdrop = ContestThemeBackdrops.find(
			(i) => i.id === form.theme.backdrop,
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

	const [processing, setProcessing] = createSignal(false);
	const buttonDisabled = createMemo(() => {
		if (step() === "wallet" && !isTonAddress(form.fee_wallet ?? "")) {
			return true;
		}

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

		if (form.date.end < Math.trunc(Date.now() / 86400_000 + 1) * 86400_000) {
			return true;
		}

		if (form.prize.length > store.limits!.form.create.prize.maxLength) {
			return true;
		}

		if (
			form.fee < store.limits!.form.create.fee.min ||
			form.fee > store.limits!.form.create.fee.max
		) {
			return true;
		}

		if (
			form.title.trim().length < store.limits!.form.create.title.minLength ||
			form.title.trim().length > store.limits!.form.create.title.maxLength
		) {
			return true;
		}

		return false;
	});

	const onBackButton = () => {
		if (processing()) return;

		if (step() === "wallet") {
			setStep("information");
		} else {
			if (navigator.isBackable()) {
				navigator.back();
			} else {
				navigator.go("/");
			}
		}
	};

	const onClickButton = async () => {
		if (processing()) return;
		setProcessing(true);

		invokeHapticFeedbackImpact("soft");

		if (form.fee && step() === "information") {
			setStep("wallet");
		} else {
			const request = await requestAPI(
				"/contest/create",
				{
					title: form.title,
					description: form.description,
					instruction: form.instruction,
					prize: form.prize,
					date: JSON.stringify(form.date),
					theme: JSON.stringify(form.theme),
					fee: form.fee.toString(),
					fee_wallet: form.fee_wallet,
					anonymous: form.anonymous ? "true" : "false",
					image: form.image
						? ((await canvasToBlob(form.image, "image/webp", 0.95)) ??
							undefined)
						: undefined,
				},
				"POST",
			);

			if (request) {
				const { result } = request;

				batch(() => {
					setForm("slug", result.slug);
					setStep("done");
					setStore("contests", {
						gallery: undefined,
						my: undefined,
					});
				});
			} else {
				invokeHapticFeedbackNotification("error");
				toast({
					icon: FaSolidCircleExclamation,
					text: t("pages.create.error.create"),
				});
				setProcessing(false);
			}
		}
	};

	const onClickButtonView = () => {
		navigator.go(`/contest/${form.slug}`, {
			params: {
				theme: {
					header: false,
				},
			},
		});
	};

	const SectionInformation = () => {
		const SectionHeader = () => {
			const HeaderBackdrop = () => {
				let container: HTMLDivElement | undefined;

				const [togglePreviewSymbol, setTogglePreviewSymbol] =
					createSignal(true);
				const [patternSize, setPatternSize] = createStore<{
					width?: number;
					height?: number;
				}>();

				createEffect(
					on(
						theme,
						() => {
							setTogglePreviewSymbol(false);

							setTimeout(() => {
								setTogglePreviewSymbol(true);
							});
						},
						{
							defer: true,
						},
					),
				);

				onMount(() => {
					if (!container) return;

					setPatternSize({
						height: container.clientHeight,
						width: container.clientWidth,
					});
				});

				return (
					<div
						id="container-page-create-section-header-backdrop"
						ref={container}
					>
						<Show
							when={theme()?.symbol && patternSize.width && patternSize.height}
						>
							<Show when={togglePreviewSymbol()}>
								<CircularIconPattern
									backdrop={theme()!.backdrop}
									symbol={theme()!.symbol}
									size={{
										width: patternSize.width!,
										height: patternSize.height!,
									}}
									layers={[
										{
											count: 6,
											alpha: 0.425,
											distance: patternSize.height! / 3,
											size: patternSize.height! / 10,
										},
										{
											count: 9,
											alpha: 0.25,
											distance: patternSize.height! / 1.875,
											size: patternSize.height! / 15,
										},
										{
											count: 15,
											alpha: 0.125,
											distance: patternSize.height! / 1.325,
											size: patternSize.height! / 18,
										},
									]}
								/>
							</Show>
						</Show>
					</div>
				);
			};

			const HeaderContent = () => {
				let filePickerImage: HTMLInputElement | undefined;

				const [imagePicker, setImagePicker] = createStore({
					active: false,
					src: "",
				});

				const onClickImagePicker = () => {
					if (!dependencies.cropper) return;
					if (!filePickerImage) return;

					filePickerImage.onchange = (event) => {
						const file = (event.target as HTMLInputElement).files?.[0];

						if (file?.type.startsWith("image/")) {
							setImagePicker({
								active: true,
								src: URL.createObjectURL(file),
							});
						}
					};

					filePickerImage.click();
				};

				const ImagePicker = () => {
					const [processing, setProcessing] = createSignal(false);

					const onClickButtonCrop = async () => {
						setProcessing(true);
						const cropperCanvas = document.querySelector(
							"cropper-selection",
						)! as any;
						setForm("image", await cropperCanvas.$toCanvas());
						setImagePicker("active", false);
						setProcessing(false);
						invokeHapticFeedbackImpact("medium");
					};

					return (
						<>
							<input
								ref={filePickerImage}
								type="file"
								accept="image/*"
								style={{ display: "none" }}
							/>

							<Show
								when={
									dependencies.cropper &&
									imagePicker.active &&
									imagePicker.src.length > 0
								}
							>
								<Portal mount={document.body}>
									<cropper-canvas background>
										<cropper-image
											src={imagePicker.src}
											translatable
											scalable
										></cropper-image>
										<cropper-shade></cropper-shade>
										<cropper-handle action="move" plain></cropper-handle>
										<cropper-selection
											initial-coverage="1"
											aspect-ratio="1"
											movable
											resizable
										>
											<cropper-grid covered></cropper-grid>
											<cropper-crosshair centered></cropper-crosshair>
											<cropper-handle
												action="move"
												theme-color="rgba(255, 255, 255, 0.35)"
											></cropper-handle>
											<cropper-handle action="n-resize"></cropper-handle>
											<cropper-handle action="e-resize"></cropper-handle>
											<cropper-handle action="s-resize"></cropper-handle>
											<cropper-handle action="w-resize"></cropper-handle>
											<cropper-handle action="ne-resize"></cropper-handle>
											<cropper-handle action="nw-resize"></cropper-handle>
											<cropper-handle action="se-resize"></cropper-handle>
											<cropper-handle action="sw-resize"></cropper-handle>
										</cropper-selection>
									</cropper-canvas>
								</Portal>

								<MainButton
									loading={processing()}
									disabled={processing()}
									onClick={onClickButtonCrop}
									text={t("pages.create.options.image.crop")}
								/>
							</Show>
						</>
					);
				};

				return (
					<div id="container-page-create-section-header-content">
						<div
							id="container-page-create-section-header-content-image"
							onClick={onClickImagePicker}
						>
							<button type="button">
								<Show when={form.image} fallback={<HiSolidPlus />}>
									{form.image}
								</Show>
							</button>

							<span class="clickable">
								{t("pages.create.options.image.label")}
							</span>
						</div>

						<ImagePicker />
					</div>
				);
			};

			return (
				<div id="container-page-create-section-header">
					<HeaderBackdrop />
					<HeaderContent />
				</div>
			);
		};

		const SectionThemes = () => {
			const activeSlideIndex = createMemo(() => {
				if (form.theme.backdrop === undefined) return 0;

				return (
					ContestThemeBackdrops.findIndex(
						(item) => item.id === form.theme.backdrop,
					) ?? 0
				);
			});

			const onClickBackdrop = (e: MouseEvent) => {
				const backdrop = (e.currentTarget as HTMLElement).getAttribute(
					"data-backdrop",
				);

				if (!backdrop) return;
				setBackdrop(Number.parseInt(backdrop, 10));
			};

			const setBackdrop = (backdrop: number | undefined) => {
				invokeHapticFeedbackSelectionChanged();
				setForm("theme", "backdrop", backdrop);
			};

			createEffect(
				on(activeSlideIndex, () => {
					(
						document.querySelector(".slider-theme-preview") as any
					)?.swiper.slideTo(activeSlideIndex());
				}),
			);

			const [picker, setPicker] = createSignal(false);
			const [symbol, setSymbol] = createSignal(
				form.theme.symbol ?? DEFAULT_SYMBOL,
			);

			createEffect(
				on(
					symbol,
					() => {
						setForm("theme", "symbol", symbol());
					},
					{
						defer: true,
					},
				),
			);

			return (
				<div id="container-page-create-section-themes">
					<section class="container-section">
						<span>
							<span>{t("pages.create.options.themes.label")}</span>

							<div
								class="clickable symbol-picker-anchor"
								onClick={() => {
									setPicker(true);
								}}
							>
								<SVGSymbol
									id={`backdrop-${form.theme.symbol ?? DEFAULT_SYMBOL}`}
								/>

								<SymbolPicker
									class="create-symbol-picker"
									anchorSelector="#container-page-create-section-themes .symbol-picker-anchor > svg"
									signal={[picker, setPicker]}
									symbol={[symbol, setSymbol]}
									closeOnClickOutside={true}
									animated={true}
									anchorPosition={isRTL() ? "tl" : "tr"}
								/>
							</div>
						</span>

						<div>
							<swiper-container
								class="slider-theme-preview"
								slides-per-view={5}
								slides-offset-before={16}
								slides-offset-after={16}
								space-between={8}
								initial-slide={activeSlideIndex()}
								dir={isRTL() ? "rtl" : "ltr"}
								resistance-ratio="0.25"
								long-swipes-ratio="0.25"
							>
								<swiper-slide>
									<div
										class="theme-preview"
										style="background-color: var(--segmented-bg);"
										classList={{
											active: form.theme.backdrop === undefined,
										}}
										onClick={() => setBackdrop(undefined)}
									></div>
								</swiper-slide>

								<For each={ContestThemeBackdrops}>
									{(theme) => (
										<swiper-slide>
											<ThemePreview
												onClick={onClickBackdrop}
												classList={{
													active: form.theme.backdrop === theme.id,
												}}
												backdrop={
													ContestThemeBackdrops.find(
														(item) => item.id === theme.id,
													)!
												}
												symbol={{
													id: form.theme.symbol ?? DEFAULT_SYMBOL,
													component: getSymbolSVGString(
														form.theme.symbol ?? DEFAULT_SYMBOL,
													),
												}}
											/>
										</swiper-slide>
									)}
								</For>
							</swiper-container>
						</div>
					</section>
				</div>
			);
		};

		const SectionInfo = () => {
			return (
				<div id="container-page-create-section-info">
					<Section>
						<div>
							<input
								class="input"
								type="text"
								placeholder={t("pages.create.options.name.placeholder")}
								value={form.title}
								onInput={(e) => setForm("title", e.currentTarget.value)}
								onBlur={(e) => setForm("title", e.currentTarget.value.trim())}
								onKeyDown={hideKeyboardOnEnter}
								maxLength={store.limits!.form.create.title.maxLength}
							/>
						</div>

						<div>
							<Editor
								value={form.description}
								setValue={(data) => setForm("description", data)}
								placeholder={t("pages.create.options.description.placeholder")}
								maxLength={store.limits!.form.create.description.maxLength}
							/>
						</div>
					</Section>
				</div>
			);
		};

		const SectionInstruction = () => {
			return (
				<div id="container-page-create-section-instruction">
					<Section>
						<textarea
							id="input-instruction"
							placeholder={t("pages.create.options.instruction.placeholder")}
							value={form.instruction}
							onInput={(e) => setForm("instruction", e.currentTarget.value)}
							onChange={(e) => {
								setForm("instruction", e.currentTarget.value.trim());
							}}
							minLength={store.limits!.form.create.instruction.maxLength}
							maxLength={store.limits!.form.create.instruction.maxLength}
						/>
					</Section>
				</div>
			);
		};

		const SectionOptions = () => {
			const [duration, setDuration] = createSignal("7");
			const [modal, setModal] = createSignal(false);

			createEffect(
				on(duration, (current, prev) => {
					if (current === "0") {
						batch(() => {
							setDuration(prev ?? "7");
							setModal(true);
						});
						return;
					}

					setForm(
						"date",
						"end",
						Math.trunc(Date.now() / 86400_000) * 86400_000 +
							Number.parseInt(duration(), 10) * 86400_000,
					);
				}),
			);

			return (
				<div id="container-page-create-section-options">
					<SectionList
						items={[
							{
								label: t("pages.create.options.duration.label"),
								placeholder: () => (
									<SectionListSelect
										value={duration()}
										setValue={setDuration}
										items={[
											{
												value: "1",
												label: t("pages.create.options.duration.options.day"),
											},
											{
												value: "7",
												label: t("pages.create.options.duration.options.week"),
											},
											{
												value: "30",
												label: t("pages.create.options.duration.options.month"),
											},
											{
												value: "0",
												label: t(
													"pages.create.options.duration.options.custom",
												),
											},
											...Array.from(new Array(90))
												.map((_, i) => ({
													value: (i + 1).toString(),
													label: td(
														"pages.create.options.duration.custom.plural",
														{
															day: (i + 1).toString(),
														},
													),
													disabled: true,
													hidden: true,
												}))
												.filter((_, i) => ![1, 7, 30].includes(i + 1)),
										]}
									/>
								),
							},
							{
								label: t("pages.create.options.prize.label"),
								placeholder: () => (
									<SectionListInput
										type="text"
										placeholder="$10,000 USDT"
										value={form.prize}
										setValue={(value) => setForm("prize", value)}
										maxLength={store.limits!.form.create.prize.maxLength}
										onBlur={() => {
											setForm("prize", formatNumbersInString(form.prize));
										}}
									/>
								),
							},
						]}
					/>

					<Show when={modal()}>
						<Modal
							onClose={() => setModal(false)}
							portalParent={document.querySelector("#portals")!}
							class="modal-section-list-picker"
							withCloseButton={true}
						>
							<p>{t("pages.create.options.duration.custom.label")}</p>

							<WheelPicker
								items={Array.from(new Array(90)).map((_, index) => ({
									value: (index + 1).toString(),
									label:
										index === 0
											? td("pages.create.options.duration.custom.singular", {
													day: (index + 1).toString(),
												})
											: td("pages.create.options.duration.custom.plural", {
													day: (index + 1).toString(),
												}),
								}))}
								setValue={setDuration}
								value={duration()}
							/>

							<CustomMainButton
								text={t("general.done")}
								onClick={() => setModal(false)}
							/>
						</Modal>
					</Show>
				</div>
			);
		};

		const SectionParticipants = () => {
			const updateFeeValue = (input: string) => {
				const value = clamp(
					Number.isNaN(Number.parseFloat(input))
						? store.limits!.form.create.fee.min
						: Number.parseFloat(input),
					store.limits!.form.create.fee.min,
					store.limits!.form.create.fee.max,
				);
				setForm("fee", value);
			};

			const feeDisplayValue = createMemo(() =>
				form.fee > 0 ? form.fee.toString() : "",
			);

			return (
				<div id="container-page-create-section-participants">
					<SectionList
						title={t("pages.create.options.participants.label")}
						items={[
							{
								label: () => (
									<span
										onClick={() => {
											setModals("anonymous", "open", true);
										}}
										class="clickable"
										style={{
											display: "flex",
											gap: "0.375rem",
											"align-items": "center",
										}}
									>
										{t("pages.create.options.participants.anonymous.label")}
										<FiInfo
											style={{ opacity: "0.5", "font-size": "1.125rem" }}
										/>
									</span>
								),
								placeholder: () => (
									<SectionListSwitch
										value={form.anonymous}
										setValue={(value) => setForm("anonymous", value)}
									/>
								),
							},
							{
								label: t("pages.create.options.fee.label"),
								placeholder: () => (
									<SectionListInput
										class="input-fee"
										type="number"
										inputmode="decimal"
										placeholder={t("pages.create.options.fee.free")}
										value={feeDisplayValue()}
										setValue={updateFeeValue}
										min={store.limits!.form.create.fee.min}
										max={store.limits!.form.create.fee.max}
										append={() => <SVGSymbol id="TON" />}
									/>
								),
							},
						]}
					/>
				</div>
			);
		};

		return (
			<>
				<SectionHeader />

				<div id="container-page-create-sections">
					<SectionThemes />

					<SectionInfo />

					<SectionInstruction />

					<SectionOptions />

					<SectionParticipants />
				</div>
			</>
		);
	};

	const SectionWallet = () => {
		let btnConnect: HTMLDivElement | undefined;

		const disposeOnModalStateChange = tonConnectUI?.onModalStateChange(
			() => {},
		);

		const disposeOnStatusChange = tonConnectUI?.onStatusChange((wallet) => {
			setForm("fee_wallet", wallet?.account.address);
		});

		const onClickButtonConnect = async () => {
			if (!dependencies.tonconnect && tonConnectUI) {
				setDependencies("tonconnect", await initializeTonConnect());
				setTimeout(onClickButtonConnect);
				return;
			}

			setProcessing(true);
			invokeHapticFeedbackImpact("light");

			if (tonConnectUI?.connected) {
				await tonConnectUI?.disconnect();
			}
			await tonConnectUI?.openModal();

			setProcessing(false);
		};

		onMount(async () => {
			setProcessing(true);
			invokeHapticFeedbackImpact("soft");

			onCleanup(() => {
				disposeOnModalStateChange?.();
				disposeOnStatusChange?.();
			});

			setDependencies("tonconnect", await initializeTonConnect());

			await tonConnectUI?.connectionRestored;
			setProcessing(false);

			if (tonConnectUI?.wallet) {
				setForm("fee_wallet", tonConnectUI.wallet.account.address);
			}
		});

		return (
			<div id="container-page-create-section-wallet">
				<LottiePlayerMotion
					src={TGS.bag.url}
					outline={TGS.bag.outline}
					autoplay
					playOnClick
				/>

				<h1>{t("pages.create.wallet.title")}</h1>

				<p class="text-secondary">{t("pages.create.wallet.description")}</p>

				<div
					ref={btnConnect}
					onClick={onClickButtonConnect}
					id="btn-connect"
					class="clickable"
					classList={{ disabled: !dependencies.tonconnect || processing() }}
				>
					<SVGSymbol id="TON" />

					<div>
						<Show
							when={form.fee_wallet}
							fallback={<span>{t("pages.create.wallet.button.text")}</span>}
						>
							<span>
								{formatTonAddress(parseTONAddress(form.fee_wallet!)!)}
							</span>
						</Show>
					</div>
				</div>

				<span class="text-hint">{t("pages.create.wallet.hint")}</span>
			</div>
		);
	};

	const SectionDone = () => {
		onMount(async () => {
			invokeHapticFeedbackNotification("success");
		});

		return (
			<div id="container-page-create-section-done">
				<LottiePlayerMotion
					src={TGS.duckConfetti.url}
					outline={TGS.duckConfetti.outline}
					autoplay
					loop
				/>

				<h1>{t("pages.create.done.title")}</h1>

				<p class="text-secondary">{t("pages.create.done.description")}</p>
			</div>
		);
	};

	return (
		<>
			<div id="container-page-create" class="page">
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
						<Match when={step() === "information"}>
							<SectionInformation />
						</Match>

						<Match when={step() === "wallet"}>
							<SectionWallet />
						</Match>

						<Match when={step() === "done"}>
							<SectionDone />
						</Match>
					</Switch>
				</div>

				<footer>
					<Switch>
						<Match when={step() === "information" || step() === "wallet"}>
							<CustomMainButton
								onClick={onClickButton}
								text={t("pages.create.button.create.text")}
								disabled={buttonDisabled() || processing()}
								loading={processing()}
							/>
						</Match>

						<Match when={step() === "done"}>
							<CustomMainButton
								onClick={onClickButtonView}
								text={t("pages.create.done.buttons.view")}
							/>
						</Match>
					</Switch>
				</footer>
			</div>

			<BackButton onClick={onBackButton} />
		</>
	);
};

export default PageCreate;
