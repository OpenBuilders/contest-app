import "./Create.scss";

import { createVirtualizer } from "@tanstack/solid-virtual";
import { TbPhotoPlus } from "solid-icons/tb";
import {
	type Accessor,
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
	type Setter,
	Show,
	Switch,
} from "solid-js";
import { createStore, type SetStoreFunction } from "solid-js/store";
import { Portal } from "solid-js/web";
import CircularIconPattern from "../components/CircularIconPattern";
import ClickableText from "../components/ClickableText";
import CustomMainButton from "../components/CustomMainButton";
import Editor from "../components/Editor";
import LottiePlayerMotion from "../components/LottiePlayerMotion";
import MainButton from "../components/MainButton";
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
import WheelPicker from "../components/WheelPicker";
import { useTranslation } from "../contexts/TranslationContext";
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
import { navigator } from "../utils/navigator";
import { clamp, formatNumbersInString } from "../utils/number";
import { toggleSignal } from "../utils/signals";
import { store } from "../utils/store";
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

type CreateFormStore = {
	title: string;
	description: string;
	image?: HTMLCanvasElement;
	prize: string;
	date: {
		end: number;
	};
	theme: {
		backdrop?: number;
		symbol?: string;
	};
	category: string;
	fee: number;
	fee_wallet?: string;
	public: boolean;
	anonymous: boolean;
	slug?: string;
};

type CreateFormStep = "intro" | "basic" | "options" | "done" | "wallet";

type CreateFormSectionProps = {
	stepSignal: [Accessor<CreateFormStep>, Setter<CreateFormStep>];
	formStore: [CreateFormStore, SetStoreFunction<CreateFormStore>];
};

const DEFAULT_SYMBOL = "symbol-55";

const SectionIntro: Component<CreateFormSectionProps> = (props) => {
	const { t } = useTranslation();

	const [, setStep] = props.stepSignal;

	const onClickButton = () => {
		setStep("basic");
	};

	onMount(async () => {
		invokeHapticFeedbackImpact("soft");

		await initializeCropper();
		await initializeDOMPurify();
		await initializeTonConnect();
	});

	return (
		<div id="container-create-section-intro">
			<div>
				<LottiePlayerMotion
					src={TGS.duckTrophy.url}
					outline={TGS.duckTrophy.outline}
					autoplay
					playOnClick
				/>

				<h1>{t("pages.create.intro.title")}</h1>

				<p class="text-secondary">{t("pages.create.intro.description")}</p>
			</div>

			<CustomMainButton
				onClick={onClickButton}
				text={t("pages.create.intro.button")}
			/>
		</div>
	);
};

