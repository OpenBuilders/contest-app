import { useNavigate, useParams } from "@solidjs/router";
import "./Submissions.scss";
import { type Component, onMount } from "solid-js";
import BackButton from "../../../components/BackButton";
import { useTranslation } from "../../../contexts/TranslationContext";
import { store } from "../../../utils/store";
import { invokeHapticFeedbackImpact } from "../../../utils/telegram";

const PageContestManageSubmissions: Component = () => {
	const navigate = useNavigate();
	const params = useParams();
	const { t } = useTranslation();

	if (!store.token) {
		navigate(`/splash/contest-${params.slug}-manage-submissions`, {
			replace: true,
		});
		return;
	}

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
