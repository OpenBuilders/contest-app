import { createStore } from "solid-js/store";

const [signals, setSignals] = createStore({
	fetchMyContests: false,
});

const toggleSignal = (signal: keyof typeof signals) => {
	setSignals(signal, !signals[signal]);
};

export { signals, toggleSignal };
