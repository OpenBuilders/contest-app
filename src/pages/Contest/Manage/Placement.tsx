import { useParams } from "@solidjs/router";
import "./Placement.scss";
import { FaSolidCircleExclamation } from "solid-icons/fa";
import { OcCheckcirclefill2, OcCircle2 } from "solid-icons/oc";
import { type Component, createMemo, createSignal, Show } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { Avatar, AvatarAlias } from "../../../components/Avatar";
import BackButton from "../../../components/BackButton";
import CustomMainButton from "../../../components/CustomMainButton";
import { SectionList, SectionListInput } from "../../../components/Section";
import { SVGSymbol } from "../../../components/SVG";
import { toast } from "../../../components/Toast";
import { useTranslation } from "../../../contexts/TranslationContext";
import { requestAPI } from "../../../utils/api";
import { cloneObject, compareObjects } from "../../../utils/general";
import { navigator } from "../../../utils/navigator";
import { formatNumbersInString } from "../../../utils/number";
import { popupManager } from "../../../utils/popup";
import { type Placement, store } from "../../../utils/store";
import {
	invokeHapticFeedbackImpact,
	invokeHapticFeedbackNotification,
	invokeHapticFeedbackSelectionChanged,
} from "../../../utils/telegram";
import { placements } from "./Results";

