import "./Settings.scss";
import { type Component, createEffect, on, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import Modal from "../components/Modal";
import {
	SectionList,
	SectionListSelect,
	SectionListSwitch,
} from "../components/Section";
import { useTranslation } from "../contexts/TranslationContext";
import { setModals } from "../utils/modal";
import { setSettings, settings } from "../utils/settings";
import { invokeHapticFeedbackImpact } from "../utils/telegram";

const ModalSettings: Component = () => {
	const { t, locale, setLocale } = useTranslation();

	onMount(() => {
		invokeHapticFeedbackImpact("soft");
	});

	const onClose = () => {
		setModals("settings", "open", false);
	};

	const [form, setForm] = createStore({
		lang: locale(),
		haptic: settings.haptic.enabled,
	});

	createEffect(
		on(
			() => form.lang,
			() => {
				setLocale(form.lang);
				setSettings("language", form.lang);
			},
			{
				defer: true,
			},
		),
	);

	createEffect(
		on(
			() => form.haptic,
			() => {
				setSettings("haptic", "enabled", form.haptic);
			},
			{
				defer: true,
			},
		),
	);

	return (
		<Modal
			containerClass="container-modal-settings"
			class="modal-settings"
			onClose={onClose}
			portalParent={document.querySelector("#modals")!}
		>
			<div>
				<SectionList
					title={t("modals.settings.title")}
					items={[
						{
							label: t("modals.settings.language"),
							placeholder: () => (
								<SectionListSelect
									items={[
										{
											label: t("locales.en"),
											value: "en",
										},
										{
											label: t("locales.ru"),
											value: "ru",
										},
										{
											label: t("locales.fa"),
											value: "fa",
										},
										{
											label: t("locales.ar"),
											value: "ar",
										},
										{
											label: t("locales.de"),
											value: "de",
										},
										{
											label: t("locales.hi"),
											value: "hi",
										},
									]}
									value={form.lang}
									setValue={(value) => {
										setForm("lang", value as any);
									}}
								/>
							),
						},
						{
							label: t("modals.settings.haptic"),
							placeholder: () => (
								<SectionListSwitch
									value={form.haptic}
									setValue={(value) => {
										setForm("haptic", value);
									}}
								/>
							),
						},
					]}
				/>
			</div>

			<p>{t("modals.settings.footer")}</p>
		</Modal>
	);
};

export default ModalSettings;
