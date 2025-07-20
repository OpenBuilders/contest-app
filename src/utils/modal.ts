import type { Component } from "solid-js";
import { createStore } from "solid-js/store";
import ModalContestCreate from "../modals/Create";
import ModalContestCreateAnonymous from "../modals/CreateAnonymous";
import ModalContestCreateCategory from "../modals/CreateCategory";
import ModalContestCreatePrize from "../modals/CreatePrize";
import ModalContestCreatePublic from "../modals/CreatePublic";
import ModalSettings from "../modals/Settings";

type ModalState = {
	open: boolean;
	component: Component;
};

type ModalsStore = {
	settings: ModalState;
	create: ModalState;
	createPublic: ModalState;
	createPrize: ModalState;
	createAnonymous: ModalState;
	createCategory: ModalState;
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
	createPublic: {
		open: false,
		component: ModalContestCreatePublic,
	},
	createPrize: {
		open: false,
		component: ModalContestCreatePrize,
	},
	createAnonymous: {
		open: false,
		component: ModalContestCreateAnonymous,
	},
	createCategory: {
		open: false,
		component: ModalContestCreateCategory,
	},
});
