import { createStore } from "solid-js/store";

type User = {
	user_id: number;
	first_name: string;
	last_name?: string;
	profile_photo?: string;
	anonymous_profile: [number, string, string];
	language?: string;
};

export type Contest = {
	id?: number;
	slug: string;
	slug_moderator?: string;
	owner_id?: number;
	moderators?: number[];
	title: string;
	description: string;
	fee: number;
	prize?: string;
	public: boolean;
	anonymous: boolean;
	verified?: boolean;
	category?: string;
	image?: string;
	theme?: {
		backdrop?: number;
		symbol?: string;
	};
	date_end: number;
	role?: "owner" | "moderator" | "participant";
};

export type Store = {
	token?: string;
	categories?: { [key: string]: string };
	limits?: { [key: string]: any };
	contests: {
		my?: Contest[];
	};
	user?: User;
	version?: string;
};

export const [store, setStore] = createStore<Store>({
	contests: {},
});
