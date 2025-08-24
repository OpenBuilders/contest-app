import { useNavigate, useParams } from "@solidjs/router";
import "./Results.scss";
import { FaSolidPlus } from "solid-icons/fa";
import {
	type Component,
	createEffect,
	createMemo,
	createSignal,
	For,
	Match,
	on,
	onCleanup,
	onMount,
	Show,
	Switch,
} from "solid-js";
import { createStore, produce, reconcile } from "solid-js/store";
import Sortable from "solid-sortablejs";
import { Avatar, AvatarStack } from "../../../components/Avatar";
import BackButton from "../../../components/BackButton";
import ButtonArray from "../../../components/ButtonArray";
import CustomMainButton from "../../../components/CustomMainButton";
import LottiePlayerMotion from "../../../components/LottiePlayerMotion";
import { SVGSymbol } from "../../../components/SVG";
import { useTranslation } from "../../../contexts/TranslationContext";
import { TGS } from "../../../utils/animations";
import { requestAPI } from "../../../utils/api";
import { setModals } from "../../../utils/modal";
import { formatNumbersInString } from "../../../utils/number";
import { popupManager } from "../../../utils/popup";
import { signals, toggleSignal } from "../../../utils/signals";
import {
	type AnnotatedSubmission,
	type Placement,
	store,
} from "../../../utils/store";
import {
	invokeHapticFeedbackImpact,
	invokeHapticFeedbackNotification,
	invokeHapticFeedbackSelectionChanged,
} from "../../../utils/telegram";

export const [data, setData] = createStore<{
	placements?: Placement[];
	submissions?: AnnotatedSubmission[];
	announced?: boolean;
}>({});

