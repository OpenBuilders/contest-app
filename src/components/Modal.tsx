import { Portal } from "solid-js/web";
import "./Modal.scss";

import { IoClose } from "solid-icons/io";
import {
	createSignal,
	createUniqueId,
	type JSX,
	onCleanup,
	onMount,
	type ParentComponent,
	Show,
} from "solid-js";
import { invokeHapticFeedbackImpact } from "../utils/telegram";

const DEFAULT_THRESHOLD = 64;

type ModalProps = {
	class?: string;
	containerClass?: string;
	onClose: () => void;
	portalParent?: Element;
	withCloseButton?: boolean;
};

const Modal: ParentComponent<ModalProps> = (props) => {
	const id = createUniqueId();

	const escapeKeyHandler = (event: KeyboardEvent) => {
		if (event.key === "Escape") {
			props.onClose();
		}
	};

	onMount(() => {
		document.addEventListener("keyup", escapeKeyHandler, {
			passive: true,
		});
		document.body.classList.add(`modal-${id}-overflow-hidden`);
	});

	onCleanup(() => {
		document.removeEventListener("keyup", escapeKeyHandler);
		document.body.classList.remove(`modal-${id}-overflow-hidden`);
	});

	const [isClosing, setIsClosing] = createSignal(false);
	const [bottomsheetTranslateValue, setBottomsheetTranslateValue] =
		createSignal(0);

	let touchStartPosition = 0;
	let lastTouchPosition = 0;

	let isDragging = false;

	const onTouchStart: JSX.EventHandlerUnion<HTMLDivElement, TouchEvent> = (
		event,
	) => {
		touchStartPosition = lastTouchPosition = event.touches[0].clientY;
	};

	const onTouchMove: JSX.EventHandlerUnion<HTMLDivElement, TouchEvent> = (
		event,
	) => {
		let dragDistance = 0;

		lastTouchPosition = event.touches[0].clientY;
		dragDistance = lastTouchPosition - touchStartPosition;

		if (dragDistance > 0) {
			setBottomsheetTranslateValue(dragDistance);
		}
	};

	const onTouchEnd: JSX.EventHandlerUnion<HTMLDivElement, TouchEvent> = () => {
		if (lastTouchPosition - touchStartPosition > DEFAULT_THRESHOLD) {
			setIsClosing(true);
		} else {
			setBottomsheetTranslateValue(0);
		}
	};

	const onMouseDown: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = (
		event,
	) => {
		isDragging = true;
		touchStartPosition = lastTouchPosition = event.clientY;

		// Prevent text selection while dragging
		document.body.style.userSelect = "none";
	};

	const onMouseMove: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = (
		event,
	) => {
		if (!isDragging) return;

		let dragDistance = 0;
		lastTouchPosition = event.clientY;
		dragDistance = lastTouchPosition - touchStartPosition;

		if (dragDistance > 0) {
			setBottomsheetTranslateValue(dragDistance);
		}
	};

	const onMouseUp: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = () => {
		if (!isDragging) return;

		isDragging = false;
		document.body.style.userSelect = ""; // Re-enable selection

		if (lastTouchPosition - touchStartPosition > DEFAULT_THRESHOLD) {
			setIsClosing(true);
		} else {
			setBottomsheetTranslateValue(0);
		}
	};

	const onOverlayClick: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = (
		event,
	) => {
		if (event.target.className === "modal-overlay" && event.target.id === id) {
			setIsClosing(true);
		}
	};

	return (
		<Portal mount={props.portalParent ?? document.body}>
			<div class={props.containerClass}>
				<div class="modal-overlay" id={id} onClick={onOverlayClick}>
					<div
						classList={{
							"modal-content": true,
							"modal-is-closing": isClosing(),
						}}
						style={{
							transform: `translateY(${bottomsheetTranslateValue()}px)`,
						}}
						{...(isClosing() ? { onAnimationEnd: props.onClose } : {})}
					>
						<div
							class="modal-handle-container"
							on:touchstart={{
								handleEvent: onTouchStart,
								passive: true,
							}}
							on:touchmove={{
								handleEvent: onTouchMove,
								passive: true,
							}}
							on:touchend={{
								handleEvent: onTouchEnd,
								passive: true,
							}}
							on:mousedown={{
								handleEvent: onMouseDown,
								passive: true,
							}}
							on:mousemove={{
								handleEvent: onMouseMove,
								passive: true,
							}}
							on:mouseup={{
								handleEvent: onMouseUp,
								passive: true,
							}}
						>
							<div class="modal-handle" />
						</div>
						<Show when={props.withCloseButton}>
							<button
								type="button"
								class="modal-close clickable"
								onClick={() => {
									invokeHapticFeedbackImpact("heavy");
									setIsClosing(true);
								}}
							>
								<IoClose />
							</button>
						</Show>
						<div class={props.class}>{props.children}</div>
					</div>
				</div>
			</div>
		</Portal>
	);
};

export default Modal;
