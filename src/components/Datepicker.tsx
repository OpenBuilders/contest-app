import dayjs from "dayjs";
import "./Datepicker.scss";

import utc from "dayjs/plugin/utc";
import {
	type Component,
	createEffect,
	createMemo,
	createSignal,
	Show,
} from "solid-js";
import { createStore } from "solid-js/store";
import { useTranslation } from "../contexts/TranslationContext";
import { invokeHapticFeedbackImpact } from "../utils/telegram";
import Modal from "./Modal";
import WheelPicker from "./WheelPicker";

dayjs.extend(utc);

type DatepickerProps = {
	label?: string;
	pickerTitle?: string;
	pickerLabel?: string;
	value: number;
	setValue: (value: number) => void;
	minDate?: string;
	maxDate?: string;
	withTime?: boolean;
	hideYear?: boolean;
	showUTC?: boolean;
};

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const Datepicker: Component<DatepickerProps> = (props) => {
	const { t } = useTranslation();
	const [modal, setModal] = createSignal(false);

	const now = dayjs.utc();

	const dateRange = {
		min: dayjs.utc(props.minDate ?? "1970-01-01"),
		max: dayjs.utc(props.maxDate ?? `${now.year() + 10}-12-31`),
	};

	const base = dayjs.utc(props.value || dateRange.min.valueOf());

	const [dp, setDp] = createStore({
		year: (props.hideYear ? now.year() : base.year()).toString(),
		month: base.month().toString(),
		day: base.date().toString(),
		hour: base.hour().toString(),
		minute: base.minute().toString(),
	});

	const selected = createMemo(() =>
		dayjs.utc(
			`${dp.year}-${Number(dp.month) + 1}-${dp.day} ${dp.hour}:${dp.minute}`,
		),
	);

	/* ---------------- WHEEL DOMAINS ---------------- */

	const allowedYears = createMemo(() => {
		if (props.hideYear) return [now.year()];
		return Array.from(
			{ length: dateRange.max.year() - dateRange.min.year() + 1 },
			(_, i) => dateRange.min.year() + i,
		);
	});

	const allowedMonths = createMemo(() => {
		const y = Number(dp.year);
		let start = 0,
			end = 11;

		if (y === dateRange.min.year()) start = dateRange.min.month();
		if (y === dateRange.max.year()) end = dateRange.max.month();

		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	});

	const allowedDays = createMemo(() => {
		const y = Number(dp.year);
		const m = Number(dp.month);
		const max = dayjs.utc(`${y}-${m + 1}-1`).daysInMonth();

		let start = 1,
			end = max;

		if (y === dateRange.min.year() && m === dateRange.min.month())
			start = dateRange.min.date();

		if (y === dateRange.max.year() && m === dateRange.max.month())
			end = dateRange.max.date();

		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	});

	/* ---------------- SAFE SET ---------------- */

	const safeSet = (next: Partial<typeof dp>) => {
		const y = Number(next.year ?? dp.year);
		const m = Number(next.month ?? dp.month);
		let d = Number(next.day ?? dp.day);
		const h = Number(next.hour ?? dp.hour);
		const min = Number(next.minute ?? dp.minute);

		const maxDay = dayjs.utc(`${y}-${m + 1}-1`).daysInMonth();
		if (d > maxDay) d = maxDay;

		const cand = dayjs.utc(`${y}-${m + 1}-${d} ${h}:${min}`);

		if (cand.isBefore(dateRange.min)) return syncFrom(dateRange.min);
		if (cand.isAfter(dateRange.max)) return syncFrom(dateRange.max);

		setDp({
			year: y.toString(),
			month: m.toString(),
			day: d.toString(),
			hour: h.toString(),
			minute: min.toString(),
		});
	};

	const syncFrom = (d: dayjs.Dayjs) =>
		setDp({
			year: d.year().toString(),
			month: d.month().toString(),
			day: d.date().toString(),
			hour: d.hour().toString(),
			minute: d.minute().toString(),
		});

	createEffect(() => props.setValue(selected().valueOf()));

	/* ---------------- PICKERS ---------------- */

	const pickerYears = createMemo(() =>
		allowedYears().map((y) => ({ value: y.toString(), label: y.toString() })),
	);

	const pickerMonths = createMemo(() =>
		allowedMonths().map((m) => ({ value: m.toString(), label: months[m] })),
	);

	const pickerDays = createMemo(() =>
		allowedDays().map((d) => ({ value: d.toString(), label: d.toString() })),
	);

	const pickerHours = createMemo(() =>
		Array.from({ length: 24 }, (_, i) => ({
			value: i.toString(),
			label: i.toString().padStart(2, "0"),
		})),
	);

	const pickerMinutes = createMemo(() =>
		Array.from({ length: 60 }, (_, i) => ({
			value: i.toString(),
			label: i.toString().padStart(2, "0"),
		})),
	);

	const onClick = () => {
		invokeHapticFeedbackImpact("soft");
		setModal(true);
	};

	return (
		<>
			<div class="container-datepicker" onClick={onClick}>
				<Show when={props.label}>
					<span>{props.label}</span>
				</Show>
				<div>
					{props.value
						? [
								dayjs
									.utc(props.value)
									.format(props.withTime ? "D MMM YYYY HH:mm" : "D MMM YYYY"),
								props.showUTC && "UTC",
							]
								.filter(Boolean)
								.join(" ")
						: t("components.datepicker.notSet")}
				</div>
			</div>

			<Show when={modal()}>
				<Modal
					withCloseButton
					containerClass="container-modal-datepicker"
					class={[
						"modal-datepicker",
						props.hideYear && "hide-year",
						props.withTime && "with-time",
					]
						.filter(Boolean)
						.join(" ")}
					onClose={() => setModal(false)}
					portalParent={document.querySelector("#modals")!}
				>
					<Show when={props.pickerLabel}>
						<span class="text-hint">{props.pickerLabel}</span>
					</Show>

					<div class="datepicker-wheels">
						<WheelPicker
							items={pickerDays()}
							value={dp.day}
							setValue={(v) => safeSet({ day: v as string })}
						/>
						<WheelPicker
							items={pickerMonths()}
							value={dp.month}
							setValue={(v) => safeSet({ month: v as string })}
						/>

						<Show when={!props.hideYear}>
							<WheelPicker
								items={pickerYears()}
								value={dp.year}
								setValue={(v) => safeSet({ year: v as string })}
							/>
						</Show>

						<Show when={props.withTime}>
							<WheelPicker
								items={pickerHours()}
								value={dp.hour}
								setValue={(v) => safeSet({ hour: v as string })}
							/>
							<WheelPicker
								items={pickerMinutes()}
								value={dp.minute}
								setValue={(v) => safeSet({ minute: v as string })}
							/>
						</Show>
					</div>
				</Modal>
			</Show>
		</>
	);
};

export default Datepicker;
