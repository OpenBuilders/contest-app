import dayjs from "dayjs";
import "./Datepicker.scss";
import {
	type Component,
	createEffect,
	createMemo,
	createSignal,
	on,
	Show,
} from "solid-js";
import { createStore } from "solid-js/store";
import { useTranslation } from "../contexts/TranslationContext";
import { invokeHapticFeedbackImpact } from "../utils/telegram";
import Modal from "./Modal";
import WheelPicker from "./WheelPicker";

type DatepickerProps = {
	label?: string;
	pickerLabel?: string;
	value: number;
	setValue: (value: number) => void;
	minDate?: string;
	maxDate?: string;
};

const { months } = {
	months: {
		0: "January",
		1: "February",
		2: "March",
		3: "April",
		4: "May",
		5: "June",
		6: "July",
		7: "August",
		8: "September",
		9: "October",
		10: "November",
		11: "December",
	},
};

const Datepicker: Component<DatepickerProps> = (props) => {
	const { t } = useTranslation();

	const [modal, setModal] = createSignal(false);

	const date = dayjs(props.value);

	const [datepicker, setDatepicker] = createStore({
		year: date.year().toString(),
		month: date.month().toString(),
		day: date.date().toString(),
	});

	const dateFormatted = createMemo(() => {
		return dayjs(props.value).format("D MMM YYYY");
	});

	const dateRange = {
		min: dayjs(props.minDate ?? "1970-01-01"),
		max: dayjs(props.maxDate ?? `${dayjs().year() + 10}-12-31`),
	};

	const pickerYears = createMemo(() => {
		return Array.from(
			new Array(dateRange.max.year() - dateRange.min.year() + 1),
		).map((_, index) => ({
			value: (dateRange.min.year() + index).toString(),
			label: (dateRange.min.year() + index).toString(),
		}));
	});

	const pickerMonths = createMemo(() => {
		return Object.entries(months)
			.filter(([index]) => {
				if (Number.parseInt(datepicker.year) === dateRange.min.year()) {
					return Number.parseInt(index) >= dateRange.min.month();
				} else if (Number.parseInt(datepicker.year) === dateRange.max.year()) {
					return Number.parseInt(index) <= dateRange.max.month();
				}

				return true;
			})
			.map(([value, label]) => ({
				value,
				label,
			}));
	});

	const pickerDays = createMemo(() => {
		return Array.from(
			new Array(
				dayjs(
					`${datepicker.year}-${Number.parseInt(datepicker.month) + 1}-1`,
				).daysInMonth(),
			),
		)

			.map((_, index) => ({
				value: (index + 1).toString(),
				label: (index + 1).toString(),
			}))
			.filter(({ value }) => {
				const day = Number.parseInt(value);

				if (
					Number.parseInt(datepicker.year) === dateRange.min.year() &&
					Number.parseInt(datepicker.month) === dateRange.min.month()
				) {
					return day >= dateRange.min.date();
				} else if (
					Number.parseInt(datepicker.year) === dateRange.max.year() &&
					Number.parseInt(datepicker.month) === dateRange.max.month()
				) {
					return day <= dateRange.max.date();
				}

				return true;
			});
	});

	const updateValue = () => {
		props.setValue(
			dayjs(
				`${datepicker.year}-${Number.parseInt(datepicker.month) + 1}-${datepicker.day}`,
			).unix() * 1000,
		);
	};

	createEffect(
		on(() => datepicker.day, updateValue, {
			defer: true,
		}),
	);

	createEffect(
		on(() => datepicker.month, updateValue, {
			defer: true,
		}),
	);

	createEffect(
		on(() => datepicker.year, updateValue, {
			defer: true,
		}),
	);

	const onClick = () => {
		setModal(true);
		invokeHapticFeedbackImpact("soft");
	};

	return (
		<>
			<div class="container-datepicker" onClick={onClick}>
				<Show when={props.label}>
					<span>{props.label}</span>
				</Show>

				<div class="text-secondary">
					{props.value ? dateFormatted() : t("components.datepicker.notSet")}
				</div>
			</div>

			<Show when={modal()}>
				<Modal
					containerClass="container-modal-datepicker"
					class="modal-datepicker"
					onClose={() => setModal(false)}
					portalParent={document.querySelector("#modals")!}
				>
					<Show when={props.pickerLabel}>
						<span class="text-hint">{props.pickerLabel}</span>
					</Show>

					<div>
						<WheelPicker
							containerClass="datepicker-day"
							itemHeight={44}
							hideActiveItemMask
							items={pickerDays()}
							value={datepicker.day}
							setValue={(value) => {
								setDatepicker("day", value as string);
							}}
						/>

						<WheelPicker
							containerClass="datepicker-month"
							itemHeight={44}
							hideActiveItemMask
							items={pickerMonths()}
							value={datepicker.month}
							setValue={(value) => {
								setDatepicker("month", value as string);
							}}
						/>

						<WheelPicker
							containerClass="datepicker-year"
							itemHeight={44}
							hideActiveItemMask
							items={pickerYears()}
							value={datepicker.year}
							setValue={(value) => {
								setDatepicker("year", value as string);
							}}
						/>
					</div>
				</Modal>
			</Show>
		</>
	);
};

export default Datepicker;