const PageContestManageResults: Component = () => {
	const navigate = useNavigate();
	const params = useParams();
	const { t } = useTranslation();

	setData({
		placements: undefined,
		submissions: undefined,
		announced: undefined,
	});

	if (!store.token) {
		navigate(`/splash/contest-${params.slug}-manage-results`, {
			replace: true,
		});
		return;
	}

	const [processing, setProcessing] = createSignal(false);

	const onBackButton = () => {
		navigate(`/contest/${params.slug}/manage`, {
			replace: true,
		});
	};

	onMount(async () => {
		invokeHapticFeedbackImpact("light");

		if (!data.placements) {
			await fetchData();
		}
	});

	onCleanup(() => {
		setData({
			placements: undefined,
			submissions: undefined,
			announced: undefined,
		});
	});

	const fetchData = async () => {
		const request = await requestAPI(
			`/contest/${params.slug}/results`,
			{},
			"GET",
		);

		if (request) {
			const { result, status } = request;

			if (status === "success") {
				setData({
					placements: result.placements,
					submissions: result.submissions,
					announced: result.announced,
				});
			}
		}
	};

	const onClickButtonAdd = () => {
		if (!(data.placements && data.submissions)) return;

		setModals(
			"placement",
			produce((store) => {
				store.slug = params.slug;
				store.placement = undefined;
				store.submissions = data.submissions;
				store.open = true;
			}),
		);
	};

	const buttonDisabled = createMemo(() => {
		return (data.placements?.length ?? -1) === 0;
	});

	const onClickButtonAnnounce = async () => {
		if (processing()) return;
		invokeHapticFeedbackImpact("soft");

		const popup = await popupManager.openPopup({
			title: t("modals.placement.announce.button"),
			message: t("modals.placement.announce.prompt"),
			buttons: [
				{
					id: "announce",
					type: "destructive",
					text: t("modals.placement.announce.button"),
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
			`/contest/${params.slug}/results/announce`,
			{},
			"POST",
		);

		if (request) {
			const { status } = request;

			if (status === "success") {
				invokeHapticFeedbackNotification("success");

				navigate(`/contest/${params.slug}/normal`, {
					replace: true,
				});
			}
		}

		setProcessing(false);
	};

	const SectionResultsLoading = () => {
		return (
			<div
				id="container-contest-manage-results-loading"
				class="shimmer-section-bg"
			>
				<div>
					<For each={Array.from(new Array(8))}>
						{() => (
							<div>
								<div>
									<div class="shimmer"></div>

									<div>
										<span class="shimmer"></span>
										<span class="shimmer"></span>
									</div>

									<AvatarStack
										avatars={[
											() => <div class="avatar shimmer"></div>,
											() => <div class="avatar shimmer"></div>,
											() => <div class="avatar shimmer"></div>,
										]}
									/>
								</div>
							</div>
						)}
					</For>
				</div>
			</div>
		);
	};

	const SectionResultsEmpty = () => {
		return (
			<div id="container-contest-manage-results-empty">
				<LottiePlayerMotion
					src={TGS.duckTrophy.url}
					outline={TGS.duckTrophy.outline}
					autoplay
					playOnClick
				/>

				<span class="text-secondary">
					{t("pages.contest.manage.results.empty.text")}
				</span>

				<button type="button" onClick={onClickButtonAdd} class="clickable">
					{t("pages.contest.manage.results.empty.button")}
				</button>
			</div>
		);
	};

	const SectionResults = () => {
		const onClickPlacement = (placement: Placement) => {
			setModals(
				"placement",
				produce((store) => {
					store.slug = params.slug;
					store.placement = placement;
					store.submissions = data.submissions;
					store.open = true;
				}),
			);
		};

		const onClickHandle = (e: MouseEvent) => e.stopPropagation();

		const onClickPlacementEvent = (e: MouseEvent) => {
			const id = (e.currentTarget as HTMLElement).getAttribute(
				"data-placement-id",
			);
			if (!id) return;
			const placement_id = Number.parseInt(id);
			const placement = data.placements?.find((i) => i.id === placement_id);
			if (!placement) return;
			onClickPlacement(placement);
		};

		const ItemResult: Component<{ placement: Placement }> = (props) => {
			return (
				<div
					class="placement"
					onClick={onClickPlacementEvent}
					data-placement-id={props.placement.id}
				>
					<div class="handle" onClick={onClickHandle}>
						<SVGSymbol id="CgMenu" />
					</div>

					<div>
						<span>{props.placement.name}</span>
						<Show when={props.placement.prize}>
							<span>{formatNumbersInString(props.placement.prize!)}</span>
						</Show>
					</div>

					<AvatarStack
						avatars={props.placement.submissions.map((submission_id) => {
							const submission = data.submissions?.find(
								(i) => i.submission.id === submission_id,
							);

							return () => (
								<Avatar
									fullname={[
										submission?.submission.first_name,
										submission?.submission.last_name,
									]
										.filter(Boolean)
										.join(" ")}
									peerId={submission?.submission.user_id}
									src={submission?.submission.profile_photo}
								/>
							);
						})}
					/>
				</div>
			);
		};

		createEffect(
			on(
				() => signals.orderResults,
				async () => {
					const request = await requestAPI(
						`/contest/${params.slug}/results/order`,
						{
							placements: JSON.stringify(data.placements),
						},
						"POST",
					);

					if (request) {
						const { status, result } = request;

						if (status === "success") {
							setData(
								reconcile({
									placements: result.placements,
									submissions: result.submissions,
									announced: result.announced,
								}),
							);
						}
					}
				},
				{
					defer: true,
				},
			),
		);

		return (
			<div id="container-contest-manage-results" class="shimmer-section-bg">
				<Sortable
					idField="id"
					items={data.placements ?? []}
					setItems={(data) => setData("placements", data)}
					handle=".handle"
					onChoose={() => {
						invokeHapticFeedbackImpact("soft");
					}}
					onMove={() => {
						invokeHapticFeedbackSelectionChanged();
					}}
					onUpdate={() => {
						setTimeout(() => {
							toggleSignal("orderResults");
						});
					}}
				>
					{(placement) => <ItemResult placement={placement} />}
				</Sortable>
			</div>
		);
	};

	return (
		<>
			<div id="container-page-contest-manage-results" class="page">
				<div>
					<header>
						<h1>{t("pages.contest.manage.results.title")}</h1>

						<ButtonArray
							items={[
								{
									component: FaSolidPlus,
									fontSize: "1.1875rem",
									class: "clickable",
									onClick: onClickButtonAdd,
								},
							]}
						/>
					</header>

					<Switch>
						<Match when={!data.placements}>
							<SectionResultsLoading />
						</Match>

						<Match when={data.placements?.length === 0}>
							<SectionResultsEmpty />
						</Match>

						<Match when={(data.placements?.length ?? 0) > 0}>
							<SectionResults />
						</Match>
					</Switch>

					<Show
						when={
							(data.placements?.length ?? 0) > 0 && data.announced === false
						}
					>
						<footer>
							<CustomMainButton
								text={t("pages.contest.manage.results.announce.button")}
								onClick={onClickButtonAnnounce}
								disabled={buttonDisabled() || processing()}
								loading={processing()}
							/>
						</footer>
					</Show>
				</div>
			</div>

			<BackButton onClick={onBackButton} />
		</>
	);
};

export default PageContestManageResults;
