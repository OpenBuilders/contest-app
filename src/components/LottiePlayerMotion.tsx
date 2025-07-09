import type { Component } from "solid-js";
import { settings } from "../utils/settings";
import type { LottiePlayerProps } from "./LottiePlayer";
import LottiePlayer from "./LottiePlayer";

const LottiePlayerMotion: Component<LottiePlayerProps> = (props) => {
	return (
		<LottiePlayer
			{...props}
			autoplay={(props.autoplay ?? false) && !settings.reduce_motion.enabled}
		/>
	);
};

export default LottiePlayerMotion;
