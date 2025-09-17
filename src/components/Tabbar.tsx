import {
	type Accessor,
	type Component,
	createEffect,
	createUniqueId,
	For,
	on,
	onCleanup,
	onMount,
	Show,
} from "solid-js";
import "./Tabbar.scss";
import { createStore } from "solid-js/store";
import { Dynamic } from "solid-js/web";
import { isRTL } from "../utils/i18n";
import { invokeHapticFeedbackSelectionChanged } from "../utils/telegram";

export type TabbarItem = {
	slug: string;
	title: string;
	subtitle?: string | Accessor<string | undefined>;
	component: Component;
};

type TabbarProps = {
	items: TabbarItem[];
	value: TabbarItem["slug"];
	setValue: (value: TabbarItem["slug"]) => void;
	mode?: "segmented" | "iOS";
	gap?: number;
};

const Tabbar: Component<TabbarProps> = (props) => {
	const id = createUniqueId();

	let slider: any;

	const mode = props.mode ?? "iOS";

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
			},
		),
	);

	createEffect(
		on(
			() => props.value,
			() => {
				invokeHapticFeedbackSelectionChanged();
			},
			{
				defer: true,
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

	const onClickTabbarItem = (e: MouseEvent) => {
		const slug = (e.currentTarget as HTMLElement).getAttribute("data-slug");
		if (!slug) return;
		props.setValue(slug);
	};

	return (
		<div class={["tabbar", mode].filter(Boolean).join(" ")} id={id}>
			<ul>
				<For each={props.items}>
					{(item) => (
						<li
							classList={{
								active: item.slug === props.value,
							}}
							onClick={onClickTabbarItem}
							data-slug={item.slug}
						>
							<span>
								{item.title}
								<Show when={item.subtitle}>
									<span>
										{typeof item.subtitle === "string"
											? item.subtitle
											: item.subtitle?.()}
									</span>
								</Show>
							</span>
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
				space-between={props.gap ?? 0}
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