const SectionBasic: Component<CreateFormSectionProps> = (props) => {
	const { t, td } = useTranslation();

	const [, setStep] = props.stepSignal;
	const [form, setForm] = props.formStore;

	const [dependencies, setDependencies] = createStore({
		cropper: false,
	});

	let filePickerImage: HTMLInputElement | undefined;

	const [imagePicker, setImagePicker] = createStore({
		active: false,
		src: "",
	});

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

		return (
			form.title.trim().length < store.limits!.form.create.title.minLength ||
			form.title.trim().length > store.limits!.form.create.title.maxLength
		);
	});

	const onClickButton = () => {
		setStep("options");
	};

	const onClickImage = () => {
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
			const cropperCanvas = document.querySelector("cropper-selection")! as any;
			setForm("image", await cropperCanvas.$toCanvas());
			setImagePicker("active", false);
			setProcessing(false);
			invokeHapticFeedbackImpact("medium");
		};

		return (
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
					text={t("pages.create.basic.image.crop")}
				/>
			</Show>
		);
	};

	const SubsectionContestInfo = () => {
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
					Math.trunc(Date.now() / 86400) * 86400 +
						Number.parseInt(duration(), 10) * 86400_000,
				);
			}),
		);

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
			<>
				<SectionList
					// title={t("pages.create.options.contest.label")}
					items={[
						{
							label: t("pages.create.options.contest.duration.label"),
							placeholder: () => (
								<SectionListSelect
									value={duration()}
									setValue={setDuration}
									items={[
										{
											value: "1",
											label: t(
												"pages.create.options.contest.duration.options.day",
											),
										},
										{
											value: "7",
											label: t(
												"pages.create.options.contest.duration.options.week",
											),
										},
										{
											value: "30",
											label: t(
												"pages.create.options.contest.duration.options.month",
											),
										},
										{
											value: "0",
											label: t(
												"pages.create.options.contest.duration.options.custom",
											),
										},
										...Array.from(new Array(90))
											.map((_, i) => ({
												value: (i + 1).toString(),
												label: td(
													"pages.create.options.contest.duration.custom.plural",
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
							label: t("pages.create.options.contest.prize.label"),
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
						{
							label: t("pages.create.options.participants.fee.label"),
							placeholder: () => (
								<SectionListInput
									class="input-fee"
									type="number"
									inputmode="decimal"
									placeholder={t("pages.create.options.participants.fee.free")}
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

				<Show when={modal()}>
					<Modal
						onClose={() => setModal(false)}
						portalParent={document.querySelector("#portals")!}
						class="modal-section-list-picker"
					>
						<p>{t("pages.create.options.contest.duration.custom.label")}</p>

						<WheelPicker
							items={Array.from(new Array(90)).map((_, index) => ({
								value: (index + 1).toString(),
								label:
									index === 0
										? td(
												"pages.create.options.contest.duration.custom.singular",
												{
													day: (index + 1).toString(),
												},
											)
										: td(
												"pages.create.options.contest.duration.custom.plural",
												{
													day: (index + 1).toString(),
												},
											),
							}))}
							setValue={setDuration}
							value={duration()}
						/>
					</Modal>
				</Show>
			</>
		);
	};

	onMount(async () => {
		invokeHapticFeedbackImpact("soft");

		setDependencies("cropper", await initializeCropper());
	});

	return (
		<>
			<div id="container-create-section-basic">
				<div>
					<Section>
						<button type="button" onClick={onClickImage}>
							<Show when={form.image} fallback={<TbPhotoPlus />}>
								{form.image}
							</Show>
						</button>

						<input
							class="input"
							type="text"
							placeholder={t("pages.create.basic.name.placeholder")}
							value={form.title}
							onInput={(e) => setForm("title", e.currentTarget.value)}
							onBlur={(e) => setForm("title", e.currentTarget.value.trim())}
							onKeyDown={hideKeyboardOnEnter}
							maxLength={store.limits!.form.create.title.maxLength}
						/>
					</Section>

					<SubsectionContestInfo />

					<Section
						class="container-section-editor"
						description={t("pages.create.basic.description.hint")}
					>
						<Editor
							value={form.description}
							setValue={(data) => setForm("description", data)}
							placeholder={t("pages.create.basic.description.placeholder")}
							maxLength={store.limits!.form.create.description.maxLength}
						/>
					</Section>
				</div>

				<CustomMainButton
					onClick={onClickButton}
					text={t("general.continue")}
					disabled={buttonDisabled()}
				/>
			</div>

			<input
				ref={filePickerImage}
				type="file"
				accept="image/*"
				style={{ display: "none" }}
			/>

			<ImagePicker />
		</>
	);
};

const SectionOptions: Component<CreateFormSectionProps> = (props) => {
	const { t } = useTranslation();

	const [, setStep] = props.stepSignal;
	const [form, setForm] = props.formStore;
	const [processing, setProcessing] = createSignal(false);

	const [togglePreview, setTogglePreview] = createSignal(true);

	const buttonDisabled = createMemo(() => {
		// if (form.date.end < Math.trunc(Date.now() / 86400_000 + 1) * 86400_000) {
		// 	return true;
		// }

		// if (form.prize.length > store.limits!.form.create.prize.maxLength) {
		// 	return true;
		// }

		// if (form.public && form.category === "none") {
		// 	return true;
		// }

		// if (form.category !== "none" && !(form.category in store.categories!)) {
		// 	return true;
		// }

		// if (
		// 	form.fee < store.limits!.form.create.fee.min ||
		// 	form.fee > store.limits!.form.create.fee.max
		// ) {
		// 	return true;
		// }

		return false;
	});

	const onClickButton = async () => {
		if (processing()) return;
		setProcessing(true);

		invokeHapticFeedbackImpact("soft");

		if (form.fee) {
			setStep("wallet");
		} else {
			await submitContest(form, setForm, setStep);
		}
	};

	onMount(async () => {
		invokeHapticFeedbackImpact("soft");
	});

	const SubsectionPreview = () => {
		let container: HTMLElement | undefined;

		const [patternSize, setPatternSize] = createStore<{
			width?: number;
			height?: number;
		}>();

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

		createEffect(
			on(
				theme,
				() => {
					setTogglePreview(false);

					setTimeout(() => {
						setTogglePreview(true);
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
			<section
				ref={container}
				id="container-subsection-preview"
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
				<Show when={theme()?.symbol && patternSize.width && patternSize.height}>
					<Show when={togglePreview()}>
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

				<Show
					when={form.image}
					fallback={
						<div class="empty">
							<Show
								when={theme()?.symbol}
								fallback={
									<div>
										<SVGSymbol id="AiOutlineTrophy" />
									</div>
								}
							>
								<div innerHTML={theme()!.symbol.component as string}></div>
							</Show>
						</div>
					}
				>
					<div>{form.image}</div>
				</Show>

				<h1>{form.title}</h1>
			</section>
		);
	};

	// const SubsectionContest = () => {
	// 	const [duration, setDuration] = createSignal("7");
	// 	const [modal, setModal] = createSignal(false);

	// 	createEffect(
	// 		on(duration, (current, prev) => {
	// 			if (current === "0") {
	// 				batch(() => {
	// 					setDuration(prev ?? "7");
	// 					setModal(true);
	// 				});
	// 				return;
	// 			}

	// 			setForm(
	// 				"date",
	// 				"end",
	// 				Math.trunc(Date.now() / 86400) * 86400 +
	// 					Number.parseInt(duration()) * 86400_000,
	// 			);
	// 		}),
	// 	);

	// 	return (
	// 		<>
	// 			<SectionList
	// 				title={t("pages.create.options.contest.label")}
	// 				items={[
	// 					{
	// 						label: t("pages.create.options.contest.duration.label"),
	// 						placeholder: () => (
	// 							<SectionListSelect
	// 								value={duration()}
	// 								setValue={setDuration}
	// 								items={[
	// 									{
	// 										value: "1",
	// 										label: t(
	// 											"pages.create.options.contest.duration.options.day",
	// 										),
	// 									},
	// 									{
	// 										value: "7",
	// 										label: t(
	// 											"pages.create.options.contest.duration.options.week",
	// 										),
	// 									},
	// 									{
	// 										value: "30",
	// 										label: t(
	// 											"pages.create.options.contest.duration.options.month",
	// 										),
	// 									},
	// 									{
	// 										value: "0",
	// 										label: t(
	// 											"pages.create.options.contest.duration.options.custom",
	// 										),
	// 									},
	// 									...Array.from(new Array(90))
	// 										.map((_, i) => ({
	// 											value: (i + 1).toString(),
	// 											label: td(
	// 												"pages.create.options.contest.duration.custom.plural",
	// 												{
	// 													day: (i + 1).toString(),
	// 												},
	// 											),
	// 											disabled: true,
	// 											hidden: true,
	// 										}))
	// 										.filter((_, i) => ![1, 7, 30].includes(i + 1)),
	// 								]}
	// 							/>
	// 						),
	// 					},
	// 					{
	// 						label: t("pages.create.options.contest.prize.label"),
	// 						placeholder: () => (
	// 							<SectionListInput
	// 								type="text"
	// 								placeholder="$10,000 USDT"
	// 								value={form.prize}
	// 								setValue={(value) => setForm("prize", value)}
	// 								maxLength={store.limits!.form.create.prize.maxLength}
	// 								onBlur={() => {
	// 									setForm("prize", formatNumbersInString(form.prize));
	// 								}}
	// 							/>
	// 						),
	// 					},
	// 				]}
	// 			/>

	// 			<Show when={modal()}>
	// 				<Modal
	// 					onClose={() => setModal(false)}
	// 					portalParent={document.querySelector("#portals")!}
	// 					class="modal-section-list-picker"
	// 				>
	// 					<p>{t("pages.create.options.contest.duration.custom.label")}</p>

	// 					<WheelPicker
	// 						items={Array.from(new Array(90)).map((_, index) => ({
	// 							value: (index + 1).toString(),
	// 							label:
	// 								index === 0
	// 									? td(
	// 											"pages.create.options.contest.duration.custom.singular",
	// 											{
	// 												day: (index + 1).toString(),
	// 											},
	// 										)
	// 									: td(
	// 											"pages.create.options.contest.duration.custom.plural",
	// 											{
	// 												day: (index + 1).toString(),
	// 											},
	// 										),
	// 						}))}
	// 						setValue={setDuration}
	// 						value={duration()}
	// 					/>
	// 				</Modal>
	// 			</Show>
	// 		</>
	// 	);
	// };

	// const SubsectionVisibility = () => {
	// 	return (
	// 		<SectionList
	// 			title={t("pages.create.options.visibility.label")}
	// 			description={() => (
	// 				<ClickableText
	// 					text={t("pages.create.options.visibility.description")}
	// 					listeners={{
	// 						public: () => {
	// 							setModals("createPublic", "open", true);
	// 						},
	// 						category: () => {
	// 							setModals("createCategory", "open", true);
	// 						},
	// 					}}
	// 				/>
	// 			)}
	// 			items={[
	// 				{
	// 					label: t("pages.create.options.visibility.public.label"),
	// 					placeholder: () => (
	// 						<SectionListSwitch
	// 							value={form.public}
	// 							setValue={(value) => setForm("public", value)}
	// 						/>
	// 					),
	// 				},
	// 				{
	// 					label: t("pages.create.options.visibility.category.label"),
	// 					placeholder: () => (
	// 						<SectionListPicker
	// 							value={form.category}
	// 							setValue={(value) => setForm("category", value)}
	// 							items={[
	// 								{
	// 									value: "none",
	// 									label: t(
	// 										"pages.create.options.visibility.category.default",
	// 									),
	// 								},
	// 								...Object.entries(store.categories!).map(
	// 									([value, label]) => ({
	// 										value,
	// 										label,
	// 									}),
	// 								),
	// 							]}
	// 						/>
	// 					),
	// 				},
	// 			]}
	// 		/>
	// 	);
	// };

	const SubsectionParticipants = () => {
		return (
			<SectionList
				title={t("pages.create.options.participants.label")}
				description={() => (
					<ClickableText
						text={t("pages.create.options.participants.description")}
						listeners={{
							anonymous: () => {
								setModals("createAnonymous", "open", true);
							},
						}}
					/>
				)}
				items={[
					{
						label: t("pages.create.options.participants.anonymous.label"),
						placeholder: () => (
							<SectionListSwitch
								value={form.anonymous}
								setValue={(value) => setForm("anonymous", value)}
							/>
						),
					},
				]}
			/>
		);
	};

	const SubsectionThemes = () => {
		const activeSlideIndex = createMemo(() => {
			if (form.theme.backdrop === undefined) return 0;

			return (
				ContestThemeBackdrops.findIndex(
					(item) => item.id === form.theme.backdrop,
				) ?? 0
			);
		});

		const onClick = (e: MouseEvent) => {
			const backdrop = (e.currentTarget as HTMLElement).getAttribute(
				"data-backdrop",
			);

			if (!backdrop) return;
			selectBackdrop(Number.parseInt(backdrop, 10));
		};

		const selectBackdrop = (backdrop: number | undefined) => {
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
		const [value, setValue] = createSignal(form.theme.symbol ?? DEFAULT_SYMBOL);

		createEffect(
			on(
				value,
				() => {
					setForm("theme", "symbol", value());
				},
				{
					defer: true,
				},
			),
		);

		const BackdropsVirtualList = () => {
			let elementParent: HTMLDivElement | undefined;

			const itemsPerRow = 3;

			const itemWidth = 100 / itemsPerRow;

			const size = Math.floor((document.body.clientWidth - 16 * 4) / 3);

			const pickerVirtualizer = createVirtualizer({
				count: ContestThemeBackdrops.length + 1,
				getScrollElement: () => elementParent!,
				estimateSize: () => size,
				lanes: itemsPerRow,
				overscan: itemsPerRow * 2,
				gap: 0,
			});

			onMount(() => {
				// pickerVirtualizer.scrollToIndex(ContestThemeBackdrops.findIndex(i => ), {
				// 	align: "start",
				// });
				//
			});

			return (
				<div id="container-backdrops-list" ref={elementParent}>
					<ul style={{ height: `${pickerVirtualizer.getTotalSize()}px` }}>
						<For each={pickerVirtualizer.getVirtualItems()}>
							{(virtualItem) => (
								<li
									style={{
										height: `${virtualItem.size}px`,
										transform: `translateY(${virtualItem.start}px)`,
										left: `${virtualItem.lane * itemWidth}%`,
										width: `${itemWidth}%`,
									}}
								>
									<div>
										<Show
											when={virtualItem.index > 0}
											fallback={
												<div
													class="theme-preview"
													style="background-color: var(--secondary-color);"
													classList={{
														active: form.theme.backdrop === undefined,
													}}
													onClick={() => selectBackdrop(undefined)}
												></div>
											}
										>
											<ThemePreview
												onClick={onClick}
												classList={{
													active:
														form.theme.backdrop ===
														ContestThemeBackdrops[virtualItem.index - 1].id,
												}}
												backdrop={ContestThemeBackdrops[virtualItem.index - 1]}
												symbol={{
													id: form.theme.symbol ?? DEFAULT_SYMBOL,
													component: getSymbolSVGString(
														form.theme.symbol ?? DEFAULT_SYMBOL,
													),
												}}
												size={size}
											/>
										</Show>
									</div>
								</li>
							)}
						</For>
					</ul>
				</div>
			);
		};

		return (
			<section id="container-section-themes">
				<SectionList
					items={[
						{
							class: "container-section-symbol",
							label: t("pages.create.options.themes.symbol.label"),
							placeholder: () => (
								<div
									onClick={() => {
										setPicker(true);
									}}
								>
									<SVGSymbol
										id={`backdrop-${form.theme.symbol ?? DEFAULT_SYMBOL}`}
									/>
									<SVGSymbol id="FaSolidChevronRight" />
									<SymbolPicker
										anchorSelector=".container-section-symbol div.placeholder"
										signal={[picker, setPicker]}
										symbol={[value, setValue]}
										closeOnClickOutside={true}
										animated={true}
										anchorPosition={isRTL() ? "tl" : "tr"}
									/>
								</div>
							),
						},
					]}
					title={t("pages.create.options.themes.label")}
				/>

				{false && (
					<Section class="container-section-themes">
						<swiper-container
							class="slider-theme-preview"
							slides-per-view={3.75}
							slides-offset-before={8}
							slides-offset-after={8}
							initial-slide={activeSlideIndex()}
							dir={isRTL() ? "rtl" : "ltr"}
							free-mode="true"
						>
							<swiper-slide>
								<div
									class="theme-preview"
									style="background-color: var(--secondary-color);"
									classList={{
										active: form.theme.backdrop === undefined,
									}}
									onClick={() => selectBackdrop(undefined)}
								></div>
							</swiper-slide>

							<For each={ContestThemeBackdrops}>
								{(backdrop) => (
									<swiper-slide>
										<ThemePreview
											onClick={onClick}
											classList={{
												active: form.theme.backdrop === backdrop.id,
											}}
											backdrop={backdrop}
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
					</Section>
				)}

				<Section class="container-section-themes">
					<BackdropsVirtualList />
				</Section>
			</section>
		);
	};

	return (
		<div id="container-create-section-options">
			<div>
				<SubsectionPreview />

				{/*<SubsectionContest />*/}

				{/*<SubsectionVisibility />*/}

				<SubsectionThemes />

				<SubsectionParticipants />
			</div>

			<CustomMainButton
				onClick={onClickButton}
				text={t("general.continue")}
				disabled={buttonDisabled() || processing()}
				loading={processing()}
			/>
		</div>
	);
};

const SectionWallet: Component<CreateFormSectionProps> = (props) => {
	let btnConnect: HTMLDivElement | undefined;

	const [dependencies, setDependencies] = createStore({
		tonconnect: false,
	});

	const { t } = useTranslation();

	const [, setStep] = props.stepSignal;
	const [form, setForm] = props.formStore;
	const [processing, setProcessing] = createSignal(false);

	const buttonDisabled = createMemo(() => {
		if (!isTonAddress(form.fee_wallet ?? "")) {
			return true;
		}

		return false;
	});

	const onClickButton = async () => {
		if (processing()) return;
		setProcessing(true);

		invokeHapticFeedbackImpact("soft");

		await submitContest(form, setForm, setStep);
	};

	const disposeOnModalStateChange = tonConnectUI?.onModalStateChange(() => {});

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
		<div id="container-create-section-wallet">
			<div>
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

			<CustomMainButton
				onClick={onClickButton}
				text={t("general.continue")}
				disabled={buttonDisabled() || processing()}
				loading={processing()}
			/>
		</div>
	);
};

const SectionDone: Component<CreateFormSectionProps> = (props) => {
	const { t } = useTranslation();

	const [form] = props.formStore;

	const onClickButton = () => {
		setModals("create", "open", false);

		navigator.go(`/contest/${form.slug}`, {
			params: {
				theme: {
					header: false,
				},
			},
		});
	};

	onMount(async () => {
		invokeHapticFeedbackImpact("soft");
	});

	return (
		<div id="container-create-section-done">
			<div>
				<LottiePlayerMotion
					src={TGS.duckConfetti.url}
					outline={TGS.duckConfetti.outline}
					autoplay
					loop
				/>

				<h1>{t("pages.create.done.title")}</h1>

				<p class="text-secondary">{t("pages.create.done.description")}</p>
			</div>

			<CustomMainButton
				onClick={onClickButton}
				text={t("pages.create.done.buttons.view")}
			/>
		</div>
	);
};

const submitContest = async (
	form: CreateFormStore,
	setForm: SetStoreFunction<CreateFormStore>,
	setStep: Setter<CreateFormStep>,
) => {
	const request = await requestAPI(
		"/contest/create",
		{
			title: form.title,
			description: form.description,
			prize: form.prize,
			date: JSON.stringify(form.date),
			theme: JSON.stringify(form.theme),
			category: form.category,
			fee: form.fee.toString(),
			fee_wallet: form.fee_wallet,
			public: form.public ? "true" : "false",
			anonymous: form.anonymous ? "true" : "false",
			image: form.image
				? ((await canvasToBlob(form.image, "image/webp", 0.95)) ?? undefined)
				: undefined,
		},
		"POST",
	);

	if (request) {
		const { result } = request;

		invokeHapticFeedbackNotification("success");

		batch(() => {
			setForm("slug", result.slug);
			setStep("done");
			toggleSignal("fetchMyContests");
		});
	}
};

export const SectionCreateForm = () => {
	const [step, setStep] = createSignal<CreateFormStep>("intro");
	const [form, setForm] = createStore<CreateFormStore>({
		title: "",
		description: "",
		prize: "",
		date: {
			end: Math.trunc((Date.now() + 7 * 86400 * 1000) / 86400) * 86400,
		},
		theme: {},
		category: "none",
		fee: 0,
		public: false,
		anonymous: false,
	});

	return (
		<div id="container-create" data-step={step()}>
			<Switch>
				<Match when={step() === "intro"}>
					<SectionIntro
						formStore={[form, setForm]}
						stepSignal={[step, setStep]}
					/>
				</Match>

				<Match when={step() === "basic"}>
					<SectionBasic
						formStore={[form, setForm]}
						stepSignal={[step, setStep]}
					/>
				</Match>

				<Match when={step() === "options"}>
					<SectionOptions
						formStore={[form, setForm]}
						stepSignal={[step, setStep]}
					/>
				</Match>

				<Match when={step() === "wallet"}>
					<SectionWallet
						formStore={[form, setForm]}
						stepSignal={[step, setStep]}
					/>
				</Match>

				<Match when={step() === "done"}>
					<SectionDone
						formStore={[form, setForm]}
						stepSignal={[step, setStep]}
					/>
				</Match>
			</Switch>
		</div>
	);
};
