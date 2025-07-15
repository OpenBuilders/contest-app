import pell from "pell";
import "./Editor.scss";
import DOMPurify from "dompurify";
import snarkdown from "snarkdown";
import { type Component, createMemo, onCleanup, onMount, Show } from "solid-js";
import { useTranslation } from "../contexts/TranslationContext";
import { isValidURL } from "../utils/input";

type EditorProps = {
	value: string;
	setValue: (value: string) => void;
	placeholder?: string;
	maxLength?: number;
};

const ALLOWED_TAGS = ["b", "i", "u", "a", "strike", "br"];

const Editor: Component<EditorProps> = (props) => {
	const { t } = useTranslation();

	let editor: HTMLDivElement | undefined;

	const sanitizeText = (text: string) => {
		return DOMPurify.sanitize(text, {
			ALLOWED_TAGS: ALLOWED_TAGS,
			ALLOWED_ATTR: ["href"],
			ALLOW_ARIA_ATTR: false,
			ALLOW_DATA_ATTR: false,
			KEEP_CONTENT: true,
		})
			.replace(/(?:<div>(?:\s|&nbsp;|\u00A0|<br\s*\/?>)*<\/div>)+/gi, "\n")
			.replace(
				/^(?:\s|&nbsp;|\u00A0|<br\s*\/?>|\n|\r)+|(?:\s|&nbsp;|\u00A0|<br\s*\/?>|\n|\r)+$/gi,
				"",
			)
			.replace(/<strong>/g, "<b>")
			.replace(/<\/strong>/g, "</b>")
			.replace(/<em>/g, "<i>")
			.replace(/<\/em>/g, "</i>")
			.replace(/<s>/g, "<strike>")
			.replace(/<\/s>/g, "</strike>")
			.trim();
	};

	const onPaste = (e: ClipboardEvent) => {
		e.preventDefault();

		const clipboardData = e.clipboardData;
		if (!clipboardData) return;

		let rawHtml =
			clipboardData.getData("text/html") || clipboardData.getData("text/plain");

		const {
			body: { textContent },
		} = new DOMParser().parseFromString(rawHtml, "text/html");

		if (rawHtml === textContent) {
			rawHtml = snarkdown(rawHtml);
		}

		const cleanHtml = sanitizeText(rawHtml);

		pell.exec("insertHTML", cleanHtml);
	};

	const onBlur = () => {
		(document.activeElement as HTMLElement)?.blur();
	};

	const handleSelection = () => {
		const selection = window.getSelection();
		const actionbar = document.querySelector(".pell-actionbar") as HTMLElement;

		if (
			selection &&
			!selection.isCollapsed &&
			editor!.contains(selection.anchorNode)
		) {
			const selection = window.getSelection();

			if (selection && selection.rangeCount > 0) {
				const range = selection.getRangeAt(0);
				const editorRect = editor!.getBoundingClientRect();
				const rect = range.getBoundingClientRect();

				actionbar.style.display = "flex";
				actionbar.style.left = `${Math.min(rect.left - editorRect.left, editorRect.right - actionbar.offsetWidth - 28)}px`;
				actionbar.style.top = `${rect.top - editorRect.top - 28}px`;
			}
		} else {
			actionbar.style.display = "none";
			actionbar.style.left = `0px`;
			actionbar.style.top = `0px`;
		}
	};

	const handleSelectionDelayed = () => {
		setTimeout(handleSelection, 50);
	};

	onMount(() => {
		if (!editor) return;

		const pellInstance = pell.init({
			element: editor,
			actions: [
				{
					name: "bold",
					icon: "<svg><use xlink:href='#svg-icon-bold'></use></svg>",
					result: () => pell.exec("bold"),
				},
				{
					name: "italic",
					icon: "<svg><use xlink:href='#svg-icon-italic'></use></svg>",
					result: () => pell.exec("italic"),
				},
				{
					name: "strikethrough",
					icon: "<svg><use xlink:href='#svg-icon-strikethrough'></use></svg>",
					result: () => pell.exec("strikethrough"),
				},
				{
					name: "underline",
					icon: "<svg><use xlink:href='#svg-icon-underline'></use></svg>",
					result: () => pell.exec("underline"),
				},
				{
					name: "link",
					icon: "<svg><use xlink:href='#svg-icon-link'></use></svg>",
					result: () => {
						const url = window.prompt(t("components.editor.url"));

						if (url && isValidURL(url)) {
							pell.exec("createLink", url);
						}
					},
				},
			],
			styleWithCSS: false,
			defaultParagraphSeparator: "br/",
			onChange: (html) => {
				props.setValue(sanitizeText(html));
			},
		});

		const pellEditor = pellInstance.querySelector(
			".pell-content",
		)! as HTMLDivElement;

		pellEditor.setAttribute("dir", "auto");

		pellEditor.addEventListener("paste", onPaste);
		pellEditor.addEventListener("blur", onBlur, {
			passive: true,
		});

		document.addEventListener("mouseup", handleSelectionDelayed, {
			passive: true,
		});
		document.addEventListener("touchend", handleSelectionDelayed, {
			passive: true,
		});

		onCleanup(() => {
			pellEditor.removeEventListener("paste", onPaste);
			pellEditor.removeEventListener("blur", onBlur);

			document.removeEventListener("mouseup", handleSelectionDelayed);
			document.removeEventListener("touchend", handleSelectionDelayed);
		});
	});

	const Placeholder = () => {
		return (
			<Show when={props.placeholder}>
				<span
					id="editor-placeholder"
					style={{ display: props.value.length > 0 ? "none" : "flex" }}
				>
					{props.placeholder}
				</span>
			</Show>
		);
	};

	const MaxLength = () => {
		const remainingChars = createMemo(() => {
			const {
				body: { textContent },
			} = new DOMParser().parseFromString(props.value, "text/html");

			return (props.maxLength ?? 0) - (textContent?.length ?? 0);
		});

		return (
			<Show when={props.maxLength}>
				<span
					id="editor-maxlength"
					style={{
						display: remainingChars() <= 512 ? "flex" : "none",
					}}
				>
					{remainingChars()}
				</span>
			</Show>
		);
	};

	return (
		<div id="container-editor">
			<svg style={{ display: "none" }}>
				<symbol id="svg-icon-bold" fill="currentColor" viewBox="0 0 384 512">
					<path d="M0 64c0-17.7 14.3-32 32-32h192c70.7 0 128 57.3 128 128 0 31.3-11.3 60.1-30 82.3 37.1 22.4 62 63.1 62 109.7 0 70.7-57.3 128-128 128H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h16V96H32C14.3 96 0 81.7 0 64zm224 160c35.3 0 64-28.7 64-64s-28.7-64-64-64H112v128h112zm-112 64v128h144c35.3 0 64-28.7 64-64s-28.7-64-64-64H112z"></path>
				</symbol>

				<symbol id="svg-icon-italic" fill="currentColor" viewBox="0 0 384 512">
					<path d="M128 64c0-17.7 14.3-32 32-32h192c17.7 0 32 14.3 32 32s-14.3 32-32 32h-58.7L160 416h64c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h58.7L224 96h-64c-17.7 0-32-14.3-32-32z"></path>
				</symbol>

				<symbol
					id="svg-icon-strikethrough"
					fill="currentColor"
					viewBox="0 0 512 512"
				>
					<path d="M161.3 144c3.2-17.2 14-30.1 33.7-38.6 21.1-9 51.8-12.3 88.6-6.5 11.9 1.9 48.8 9.1 60.1 12 17.1 4.5 34.6-5.6 39.2-22.7s-5.6-34.6-22.7-39.2c-14.3-3.8-53.6-11.4-66.6-13.4-44.7-7-88.3-4.2-123.7 10.9-36.5 15.6-64.4 44.8-71.8 87.3-.1.6-.2 1.1-.2 1.7-2.8 23.9.5 45.6 10.1 64.6 4.5 9 10.2 16.9 16.7 23.9H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h448c17.7 0 32-14.3 32-32s-14.3-32-32-32H270.1c-.1 0-.3-.1-.4-.1l-1.1-.3c-36-10.8-65.2-19.6-85.2-33.1-9.3-6.3-15-12.6-18.2-19.1-3.1-6.1-5.2-14.6-3.8-27.4zm187.6 193.2c2.7 6.5 4.4 15.8 1.9 30.1-3 17.6-13.8 30.8-33.9 39.4-21.1 9-51.7 12.3-88.5 6.5-18-2.9-49.1-13.5-74.4-22.1-5.6-1.9-11-3.7-15.9-5.4-16.8-5.6-34.9 3.5-40.5 20.3s3.5 34.9 20.3 40.5c3.6 1.2 7.9 2.7 12.7 4.3 24.9 8.5 63.6 21.7 87.6 25.6h.2c44.7 7 88.3 4.2 123.7-10.9 36.5-15.6 64.4-44.8 71.8-87.3 3.6-21 2.7-40.4-3.1-58.1h-75.7c7 5.6 11.4 11.2 13.9 17.2z"></path>
				</symbol>

				<symbol
					id="svg-icon-underline"
					fill="currentColor"
					viewBox="0 0 448 512"
				>
					<path d="M16 64c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32h-16v128c0 53 43 96 96 96s96-43 96-96V96h-16c-17.7 0-32-14.3-32-32s14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32h-16v128c0 88.4-71.6 160-160 160S64 312.4 64 224V96H48c-17.7 0-32-14.3-32-32zM0 448c0-17.7 14.3-32 32-32h384c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32z"></path>
				</symbol>

				<symbol id="svg-icon-link" fill="currentColor" viewBox="0 0 640 512">
					<path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6 31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0l112.3-112.3zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5 50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5l112.2-112.3c31.5-31.5 82.5-31.5 114 0 27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"></path>
				</symbol>
			</svg>

			<div ref={editor} id="editor" class="content" />
			<Placeholder />
			<MaxLength />
		</div>
	);
};

export default Editor;
