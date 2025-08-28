import "./SymbolPicker.scss";
import { createVirtualizer } from "@tanstack/solid-virtual";
import {
	type Accessor,
	batch,
	type Component,
	createSelector,
	For,
	onMount,
	type Setter,
} from "solid-js";
import { SymbolsModule } from "../utils/symbols";
import { invokeHapticFeedbackSelectionChanged } from "../utils/telegram";
import type { PopupProps } from "./Popup";
import Popup from "./Popup";
import { SVGSymbol } from "./SVG";

type SymbolPickerProps = PopupProps & {
	symbol: [Accessor<string>, Setter<string>];
	itemsPerRow?: number;
};

const DEFAULT_ITEMS_PER_ROW = 6;

const SymbolPicker: Component<SymbolPickerProps> = (props) => {
	const [value, setValue] = props.symbol;
	const [, setOpen] = props.signal;

	const VirtualList = () => {
		let elementParent: HTMLDivElement | undefined;

		const itemWidth = 100 / (props.itemsPerRow ?? DEFAULT_ITEMS_PER_ROW);

		const isActiveItem = createSelector(value);

		const items = Object.keys(SymbolsModule).map((i) =>
			i.replace("../assets/icons/symbols/", "").replace(".svg", ""),
		);

		const pickerVirtualizer = createVirtualizer({
			count: items.length,
			getScrollElement: () => elementParent!,
			estimateSize: () => 40,
			lanes: props.itemsPerRow ?? DEFAULT_ITEMS_PER_ROW,
			overscan: (props.itemsPerRow ?? DEFAULT_ITEMS_PER_ROW) * 2,
		});

		onMount(() => {
			pickerVirtualizer.scrollToIndex(items.indexOf(value()), {
				align: "start",
			});
		});

		const onClickItem = (e: MouseEvent) => {
			const id = (e.currentTarget as HTMLElement).getAttribute("data-id");
			if (!id) return;
			batch(() => {
				setValue(id);
				setOpen(false);
				invokeHapticFeedbackSelectionChanged();
			});
		};

		return (
			<div id="container-symbols-picker" ref={elementParent}>
				<ul style={{ height: `${pickerVirtualizer.getTotalSize()}px` }}>
					<For each={pickerVirtualizer.getVirtualItems()}>
						{(virtualItem) => (
							<li
								style={{
									height: `${virtualItem.size}px`,
									transform: `translateY(${virtualItem.start}px)`,
									left: `${virtualItem.lane * itemWidth}%`,
									width: `${itemWidth}%`,
								}}
								classList={{ active: isActiveItem(items[virtualItem.index]) }}
								data-id={items[virtualItem.index]}
								onClick={onClickItem}
							>
								<SVGSymbol id={`backdrop-${items[virtualItem.index]}`} />
							</li>
						)}
					</For>
				</ul>
			</div>
		);
	};

	return (
		<Popup
			anchorSelector={props.anchorSelector}
			signal={props.signal}
			closeOnClickOutside={props.closeOnClickOutside}
			portalParent={document.querySelector("#popups")!}
			anchorPosition={props.anchorPosition}
			animated={props.animated}
			animationDurationMs={props.animationDurationMs}
			containerClass={["container-symbol-picker", props.containerClass]
				.filter(Boolean)
				.join(" ")}
			class={props.class}
		>
			<VirtualList />
		</Popup>
	);
};

export default SymbolPicker;
