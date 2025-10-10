import "./Participate.scss";
import type {
	SendTransactionResponse,
	TonProofItemReply,
} from "@tonconnect/sdk";
import { BsQuestionCircleFill } from "solid-icons/bs";
import { FaSolidCircleExclamation } from "solid-icons/fa";
import {
	batch,
	type Component,
	createMemo,
	createSignal,
	Match,
	onMount,
	Show,
	Switch,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import { Avatar, AvatarAlias } from "../components/Avatar";
import CustomMainButton from "../components/CustomMainButton";
import Editor from "../components/Editor";
import LottiePlayerMotion from "../components/LottiePlayerMotion";
import Modal from "../components/Modal";
import { Section } from "../components/Section";
import { toast } from "../components/Toast";
import { useTranslation } from "../contexts/TranslationContext";
import { TGS } from "../utils/animations";
import { requestAPI } from "../utils/api";
import { playConfetti } from "../utils/confetti";
import {
	initializeTonConnect,
	parseTONAddress,
	tonConnectUI,
} from "../utils/lazy";
import { modals, setModals } from "../utils/modal";
import { popupManager } from "../utils/popup";
import { toggleSignal } from "../utils/signals";
import { store } from "../utils/store";
import {
	invokeHapticFeedbackImpact,
	invokeHapticFeedbackNotification,
	lp,
} from "../utils/telegram";

type ParticipateFormStore = {
	description: string;
};

type WalletFormStore = {
	wallet?: string;
	wallet_initState?: string;
	ton_proof?: TonProofItemReply;
};

const ModalParticipate: Component = () => {
	const { t, td } = useTranslation();

	const [state, setState] = createSignal<"form" | "done">("form");

	const [form, setForm] = createStore<ParticipateFormStore>({
		description: "",
	});
	const [formWallet, setFormWallet] = createStore<WalletFormStore>({});
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
		const {
			body: { textContent },
		} = new DOMParser().parseFromString(form.description, "text/html");

		if (
			textContent.length === 0 ||
			textContent.length > store.limits!.form.participate.description.maxLength
		) {
			return true;
		}
	});

	const handlePayment = async () => {
		if (!(dependencies.tonconnect && tonConnectUI)) {
			setDependencies("tonconnect", await initializeTonConnect());
			return handlePayment();
		}

		tonConnectUI?.setConnectRequestParameters({
			state: "loading",
		});

		const request = await requestAPI(
			"/transaction/payload/create",
			undefined,
			"GET",
		);

		if (!request) return;

		const {
			result: { payload },
		} = request;

		tonConnectUI?.setConnectRequestParameters({
			state: "ready",
			value: {
				tonProof: payload,
			},
		});

		await tonConnectUI?.openModal();

		return new Promise<false | SendTransactionResponse>((resolve) => {
			const disposeOnStatusChange = tonConnectUI?.onStatusChange(
				async (wallet) => {
					disposeOnModalStateChange?.();
					disposeOnStatusChange?.();

					setFormWallet(
						produce((store) => {
							if (wallet) {
								store.wallet = wallet?.account.address;
								store.wallet_initState = wallet.account.walletStateInit;
							}

							if (wallet?.connectItems?.tonProof) {
								store.ton_proof = wallet?.connectItems?.tonProof;
							}
						}),
					);

					const request = await requestAPI(
						`/contest/${modals.participate.contest?.slug}/transaction/create`,
						{
							wallet: formWallet.wallet,
							wallet_initState: formWallet.wallet_initState,
							ton_proof: formWallet.ton_proof
								? JSON.stringify(formWallet.ton_proof)
								: undefined,
						},
						"POST",
					);

					if (request) {
						const {
							result: {
								payload: { master: payload_master, target: payload_target },
							},
						} = request;

						tonConnectUI
							?.sendTransaction({
								validUntil: Math.floor(Date.now() / 1000) + 300,
								messages: [
									{
										address:
											parseTONAddress(
												modals.participate.contest?.fee_wallet ?? "",
											) ?? "",
										amount: (
											0.95 *
											modals.participate.contest!.fee! *
											1e9
										).toString(),
										payload: payload_target,
									},
									{
										address: store.wallets.master ?? "",
										amount: (
											0.05 *
											modals.participate.contest!.fee! *
											1e9
										).toString(),
										payload: payload_master,
									},
								],
							})
							.then(resolve)
							.catch((e) => {
								console.error(e);
								resolve(false);
							});
					}
				},
			);

			const disposeOnModalStateChange = tonConnectUI?.onModalStateChange(
				(state) => {
					if (state.status === "closed") {
						resolve(false);
					}

					disposeOnModalStateChange?.();
				},
			);
		});
	};

	const onClickButton = async () => {
		if (processing()) return;

		const popup = await popupManager.openPopup({
			title: t("modals.participate.confirm.title"),
			message: t("modals.participate.confirm.prompt"),
			buttons: [
				{
					id: "ok",
					type: "destructive",
					text: t("modals.participate.confirm.button"),
				},
				{
					id: "cancel",
					type: "cancel",
				},
			],
		});

		if (!popup.button_id || popup.button_id === "cancel") return;

		setProcessing(true);

		invokeHapticFeedbackImpact("soft");

		let boc: string | undefined;

		if (modals.participate.contest?.fee) {
			const result = await handlePayment();

			if (result) {
				boc = result.boc;
			} else {
				setProcessing(false);
				return;
			}
		}

		const request = await requestAPI(
			`/contest/${modals.participate.contest!.slug}/submit`,
			{
				description: form.description,
				boc: boc,
				wallet: formWallet.wallet,
			},
			"POST",
		);

		if (request) {
			const { status } = request;

			if (status === "success") {
				invokeHapticFeedbackNotification("success");
				playConfetti({
					emojis: ["🎉"],
				});

				batch(() => {
					setState("done");
					toggleSignal("fetchContest");
				});

				return;
			}
		}

		toast({
			icon: FaSolidCircleExclamation,
			text: t("errors.participate.submit"),
		});
		setProcessing(false);
	};

	const fullname = modals.participate.contest?.anonymous
		? [
				store.user?.anonymous_profile[1][1],
				store.user?.anonymous_profile[2][1],
			].join(" ")
		: [lp?.tgWebAppData?.user?.first_name, lp?.tgWebAppData?.user?.last_name]
				.filter(Boolean)
				.join(" ");

	return (
		<Modal
			containerClass="container-modal-participate"
			class="modal-participate"
			onClose={onClose}
			portalParent={document.querySelector("#modals")!}
			withCloseButton={true}
		>
			<Switch>
				<Match when={state() === "form"}>
					<div>
						<div id="container-modal-participate-form">
							<h1>{t("modals.participate.title")}</h1>

							<Section>
								<header>
									<BsQuestionCircleFill />
									<span>{t("modals.participate.instruction.title")}</span>
								</header>

								<div
									innerHTML={(
										modals.participate.contest?.instruction ??
										t("modals.participate.instruction.default")
									).replace(/\n/g, "<br>")}
								></div>
							</Section>

							<Section class="container-participant-form-description">
								<Editor
									value={form.description}
									setValue={(data) => setForm("description", data)}
									placeholder={t(
										"modals.participate.form.description.placeholder",
									)}
									maxLength={
										store.limits!.form.participate.description.maxLength
									}
								/>
							</Section>

							<footer>
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
								<span
									innerHTML={td("modals.participate.profile", {
										profile: fullname,
									})}
								></span>
							</footer>
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
				</Match>

				<Match when={state() === "done"}>
					<div>
						<div id="container-modal-participate-done">
							<LottiePlayerMotion
								src={TGS.confetti.url}
								outline={TGS.confetti.outline}
								autoplay
								playOnClick
							/>

							<h1>{t("modals.participate.done.title")}</h1>
							<p>{t("modals.participate.done.description")}</p>
						</div>

						<footer>
							<CustomMainButton onClick={onClose} text={t("general.done")} />
						</footer>
					</div>
				</Match>
			</Switch>
		</Modal>
	);
};

export default ModalParticipate;
