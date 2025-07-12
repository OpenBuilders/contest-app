import type { Component } from "solid-js";
import { createStore } from "solid-js/store";
import ModalContestCreate from "../modals/Create";
import ModalSettings from "../modals/Settings";

type ModalState = {
	open: boolean;
	component: Component;
};

type ModalsStore = {
	settings: ModalState;
	create: ModalState;
};

export const [modals, setModals] = createStore<ModalsStore>({
	settings: {
		open: false,
		component: ModalSettings,
	},
	create: {
		open: false,
		component: ModalContestCreate,
	},
});
