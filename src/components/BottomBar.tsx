import "./BottomBar.scss";

import { A, useLocation } from "@solidjs/router";
import { AiFillTrophy, AiOutlineTrophy } from "solid-icons/ai";
import {
	RiBuildingsHomeSmile2Fill,
	RiBuildingsHomeSmile2Line,
	RiUserFacesUser4Fill,
	RiUserFacesUser4Line,
} from "solid-icons/ri";
import { type Component, Show } from "solid-js";
import { useTranslation } from "../contexts/TranslationContext";
import { navigator } from "../utils/navigator";
import { lp } from "../utils/telegram";
import ImageLoader from "./ImageLoader";

export const bottomBarValidPaths = ["/contests", "/profile"];

const BottomBar: Component = () => {
	const { t } = useTranslation();
	const location = useLocation();

	const onClickItem = (e: MouseEvent) => {
		e.preventDefault();
		const href = (e.currentTarget as HTMLElement).getAttribute("data-href");
		if (!href) return;
		navigator.go(href);
	};

	return (
		<div id="container-bottombar">
			<A
				href="/"
				data-href="/"
				class="home text-secondary"
				onClick={onClickItem}
			>
				<Show
					when={location.pathname === "/"}
					fallback={<RiBuildingsHomeSmile2Line />}
				>
					<RiBuildingsHomeSmile2Fill />
				</Show>

				<span>{t("general.bottombar.home")}</span>
			</A>

			<A
				href="/contests"
				data-href="/contests"
				class="contests text-secondary"
				onClick={onClickItem}
			>
				<Show
					when={location.pathname === "/contests"}
					fallback={<AiOutlineTrophy />}
				>
					<AiFillTrophy />
				</Show>

				<span>{t("general.bottombar.contests")}</span>
			</A>

			<A
				href="/profile"
				data-href="/profile"
				class="profile text-secondary"
				onClick={onClickItem}
			>
				<Show
					when={lp!.tgWebAppData?.user?.photo_url}
					fallback={
						<Show
							when={location.pathname === "/profile"}
							fallback={<RiUserFacesUser4Line />}
						>
							<RiUserFacesUser4Fill />
						</Show>
					}
				>
					<ImageLoader src={lp!.tgWebAppData?.user?.photo_url!} />
				</Show>

				<span>{t("general.bottombar.profile")}</span>
			</A>
		</div>
	);
};

export default BottomBar;
