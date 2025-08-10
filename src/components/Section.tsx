import {
	type Component,
	createEffect,
	createMemo,
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
import { hideKeyboardOnEnter } from "../utils/input";
import { invokeHapticFeedbackSelectionChanged } from "../utils/telegram";
import Modal from "./Modal";
import type { WheelPickerItem } from "./WheelPicker";
import WheelPicker from "./WheelPicker";

type SectionProps = {
	title?: string;
	description?: string | Component;
	class?: string;
};

export const Section: ParentComponent<SectionProps> = (props) => {
	return (
		<section
			class={["container-section", props.class].filter(Boolean).join(" ")}
		>
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
	label: string | Component;
	placeholder?: Component;
	clickable?: boolean;
	onClick?: (e: MouseEvent) => void;
	onClickLabel?: (e: MouseEvent) => void;
	class?: string;
};

type SectionListProps = SectionProps & {
	items: SectionListItem[];
};

export const SectionList: Component<SectionListProps> = (props) => {
	return (
		<Section title={props.title} description={props.description}>
			<div
				class={["container-section-list", props.class]
					.filter(Boolean)
					.join(" ")}
			>
				<For each={props.items}>
					{(item) => (
						<div
							onClick={item.onClick}
							class={item.class}
							classList={{ clickable: item.clickable }}
						>
							<Show when={item.prepend}>
								<div class="prepend">
									<Dynamic component={item.prepend} />
								</div>
							</Show>

							<span onClick={item.onClickLabel}>
								{typeof item.label === "string" ? (
									item.label
								) : (
									<Dynamic component={item.label} />
								)}
							</span>

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
	class?: string;
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
		<div
			class={["container-section-list-switch", props.class]
				.filter(Boolean)
				.join(" ")}
			onClick={toggle}
		>
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
	class?: string;
};

type SectionListSelectProps = {
	value?: string;
	setValue: (value: string) => void;
	items: SectionListSelectItem[];
	class?: string;
};

export const SectionListSelect: Component<SectionListSelectProps> = (props) => {
	let select: HTMLSelectElement | undefined;

	const items = createMemo(() => {
		return props.items.filter((item) => {
			if (item.hidden) {
				if (item.value !== props.value) {
					return false;
				}
			}

			return true;
		});
	});

	createEffect(
		on(items, () => {
			if (!select) return;
			select.value = props.value!;
		}),
	);

	createEffect(
		on(
			() => props.value,
			() => {
				invokeHapticFeedbackSelectionChanged();
			},
		),
	);

	return (
		<div
			class={["container-section-list-select", props.class]
				.filter(Boolean)
				.join(" ")}
		>
			<select
				ref={select}
				value={props.value}
				onChange={(e) => props.setValue(e.target.value)}
			>
				<For each={items()}>
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
	class?: string;
};

export const SectionListPicker: Component<SectionListPickerProps> = (props) => {
	const [modal, setModal] = createSignal(false);

	return (
		<div
			class={["container-section-list-picker", props.class]
				.filter(Boolean)
				.join(" ")}
		>
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

type SectionListInputProps = {
	type: "text" | "number" | "email" | "password" | "search" | "url" | "tel";
	placeholder?: string;
	inputmode?:
		| "none"
		| "text"
		| "decimal"
		| "numeric"
		| "tel"
		| "search"
		| "email"
		| "url";
	value?: string;
	setValue: (value: string) => void;
	onBlur?: () => void;
	pattern?: "string";
	minLength?: number;
	maxLength?: number;
	max?: number;
	min?: number;
	prepend?: Component;
	append?: Component;
	class?: string;
};

export const SectionListInput: Component<SectionListInputProps> = (props) => {
	let input: HTMLInputElement | undefined;

	createEffect(
		on(
			() => props.value,
			() => {
				if (!input) return;
				input.value = props.value ?? "";
			},
		),
	);

	const preventNewValue = () => {
		if (!input) return;
		input.value = props.value ?? "";
	};

	return (
		<div
			class={["container-section-list-input", props.class]
				.filter(Boolean)
				.join(" ")}
		>
			<Show when={props.prepend}>
				<Dynamic component={props.prepend} />
			</Show>

			<input
				ref={input}
				type={props.type}
				value={props.value}
				inputMode={props.inputmode ?? "text"}
				pattern={props.pattern}
				onInput={(e) => {
					const { value } = e.target;

					if (props.minLength && value.length < props.minLength) {
						preventNewValue();
						return;
					}

					if (props.maxLength && value.length > props.maxLength) {
						preventNewValue();
						return;
					}

					if (
						props.type === "number" &&
						props.min &&
						Number.parseFloat(value) < props.min
					) {
						preventNewValue();
						return;
					}

					if (
						props.type === "number" &&
						props.max &&
						Number.parseFloat(value) > props.max
					) {
						preventNewValue();
						return;
					}

					props.setValue(value);
				}}
				onChange={(e) => {
					props.setValue(e.target.value.trim());
				}}
				onKeyUp={hideKeyboardOnEnter}
				placeholder={props.placeholder}
				onBlur={props.onBlur}
				min={props.min}
				max={props.max}
				minLength={props.minLength}
				maxLength={props.maxLength}
			/>

			<Show when={props.append}>
				<Dynamic component={props.append} />
			</Show>
		</div>
	);
};
