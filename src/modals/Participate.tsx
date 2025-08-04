import "./Participate.scss";
import { batch, type Component, createMemo, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { Avatar, AvatarAlias } from "../components/Avatar";
import CustomMainButton from "../components/CustomMainButton";
import Editor from "../components/Editor";
import Modal from "../components/Modal";
import { Section } from "../components/Section";
import { useTranslation } from "../contexts/TranslationContext";
import { hideKeyboardOnEnter, isValidURL } from "../utils/input";
import { modals, setModals } from "../utils/modal";
import { store } from "../utils/store";
import { invokeHapticFeedbackImpact, lp } from "../utils/telegram";

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

	onMount(() => {
		if (!(modals.participate.contest && modals.participate.metadata)) {
			onClose();
			return;
		}

		invokeHapticFeedbackImpact("soft");
	});

	const onClose = () => {
		batch(() => {
			setModals("participate", "open", false);
			setModals("participate", "contest", undefined);
			setModals("participate", "metadata", undefined);
		});
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
			!isValidURL(form.link.trim()) ||
			form.link.trim().length < store.limits!.form.participate.link.minLength ||
			form.link.trim().length > store.limits!.form.participate.link.maxLength
		);
	});

	const onClickButton = () => {};

	return (
		<Modal
			containerClass="container-modal-participate"
			class="modal-participate"
			onClose={onClose}
			portalParent={document.querySelector("#modals")!}
		>
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

				<CustomMainButton
					onClick={onClickButton}
					text={t("modals.participate.form.button")}
					disabled={buttonDisabled()}
				/>
			</div>
		</Modal>
	);
};

export default ModalParticipate;
