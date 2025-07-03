import type { Component } from "solid-js";
import ModalSettings from "../modals/Settings";
import { createStore } from "solid-js/store";

type ModalState = {
	open: boolean;
	component: Component;
};

type ModalsStore = {
	settings: ModalState;
};

export const [modals, setModals] = createStore<ModalsStore>({
	settings: {
		open: false,
		component: ModalSettings,
	},
});
