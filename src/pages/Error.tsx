import "./Error.scss";

import { RiUserFacesAliensLine } from "solid-icons/ri";
import { VsBracketError } from "solid-icons/vs";
import { type Component, onMount } from "solid-js";
import { useTranslation } from "../contexts/TranslationContext";
import { invokeHapticFeedbackNotification } from "../utils/telegram";

type PageErrorProps = {
	title?: string;
	description?: string;
};

export const SectionError: Component<PageErrorProps> = ({
	title,
	description,
}) => {
	const { t } = useTranslation();

	onMount(() => {
		invokeHapticFeedbackNotification("error");
	});

	return (
		<div id="container-section-error">
			<RiUserFacesAliensLine class="animate__animated animate__fadeInUp" />
			<h1 class="animate__animated animate__fadeInUp">
				{title ?? t("pages.error.title")}
			</h1>
			<p class="animate__animated animate__fadeInUp">
				{description ?? t("pages.error.description")}
			</p>
		</div>
	);
};

const PageError: Component<PageErrorProps> = ({ title, description }) => {
	const { t } = useTranslation();

	return (
		<div id="container-page-error">
			<VsBracketError class="animate__animated animate__fadeInUp" />
			<h1 class="animate__animated animate__fadeInUp">
				{title ?? t("pages.error.title")}
			</h1>
			<p class="animate__animated animate__fadeInUp">
				{description ?? t("pages.error.description")}
			</p>
		</div>
	);
};

export default PageError;
