import { Portal } from "solid-js/web";
import "./Popup.scss";
import {
	type Accessor,
	batch,
	createSignal,
	onMount,
	type ParentComponent,
	type Setter,
	Show,
} from "solid-js";
import { createStore } from "solid-js/store";

export type PopupProps = {
	signal: [Accessor<boolean>, Setter<boolean>];
	closeOnClickOutside?: boolean;
	anchorSelector: string;
	anchorPosition: "tl" | "tr" | "bl" | "br";
	class?: string;
	containerClass?: string;
	portalParent?: Element;
	animated?: boolean;
	animationDurationMs?: number;
};

const transformOrigin: { [key in PopupProps["anchorPosition"]]: string } = {
	bl: "bottom left",
	br: "bottom right",
	tl: "top left",
	tr: "top right",
};

export const DEFAULT_ANIMATION_DURATION = 250;

const Popup: ParentComponent<PopupProps> = (props) => {
	const [open, setOpen] = props.signal;

	const [rect, setRect] = createSignal<DOMRect | undefined>();

	let anchor: HTMLElement | undefined;

	const [position, setPosition] = createStore({
		top: "auto",
		bottom: "auto",
		right: "auto",
		left: "auto",
	});

	const onClickBackdrop = () => {
		setOpen(false);
	};

	onMount(() => {
		anchor = document.querySelector(props.anchorSelector) as HTMLElement;

		batch(() => {
			if (!anchor) return;
			setRect(anchor.getBoundingClientRect());

			switch (props.anchorPosition) {
				case "tr":
					setPosition({
						top: `${rect()?.bottom}px`,
						right: `${document.body.clientWidth - rect()!.right}px`,
						bottom: "auto",
						left: "auto",
					});
					break;

				case "tl":
					setPosition({
						top: `${rect()?.bottom}px`,
						left: `${rect()!.left + rect()!.width}px`,
						bottom: "auto",
						right: "auto",
					});
					break;

				case "br":
					setPosition({
						bottom: `${document.body.clientHeight - rect()!.top}px`,
						right: `${document.body.clientWidth - rect()!.right}px`,
						top: "auto",
						left: "auto",
					});
					break;

				case "bl":
					setPosition({
						bottom: `${document.body.clientHeight - rect()!.top}px`,
						left: `${rect()!.left + rect()!.width}px`,
						top: "auto",
						right: "auto",
					});
					break;
			}
		});
	});

	return (
		<Show when={open()}>
			<Portal mount={props.portalParent ?? document.body}>
				<div
					class={["popup-container", props.containerClass]
						.filter(Boolean)
						.join(" ")}
					classList={{
						animated: props.animated,
						close: !open(),
					}}
				>
					<Show when={props.closeOnClickOutside}>
						<div class="popup-backdrop" onClick={onClickBackdrop}></div>
					</Show>
					<Show when={rect()}>
						<div
							class={["popup", props.class].filter(Boolean).join(" ")}
							style={{
								"--top": position.top,
								"--bottom": position.bottom,
								"--right": position.right,
								"--left": position.left,
								"--transform-origin": transformOrigin[props.anchorPosition],
								"--animation-duration": `${(props.animationDurationMs ?? DEFAULT_ANIMATION_DURATION) / 1000}s`,
							}}
						>
							{props.children}
						</div>
					</Show>
				</div>
			</Portal>
		</Show>
	);
};

export default Popup;
