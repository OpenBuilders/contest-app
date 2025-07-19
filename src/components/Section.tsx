import {
	type Component,
	createEffect,
	createSignal,
	For,
	on,
	type ParentComponent,
	Show,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import "./Section.scss";
import { FaSolidChevronRight } from "solid-icons/fa";
import { HiSolidChevronUpDown } from "solid-icons/hi";
import { invokeHapticFeedbackSelectionChanged } from "../utils/telegram";
import Modal from "./Modal";
import type { WheelPickerItem } from "./WheelPicker";
import WheelPicker from "./WheelPicker";

type SectionProps = {
	title?: string;
	description?: string | Component;
};

export const Section: ParentComponent<SectionProps> = (props) => {
	return (
		<section class="container-section">
			<Show when={props.title}>
				<span>{props.title}</span>
			</Show>

			<div>{props.children}</div>

			<Show when={props.description}>
				<Show
					when={typeof props.description === "string"}
					fallback={<Dynamic component={props.description} />}
				>
					<p>{props.description as string}</p>
				</Show>
			</Show>
		</section>
	);
};

type SectionListItem = {
	prepend?: Component;
	label: string;
	placeholder: Component;
	clickable?: boolean;
	onClick?: (e: MouseEvent) => void;
	onClickLabel?: (e: MouseEvent) => void;
};

type SectionListProps = SectionProps & {
	items: SectionListItem[];
};

export const SectionList: Component<SectionListProps> = (props) => {
	return (
		<Section title={props.title} description={props.description}>
			<div class="container-section-list">
				<For each={props.items}>
					{(item) => (
						<div
							onClick={item.onClick}
							classList={{ clickable: item.clickable }}
						>
							<Show when={item.prepend}>
								<div class="prepend">
									<Dynamic component={item.prepend} />
								</div>
							</Show>

							<span onClick={item.onClickLabel}>{item.label}</span>

							<div class="placeholder">
								<Dynamic component={item.placeholder} />
							</div>
						</div>
					)}
				</For>
			</div>
		</Section>
	);
};

type SectionListSwitchProps = {
	value: boolean;
	setValue: (value: boolean) => void;
};

export const SectionListSwitch: Component<SectionListSwitchProps> = (props) => {
	const toggle = () => props.setValue(!props.value);

	createEffect(
		on(
			() => props.value,
			() => {
				invokeHapticFeedbackSelectionChanged();
			},
		),
	);

	return (
		<div class="container-section-list-switch" onClick={toggle}>
			<button classList={{ active: props.value }} type="button">
				<div class="track" />
				<div class="thumb" />
			</button>
		</div>
	);
};

type SectionListSelectItem = {
	value: string;
	label: string;
	disabled?: boolean;
	hidden?: boolean;
};

type SectionListSelectProps = {
	value?: string;
	setValue: (value: string) => void;
	items: SectionListSelectItem[];
};

export const SectionListSelect: Component<SectionListSelectProps> = (props) => {
	createEffect(
		on(
			() => props.value,
			() => {
				invokeHapticFeedbackSelectionChanged();
			},
		),
	);

	return (
		<div class="container-section-list-select">
			<select
				value={props.value}
				onChange={(e) => props.setValue(e.target.value)}
			>
				<For each={props.items}>
					{(item) => (
						<option
							value={item.value}
							disabled={!!item.disabled}
							hidden={!!item.hidden}
						>
							{item.label}
						</option>
					)}
				</For>
			</select>

			<HiSolidChevronUpDown />
		</div>
	);
};

type SectionListPickerProps = {
	value?: string;
	setValue: (value: string) => void;
	items: WheelPickerItem[];
	visibleItemsCount?: number;
	containerClass?: string;
	hideActiveItemMask?: boolean;
	itemHeight?: number;
	label?: string;
};

export const SectionListPicker: Component<SectionListPickerProps> = (props) => {
	const [modal, setModal] = createSignal(false);

	return (
		<div class="container-section-list-picker">
			<span onClick={() => setModal(true)}>
				<span>{props.items.find((i) => i.value === props.value)?.label}</span>

				<FaSolidChevronRight />
			</span>

			<Show when={modal()}>
				<Modal
					onClose={() => setModal(false)}
					portalParent={document.querySelector("#portals")!}
					class="modal-section-list-picker"
				>
					<Show when={props.label}>
						<p>{props.label}</p>
					</Show>

					<WheelPicker
						items={props.items}
						setValue={props.setValue}
						value={props.value ?? ""}
						visibleItemsCount={props.visibleItemsCount}
						containerClass={props.containerClass}
						hideActiveItemMask={props.hideActiveItemMask}
						itemHeight={props.itemHeight}
					/>
				</Modal>
			</Show>
		</div>
	);
};
