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

const BottomBar: Component = () => {
	const { t } = useTranslation();
	const location = useLocation();

	return (
		<div id="container-bottombar">
			<A href="/" class="home">
				<Show
					when={location.pathname === "/"}
					fallback={<RiBuildingsHomeSmile2Line />}
				>
					<RiBuildingsHomeSmile2Fill />
				</Show>

				<span>{t("general.bottombar.home")}</span>
			</A>

			<A href="/contests" class="contests">
				<Show
					when={location.pathname === "/contests"}
					fallback={<AiOutlineTrophy />}
				>
					<AiFillTrophy />
				</Show>

				<span>{t("general.bottombar.contests")}</span>
			</A>

			<A href="/profile" class="profile">
				<Show
					when={location.pathname === "/profile"}
					fallback={<RiUserFacesUser4Line />}
				>
					<RiUserFacesUser4Fill />
				</Show>

				<span>{t("general.bottombar.profile")}</span>
			</A>
		</div>
	);
};

export default BottomBar;
