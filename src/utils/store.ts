import { createStore } from "solid-js/store";

export type Store = {
	token: string | null;
	version: string | null;
};

export const [store, setStore] = createStore<Store>({
	token: null,
	version: null,
});
