import "./Create.scss";

import CropperCanvas from "@cropper/element-canvas";
import CropperGrid from "@cropper/element-grid";
import CropperHandle from "@cropper/element-handle";
import CropperImage from "@cropper/element-image";
import CropperSelection from "@cropper/element-selection";
import CropperShade from "@cropper/element-shade";

import { useNavigate } from "@solidjs/router";
import { CustomIcon } from "solid-icons";
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
	onMount,
	type Setter,
	Show,
	Switch,
} from "solid-js";
import { createStore, type SetStoreFunction } from "solid-js/store";
import { Portal } from "solid-js/web";
import BackButton from "../components/BackButton";
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
	SectionListPicker,
	SectionListSelect,
	SectionListSwitch,
} from "../components/Section";
import ThemePreview from "../components/ThemePreview";
import WheelPicker from "../components/WheelPicker";
import { useTranslation } from "../contexts/TranslationContext";
import { TGS } from "../utils/animations";
import { requestAPI } from "../utils/api";
import { canvasToBlob } from "../utils/general";
import { isRTL } from "../utils/i18n";
import { hideKeyboardOnEnter } from "../utils/input";
import { setModals } from "../utils/modal";
import { clamp, formatNumbersInString } from "../utils/number";
import { toggleSignal } from "../utils/signals";
import { store } from "../utils/store";
import { getSymbolSVGString } from "../utils/symbols";
import {
	invokeHapticFeedbackImpact,
	invokeHapticFeedbackSelectionChanged,
} from "../utils/telegram";
import { ContestThemeBackdrops, ContestThemes } from "../utils/themes";

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

CropperCanvas.$define();
CropperImage.$define();
CropperHandle.$define();
CropperShade.$define();
CropperSelection.$define();
CropperGrid.$define();

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
	public: boolean;
	anonymous: boolean;
	slug?: string;
};

type CreateFormStep = "intro" | "basic" | "options" | "done";

type CreateFormSectionProps = {
	stepSignal: [Accessor<CreateFormStep>, Setter<CreateFormStep>];
	formStore: [CreateFormStore, SetStoreFunction<CreateFormStore>];
};

