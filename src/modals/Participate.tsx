import "./Participate.scss";
import { type Component, onMount, Show } from "solid-js";
import { Avatar, AvatarAlias } from "../components/Avatar";
import Modal from "../components/Modal";
import { Section } from "../components/Section";
import { useTranslation } from "../contexts/TranslationContext";
import { modals, setModals } from "../utils/modal";
import { store } from "../utils/store";
import { invokeHapticFeedbackImpact, lp } from "../utils/telegram";

const ModalParticipate: Component = () => {
	const { t } = useTranslation();

	onMount(() => {
		if (!(modals.participate.contest && modals.participate.metadata)) {
			onClose();
			return;
		}

		invokeHapticFeedbackImpact("soft");
	});

	const onClose = () => {
		setModals("participate", "open", false);
	};

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
			</div>
		</Modal>
	);
};

export default ModalParticipate;
