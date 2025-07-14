import "./Create.scss";

import CropperCanvas from "@cropper/element-canvas";
import CropperGrid from "@cropper/element-grid";
import CropperHandle from "@cropper/element-handle";
import CropperImage from "@cropper/element-image";
import CropperSelection from "@cropper/element-selection";
import CropperShade from "@cropper/element-shade";

import { useNavigate } from "@solidjs/router";
import dayjs from "dayjs";
import { TbPhotoPlus } from "solid-icons/tb";
import {
	type Accessor,
	type Component,
	createMemo,
	createSignal,
	Match,
	onMount,
	type Setter,
	Show,
	Switch,
} from "solid-js";
import { createStore, type SetStoreFunction } from "solid-js/store";
import { Portal } from "solid-js/web";
import BackButton from "../components/BackButton";
import CustomMainButton from "../components/CustomMainButton";
import Datepicker from "../components/Datepicker";
import Editor from "../components/Editor";
import LottiePlayerMotion from "../components/LottiePlayerMotion";
import MainButton from "../components/MainButton";
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
	date: {
		start: number;
		end: number;
	};
	fee: number;
	public: boolean;
	anonymous: boolean;
};

type CreateFormStep = "intro" | "basic" | "fee" | "public" | "anonymous";

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

		if (!(form.date.start || form.date.end)) return true;

		if (form.date.start < Math.trunc(dayjs().unix() / 86400) * 86400) {
			return true;
		}

		if (form.date.end <= form.date.start) {
			return true;
		}

		return form.title.trim().length < 3 || form.title.trim().length > 64;
	});

	const onClickButton = () => {
		setStep("public");
	};

	const onClickImage = () => {
		const filePicker = document.createElement("input");
		filePicker.type = "file";
		filePicker.accept = "image/*";

		filePicker.onchange = (event) => {
			const file = (event.target as HTMLInputElement).files?.[0];

			if (file?.type.startsWith("image/")) {
				setImagePicker({
					active: true,
					src: URL.createObjectURL(file),
				});
			}
		};

		filePicker.click();
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
						<cropper-handle action="select" plain></cropper-handle>
						<cropper-selection
							initial-coverage="0.5"
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

					<footer>
						<span class="text-secondary">
							{t("pages.create.basic.submissions.title")}
						</span>

						<div>
							<div>
								<Datepicker
									label={t("pages.create.basic.submissions.from.label")}
									pickerLabel={t(
										"pages.create.basic.submissions.from.placeholder",
									)}
									value={form.date.start}
									setValue={(value) => {
										setForm("date", "start", value);
									}}
									minDate={dayjs().format("YYYY-MM-D")}
								/>
							</div>

							<div>
								<Datepicker
									label={t("pages.create.basic.submissions.to.label")}
									pickerLabel={t(
										"pages.create.basic.submissions.to.placeholder",
									)}
									value={form.date.end}
									setValue={(value) => {
										setForm("date", "end", value);
									}}
									minDate={dayjs(Date.now() + 86400_000).format("YYYY-MM-D")}
								/>
							</div>
						</div>

						<p class="text-hint">{t("pages.create.basic.submissions.hint")}</p>
					</footer>
				</div>

				<CustomMainButton
					onClick={onClickButton}
					text={t("general.continue")}
					disabled={buttonDisabled()}
				/>
			</div>

			<ImagePicker />
		</>
	);
};

const SectionPublic: Component<CreateFormSectionProps> = (props) => {
	const { t } = useTranslation();

	const [, setStep] = props.stepSignal;
	// const [form, setForm] = props.formStore;

	const buttonDisabled = createMemo(() => false);

	const onClickButton = () => {
		setStep("anonymous");
	};

	onMount(async () => {
		invokeHapticFeedbackImpact("soft");
	});

	return (
		<div id="container-create-section-public">
			<div>Section Public</div>

			<CustomMainButton
				onClick={onClickButton}
				text={t("general.continue")}
				disabled={buttonDisabled()}
			/>
		</div>
	);
};

const SectionAnonymous: Component<CreateFormSectionProps> = (props) => {
	const { t } = useTranslation();

	const [, setStep] = props.stepSignal;
	// const [form, setForm] = props.formStore;

	const buttonDisabled = createMemo(() => false);

	const onClickButton = () => {
		setStep("fee");
	};

	onMount(async () => {
		invokeHapticFeedbackImpact("soft");
	});

	return (
		<div id="container-create-section-anonymous">
			<div>Section Anonymous</div>

			<CustomMainButton
				onClick={onClickButton}
				text={t("general.continue")}
				disabled={buttonDisabled()}
			/>
		</div>
	);
};

const SectionFee: Component<CreateFormSectionProps> = (props) => {
	const { t } = useTranslation();

	const [, setStep] = props.stepSignal;
	// const [form, setForm] = props.formStore;

	const buttonDisabled = createMemo(() => false);

	const onClickButton = () => {
		setStep("basic");
	};

	onMount(async () => {
		invokeHapticFeedbackImpact("soft");
	});

	return (
		<div id="container-create-section-fee">
			<div>Section Fee</div>

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
		date: {
			start: Math.trunc(Date.now() / 86400) * 86400,
			end: Math.trunc((Date.now() + 7 * 86400 * 1000) / 86400) * 86400,
		},
		fee: 0,
		public: false,
		anonymous: false,
	});

	return (
		<div id="container-create">
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

				<Match when={step() === "fee"}>
					<SectionFee
						formStore={[form, setForm]}
						stepSignal={[step, setStep]}
					/>
				</Match>

				<Match when={step() === "public"}>
					<SectionPublic
						formStore={[form, setForm]}
						stepSignal={[step, setStep]}
					/>
				</Match>

				<Match when={step() === "anonymous"}>
					<SectionAnonymous
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
