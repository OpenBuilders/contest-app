import pell from "pell";
import "./Editor.scss";
import type { DOMPurify } from "dompurify";
import snarkdown from "snarkdown";
import {
	AiOutlineBold,
	AiOutlineItalic,
	AiOutlineLink,
	AiOutlineStrikethrough,
	AiOutlineUnderline,
} from "solid-icons/ai";
import { type Component, createMemo, onCleanup, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";
import tippy, { type Instance } from "tippy.js";
import { useTranslation } from "../contexts/TranslationContext";
import { isValidURL } from "../utils/input";
import { initializeDOMPurify } from "../utils/lazy";
import { store } from "../utils/store";

type EditorProps = {
	value: string;
	setValue: (value: string) => void;
	placeholder?: string;
	maxLength?: number;
};

const Editor: Component<EditorProps> = (props) => {
	const { t } = useTranslation();

	let editor: HTMLDivElement | undefined;
	let realActionbar: HTMLElement | undefined;
	let actionbar: Instance | undefined;
	let savedRange: Range | undefined;

	let domPurify: DOMPurify | undefined;

	const [dependencies, setDependencies] = createStore({
		dompurify: false,
	});

	const [actionbarToggles, setActionbarToggles] = createStore({
		bold: false,
		italic: false,
		strikethrough: false,
		underline: false,
	});

	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			const target = mutation.target as HTMLElement;
			if (target.classList.contains("pell-button")) {
				switch (target.title) {
					case "Bold": {
						const value = target.classList.contains("pell-button-selected");
						if (value !== actionbarToggles.bold) {
							setActionbarToggles("bold", value);
						}
						break;
					}

					case "Italic": {
						const value = target.classList.contains("pell-button-selected");
						if (value !== actionbarToggles.italic) {
							setActionbarToggles("italic", value);
						}
						break;
					}

					case "Strike-through": {
						const value = target.classList.contains("pell-button-selected");
						if (value !== actionbarToggles.strikethrough) {
							setActionbarToggles("strikethrough", value);
						}
						break;
					}

					case "Underline": {
						const value = target.classList.contains("pell-button-selected");
						if (value !== actionbarToggles.underline) {
							setActionbarToggles("underline", value);
						}
						break;
					}
				}
			}
		}
	});

	const sanitizeText = (text: string) => {
		if (!domPurify) return "";

		return domPurify
			.sanitize(
				text
					.replace(/<strong>/g, "<b>")
					.replace(/<\/strong>/g, "</b>")
					.replace(/<em>/g, "<i>")
					.replace(/<\/em>/g, "</i>")
					.replace(/<s>/g, "<strike>")
					.replace(/<\/s>/g, "</strike>"),
				{
					ALLOWED_TAGS: store.limits!.form.create.description.allowedTags,
					ALLOWED_ATTR: store.limits!.form.create.description.allowedAttrs,
					ALLOW_ARIA_ATTR: false,
					ALLOW_DATA_ATTR: false,
					KEEP_CONTENT: true,
				},
			)
			.replace(/(?:<div>(?:\s|&nbsp;|\u00A0|<br\s*\/?>)*<\/div>)+/gi, "\n")
			.replace(
				/^(?:\s|&nbsp;|\u00A0|<br\s*\/?>|\n|\r)+|(?:\s|&nbsp;|\u00A0|<br\s*\/?>|\n|\r)+$/gi,
				"",
			)
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

		if (
			selection &&
			!selection.isCollapsed &&
			editor!.contains(selection.anchorNode)
		) {
			const selection = window.getSelection();

			if (selection && selection.rangeCount > 0) {
				const range = selection.getRangeAt(0);
				savedRange = range.cloneRange();
				const rect = range.getBoundingClientRect();

				actionbar?.setProps({
					getReferenceClientRect: () => rect,
				});

				actionbar?.show();
			}
		} else {
			actionbar?.hide();
		}
	};

	const handleSelectionDelayed = () => {
		setTimeout(handleSelection, 50);
	};

	const resetRange = () => {
		if (savedRange) {
			const selection = window.getSelection();
			if (selection) {
				selection.removeAllRanges();
				selection.addRange(savedRange);
			}
		}
	};

	onMount(async () => {
		if (!editor) return;

		const pellInstance = pell.init({
			element: editor,
			actions: ["bold", "italic", "strikethrough", "underline"],
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

		realActionbar = document.querySelector(".pell-actionbar") as HTMLElement;

		const actionbarContainer = document.createElement("div");
		actionbarContainer.appendChild((<ActionBar />) as unknown as Node);

		actionbar = tippy(document.body, {
			content: actionbarContainer,
			placement: "top",
			trigger: "manual",
			interactive: true,
			arrow: true,
			theme: "editor",
		});

		observer.observe(realActionbar, {
			attributes: true,
			subtree: true,
		});

		onCleanup(() => {
			pellEditor.removeEventListener("paste", onPaste);
			pellEditor.removeEventListener("blur", onBlur);

			document.removeEventListener("mouseup", handleSelectionDelayed);
			document.removeEventListener("touchend", handleSelectionDelayed);

			actionbar?.destroy();
			actionbar = undefined;

			actionbarContainer.remove();

			observer.disconnect();
		});

		domPurify = await initializeDOMPurify();
		setDependencies("dompurify", true);

		if (props.value.length > 0) {
			pellEditor.innerHTML = sanitizeText(props.value);
		}
	});

	const ActionBar = () => {
		const onClickBold = () => {
			resetRange();
			(
				document.querySelector(".pell-button[title=Bold]") as HTMLElement
			).click();
		};

		const onClickItalic = () => {
			resetRange();

			(
				document.querySelector(".pell-button[title=Italic]") as HTMLElement
			).click();
		};

		const onClickStrikethrough = () => {
			resetRange();

			(
				document.querySelector(
					".pell-button[title=Strike-through]",
				) as HTMLElement
			).click();
		};

		const onClickUnderline = () => {
			resetRange();

			(
				document.querySelector(".pell-button[title=Underline]") as HTMLElement
			).click();
		};

		const onClickLink = () => {
			resetRange();
			const url = window.prompt(t("components.editor.url"));

			if (url && isValidURL(url)) {
				pell.exec("createLink", url);
			}
		};

		return (
			<div id="container-editor-actionbar">
				<ul id="editor-actionbar">
					<li
						classList={{ active: actionbarToggles.bold }}
						onClick={onClickBold}
					>
						<AiOutlineBold />
					</li>

					<li
						classList={{ active: actionbarToggles.italic }}
						onClick={onClickItalic}
					>
						<AiOutlineItalic />
					</li>

					<li
						classList={{ active: actionbarToggles.strikethrough }}
						onClick={onClickStrikethrough}
					>
						<AiOutlineStrikethrough />
					</li>

					<li
						classList={{ active: actionbarToggles.underline }}
						onClick={onClickUnderline}
					>
						<AiOutlineUnderline />
					</li>

					<li onClick={onClickLink}>
						<AiOutlineLink />
					</li>
				</ul>
			</div>
		);
	};

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
		<div id="container-editor" classList={{ loading: !dependencies.dompurify }}>
			<div ref={editor} id="editor" class="content" />
			<Placeholder />
			<MaxLength />
		</div>
	);
};

export default Editor;
