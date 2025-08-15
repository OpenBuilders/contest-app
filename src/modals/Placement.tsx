import "./Placement.scss";
import { FaSolidPlus } from "solid-icons/fa";
import {
	type Component,
	createMemo,
	createSignal,
	onCleanup,
	onMount,
	Show,
} from "solid-js";
import { createStore, produce, reconcile } from "solid-js/store";
import { Avatar, AvatarAlias } from "../components/Avatar";
import CustomMainButton from "../components/CustomMainButton";
import Modal from "../components/Modal";
import { SectionList, SectionListInput } from "../components/Section";
import { SVGSymbol } from "../components/SVG";
import { useTranslation } from "../contexts/TranslationContext";
import { setData } from "../pages/Contest/Manage/Results";
import { requestAPI } from "../utils/api";
import { cloneObject, compareObjects } from "../utils/general";
import { modals, setModals } from "../utils/modal";
import { formatNumbersInString } from "../utils/number";
import { popupManager } from "../utils/popup";
import { type Placement, store } from "../utils/store";
import {
	invokeHapticFeedbackImpact,
	invokeHapticFeedbackNotification,
} from "../utils/telegram";

export const [form, setForm] = createStore<Placement>({
	name: "",
	prize: "",
	submissions: [],
});

const ModalPlacement: Component = () => {
	const { t } = useTranslation();

	setForm({
		id: modals.placement.placement?.id ?? undefined,
		name: modals.placement.placement?.name ?? "",
		prize: modals.placement.placement?.prize ?? undefined,
		submissions: cloneObject(modals.placement.placement?.submissions ?? []),
	});

	onMount(() => {
		invokeHapticFeedbackImpact("light");
	});

	onCleanup(() => {
		setForm({
			id: undefined,
			name: "",
			prize: undefined,
			submissions: [],
		});
	});

	const onClose = () => {
		setModals(
			"placement",
			produce((store) => {
				store.placement = undefined;
				store.slug = undefined;
				store.submissions = undefined;
				store.open = false;
			}),
		);
	};

	const onClickAdd = () => {
		setModals(
			"submissionsPicker",
			produce((store) => {
				store.submissions = modals.placement.submissions;
				store.picked = form.submissions as number[];
				store.open = true;
			}),
		);
	};

	const onClickButtonRemove = async (submission_id: number) => {
		invokeHapticFeedbackImpact("rigid");

		const popup = await popupManager.openPopup({
			title: t("modals.placement.remove.title"),
			message: t("modals.placement.remove.prompt"),
			buttons: [
				{
					id: "remove",
					type: "destructive",
					text: t("modals.placement.remove.button"),
				},
				{
					id: "cancel",
					type: "cancel",
				},
			],
		});

		if (!popup.button_id || popup.button_id === "cancel") return;

		setForm(
			"submissions",
			produce((store) => {
				store.splice(store.indexOf(submission_id as any), 1);
			}),
		);
	};

	const type = createMemo(() =>
		modals.placement.placement ? "update" : "create",
	);

	const submissions = createMemo(() =>
		modals.placement.submissions?.filter((i) =>
			form.submissions.includes(i.submission.id as any),
		),
	);

	const [processing, setProcessing] = createSignal<false | "update" | "delete">(
		false,
	);

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

		if (type() === "update") {
			if (compareObjects(form, modals.placement.placement)) {
				return true;
			}
		}

		return false;
	});

	const onClickButtonMain = async () => {
		if (processing()) return;
		setProcessing("update");

		invokeHapticFeedbackImpact("soft");

		const request = await requestAPI(
			type() === "create"
				? `/contest/${modals.placement.slug}/results/create`
				: `/contest/${modals.placement.slug}/results/${modals.placement.placement?.id}/update`,
			{
				id: form.id?.toString(),
				name: form.name,
				prize: form.prize,
				submissions: JSON.stringify(form.submissions),
			},
			"POST",
		);

		if (request) {
			const { status, result } = request;

			if (status === "success") {
				invokeHapticFeedbackNotification("success");

				setData(
					reconcile({
						placements: result.placements,
						submissions: result.submissions,
					}),
				);

				onClose();
			}
		}

		setProcessing(false);
	};

	const onClickButtonDelete = async () => {
		if (processing()) return;
		invokeHapticFeedbackImpact("rigid");

		const popup = await popupManager.openPopup({
			title: t("modals.placement.delete.title"),
			message: t("modals.placement.delete.prompt"),
			buttons: [
				{
					id: "delete",
					type: "destructive",
					text: t("modals.placement.delete.button"),
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
			`/contest/${modals.placement.slug}/results/${modals.placement.placement?.id}/delete`,
			{},
			"POST",
		);

		if (request) {
			const { status, result } = request;

			if (status === "success") {
				invokeHapticFeedbackNotification("success");

				setData({
					placements: result.placements,
					submissions: result.submissions,
				});

				onClose();
			}
		}

		setProcessing(false);
	};

	return (
		<Modal
			containerClass="container-modal-placement"
			class="modal-placement"
			onClose={onClose}
			portalParent={document.querySelector("#modals")!}
		>
			<div>
				<SectionList
					title={t("modals.placement.title")}
					items={[
						{
							label: t("modals.placement.name.label"),
							placeholder: () => (
								<SectionListInput
									type="text"
									placeholder={t("modals.placement.name.placeholder")}
									value={form.name}
									setValue={(value) => setForm("name", value)}
									maxLength={store.limits!.form.placement.name.maxLength}
								/>
							),
						},
						{
							label: t("modals.placement.prize.label"),
							placeholder: () => (
								<SectionListInput
									type="text"
									placeholder="$5,000 USDT"
									value={form.prize}
									setValue={(value) => setForm("prize", value)}
									maxLength={store.limits!.form.placement.prize.maxLength}
									onBlur={() => {
										setForm("prize", formatNumbersInString(form.prize ?? ""));
									}}
								/>
							),
						},
					]}
				/>

				<SectionList
					title={t("modals.placement.submissions.title")}
					description={t("modals.placement.submissions.hint")}
					class="container-section-included-submissions"
					items={[
						{
							class: "container-section-included-submissions-add",
							label: t("modals.placement.submissions.add"),
							clickable: true,
							prepend: FaSolidPlus,
							onClick: onClickAdd,
						},
						...submissions()!.map((submission) => {
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
								label: fullname,
								prepend: () => (
									<Show
										when={submission.submission.user_id}
										fallback={
											<AvatarAlias
												colorIndex={submission.submission.anonymous_profile[0]}
												symbol={submission.submission.anonymous_profile[2][0]}
											/>
										}
									>
										<Avatar
											fullname={fullname}
											peerId={submission.submission.user_id}
											src={submission.submission.profile_photo}
										/>
									</Show>
								),
								placeholder: () => (
									<SVGSymbol
										id="CgRemove"
										class="remove"
										onClick={(e) => {
											e.stopPropagation();
											onClickButtonRemove(submission.submission.id);
										}}
									/>
								),
							};
						}),
					]}
				/>

				<footer>
					<CustomMainButton
						onClick={onClickButtonMain}
						text={t(
							type() === "create"
								? "modals.placement.button.create"
								: "modals.placement.button.update",
						)}
						disabled={buttonDisabled() || processing() !== false}
						loading={processing() === "update"}
					/>

					<Show when={type() === "update"}>
						<CustomMainButton
							onClick={onClickButtonDelete}
							text={t("modals.placement.button.delete")}
							disabled={processing() !== false}
							loading={processing() === "delete"}
							backgroundColor="transparent"
							textColor="var(--tg-theme-destructive-text-color)"
						/>
					</Show>
				</footer>
			</div>
		</Modal>
	);
};

export default ModalPlacement;
