import type { Component } from "solid-js";
import { createStore } from "solid-js/store";
import ModalAnonymous from "../modals/Anonymous";
import ModalModeratorJoin from "../modals/ModeratorJoin";
import ModalParticipate from "../modals/Participate";
import ModalPlacement from "../modals/Placement";
import ModalSettings from "../modals/Settings";
import ModalSubmission from "../modals/Submission";
import ModalSubmissionsPicker from "../modals/SubmissionsPicker";
import type {
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
	anonymous: ModalState;
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
};

export const [modals, setModals] = createStore<ModalsStore>({
	settings: {
		open: false,
		component: ModalSettings,
	},
	anonymous: {
		open: false,
		component: ModalAnonymous,
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
});
