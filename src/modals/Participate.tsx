import "./Participate.scss";
import { isTelegramUrl } from "@tonconnect/sdk";
import {
	batch,
	type Component,
	createMemo,
	createSignal,
	onMount,
	Show,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import { Avatar, AvatarAlias } from "../components/Avatar";
import CustomMainButton from "../components/CustomMainButton";
import Editor from "../components/Editor";
import Modal from "../components/Modal";
import { Section } from "../components/Section";
import { useTranslation } from "../contexts/TranslationContext";
import { requestAPI } from "../utils/api";
import {
	hideKeyboardOnEnter,
	isValidTelegramUsername,
	isValidURL,
	normalizeTelegramUsernameToURL,
	normalizeURL,
} from "../utils/input";
import {
	initializeTonConnect,
	parseTONAddress,
	tonConnectUI,
} from "../utils/lazy";
import { modals, setModals } from "../utils/modal";
import { toggleSignal } from "../utils/signals";
import { store } from "../utils/store";
import {
	invokeHapticFeedbackImpact,
	invokeHapticFeedbackNotification,
	lp,
} from "../utils/telegram";

type ParticipateFormStore = {
	link: string;
	description: string;
};

const ModalParticipate: Component = () => {
	const { t } = useTranslation();

	const [form, setForm] = createStore<ParticipateFormStore>({
		link: "",
		description: "",
	});
	const [processing, setProcessing] = createSignal(false);

	const [dependencies, setDependencies] = createStore({
		tonconnect: false,
	});

	onMount(async () => {
		if (!(modals.participate.contest && modals.participate.metadata)) {
			onClose();
			return;
		}

		invokeHapticFeedbackImpact("soft");

		setDependencies("tonconnect", await initializeTonConnect());
	});

	const onClose = () => {
		setModals(
			"participate",
			produce((data) => {
				data.contest = undefined;
				data.metadata = undefined;
				data.open = false;
			}),
		);
	};

	const buttonDisabled = createMemo(() => {
		if (form.description) {
			const {
				body: { textContent },
			} = new DOMParser().parseFromString(form.description, "text/html");

			if (
				(textContent?.length ?? 0) >
				store.limits!.form.participate.description.maxLength
			) {
				return true;
			}
		}

		return (
			!(
				isValidURL(form.link.trim()) ||
				isValidTelegramUsername(form.link.trim())
			) ||
			form.link.trim().length < store.limits!.form.participate.link.minLength ||
			form.link.trim().length > store.limits!.form.participate.link.maxLength
		);
	});

	const handlePayment = async () => {
		if (!(dependencies.tonconnect && tonConnectUI)) {
			setDependencies("tonconnect", await initializeTonConnect());
			return handlePayment();
		}

		await tonConnectUI?.connectionRestored;

		if (!tonConnectUI?.connected) {
			await tonConnectUI?.openModal();
		}

		try {
			const result = await tonConnectUI?.sendTransaction({
				validUntil: Math.floor(Date.now() / 1000) + 600,
				messages: [
					{
						address: parseTONAddress(
							modals.participate.contest?.fee_wallet ?? "",
						),
						amount: (0.95 * modals.participate.contest!.fee! * 1e9).toString(),
						payload: `contest-${modals.participate.contest?.slug}-${store.user?.user_id}`,
					},
					{
						address: import.meta.env.VITE_MASTER_WALLET,
						amount: (0.05 * modals.participate.contest!.fee! * 1e9).toString(),
						payload: `fee-${modals.participate.contest?.slug}-${store.user?.user_id}`,
					},
				],
			});

			return result.boc;
		} catch (_) {}

		return false;
	};

	const onClickButton = async () => {
		if (processing()) return;
		setProcessing(true);

		invokeHapticFeedbackImpact("soft");

		let boc: string | undefined;

		if (modals.participate.contest?.fee) {
			const result = await handlePayment();

			if (result) {
				boc = result;
			} else {
				setProcessing(false);
				return;
			}
		}

		const request = await requestAPI(
			`/contest/${modals.participate.contest!.slug}/submit`,
			{
				link: (isTelegramUrl(form.link)
					? normalizeTelegramUsernameToURL(form.link)
					: normalizeURL(form.link))!,
				description: form.description,
				boc: boc,
			},
			"POST",
		);

		if (request) {
			const { status } = request;

			if (status === "success") {
				invokeHapticFeedbackNotification("success");

				batch(() => {
					setModals(
						"participate",
						produce((data) => {
							data.contest = undefined;
							data.metadata = undefined;
							data.open = false;
						}),
					);

					toggleSignal("fetchContest");
				});

				return;
			}
		}

		setProcessing(false);
	};

	return (
		<Modal
			containerClass="container-modal-participate"
			class="modal-participate"
			onClose={onClose}
			portalParent={document.querySelector("#modals")!}
			withCloseButton={true}
		>
			<div>
				<div>
					<Section
						title={t("modals.participate.alias.title")}
						description={
							modals.participate.contest?.anonymous
								? t("modals.participate.alias.hint_anonymous")
								: t("modals.participate.alias.hint_normal")
						}
						class="container-participant-identity"
					>
						<Show
							when={modals.participate.contest?.anonymous}
							fallback={
								<Avatar
									src={lp?.tgWebAppData?.user?.photo_url}
									peerId={lp?.tgWebAppData?.user?.id}
									fullname={[
										lp?.tgWebAppData?.user?.first_name,
										lp?.tgWebAppData?.user?.last_name,
									]
										.filter(Boolean)
										.join(" ")}
								/>
							}
						>
							<AvatarAlias
								symbol={store.user?.anonymous_profile[2][0]!}
								colorIndex={store.user?.anonymous_profile[0]!}
							/>
						</Show>

						<Show
							when={modals.participate.contest?.anonymous}
							fallback={
								<span>
									{[
										lp?.tgWebAppData?.user?.first_name,
										lp?.tgWebAppData?.user?.last_name,
									]
										.filter(Boolean)
										.join(" ")}
								</span>
							}
						>
							<span>
								{[
									store.user?.anonymous_profile[1][1],
									store.user?.anonymous_profile[2][1],
								].join(" ")}
							</span>
						</Show>
					</Section>

					<Section
						title={t("modals.participate.form.title")}
						class="container-participant-form-title"
					>
						<input
							class="input"
							type="text"
							inputmode="url"
							placeholder={t("modals.participate.form.link.placeholder")}
							value={form.link}
							onInput={(e) => setForm("link", e.currentTarget.value)}
							onBlur={(e) => setForm("link", e.currentTarget.value.trim())}
							onKeyDown={hideKeyboardOnEnter}
							maxLength={store.limits!.form.participate.link.maxLength}
						/>
					</Section>

					<Section
						description={t("modals.participate.form.description.hint")}
						class="container-participant-form-description"
					>
						<Editor
							value={form.description}
							setValue={(data) => setForm("description", data)}
							placeholder={t("modals.participate.form.description.placeholder")}
							maxLength={store.limits!.form.participate.description.maxLength}
						/>
					</Section>
				</div>

				<footer>
					<CustomMainButton
						onClick={onClickButton}
						text={t("modals.participate.form.button")}
						disabled={buttonDisabled() || processing()}
						loading={processing()}
					/>
				</footer>
			</div>
		</Modal>
	);
};

export default ModalParticipate;
