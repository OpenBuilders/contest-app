import { createStore } from "solid-js/store";

type User = {
	user_id: number;
	first_name: string;
	last_name?: string;
	profile_photo?: string;
	anonymous_profile: [number, string, string];
	language?: string;
};

type Contest = {
	id?: number;
	owner_id: number;
	moderators?: number[];
	title: string;
	description: string;
	price: number;
	public: boolean;
	anonymous: boolean;
	category?: number;
	date_start: number;
	date_end: number;
	date_results?: number;
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