const SectionIntro: Component<CreateFormSectionProps> = (props) => {
	const { t } = useTranslation();

	const [, setStep] = props.stepSignal;

	const onClickButton = () => {
		setStep("basic");
	};

	onMount(async () => {
		invokeHapticFeedbackImpact("soft");
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
	const { t } = useTranslation();

	const [, setStep] = props.stepSignal;
	const [form, setForm] = props.formStore;

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

		return (
			form.title.trim().length < store.limits!.form.create.title.minLength ||
			form.title.trim().length > store.limits!.form.create.title.maxLength
		);
	});

	const onClickButton = () => {
		setStep("options");
	};

	const onClickImage = () => {
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
			<Show when={imagePicker.active && imagePicker.src.length > 0}>
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

	onMount(async () => {
		invokeHapticFeedbackImpact("soft");
	});

	return (
		<>
			<div id="container-create-section-basic">
				<div>
					<header>
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
					</header>

					<section>
						<Editor
							value={form.description}
							setValue={(data) => setForm("description", data)}
							placeholder={t("pages.create.basic.description.placeholder")}
							maxLength={store.limits!.form.create.description.maxLength}
						/>

						<p class="text-hint">{t("pages.create.basic.description.hint")}</p>
					</section>
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
	const { t, td } = useTranslation();

	const [, setStep] = props.stepSignal;
	const [form, setForm] = props.formStore;
	const [processing, setProcessing] = createSignal(false);

	const buttonDisabled = createMemo(() => {
		if (form.date.end < Math.trunc(Date.now() / 86400_000 + 1) * 86400_000) {
			return true;
		}

		if (form.prize.length > store.limits!.form.create.prize.maxLength) {
			return true;
		}

		if (form.public && form.category === "none") {
			return true;
		}

		if (form.category !== "none" && !(form.category in store.categories!)) {
			return true;
		}

		if (
			form.fee < store.limits!.form.create.fee.min ||
			form.fee > store.limits!.form.create.fee.max
		) {
			return true;
		}

		return false;
	});

	const onClickButton = async () => {
		if (processing()) return;
		setProcessing(true);

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

			batch(() => {
				setForm("slug", result.slug);
				setStep("done");
				toggleSignal("fetchMyContests");
			});
		}
	};

	onMount(async () => {
		invokeHapticFeedbackImpact("soft");
	});

	const SubsectionContest = () => {
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
						Number.parseInt(duration()) * 86400_000,
				);
			}),
		);

		return (
			<>
				<SectionList
					title={t("pages.create.options.contest.label")}
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

	const SubsectionVisibility = () => {
		return (
			<SectionList
				title={t("pages.create.options.visibility.label")}
				description={() => (
					<ClickableText
						text={t("pages.create.options.visibility.description")}
						listeners={{
							public: () => {
								setModals("createPublic", "open", true);
							},
							category: () => {
								setModals("createCategory", "open", true);
							},
						}}
					/>
				)}
				items={[
					{
						label: t("pages.create.options.visibility.public.label"),
						placeholder: () => (
							<SectionListSwitch
								value={form.public}
								setValue={(value) => setForm("public", value)}
							/>
						),
					},
					{
						label: t("pages.create.options.visibility.category.label"),
						placeholder: () => (
							<SectionListPicker
								value={form.category}
								setValue={(value) => setForm("category", value)}
								items={[
									{
										value: "none",
										label: t(
											"pages.create.options.visibility.category.default",
										),
									},
									...Object.entries(store.categories!).map(
										([value, label]) => ({
											value,
											label,
										}),
									),
								]}
							/>
						),
					},
				]}
			/>
		);
	};

	const SubsectionParticipants = () => {
		const updateValue = (input: string) => {
			const value = clamp(
				Number.isNaN(Number.parseFloat(input))
					? store.limits!.form.create.fee.min
					: Number.parseFloat(input),
				store.limits!.form.create.fee.min,
				store.limits!.form.create.fee.max,
			);
			setForm("fee", value);
		};

		const displayValue = createMemo(() =>
			form.fee > 0 ? form.fee.toString() : "",
		);

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
					{
						label: t("pages.create.options.participants.fee.label"),
						placeholder: () => (
							<SectionListInput
								class="input-fee"
								type="number"
								inputmode="decimal"
								placeholder={t("pages.create.options.participants.fee.free")}
								value={displayValue()}
								setValue={updateValue}
								min={store.limits!.form.create.fee.min}
								max={store.limits!.form.create.fee.max}
								append={() => (
									<CustomIcon
										src={{
											a: { fill: "currentColor", viewBox: "0 0 56 56" },
											c: "<path d='M9.8 1.2h36.7a9 9 0 0 1 4 .8 7.5 7.5 0 0 1 3.2 3c.7 1.4 1 2.7 1 4.2 0 1.4-.2 3-1 4.2l-23.2 40a2.9 2.9 0 0 1-5 0L2.7 13.5c-.5-.9-1.3-2.2-1.5-3.9a7.8 7.8 0 0 1 4.5-7.7c1.5-.7 3-.7 4-.7zM25 7H9.8c-1 0-1.4 0-1.7.2a2 2 0 0 0-1.2 2c0 .3.1.6.7 1.5l17.5 30.6ZM31 7v34.5l17.9-30.8c.2-.3.3-.9.3-1.4 0-.5-.1-.8-.3-1.2l-.5-.6-.2-.2c-.4-.2-.9-.3-1.6-.3z' />",
										}}
									/>
								)}
							/>
						),
					},
				]}
			/>
		);
	};

	const SubsectionThemes = () => {
		const activeSlideIndex = createMemo(() => {
			if (form.theme.backdrop === undefined && form.theme.symbol === undefined)
				return 0;

			return (
				ContestThemes.findIndex(
					(item) =>
						item.backdrop === form.theme.backdrop &&
						item.symbol === form.theme.symbol,
				) ?? 0
			);
		});

		const onClick = (e: MouseEvent) => {
			const backdrop = (e.currentTarget as HTMLElement).getAttribute(
				"data-backdrop",
			);
			const symbol = (e.currentTarget as HTMLElement).getAttribute(
				"data-symbol",
			);

			if (!(backdrop && symbol)) return;
			selectTheme(Number.parseInt(backdrop), symbol);
		};

		const selectTheme = (
			backdrop: number | undefined,
			symbol: string | undefined,
		) => {
			invokeHapticFeedbackSelectionChanged();
			setForm("theme", {
				backdrop,
				symbol,
			});
		};

		createEffect(
			on(activeSlideIndex, () => {
				(
					document.querySelector(".slider-theme-preview") as any
				)?.swiper.slideTo(activeSlideIndex());
			}),
		);

		return (
			<Section
				class="container-section-themes"
				title={t("pages.create.options.themes.label")}
			>
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
								active:
									form.theme.backdrop === undefined &&
									form.theme.symbol === undefined,
							}}
							onClick={() => selectTheme(undefined, undefined)}
						></div>
					</swiper-slide>

					<For each={ContestThemes}>
						{(theme) => (
							<swiper-slide>
								<ThemePreview
									onClick={onClick}
									classList={{
										active:
											form.theme.backdrop === theme.backdrop &&
											form.theme.symbol === theme.symbol,
									}}
									backdrop={
										ContestThemeBackdrops.find(
											(item) => item.id === theme.backdrop,
										)!
									}
									symbol={{
										id: theme.symbol,
										component: getSymbolSVGString(theme.symbol),
									}}
								/>
							</swiper-slide>
						)}
					</For>
				</swiper-container>
			</Section>
		);
	};

	return (
		<div id="container-create-section-options">
			<div>
				<SubsectionContest />

				<SubsectionVisibility />

				<SubsectionParticipants />

				<SubsectionThemes />
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
	const navigate = useNavigate();
	const { t } = useTranslation();

	const [form] = props.formStore;

	const onClickButton = () => {
		setModals("create", "open", false);

		navigate(`/contest/${form.slug}`, {
			replace: true,
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

const PageCreate: Component = () => {
	const navigate = useNavigate();

	if (!store.token) {
		navigate("/splash/create", {
			replace: true,
		});
		return;
	}

	const onBackButton = () => {
		navigate("/", {
			replace: true,
		});
	};

	return (
		<>
			<div id="container-page-create" class="page">
				<div>
					<SectionCreateForm />
				</div>
			</div>

			<BackButton onClick={onBackButton} />
		</>
	);
};

export default PageCreate;
