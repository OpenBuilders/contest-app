import type { Component } from "solid-js";
import { createStore } from "solid-js/store";
import ModalContestCreate from "../modals/Create";
import ModalContestCreateAnonymous from "../modals/CreateAnonymous";
import ModalContestCreateCategory from "../modals/CreateCategory";
import ModalContestCreatePublic from "../modals/CreatePublic";
import ModalParticipate from "../modals/Participate";
import ModalSettings from "../modals/Settings";
import type { Contest, ContestMetadata } from "./store";

type ModalState = {
	open: boolean;
	component: Component;
};

type ModalsStore = {
	settings: ModalState;
	create: ModalState;
	createPublic: ModalState;
	createAnonymous: ModalState;
	createCategory: ModalState;
	participate: {
		contest?: Contest;
		metadata?: ContestMetadata;
	} & ModalState;
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
	createAnonymous: {
		open: false,
		component: ModalContestCreateAnonymous,
	},
	createCategory: {
		open: false,
		component: ModalContestCreateCategory,
	},
	participate: {
		open: false,
		component: ModalParticipate,
	},
});
