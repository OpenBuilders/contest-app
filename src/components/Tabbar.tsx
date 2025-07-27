import {
	type Component,
	createEffect,
	createUniqueId,
	For,
	on,
	onCleanup,
	onMount,
} from "solid-js";
import "./Tabbar.scss";
import { createStore } from "solid-js/store";
import { Dynamic } from "solid-js/web";
import { isRTL } from "../utils/i18n";
import { invokeHapticFeedbackSelectionChanged } from "../utils/telegram";

type TabbarItem = {
	slug: string;
	title: string;
	component: Component;
};

type TabbarProps = {
	items: TabbarItem[];
	value: TabbarItem["slug"];
	setValue: (value: TabbarItem["slug"]) => void;
};

const Tabbar: Component<TabbarProps> = (props) => {
	const id = createUniqueId();

	let slider: any;

	const [indicatorPosition, setIndicatorPosition] = createStore({
		x: "auto",
		width: "auto",
	});

	const getIndex = (slug: string) => {
		return props.items.findIndex((i) => i.slug === slug);
	};

	createEffect(
		on(
			() => props.value,
			() => {
				slider.swiper.slideTo(getIndex(props.value));

				const activeLISpan = document.querySelector(
					`#${id} > ul > li:nth-child(${getIndex(props.value) + 1}) > span`,
				) as HTMLElement;

				setIndicatorPosition({
					x: `${activeLISpan.offsetLeft}px`,
					width: `${activeLISpan.clientWidth ?? 0}px`,
				});

				invokeHapticFeedbackSelectionChanged();
			},
		),
	);

	const onSliderChange = () => {
		props.setValue(props.items[slider.swiper.activeIndex].slug);
	};

	onMount(() => {
		slider.swiper.on("slideChange", onSliderChange);

		onCleanup(() => {
			slider.swiper.off("slideChange", onSliderChange);
		});
	});

	return (
		<div class="tabbar" id={id}>
			<ul>
				<For each={props.items}>
					{(item) => (
						<li
							classList={{
								active: item.slug === props.value,
							}}
							onClick={() => props.setValue(item.slug)}
						>
							<span>{item.title}</span>
						</li>
					)}
				</For>

				<li
					class="indicator"
					style={{
						"inset-inline-start": indicatorPosition.x,
						width: indicatorPosition.width,
					}}
				></li>
			</ul>

			<swiper-container
				ref={slider}
				slides-per-view={1}
				initial-slide={getIndex(props.value)}
				dir={isRTL() ? "rtl" : "ltr"}
			>
				<For each={props.items}>
					{(item) => (
						<swiper-slide>
							<Dynamic component={item.component} />
						</swiper-slide>
					)}
				</For>
			</swiper-container>
		</div>
	);
};

export default Tabbar;
