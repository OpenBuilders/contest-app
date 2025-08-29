import type { Component } from "solid-js";
import { createStore } from "solid-js/store";
import ModalContestDescription from "../modals/ContestDescription";
import ModalContestCreate from "../modals/Create";
import ModalContestCreateAnonymous from "../modals/CreateAnonymous";
import ModalContestCreateCategory from "../modals/CreateCategory";
import ModalContestCreatePublic from "../modals/CreatePublic";
import ModalModeratorJoin from "../modals/ModeratorJoin";
import ModalParticipate from "../modals/Participate";
import ModalPlacement from "../modals/Placement";
import ModalSettings from "../modals/Settings";
import ModalSubmission from "../modals/Submission";
import ModalSubmissionsPicker from "../modals/SubmissionsPicker";
import type {
	AnnotatedContest,
	AnnotatedSubmission,
	Contest,
	ContestMetadata,
	Placement,
} from "./store";

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
	participate: ModalState & {
		contest?: Contest;
		metadata?: ContestMetadata;
	};
	moderatorJoin: ModalState & {
		slug_moderator?: string;
	};
	submission: ModalState & {
		slug?: string;
		submission?: AnnotatedSubmission;
	};
	placement: ModalState & {
		slug?: string;
		placement?: Placement;
		submissions?: AnnotatedSubmission[];
	};
	submissionsPicker: ModalState & {
		picked?: number[];
		submissions?: AnnotatedSubmission[];
	};
	contestDescription: ModalState & {
		contest?: AnnotatedContest;
	};
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
	moderatorJoin: {
		open: false,
		component: ModalModeratorJoin,
	},
	submission: {
		open: false,
		component: ModalSubmission,
	},
	placement: {
		open: false,
		component: ModalPlacement,
	},
	submissionsPicker: {
		open: false,
		component: ModalSubmissionsPicker,
	},
	contestDescription: {
		open: false,
		component: ModalContestDescription,
	},
});
