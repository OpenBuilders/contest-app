import { useParams } from "@solidjs/router";
import "./Settings.scss";
import { type Component, createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import BackButton from "../../../components/BackButton";
import Tabbar, { type TabbarItem } from "../../../components/Tabbar";
import { useTranslation } from "../../../contexts/TranslationContext";
import { navigator } from "../../../utils/navigator";
import { store } from "../../../utils/store";
import { SectionContestManageOptions } from "./Options";

const PageContestManageSettings: Component = () => {
	const params = useParams();
	const { t } = useTranslation();

	if (!store.token) {
		navigator.go("/splash", {
			params: {
				from: `/contest/${params.slug}/manage/settings/${params.tab ?? "options"}`,
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

	const [processingOptions, setProcessingOptions] = createSignal(false);
	const [formOptions, setFormOptions] = createStore({
		fee: 0,
		title: "",
		description: "",
		instruction: "",
		fee_wallet: "",
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

	const [tab, setTab] = createSignal(params.tab ?? "options");

	const items: TabbarItem[] = [
		{
			title: t("pages.contest.manage.settings.tabs.options.title"),
			slug: "options",
			component: () => (
				<SectionContestManageOptions
					form={[formOptions, setFormOptions]}
					processing={[processingOptions, setProcessingOptions]}
					slug={params.slug}
					onBackButton={onBackButton}
				/>
			),
		},
	];

	createEffect(() => {
		navigator.go(`/contest/${params.slug}/manage/settings/${tab()}`, {
			skipHistory: true,
			resolve: false,
		});

		(document.activeElement as HTMLElement)?.blur();
	});

	return (
		<>
			<div id="container-page-contest-manage-settings" class="page">
				<div>
					<header>
						<h1>{t("pages.contest.manage.settings.title")}</h1>
					</header>

					<Tabbar
						items={items}
						value={tab()}
						setValue={setTab}
						mode="segmented"
						gap={16}
					/>
				</div>
			</div>

			<BackButton onClick={onBackButton} />
		</>
	);
};

export default PageContestManageSettings;
