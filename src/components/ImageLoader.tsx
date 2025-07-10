import "./ImageLoader.scss";
import {
	type Component,
	createEffect,
	createSignal,
	type JSX,
	onCleanup,
	type Ref,
	Show,
} from "solid-js";

type ImageLoaderProps = {
	src: string;
	ref?: Ref<HTMLDivElement>;
	containerAttrs?: JSX.HTMLAttributes<HTMLDivElement>;
	imageAttrs?: JSX.HTMLAttributes<HTMLImageElement>;
};

const ImageLoader: Component<ImageLoaderProps> = (props) => {
	let img: HTMLImageElement | undefined;
	const [loaded, setLoaded] = createSignal<boolean | null>(null);

	const onLoad = () => {
		setLoaded(true);
	};

	createEffect(() => {
		if (!img) return;

		setLoaded(img.complete);
		img.addEventListener("load", onLoad);
	});

	onCleanup(() => {
		img?.removeEventListener("load", onLoad);
	});

	return (
		<div class="image-loader" {...props.containerAttrs}>
			<Show when={loaded() === false}>
				<div class="shimmer" />
			</Show>

			<img ref={img} src={props.src} {...props.imageAttrs} />
		</div>
	);
};

export default ImageLoader;
