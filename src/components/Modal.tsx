import "solid-bottomsheet/styles.css";
import "./Modal.scss";

// @ts-ignore
import { SolidBottomsheet } from "solid-bottomsheet";
import { onCleanup, onMount, type ParentComponent } from "solid-js";

const Modal: ParentComponent<{
	class?: string;
	onClose: () => void;
}> = (props) => {
	const escapeKeyHandler = (event: KeyboardEvent) => {
		if (event.key === "Escape") {
			props.onClose();
		}
	};

	onMount(() => {
		document.addEventListener("keyup", escapeKeyHandler);
	});

	onCleanup(() => {
		document.removeEventListener("keyup", escapeKeyHandler);
	});

	return (
		<SolidBottomsheet variant="default" onClose={props.onClose}>
			<div class={props.class}>{props.children}</div>
		</SolidBottomsheet>
	);
};

export default Modal;
