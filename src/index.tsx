import "./scss/tailwind.css";
import "./scss/app.scss";

import Plausible from "plausible-tracker";

/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";

export const plausible = Plausible({
	domain: import.meta.env.VITE_PLAUSIBLE_DOMAIN,
	apiHost: import.meta.env.VITE_PLAUSIBLE_API,
});

plausible.enableAutoPageviews();

const root = document.getElementById("root");

render(() => <App />, root!);
