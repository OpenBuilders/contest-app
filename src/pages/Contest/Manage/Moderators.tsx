import { useNavigate, useParams } from "@solidjs/router";
import BackButton from "../../../components/BackButton";
import "./Moderators.scss";
import { type Component, onMount } from "solid-js";
import { useTranslation } from "../../../contexts/TranslationContext";
import { invokeHapticFeedbackImpact } from "../../../utils/telegram";

const PageContestManageModerators: Component = () => {
	const navigate = useNavigate();
	const params = useParams();
	const { t } = useTranslation();

	const onBackButton = () => {
		navigate(`/contest/${params.slug}/manage`, {
			replace: true,
		});
	};

	onMount(() => {
		invokeHapticFeedbackImpact("light");
	});

	return (
		<>
			<div id="container-page-contest-manage-moderators" class="page">
				<div>{t("general.ok")} Moderators</div>
			</div>

			<BackButton onClick={onBackButton} />
		</>
	);
};

export default PageContestManageModerators;
