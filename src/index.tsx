import "./scss/tailwind.css";
import "./scss/app.scss";

/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";

const root = document.getElementById("root");

render(() => <App />, root!);
