import gsap from "gsap";
import { type Component, createEffect, onMount } from "solid-js";
import { motionMultipler } from "../utils/motion";

type CounterProps = {
	value: number;
	initialValue?: number;
	class?: string;
	durationMs?: number;
	splitDigits?: boolean;
	snap?: number;
};

const Counter: Component<CounterProps> = (props) => {
	let counter: HTMLSpanElement | undefined;

	onMount(() => {
		if (!counter) return;

		createEffect(() => {
			gsap.fromTo(
				counter,
				{
					innerText: counter.innerText.replace(",", ""),
				},
				{
					innerText: props.value,
					duration: ((props.durationMs ?? 1_000) / 1_000) * motionMultipler(),
					snap: { innerText: props.snap ?? 1 },
					stagger: {
						onUpdate: function () {
							if (props.splitDigits !== false) {
								// @ts-ignore
								const el = this.targets()[0];
								el.innerText = Number.parseInt(el.innerText).toLocaleString();
							}
						},
					},
				},
			);
		});
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
