import "./Avatar.scss";
import { type Component, For, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { getNameInitials } from "../utils/general";
import ImageLoader from "./ImageLoader";
import { SVGSymbol } from "./SVG";

export const AvatarColors = [
	{ slug: "red", from: "#FF885E", to: "#FF516A" },
	{ slug: "orange", from: "#FFCD6A", to: "#FFA85C" },
	{ slug: "violet", from: "#82B1FF", to: "#665FFF" },
	{ slug: "green", from: "#A0DE7E", to: "#54CB68" },
	{ slug: "cyan", from: "#53EDD6", to: "#28C9B7" },
	{ slug: "blue", from: "#72D5FD", to: "#2A9EF1" },
	{ slug: "pink", from: "#E0A2F3", to: "#D669ED" },
];

export const AvatarColorArchived = {
	slug: "archived",
	from: "#B8C2CC",
	to: "#9EAAB5",
};

type AvatarProps = {
	src?: string;
	fullname?: string;
	rawText?: string;
	peerId?: number;
};

export const Avatar: Component<AvatarProps> = (props) => {
	const getIndex = (s: string, len: number) =>
		Array.from(s).reduce((h, c) => (h * 31 + c.codePointAt(0)!) >>> 0, 0) % len;

	let color = props.peerId
		? AvatarColors[Math.abs(+props.peerId) % AvatarColors.length]
		: AvatarColors[getIndex(props.fullname ?? "", AvatarColors.length)];

	if (props.peerId === -1) {
		color = AvatarColorArchived;
	}

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
				fallback={
					<span>
						{props.rawText ??
							getNameInitials(props.fullname ?? "").toUpperCase()}
					</span>
				}
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

type AvatarStackProps = {
	avatars: Array<Component<AvatarProps> | Component<AvatarAliasProps>>;
	limit?: number;
};

const AVATAR_STACK_LIMIT = 3;

export const AvatarStack: Component<AvatarStackProps> = (props) => {
	return (
		<div class="avatar-stack">
			<For each={props.avatars.slice(0, props.limit ?? AVATAR_STACK_LIMIT)}>
				{(item) => <Dynamic component={item as Component} />}
			</For>

			<Show when={props.avatars.length > (props.limit ?? AVATAR_STACK_LIMIT)}>
				<Avatar
					rawText={`+${props.avatars.length - (props.limit ?? AVATAR_STACK_LIMIT)}`}
					peerId={-1}
				/>
			</Show>
		</div>
	);
};
