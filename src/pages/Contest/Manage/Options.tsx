import { useParams } from "@solidjs/router";
import "./Options.scss";
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
import BackButton from "../../../components/BackButton";
import CustomMainButton from "../../../components/CustomMainButton";
import Editor from "../../../components/Editor";
import {
	Section,
	SectionList,
	SectionListInput,
} from "../../../components/Section";
import { SVGSymbol } from "../../../components/SVG";
import { useTranslation } from "../../../contexts/TranslationContext";
import { requestAPI } from "../../../utils/api";
import { cloneObject, compareObjects } from "../../../utils/general";
import { navigator } from "../../../utils/navigator";
import { clamp, formatNumbersInString } from "../../../utils/number";
import { setStore, store } from "../../../utils/store";
import {
	invokeHapticFeedbackImpact,
	invokeHapticFeedbackNotification,
} from "../../../utils/telegram";

export type SectionContestManageOptionsForm = {
	fee: number;
	title: string;
	description: string;
	prize: string;
	loaded: boolean;
};

type SectionContestManageOptionsProps = {
	form: [
		SectionContestManageOptionsForm,
		SetStoreFunction<SectionContestManageOptionsForm>,
	];
	processing: [Accessor<boolean>, Setter<boolean>];
	slug: string;
	onBackButton: () => void;
};

const PageContestManageOptions: Component = () => {
	const params = useParams();

	if (!store.token) {
		navigator.go("/splash", {
			params: {
				from: `/contest/${params.slug}/manage/settings/options`,
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

	const [form, setForm] = createStore({
		fee: 0,
		title: "",
		description: "",
		prize: "",
		loaded: false,
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

	const [processing, setProcessing] = createSignal(false);

	return (
		<>
			<SectionContestManageOptions
				form={[form, setForm]}
				processing={[processing, setProcessing]}
				slug={params.slug}
				onBackButton={onBackButton}
			/>

			<BackButton onClick={onBackButton} />
		</>
	);
};

export const SectionContestManageOptions: Component<
	SectionContestManageOptionsProps
> = (props) => {
	const { t } = useTranslation();

	const [processing, setProcessing] = props.processing;
	const [form, setForm] = props.form;

	const SectionOptionsLoading = () => {
		return (
			<div id="container-contest-options-loading">
				<div class="shimmer"></div>
				<div class="shimmer"></div>
			</div>
		);
	};

	const onClickButton = async () => {
		if (processing()) return;
		setProcessing(true);

		invokeHapticFeedbackImpact("soft");

		const request = await requestAPI(
			`/contest/${props.slug}/options/update`,
			{
				title: form.title,
				description: form.description,
				prize: form.prize,
				fee: form.fee.toString(),
			},
			"POST",
		);

		if (request) {
			const { status } = request;

			if (status === "success") {
				invokeHapticFeedbackNotification("success");
				setFormData(form);
				setStore("contests", "my", undefined);
				props.onBackButton();
			}
		}
		setProcessing(false);
	};

	const SectionOptions = () => {
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
			<div id="container-contest-options">
				<SectionList
					items={[
						{
							label: t("pages.contest.manage.options.form.name.label"),
							placeholder: () => (
								<SectionListInput
									type="text"
									placeholder={t(
										"pages.contest.manage.options.form.name.placeholder",
									)}
									value={form.title}
									setValue={(value) => setForm("title", value)}
									maxLength={store.limits!.form.create.title.maxLength}
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

				<Section title={t("pages.contest.description.title")}>
					<Editor
						value={form.description}
						setValue={(data) => setForm("description", data)}
						maxLength={store.limits!.form.create.description.maxLength}
						placeholder={t("pages.create.options.description.placeholder")}
					/>
				</Section>
			</div>
		);
	};

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

		if (
			form.title.trim().length < store.limits!.form.create.title.minLength ||
			form.title.trim().length > store.limits!.form.create.title.maxLength
		) {
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

		if (compareObjects(form, formData)) {
			return true;
		}

		return false;
	});

	const fetchData = async () => {
		const request = await requestAPI(
			`/contest/${props.slug}/options`,
			{},
			"GET",
		);

		if (request) {
			const { result, status } = request;

			if (status === "success") {
				invokeHapticFeedbackNotification("success");

				setForm({
					description: result.contest.description ?? form.description,
					fee: result.contest.fee ?? form.fee,
					prize: result.contest.prize ?? form.prize,
					title: result.contest.title ?? form.title,
					loaded: true,
				});
				setFormData(form);
			}
		}
	};

	onMount(async () => {
		if (!form.loaded) {
			await fetchData();
		}
	});

	const [formData, setFormData] = createStore(cloneObject(form));

	return (
		<div id="container-page-contest-manage-options" class="page">
			<div>
				<header>
					<h1>{t("pages.contest.manage.options.title")}</h1>
				</header>

				<Switch>
					<Match when={!form.loaded}>
						<SectionOptionsLoading />
					</Match>

					<Match when={form.loaded}>
						<SectionOptions />
					</Match>
				</Switch>

				<Switch>
					<Match when={form.loaded}>
						<footer>
							<CustomMainButton
								text={t("pages.contest.manage.options.button")}
								onClick={onClickButton}
								disabled={buttonDisabled() || processing()}
								loading={processing()}
							/>
						</footer>
					</Match>
				</Switch>
			</div>
		</div>
	);
};

export default PageContestManageOptions;
