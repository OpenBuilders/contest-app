import Plausible from "plausible-tracker";
import { type Component, onMount } from "solid-js";

export const plausible = Plausible({
	domain: import.meta.env.VITE_PLAUSIBLE_DOMAIN,
	apiHost: import.meta.env.VITE_PLAUSIBLE_API,
});

const PlausibleTracker: Component = () => {
	onMount(() => {
		plausible.trackPageview();
		plausible.enableAutoPageviews();
	});

	return null;
};

export default PlausibleTracker;
