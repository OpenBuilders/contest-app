import "./Avatar.scss";
import { type Component, Show } from "solid-js";
import { getNameInitials } from "../utils/general";
import { AvatarColors } from "../utils/themes";
import ImageLoader from "./ImageLoader";
import { SVGSymbol } from "./SVG";

type AvatarProps = {
	src?: string;
	fullname: string;
};

export const Avatar: Component<AvatarProps> = (props) => {
	const getIndex = (s: string, len: number) =>
		Array.from(s).reduce((h, c) => (h * 31 + c.codePointAt(0)!) >>> 0, 0) % len;

	const color = AvatarColors[getIndex(props.fullname, AvatarColors.length)];

	return (
		<div
			class="avatar"
			style={{
				"--color-from": color.from,
				"--color-to": color.to,
			}}
		>
			<Show
				when={props.src}
				fallback={<span>{getNameInitials(props.fullname)}</span>}
			>
				<ImageLoader src={props.src!} />
			</Show>
		</div>
	);
};

type AvatarAliasProps = {
	symbol: string;
	colorIndex: number;
};

export const AvatarAlias: Component<AvatarAliasProps> = (props) => {
	const color = AvatarColors[props.colorIndex];

	return (
		<div
			class="avatar-alias"
			style={{
				"--color-from": color.from,
				"--color-to": color.to,
			}}
		>
			<SVGSymbol id={`alias-${props.symbol}`} />
		</div>
	);
};
