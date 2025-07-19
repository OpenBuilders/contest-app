import "./Create.scss";

import CropperCanvas from "@cropper/element-canvas";
import CropperGrid from "@cropper/element-grid";
import CropperHandle from "@cropper/element-handle";
import CropperImage from "@cropper/element-image";
import CropperSelection from "@cropper/element-selection";
import CropperShade from "@cropper/element-shade";

import { useNavigate } from "@solidjs/router";
import { TbPhotoPlus } from "solid-icons/tb";
import {
	type Accessor,
	batch,
	type Component,
	createEffect,
	createMemo,
	createSignal,
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
import CustomMainButton from "../components/CustomMainButton";
import Editor from "../components/Editor";
import LottiePlayerMotion from "../components/LottiePlayerMotion";
import MainButton from "../components/MainButton";
import Modal from "../components/Modal";
import {
	SectionList,
	SectionListPicker,
	SectionListSelect,
	SectionListSwitch,
} from "../components/Section";
import WheelPicker from "../components/WheelPicker";
import { useTranslation } from "../contexts/TranslationContext";
import { TGS } from "../utils/animations";
import { hideKeyboardOnEnter } from "../utils/input";
import { store } from "../utils/store";
import { invokeHapticFeedbackImpact } from "../utils/telegram";

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
	category: string;
	fee: number;
	public: boolean;
	anonymous: boolean;
};

type CreateFormStep = "intro" | "basic" | "options";

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

			if ((textContent?.length ?? 0) > 2048) {
				return true;
			}
		}

		return form.title.trim().length < 3 || form.title.trim().length > 64;
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
							maxLength={64}
						/>
					</header>

					<section>
						<Editor
							value={form.description}
							setValue={(data) => setForm("description", data)}
							placeholder={t("pages.create.basic.description.placeholder")}
							maxLength={2048}
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

	const buttonDisabled = createMemo(() => {
		return false;
	});

	const onClickButton = () => {
		setStep("intro");
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
										...Array.from(new Array(60))
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
							placeholder: () => <span>Prize</span>,
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
							items={Array.from(new Array(60)).map((_, index) => ({
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
		return (
			<SectionList
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
						placeholder: () => <span>Fee</span>,
					},
				]}
			/>
		);
	};

	return (
		<div id="container-create-section-options">
			<div>
				<SubsectionContest />

				<SubsectionVisibility />

				<SubsectionParticipants />
			</div>

			<CustomMainButton
				onClick={onClickButton}
				text={t("general.continue")}
				disabled={buttonDisabled()}
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
			</Switch>
		</div>
	);
};

const PageCreate: Component = () => {
	const navigate = useNavigate();

	if (!store.token) {
		const navigate = useNavigate();
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