const PageContestManagePlacement: Component = () => {
	const params = useParams();
	const { t } = useTranslation();

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

	const placement = placements.placements?.find(
		(i) => i.id?.toString() === params.id,
	);

	const [form, setForm] = createStore<Placement>({
		id: placement?.id,
		name: placement?.name ?? "",
		prize: placement?.prize ?? "",
		submissions: cloneObject(placement?.submissions ?? []),
	});

	const [isPlacement] = createSignal(params.id !== "new");

	if (isPlacement() && !placement) {
		navigator.go(`/contest/${params.slug}/manage/results`);
		return;
	}

	const [processing, setProcessing] = createSignal<false | "update" | "delete">(
		false,
	);
	const onBackButton = () => {
		navigator.go(`/contest/${params.slug}/manage/results`);
	};

	const onClickButtonDelete = async () => {
		if (processing()) return;
		invokeHapticFeedbackImpact("rigid");

		const popup = await popupManager.openPopup({
			title: t("pages.contest.manage.placement.delete.button"),
			message: t("pages.contest.manage.placement.delete.prompt"),
			buttons: [
				{
					id: "delete",
					type: "destructive",
					text: t("pages.contest.manage.placement.delete.button"),
				},
				{
					id: "cancel",
					type: "cancel",
				},
			],
		});

		if (!popup.button_id || popup.button_id === "cancel") return;

		setProcessing("delete");

		const request = await requestAPI(
			`/contest/${params.slug}/results/${placement?.id}/delete`,
			{},
			"POST",
		);

		if (request) {
			const { status } = request;

			if (status === "success") {
				invokeHapticFeedbackNotification("success");
				onBackButton();
				return;
			}
		}

		toast({
			icon: FaSolidCircleExclamation,
			text: t("errors.placement.delete"),
		});

		setProcessing(false);
	};

	const buttonDisabled = createMemo(() => {
		if (form.prize) {
			if (
				form.prize.trim().length <
					store.limits!.form.placement.prize.minLength ||
				form.prize.trim().length > store.limits!.form.placement.prize.maxLength
			) {
				return true;
			}
		}

		if (
			form.name.trim().length < store.limits!.form.placement.name.minLength ||
			form.name.trim().length > store.limits!.form.placement.name.maxLength
		) {
			return true;
		}

		if (isPlacement()) {
			if (compareObjects(form, placement)) {
				return true;
			}
		}

		if (form.submissions.length === 0) {
			return true;
		}

		return false;
	});

	const onClickButton = async () => {
		if (processing()) return;
		setProcessing("update");

		invokeHapticFeedbackImpact("soft");

		const request = await requestAPI(
			isPlacement()
				? `/contest/${params.slug}/results/${placement?.id}/update`
				: `/contest/${params.slug}/results/create`,
			{
				id: form.id?.toString(),
				name: form.name,
				prize: form.prize,
				submissions: JSON.stringify(form.submissions),
			},
			"POST",
		);

		if (request) {
			const { status } = request;

			if (status === "success") {
				invokeHapticFeedbackNotification("success");
				onBackButton();
				return;
			}
		}

		toast({
			icon: FaSolidCircleExclamation,
			text: isPlacement()
				? t("errors.placement.update")
				: t("errors.placement.add"),
		});
		setProcessing(false);
	};

	const submissions = createMemo(() => {
		const items = cloneObject(placements.submissions!);

		items.sort(
			(a, b) =>
				Number(form?.submissions.includes(b.submission.id as any)) -
				Number(form?.submissions.includes(a.submission.id as any)),
		);

		return items;
	});

	const onClickSubmission = (id: number) => {
		invokeHapticFeedbackSelectionChanged();

		if (form.submissions?.includes(id as any)) {
			setForm(
				"submissions",
				produce((store) => {
					store.splice(store.indexOf(id as any), 1);
				}),
			);
		} else {
			setForm(
				"submissions",
				produce((store) => {
					store.push(id as any);
				}),
			);
		}
	};

	return (
		<>
			<div id="container-page-contest-manage-placement" class="page">
				<div>
					<header>
						<div>
							<h1>{t("pages.contest.manage.placement.title")}</h1>
						</div>
					</header>

					<div>
						<SectionList
							items={[
								{
									label: t("pages.contest.manage.placement.name.label"),
									placeholder: () => (
										<SectionListInput
											type="text"
											placeholder={t(
												"pages.contest.manage.placement.name.placeholder",
											)}
											value={form.name}
											setValue={(value) => setForm("name", value)}
											maxLength={store.limits!.form.placement.name.maxLength}
										/>
									),
								},
								{
									label: t("pages.contest.manage.placement.prize.label"),
									placeholder: () => (
										<SectionListInput
											type="text"
											placeholder="$5,000 USDT"
											value={form.prize}
											setValue={(value) => setForm("prize", value)}
											maxLength={store.limits!.form.placement.prize.maxLength}
											onBlur={() => {
												setForm(
													"prize",
													formatNumbersInString(form.prize ?? ""),
												);
											}}
										/>
									),
								},
							]}
							description={t("pages.contest.manage.placement.prize.hint")}
						/>

						<Show when={isPlacement()}>
							<div id="container-page-contest-manage-placement-delete">
								<button
									type="button"
									class="clickable"
									onClick={onClickButtonDelete}
								>
									{t("pages.contest.manage.placement.delete.button")}
								</button>
							</div>
						</Show>

						<SectionList
							title={t("pages.contest.manage.placement.participants.title")}
							items={submissions().map((submission) => {
								const fullname = submission.submission.user_id
									? [
											submission.submission.first_name,
											submission.submission.last_name,
										]
											.filter(Boolean)
											.join(" ")
									: [
											submission.submission.anonymous_profile[1][1],
											submission.submission.anonymous_profile[2][1],
										]
											.filter(Boolean)
											.join(" ");

								return {
									class: "contest-manage-placement-item",
									label: () => (
										<div>
											<Show
												when={submission.submission.user_id}
												fallback={
													<AvatarAlias
														colorIndex={
															submission.submission.anonymous_profile[0]
														}
														symbol={
															submission.submission.anonymous_profile[2][0]
														}
													/>
												}
											>
												<Avatar
													fullname={fullname}
													peerId={submission.submission.user_id}
													src={submission.submission.profile_photo}
												/>
											</Show>

											<div>
												<span>{fullname}</span>
											</div>
										</div>
									),
									prepend: () => (
										<div>
											<Show
												when={form?.submissions.includes(
													submission.submission.id as any,
												)}
												fallback={<OcCircle2 />}
											>
												<OcCheckcirclefill2 class="checked" />
											</Show>
										</div>
									),
									placeholder: () => (
										<ul>
											<li
												classList={{
													fill: submission.metadata.liked_by_viewer,
													empty: !submission.metadata.liked_by_viewer,
												}}
											>
												<SVGSymbol id="thumb-up" />
												<span>{submission.submission.likes}</span>
											</li>

											<li
												classList={{
													fill: submission.metadata.disliked_by_viewer,
													empty: !submission.metadata.disliked_by_viewer,
												}}
											>
												<SVGSymbol id="thumb-down" />
												<span>{submission.submission.dislikes}</span>
											</li>
										</ul>
									),
									onClick: () => {
										onClickSubmission(submission.submission.id);
									},
									clickable: true,
								};
							})}
						/>
					</div>

					<footer>
						<CustomMainButton
							text={
								isPlacement()
									? t("pages.contest.manage.placement.buttons.update")
									: t("pages.contest.manage.placement.buttons.add")
							}
							onClick={onClickButton}
							disabled={buttonDisabled() || processing() !== false}
							loading={processing() === "update"}
						/>
					</footer>
				</div>
			</div>

			<BackButton onClick={onBackButton} />
		</>
	);
};

export default PageContestManagePlacement;
