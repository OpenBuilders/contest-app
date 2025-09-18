import { type Component, createEffect, onCleanup } from "solid-js";
import { motionMultipler } from "../utils/motion";

type CounterProps = {
	value: number;
	initialValue?: number;
	class?: string;
	durationMs?: number;
	splitDigits?: boolean;
	snap?: number; // smallest increment (e.g. 1, 0.1)
};

const Counter: Component<CounterProps> = (props) => {
	let counter: HTMLSpanElement | undefined;
	let frameId: number | null = null;

	createEffect(() => {
		if (!counter) return;

		// Cancel any previous animation
		if (frameId) cancelAnimationFrame(frameId);

		const start =
			parseFloat(counter.innerText.replace(/,/g, "")) ||
			props.initialValue ||
			0;
		const end = props.value;
		const duration =
			((props.durationMs ?? 1000) / 1000) * motionMultipler() * 1000;
		const snap = props.snap ?? 1;

		const startTime = performance.now();

		const animate = (now: number) => {
			const elapsed = now - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const current = start + (end - start) * progress;

			const displayValue = Math.round(current / snap) * snap;

			if (props.splitDigits !== false) {
				counter!.innerText = displayValue.toLocaleString();
			} else {
				counter!.innerText = String(displayValue);
			}

			if (progress < 1) {
				frameId = requestAnimationFrame(animate);
			}
		};

		frameId = requestAnimationFrame(animate);
	});

	onCleanup(() => {
		if (frameId) cancelAnimationFrame(frameId);
	});

	return (
		<span
			ref={counter}
			class={["counter", props.class].filter(Boolean).join(" ")}
		>
			{props.initialValue ?? 0}
		</span>
	);
};

export default Counter;
