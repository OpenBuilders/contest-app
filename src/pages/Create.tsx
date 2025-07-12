import "./Create.scss";
import { useNavigate } from "@solidjs/router";
import {
	type Accessor,
	type Component,
	createMemo,
	createSignal,
	Match,
	onMount,
	type Setter,
	Switch,
} from "solid-js";
import { createStore, type SetStoreFunction } from "solid-js/store";
import BackButton from "../components/BackButton";
import CustomMainButton from "../components/CustomMainButton";
import LottiePlayerMotion from "../components/LottiePlayerMotion";
import MainButton from "../components/MainButton";
import { useTranslation } from "../contexts/TranslationContext";
import { TGS } from "../utils/animations";
import { store } from "../utils/store";
import { invokeHapticFeedbackImpact } from "../utils/telegram";

type CreateFormStore = {
	title: string;
	description: string;
	image?: string;
	date: {
		start?: number;
		end?: number;
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

	const [step, setStep] = props.stepSignal;
	const [form, setForm] = props.formStore;

	const buttonDisabled = createMemo(() => false);

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
				disabled={buttonDisabled()}
			/>
		</div>
	);
};

const SectionBasic: Component<CreateFormSectionProps> = (props) => {
	const { t } = useTranslation();

	const [step, setStep] = props.stepSignal;
	const [form, setForm] = props.formStore;

	const buttonDisabled = createMemo(() => false);

	const onClickButton = () => {
		setStep("public");
	};

	onMount(async () => {
		invokeHapticFeedbackImpact("soft");
	});

	return (
		<div id="container-create-section-basic">
			<div>Section Basic</div>

			<CustomMainButton
				onClick={onClickButton}
				text={t("pages.create.intro.button")}
				disabled={buttonDisabled()}
			/>
		</div>
	);
};

const SectionPublic: Component<CreateFormSectionProps> = (props) => {
	const { t } = useTranslation();

	const [step, setStep] = props.stepSignal;
	const [form, setForm] = props.formStore;

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
				text={t("pages.create.intro.button")}
				disabled={buttonDisabled()}
			/>
		</div>
	);
};

const SectionAnonymous: Component<CreateFormSectionProps> = (props) => {
	const { t } = useTranslation();

	const [step, setStep] = props.stepSignal;
	const [form, setForm] = props.formStore;

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
				text={t("pages.create.intro.button")}
				disabled={buttonDisabled()}
			/>
		</div>
	);
};

const SectionFee: Component<CreateFormSectionProps> = (props) => {
	const { t } = useTranslation();

	const [step, setStep] = props.stepSignal;
	const [form, setForm] = props.formStore;

	const buttonDisabled = createMemo(() => false);

	const onClickButton = () => {
		// setStep("basic");
	};

	onMount(async () => {
		invokeHapticFeedbackImpact("soft");
	});

	return (
		<div id="container-create-section-fee">
			<div>Section Fee</div>

			<CustomMainButton
				onClick={onClickButton}
				text={t("pages.create.intro.button")}
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
		date: {},
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
