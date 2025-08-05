import { useNavigate, useParams } from "@solidjs/router";
import "./Submissions.scss";
import { type Component, onMount } from "solid-js";
import BackButton from "../../../components/BackButton";
import { useTranslation } from "../../../contexts/TranslationContext";
import { invokeHapticFeedbackImpact } from "../../../utils/telegram";

const PageContestManageSubmissions: Component = () => {
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
			<div id="container-page-contest-manage-submissions" class="page">
				<div>{t("general.ok")} Submissions</div>
			</div>

			<BackButton onClick={onBackButton} />
		</>
	);
};

export default PageContestManageSubmissions;
