import { useParams } from "@solidjs/router";
import BackButton from "../../../components/BackButton";
import "./Moderators.scss";
import {
	FaSolidCircleExclamation,
	FaSolidLink,
	FaSolidPlus,
} from "solid-icons/fa";
import {
	type Accessor,
	type Component,
	createSignal,
	Match,
	onMount,
	type Setter,
	Switch,
} from "solid-js";
import { createStore, type SetStoreFunction } from "solid-js/store";
import { Avatar } from "../../../components/Avatar";
import ButtonArray from "../../../components/ButtonArray";
import LottiePlayerMotion from "../../../components/LottiePlayerMotion";
import { SectionList } from "../../../components/Section";
import { SVGSymbol } from "../../../components/SVG";
import { toast } from "../../../components/Toast";
import { useTranslation } from "../../../contexts/TranslationContext";
import { TGS } from "../../../utils/animations";
import { requestAPI } from "../../../utils/api";
import { navigator } from "../../../utils/navigator";
import { popupManager } from "../../../utils/popup";
import { store, type User } from "../../../utils/store";
import {
	invokeHapticFeedbackImpact,
	invokeHapticFeedbackNotification,
	isVersionAtLeast,
	postEvent,
} from "../../../utils/telegram";

const PageContestManageModerators: Component = () => {
	const params = useParams();
	const { t, td } = useTranslation();

	const [processing, setProcessing] = createSignal(false);

	if (!store.token) {
		navigator.go("/splash", {
			params: {
				from: `/contest/${params.slug}/manage/moderators`,
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

	const [data, setData] = createStore<SectionContestManageModeratorsData>({});

	const onBackButton = () => {
		navigator.go(`/contest/${params.slug}/manage`, {
			params: {
				theme: {
					header: false,
				},
			},
		});
	};

	const onClickButtonInvite = () => {
		if (!data.slug_moderator) return;

		invokeHapticFeedbackImpact("light");

		if (isVersionAtLeast("6.1")) {
			postEvent("web_app_open_tg_link", {
				path_full: `/share/url?url=https://t.me/${import.meta.env.VITE_BOT_USERNAME}/${import.meta.env.VITE_MINIAPP_SLUG}?startapp=moderator-join-${data?.slug_moderator}&text=${encodeURI(
					td("pages.contest.manage.moderators.invite.text", {
						title: data.title,
					}),
				)}`,
			});
		}
	};

	const onClickButtonRevoke = async () => {
		if (!data.slug_moderator) return;
		if (processing()) return;

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
		setProcessing(true);

		const request = await requestAPI(
			`/contest/${params.slug}/moderators/revoke`,
			{},
			"POST",
		);

		if (request) {
			const { status, result } = request;

			if (status === "success") {
				invokeHapticFeedbackImpact("heavy");
				setData("slug_moderator", result.slug_moderator);
				return;
			}
		}

		toast({
			icon: FaSolidCircleExclamation,
			text: t("errors.moderators.revoke"),
		});
		setProcessing(false);
	};

	return (
		<>
			<div id="container-page-contest-manage-moderators" class="page">
				<div>
					<header>
						<h1>{t("pages.contest.manage.moderators.title")}</h1>

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
					</header>

					<SectionContestManageModerators
						data={[data, setData]}
						processing={[processing, setProcessing]}
						onClickButtonInvite={onClickButtonInvite}
						slug={params.slug}
					/>
				</div>
			</div>

			<BackButton onClick={onBackButton} />
		</>
	);
};

export type SectionContestManageModeratorsData = {
	title?: string;
	slug_moderator?: string;
	moderators?: Pick<
		User,
		"user_id" | "first_name" | "last_name" | "profile_photo"
	>[];
};

type SectionContestManageModerators = {
	processing: [Accessor<boolean>, Setter<boolean>];
	data: [
		SectionContestManageModeratorsData,
		SetStoreFunction<SectionContestManageModeratorsData>,
	];
	onClickButtonInvite: () => void;
	slug: string;
};

export const SectionContestManageModerators: Component<
	SectionContestManageModerators
> = (props) => {
	const { t } = useTranslation();
	const [processing, setProcessing] = props.processing;
	const [data, setData] = props.data;

	const fetchData = async () => {
		const request = await requestAPI(
			`/contest/${props.slug}/moderators`,
			{},
			"GET",
		);

		if (request) {
			const { result, status } = request;

			if (status === "success") {
				invokeHapticFeedbackNotification("success");

				setData({
					title: result.title,
					slug_moderator: result.slug_moderator,
					moderators: result.moderators,
				});
				return;
			}
		}

		toast({
			icon: FaSolidCircleExclamation,
			text: t("errors.moderators.fetch"),
		});
	};

	onMount(async () => {
		if (!data.slug_moderator) {
			await fetchData();
		}
	});

	const SectionModeratorsLoading = () => {
		return (
			<div id="container-contest-moderators-loading">
				<div class="shimmer"></div>
			</div>
		);
	};

	const SectionModeratorsEmpty = () => {
		return (
			<div id="container-contest-moderators-empty">
				<LottiePlayerMotion
					src={TGS.duckCommentate.url}
					outline={TGS.duckCommentate.outline}
					autoplay
					playOnClick
				/>

				<span class="text-secondary">
					{t("pages.contest.manage.moderators.empty.text")}
				</span>

				<button
					type="button"
					onClick={props.onClickButtonInvite}
					class="clickable"
				>
					{t("pages.contest.manage.moderators.empty.button")}
				</button>
			</div>
		);
	};

	const onClickButtonRemove = async (user_id: number) => {
		if (!data.slug_moderator) return;
		if (processing()) return;

		invokeHapticFeedbackImpact("rigid");

		const popup = await popupManager.openPopup({
			title: t("pages.contest.manage.moderators.invite.remove.title"),
			message: t("pages.contest.manage.moderators.invite.remove.prompt"),
			buttons: [
				{
					id: "revoke",
					type: "destructive",
					text: t("pages.contest.manage.moderators.invite.remove.button"),
				},
				{
					id: "cancel",
					type: "cancel",
				},
			],
		});

		if (!popup.button_id || popup.button_id === "cancel") return;
		setProcessing(true);

		const request = await requestAPI(
			`/contest/${props.slug}/moderators/remove`,
			{
				user_id: user_id.toString(),
			},
			"POST",
		);

		setProcessing(false);

		if (request) {
			const { status, result } = request;

			if (status === "success") {
				invokeHapticFeedbackImpact("heavy");
				setData("moderators", result.moderators);
				return;
			}
		}

		toast({
			icon: FaSolidCircleExclamation,
			text: t("errors.moderators.remove"),
		});
	};

	const SectionModerators = () => {
		return (
			<div id="container-contest-moderators" class="shimmer-section-bg">
				<SectionList
					description={t("pages.contest.manage.moderators.empty.text")}
					items={data.moderators!.map((moderator) => {
						const fullname = [moderator.first_name, moderator.last_name]
							.filter(Boolean)
							.join(" ");

						return {
							label: fullname,
							prepend: () => (
								<Avatar
									fullname={fullname}
									peerId={moderator.user_id}
									src={moderator.profile_photo}
								/>
							),
							placeholder: () => (
								<SVGSymbol
									id="CgRemove"
									class="clickable"
									onClick={() => onClickButtonRemove(moderator.user_id)}
								/>
							),
						};
					})}
				/>
			</div>
		);
	};

	return (
		<Switch>
			<Match when={!data.moderators}>
				<SectionModeratorsLoading />
			</Match>

			<Match when={data.moderators?.length === 0}>
				<SectionModeratorsEmpty />
			</Match>

			<Match when={(data.moderators?.length ?? 0) > 0}>
				<SectionModerators />
			</Match>
		</Switch>
	);
};

export default PageContestManageModerators;
