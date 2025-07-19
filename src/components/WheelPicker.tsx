import { clamp } from "../utils/number";
import { invokeHapticFeedbackSelectionChanged } from "../utils/telegram";
import "./WheelPicker.scss";
import {
	type Component,
	createEffect,
	createMemo,
	createSignal,
	For,
	on,
	onMount,
} from "solid-js";

export type WheelPickerItem = {
	value: string;
	label: string;
};

type WheelPickerProps = {
	items: WheelPickerItem[];
	value: string;
	setValue: (value: string) => void;
	visibleItemsCount?: number;
	itemHeight?: number;
	hideActiveItemMask?: boolean;
	containerClass?: string;
};

const WheelPicker: Component<WheelPickerProps> = (props) => {
	const itemHeight = props.itemHeight ?? 40;
	const visibleItemsCount = props.visibleItemsCount ?? 7;

	let container: HTMLDivElement | undefined;
	let lastValue: string | undefined;

	const [selectedIndex, setSelectedIndex] = createSignal(
		props.items.findIndex(({ value }) => value === props.value),
	);

	const selectedValue = createMemo(() => {
		const value = props.items[selectedIndex()]?.value;
		if (value) {
			setTimeout(() => {
				lastValue = value;
			});
		}
		return value;
	});

	const onClickItem = (e: MouseEvent) => {
		const dataIndex = (e.currentTarget as HTMLElement).getAttribute(
			"data-index",
		);
		if (!dataIndex) return;
		scrollToIndex(Number.parseInt(dataIndex), true);
	};

	const onScroll = () => {
		if (!container) return;
		const scrollTop = container.scrollTop;
		const index = clamp(
			Math.round(scrollTop / itemHeight),
			0,
			props.items.length - 1,
		);

		if (index !== selectedIndex()) {
			setSelectedIndex(index);
		}

		updateTransforms();
	};

	const scrollToIndex = (index: number, smooth?: boolean) => {
		if (container) {
			container.scrollTo({
				top: index * itemHeight,
				behavior: smooth ? "smooth" : "instant",
			});
		}
	};

	const updateTransforms = () => {
		if (!container) return;
		const children = Array.from(container.children) as HTMLDivElement[];
		const center = container.scrollTop + container.clientHeight / 2;

		children.forEach((item) => {
			const el = item.firstChild as HTMLSpanElement;
			if (!el) return;

			const offset = el.offsetTop + el.offsetHeight / 2 - center;
			const ratio = offset / itemHeight;
			const rotateX = ratio * 20;
			const scale = 1 - Math.abs(ratio * 0.1);
			const opacity = 1 - Math.abs(ratio) / 4;

			el.style.transform = `rotateX(${rotateX}deg) scale(${scale})`;
			el.style.opacity = `${opacity}`;
		});
	};

	onMount(() => {
		scrollToIndex(selectedIndex());
		updateTransforms();
	});

	createEffect(
		on(
			selectedIndex,
			() => {
				if (!selectedValue()) return;
				invokeHapticFeedbackSelectionChanged();
				props.setValue(selectedValue());
			},
			{
				defer: true,
			},
		),
	);

	createEffect(
		on(
			() => props.items,
			() => {
				const currentValueIndex = props.items.findIndex(
					(item) => item.value === lastValue,
				);

				if (currentValueIndex > -1 && currentValueIndex !== selectedIndex()) {
					setSelectedIndex(currentValueIndex);
				}

				if (props.items.length <= selectedIndex()) {
					setSelectedIndex(props.items.length - 1);
				}

				scrollToIndex(selectedIndex());
				updateTransforms();
			},
			{
				defer: true,
			},
		),
	);

	return (
		<div
			class={["container-wheel-picker", props.containerClass]
				.filter(Boolean)
				.join(" ")}
			classList={{ mask: !props.hideActiveItemMask }}
			style={{
				"--item-height": `${itemHeight}px`,
			}}
		>
			<div
				ref={container}
				on:scroll={{
					handleEvent: onScroll,
					passive: true,
				}}
				style={{
					height: `${visibleItemsCount * itemHeight}px`,
				}}
			>
				<For each={Array.from(new Array(Math.floor(visibleItemsCount / 2)))}>
					{() => <div></div>}
				</For>

				<For each={props.items}>
					{({ label }, index) => (
						<div data-index={index()} onClick={onClickItem}>
							<span>{label}</span>
						</div>
					)}
				</For>

				<For each={Array.from(new Array(Math.floor(visibleItemsCount / 2)))}>
					{() => <div></div>}
				</For>
			</div>
		</div>
	);
};

export default WheelPicker;
