import "./scss/tailwind.css";
import "./scss/app.scss";

import App from "./App";
/* @refresh reload */
import { render } from "solid-js/web";

const root = document.getElementById("root");

render(() => <App />, root!);
