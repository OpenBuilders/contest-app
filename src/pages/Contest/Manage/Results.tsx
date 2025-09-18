import { useParams } from "@solidjs/router";
import "./Results.scss";
import { FaSolidCircleExclamation, FaSolidFlagCheckered } from "solid-icons/fa";
import { IoAddCircle } from "solid-icons/io";
import {
	type Component,
	createEffect,
	createMemo,
	createSignal,
	For,
	Match,
	on,
	onMount,
	Show,
	Switch,
} from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import { Avatar, AvatarStack } from "../../../components/Avatar";
import BackButton from "../../../components/BackButton";
import CustomMainButton from "../../../components/CustomMainButton";
import { Section } from "../../../components/Section";
import { SVGSymbol } from "../../../components/SVG";
import { toast } from "../../../components/Toast";
import { useTranslation } from "../../../contexts/TranslationContext";
import { requestAPI } from "../../../utils/api";
import { initializeSortable } from "../../../utils/lazy";
import { navigator } from "../../../utils/navigator";
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

export const [placements, setPlacements] = createStore<{
	placements?: Placement[];
	submissions?: AnnotatedSubmission[];
	announced?: boolean;
}>();

const PageContestManageResults: Component = () => {
	const params = useParams();
	const { t, td } = useTranslation();

	setPlacements({
		placements: undefined,
		submissions: undefined,
		announced: undefined,
	});

	if (!store.token) {
		navigator.go("/splash", {
			params: {
				from: `/contest/${params.slug}/manage/results`,
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

	let Sortable: any;

	const [dependencies, setDependencies] = createStore({
		sortable: false,
	});

	const [processing, setProcessing] = createSignal(false);

	const onBackButton = () => {
		navigator.go(`/contest/${params.slug}/submissions`, {
			params: {
				theme: {
					header: false,
				},
			},
		});
	};

	onMount(async () => {
		initializeSortable().then((result) => {
			Sortable = result;
			setDependencies("sortable", true);
		});

		if (!placements.placements) {
			await fetchData();
		}
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
				invokeHapticFeedbackNotification("success");

				setPlacements({
					placements: result.placements,
					submissions: result.submissions,
					announced: result.announced,
				});

				return;
			}
		}

		toast({
			icon: FaSolidCircleExclamation,
			text: t("errors.fetch"),
		});
	};

	const onClickButtonAdd = () => {
		if (!(placements.placements && placements.submissions)) return;

		navigator.go(`/contest/${params.slug}/manage/results/new`);
	};

	const buttonDisabled = createMemo(() => {
		return (placements.placements?.length ?? -1) === 0;
	});

	const onClickButtonAnnounce = async () => {
		if (processing()) return;
		invokeHapticFeedbackImpact("soft");

		const popup = await popupManager.openPopup({
			title: t("pages.contest.manage.results.announce.title"),
			message: t("pages.contest.manage.results.announce.prompt"),
			buttons: [
				{
					id: "announce",
					type: "destructive",
					text: t("pages.contest.manage.results.announce.button"),
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

				navigator.go(`/contest/${params.slug}`, {
					params: {
						theme: {
							header: false,
						},
					},
				});
				return;
			}
		}

		toast({
			icon: FaSolidCircleExclamation,
			text: t("errors.results.announce"),
		});
		setProcessing(false);
	};

	const SectionResultsLoading = () => {
		return (
			<div
				id="container-contest-manage-results-loading"
				class="shimmer-section-bg"
			>
				<div>
					<For each={Array.from(new Array(6))}>
						{() => (
							<div>
								<div>
									<div class="shimmer"></div>

									<div>
										<span class="shimmer"></span>
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

	const SectionResults = () => {
		const onClickPlacement = (placement: Placement) => {
			navigator.go(`/contest/${params.slug}/manage/results/${placement.id}`);
		};

		const onClickHandle = (e: MouseEvent) => e.stopPropagation();

		const onClickPlacementEvent = (e: MouseEvent) => {
			const id = (e.currentTarget as HTMLElement).getAttribute(
				"data-placement-id",
			);
			if (!id) return;
			const placement_id = Number.parseInt(id);
			const placement = placements.placements?.find(
				(i) => i.id === placement_id,
			);
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
							<span>
								{td("pages.contest.manage.results.list.reward", {
									reward: formatNumbersInString(props.placement.prize!),
								})}
							</span>
						</Show>
						<Show when={props.placement.submissions.length > 0}>
							<span>
								{td("pages.contest.manage.results.list.winners", {
									count: props.placement.submissions.length.toString(),
								})}
							</span>
						</Show>
					</div>

					<AvatarStack
						avatars={props.placement.submissions.map((submission_id) => {
							const submission = placements.submissions?.find(
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

		const SectionItems = () => {
			return (
				<Sortable
					idField="id"
					items={placements.placements ?? []}
					setItems={(data: Placement[]) => setPlacements("placements", data)}
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
					{(placement: Placement) => <ItemResult placement={placement} />}
				</Sortable>
			);
		};

		const SectionEmpty = () => {
			return (
				<Section class="container-contest-manage-results-empty">
					{t("pages.contest.manage.results.empty.text")}
				</Section>
			);
		};

		createEffect(
			on(
				() => signals.orderResults,
				async () => {
					const request = await requestAPI(
						`/contest/${params.slug}/results/order`,
						{
							placements: JSON.stringify(placements.placements),
						},
						"POST",
					);

					if (request) {
						const { status, result } = request;

						if (status === "success") {
							setPlacements(
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
				<Show
					when={(placements.placements?.length ?? 0) > 0}
					fallback={<SectionEmpty />}
				>
					<SectionItems />
				</Show>

				<footer>
					<button class="clickable" type="button" onClick={onClickButtonAdd}>
						<IoAddCircle />
						<span>{t("pages.contest.manage.results.add.button")}</span>
					</button>
				</footer>
			</div>
		);
	};

	return (
		<>
			<div id="container-page-contest-manage-results" class="page">
				<div>
					<header>
						<div>
							<h1>{t("pages.contest.manage.results.title")}</h1>
							<p>{t("pages.contest.manage.results.description")}</p>
						</div>
					</header>

					<Switch>
						<Match when={!placements.placements}>
							<SectionResultsLoading />
						</Match>

						<Match when={dependencies.sortable}>
							<SectionResults />
						</Match>
					</Switch>

					<Show
						when={
							(placements.placements?.length ?? 0) > 0 &&
							placements.announced === false
						}
					>
						<footer>
							<CustomMainButton
								text={t("general.done")}
								onClick={onBackButton}
								secondary={true}
							/>

							<CustomMainButton
								text={t("pages.contest.manage.results.announce.button")}
								onClick={onClickButtonAnnounce}
								disabled={buttonDisabled() || processing()}
								loading={processing()}
								prepend={FaSolidFlagCheckered}
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
