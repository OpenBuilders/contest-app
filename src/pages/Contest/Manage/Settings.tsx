import { useParams } from "@solidjs/router";
import "./Settings.scss";
import {
	FaSolidCircleExclamation,
	FaSolidLink,
	FaSolidPlus,
} from "solid-icons/fa";
import {
	type Component,
	createEffect,
	createSignal,
	Match,
	Switch,
} from "solid-js";
import { createStore } from "solid-js/store";
import BackButton from "../../../components/BackButton";
import ButtonArray from "../../../components/ButtonArray";
import Tabbar, { type TabbarItem } from "../../../components/Tabbar";
import { toast } from "../../../components/Toast";
import { useTranslation } from "../../../contexts/TranslationContext";
import { requestAPI } from "../../../utils/api";
import { navigator } from "../../../utils/navigator";
import { popupManager } from "../../../utils/popup";
import { store } from "../../../utils/store";
import {
	invokeHapticFeedbackImpact,
	isVersionAtLeast,
	postEvent,
} from "../../../utils/telegram";
import {
	SectionContestManageModerators,
	type SectionContestManageModeratorsData,
} from "./Moderators";
import { SectionContestManageOptions } from "./Options";

const PageContestManageSettings: Component = () => {
	const params = useParams();
	const { t, td } = useTranslation();

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

	const [processingModerators, setProcessingModerators] = createSignal(false);
	const [dataModerators, setDataModerators] =
		createStore<SectionContestManageModeratorsData>({});

	const [processingOptions, setProcessingOptions] = createSignal(false);
	const [formOptions, setFormOptions] = createStore({
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
		{
			title: t("pages.contest.manage.settings.tabs.moderators.title"),
			slug: "moderators",
			component: () => (
				<div id="container-page-contest-manage-moderators" class="page">
					<div>
						<SectionContestManageModerators
							data={[dataModerators, setDataModerators]}
							onClickButtonInvite={onClickButtonInvite}
							processing={[processingModerators, setProcessingModerators]}
							slug={params.slug}
						/>
					</div>
				</div>
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

	const onClickButtonInvite = () => {
		if (!dataModerators.slug_moderator) return;

		invokeHapticFeedbackImpact("light");

		if (isVersionAtLeast("6.1")) {
			postEvent("web_app_open_tg_link", {
				path_full: `/share/url?url=https://t.me/${import.meta.env.VITE_BOT_USERNAME}/${import.meta.env.VITE_MINIAPP_SLUG}?startapp=moderator-join-${dataModerators?.slug_moderator}&text=${encodeURI(
					td("pages.contest.manage.moderators.invite.text", {
						title: dataModerators.title,
					}),
				)}`,
			});
		}
	};

	const onClickButtonRevoke = async () => {
		if (!dataModerators.slug_moderator) return;
		if (processingModerators()) return;

		invokeHapticFeedbackImpact("rigid");

		const popup = await popupManager.openPopup({
			title: t("pages.contest.manage.moderators.invite.revoke.title"),
			message: t("pages.contest.manage.moderators.invite.revoke.prompt"),
			buttons: [
				{
					id: "revoke",
					type: "destructive",
					text: t("pages.contest.manage.moderators.invite.revoke.button"),
				},
				{
					id: "cancel",
					type: "cancel",
				},
			],
		});

		if (!popup.button_id || popup.button_id === "cancel") return;
		setProcessingModerators(true);

		const request = await requestAPI(
			`/contest/${params.slug}/moderators/revoke`,
			{},
			"POST",
		);

		if (request) {
			const { status, result } = request;

			if (status === "success") {
				invokeHapticFeedbackImpact("heavy");
				setDataModerators("slug_moderator", result.slug_moderator);
				return;
			}
		}

		toast({
			icon: FaSolidCircleExclamation,
			text: t("errors.moderators.revoke"),
		});
		setProcessingModerators(false);
	};

	return (
		<>
			<div id="container-page-contest-manage-settings" class="page">
				<div>
					<header>
						<h1>{t("pages.contest.manage.settings.title")}</h1>

						<Switch>
							<Match when={tab() === "moderators" && dataModerators.moderators}>
								<ButtonArray
									items={[
										{
											component: FaSolidLink,
											fontSize: "1.25rem",
											class: "clickable",
											onClick: onClickButtonRevoke,
										},
										{
											component: FaSolidPlus,
											fontSize: "1.1875rem",
											class: "clickable",
											onClick: onClickButtonInvite,
										},
									]}
								/>
							</Match>
						</Switch>
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
