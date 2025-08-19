import { useNavigate, useParams } from "@solidjs/router";
import "./Options.scss";
import {
	type Component,
	createMemo,
	createSignal,
	Match,
	onMount,
	Switch,
} from "solid-js";
import { createStore } from "solid-js/store";
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
import { clamp, formatNumbersInString } from "../../../utils/number";
import { store } from "../../../utils/store";
import { invokeHapticFeedbackImpact } from "../../../utils/telegram";

const PageContestManageOptions: Component = () => {
	const navigate = useNavigate();
	const params = useParams();
	const { t } = useTranslation();

	if (!store.token) {
		navigate(`/splash/contest-${params.slug}-manage-options`, {
			replace: true,
		});
		return;
	}

	const onBackButton = () => {
		navigate(`/contest/${params.slug}/manage`, {
			replace: true,
		});
	};

	onMount(async () => {
		invokeHapticFeedbackImpact("light");

		if (!form.loaded) {
			await fetchData();
		}
	});

	const [form, setForm] = createStore({
		fee: 0,
		title: "",
		description: "",
		prize: "",
		loaded: false,
	});

	const [formData, setFormData] = createStore(cloneObject(form));

	const [processing, setProcessing] = createSignal(false);
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
			`/contest/${params.slug}/options`,
			{},
			"GET",
		);

		if (request) {
			const { result, status } = request;

			if (status === "success") {
				setForm({
					...result.contest,
					loaded: true,
				});
				setFormData(form);
			}
		}
	};

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

		const request = await requestAPI(
			`/contest/${params.slug}/options/update`,
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
				setFormData(form);
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

				<Section title={t("pages.contest.description.title")}>
					<Editor
						value={form.description}
						setValue={(data) => setForm("description", data)}
						maxLength={store.limits!.form.create.description.maxLength}
						placeholder={t("pages.create.basic.description.placeholder")}
					/>
				</Section>
			</div>
		);
	};

	return (
		<>
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

					<footer>
						<Switch>
							<Match when={form.loaded}>
								<CustomMainButton
									text={t("pages.contest.manage.options.button")}
									onClick={onClickButton}
									disabled={buttonDisabled() || processing()}
									loading={processing()}
								/>{" "}
							</Match>
						</Switch>
					</footer>
				</div>
			</div>

			<BackButton onClick={onBackButton} />
		</>
	);
};

export default PageContestManageOptions;
