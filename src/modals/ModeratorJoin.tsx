import "./ModeratorJoin.scss";
import { FaSolidCircleExclamation } from "solid-icons/fa";
import {
	type Component,
	createMemo,
	createSignal,
	onMount,
	Show,
} from "solid-js";
import { produce } from "solid-js/store";
import ContestThumbnail from "../components/ContestThumbnail";
import CustomMainButton from "../components/CustomMainButton";
import Modal from "../components/Modal";
import { SVGSymbol } from "../components/SVG";
import { toast } from "../components/Toast";
import { useTranslation } from "../contexts/TranslationContext";
import { requestAPI } from "../utils/api";
import { modals, setModals } from "../utils/modal";
import { navigator } from "../utils/navigator";
import { toggleSignal } from "../utils/signals";
import type { Contest } from "../utils/store";
import { getSymbolSVGString } from "../utils/symbols";
import {
	invokeHapticFeedbackImpact,
	invokeHapticFeedbackNotification,
} from "../utils/telegram";
import {
	ContestThemeBackdrops,
	type ContestThemeSymbol,
} from "../utils/themes";

const ModalModeratorJoin: Component = () => {
	const { t } = useTranslation();

	const [processing, setProcessing] = createSignal(false);
	const [data, setData] = createSignal<
		| undefined
		| {
				contest: Pick<
					Contest,
					"title" | "image" | "theme" | "verified" | "slug"
				>;
		  }
	>(undefined);

	onMount(async () => {
		if (!modals.moderatorJoin.slug_moderator) {
			onClose();
			return;
		}

		if (!data()) {
			await fetchData();
		}
	});

	const fetchData = async () => {
		const request = await requestAPI(
			`/contest/${modals.moderatorJoin.slug_moderator}/moderators/info`,
			{},
			"GET",
		);

		if (request) {
			const { result, status } = request;

			if (status === "success") {
				setData({
					contest: result.contest,
				});
			}
		}

		toast({
			icon: FaSolidCircleExclamation,
			text: t("errors.moderators.fetch"),
		});
		onClose();
	};

	const onClose = () => {
		setModals(
			"moderatorJoin",
			produce((data) => {
				data.slug_moderator = undefined;
				data.open = false;
			}),
		);
	};

	const onClickJoin = async () => {
		if (processing()) return;
		setProcessing(true);
		invokeHapticFeedbackImpact("soft");

		const request = await requestAPI(
			`/contest/${modals.moderatorJoin.slug_moderator}/moderators/join`,
			{},
			"POST",
		);

		if (request) {
			const { status } = request;

			if (status === "success") {
				onClose();
				toggleSignal("fetchMyContests");
				invokeHapticFeedbackNotification("success");
				navigator.go(`/contest/${data()!.contest.slug}`, {
					params: {
						theme: {
							header: false,
						},
					},
				});
				return;
			}
		}

		toast({
			icon: FaSolidCircleExclamation,
			text: t("errors.moderators.join"),
		});
		setProcessing(false);
	};

	const theme = createMemo(() => {
		if (!data()?.contest?.theme) return;

		const backdrop = ContestThemeBackdrops.find(
			(i) => i.id === data()!.contest?.theme?.backdrop,
		);
		if (!backdrop) return;

		const symbol: ContestThemeSymbol = {
			id: data()!.contest.theme!.symbol!,
			component: getSymbolSVGString(data()!.contest.theme!.symbol!),
		};

		return {
			backdrop,
			symbol,
		};
	});

	return (
		<Modal
			containerClass="container-modal-moderator-join"
			class="modal-moderator-join"
			onClose={onClose}
			portalParent={document.querySelector("#modals")!}
			withCloseButton={true}
		>
			<Show
				when={data()}
				fallback={
					<div id="container-modal-moderator-join-shimmer">
						<header>
							<div class="shimmer"></div>
							<span class="shimmer"></span>
						</header>

						<div>
							<div class="shimmer"></div>
						</div>

						<div class="shimmer"></div>
					</div>
				}
			>
				<div>
					<header>
						<ContestThumbnail
							image={data()!.contest?.image}
							backdrop={theme()?.backdrop}
							symbol={theme()?.symbol}
							symbolSize={48}
						/>

						<h1>
							{data()!.contest?.title}
							<Show when={data()!.contest?.verified}>
								<SVGSymbol id="VsVerifiedFilled" />
							</Show>
						</h1>
					</header>

					<p>{t("modals.moderators.join.prompt")}</p>

					<CustomMainButton
						text={t("modals.moderators.join.button")}
						onClick={onClickJoin}
						disabled={processing()}
						loading={processing()}
					/>
				</div>
			</Show>
		</Modal>
	);
};

export default ModalModeratorJoin;
