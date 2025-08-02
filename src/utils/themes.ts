import type { Component } from "solid-js";

export const AvatarColors = [
	{ from: "#FF885E", to: "#FF516A" },
	{ from: "#FFCD6A", to: "#FFA85C" },
	{ from: "#82B1FF", to: "#665FFF" },
	{ from: "#A0DE7E", to: "#54CB68" },
	{ from: "#53EDD6", to: "#28C9B7" },
	{ from: "#72D5FD", to: "#2A9EF1" },
	{ from: "#E0A2F3", to: "#D669ED" },
	{ from: "#A7ADB9", to: "#878B96" },
];

export type ContestThemeBackdrop = {
	id: number;
	name: string;
	colors: {
		center: string;
		edge: string;
		pattern: string;
		text: string;
	};
};

export type ContestThemeSymbol = {
	id: string;
	component: Component | string;
};

export type ContestTheme = {
	backdrop: number;
	symbol: string;
};

export const ContestThemeBackdrops: ContestThemeBackdrop[] = [
	// {
	// 	id: 0,
	// 	name: "Black",
	// 	colors: {
	// 		center: "#363738",
	// 		edge: "#0e0f0f",
	// 		pattern: "#6c6868",
	// 		text: "#8c8f91",
	// 	},
	// },
	{
		id: 1,
		name: "Electric Purple",
		colors: {
			center: "#ca70c6",
			edge: "#9662d4",
			pattern: "#620fb4",
			text: "#ebceff",
		},
	},
	{
		id: 2,
		name: "Lavender",
		colors: {
			center: "#b789e4",
			edge: "#8a5abc",
			pattern: "#5b10ab",
			text: "#e8d1ff",
		},
	},
	{
		id: 3,
		name: "Cyberpunk",
		colors: {
			center: "#858ff3",
			edge: "#865fd3",
			pattern: "#4318a6",
			text: "#e0d9ff",
		},
	},
	{
		id: 4,
		name: "Electric Indigo",
		colors: {
			center: "#a980f3",
			edge: "#5b62d8",
			pattern: "#3722ab",
			text: "#d8d8ff",
		},
	},
	{
		id: 5,
		name: "Neon Blue",
		colors: {
			center: "#7596f9",
			edge: "#6862e4",
			pattern: "#2828bc",
			text: "#cfddff",
		},
	},
	{
		id: 6,
		name: "Navy Blue",
		colors: {
			center: "#6c9edd",
			edge: "#5c6ec9",
			pattern: "#1239a2",
			text: "#d3e1ff",
		},
	},
	{
		id: 7,
		name: "Sapphire",
		colors: {
			center: "#58a3c8",
			edge: "#5379c2",
			pattern: "#0d45b6",
			text: "#c1deff",
		},
	},
	{
		id: 8,
		name: "Sky Blue",
		colors: {
			center: "#58b4c8",
			edge: "#538bc2",
			pattern: "#07609b",
			text: "#cde8fd",
		},
	},
	{
		id: 9,
		name: "Azure Blue",
		colors: {
			center: "#5db1cb",
			edge: "#448bab",
			pattern: "#025074",
			text: "#b5ecff",
		},
	},
	{
		id: 10,
		name: "Pacific Cyan",
		colors: {
			center: "#5abea6",
			edge: "#3d95ba",
			pattern: "#02648d",
			text: "#b6efff",
		},
	},
	{
		id: 11,
		name: "Aquamarine",
		colors: {
			center: "#60b195",
			edge: "#46abb4",
			pattern: "#035f67",
			text: "#c7fdfe",
		},
	},
	{
		id: 12,
		name: "Pacific Green",
		colors: {
			center: "#6fc793",
			edge: "#3b9c84",
			pattern: "#006149",
			text: "#c6fff0",
		},
	},
	{
		id: 13,
		name: "Emerald",
		colors: {
			center: "#78c585",
			edge: "#42a171",
			pattern: "#006532",
			text: "#b9f9d9",
		},
	},
	{
		id: 14,
		name: "Mint Green",
		colors: {
			center: "#7ecb82",
			edge: "#459e5a",
			pattern: "#026b22",
			text: "#bdffcc",
		},
	},
	{
		id: 15,
		name: "Malachite",
		colors: {
			center: "#95b457",
			edge: "#3d9755",
			pattern: "#046b06",
			text: "#c2efbe",
		},
	},
	{
		id: 16,
		name: "Shamrock Green",
		colors: {
			center: "#8ab163",
			edge: "#559345",
			pattern: "#126b00",
			text: "#d5fbc8",
		},
	},
	{
		id: 17,
		name: "Lemongrass",
		colors: {
			center: "#aeb85a",
			edge: "#559345",
			pattern: "#466a07",
			text: "#d8f2c2",
		},
	},
	{
		id: 18,
		name: "Light Olive",
		colors: {
			center: "#c2af64",
			edge: "#887e45",
			pattern: "#594c04",
			text: "#f5ebbc",
		},
	},
	{
		id: 19,
		name: "Satin Gold",
		colors: {
			center: "#bf9b47",
			edge: "#8d7739",
			pattern: "#5d3b00",
			text: "#fee4a9",
		},
	},
	{
		id: 20,
		name: "Pure Gold",
		colors: {
			center: "#ccab41",
			edge: "#987b32",
			pattern: "#703c00",
			text: "#ffe5ab",
		},
	},
	{
		id: 21,
		name: "Amber",
		colors: {
			center: "#dab345",
			edge: "#b1802a",
			pattern: "#7a3100",
			text: "#ffedc7",
		},
	},
	{
		id: 22,
		name: "Caramel",
		colors: {
			center: "#d09932",
			edge: "#b77431",
			pattern: "#7d3600",
			text: "#ffd9b3",
		},
	},
	{
		id: 23,
		name: "Orange",
		colors: {
			center: "#d19a3a",
			edge: "#c06f47",
			pattern: "#9d3907",
			text: "#ffe1c3",
		},
	},
	{
		id: 24,
		name: "Carrot Juice",
		colors: {
			center: "#db9867",
			edge: "#c76f4f",
			pattern: "#8e2100",
			text: "#ffd7ca",
		},
	},
	{
		id: 25,
		name: "Coral Red",
		colors: {
			center: "#da896b",
			edge: "#c4654f",
			pattern: "#891200",
			text: "#ffd9d2",
		},
	},
	{
		id: 26,
		name: "Persimmon",
		colors: {
			center: "#e7a75a",
			edge: "#c5675f",
			pattern: "#ad0e00",
			text: "#ffe4d7",
		},
	},
	{
		id: 27,
		name: "Strawberry",
		colors: {
			center: "#dd8e6f",
			edge: "#b75a60",
			pattern: "#a90c0c",
			text: "#ffd3d3",
		},
	},
	{
		id: 28,
		name: "Raspberry",
		colors: {
			center: "#e07b85",
			edge: "#b65980",
			pattern: "#890638",
			text: "#ffd6e6",
		},
	},
	{
		id: 29,
		name: "Mystic Pearl",
		colors: {
			center: "#d08b6d",
			edge: "#b05770",
			pattern: "#9b0526",
			text: "#fedde0",
		},
	},
	{
		id: 30,
		name: "Fandango",
		colors: {
			center: "#e28ab6",
			edge: "#a4588b",
			pattern: "#8e054e",
			text: "#ffc7eb",
		},
	},
	{
		id: 31,
		name: "Dark Lilac",
		colors: {
			center: "#b17da5",
			edge: "#8c577a",
			pattern: "#652852",
			text: "#f0c4e2",
		},
	},
	{
		id: 32,
		name: "English Violet",
		colors: {
			center: "#b186bb",
			edge: "#875a91",
			pattern: "#54225f",
			text: "#e6c7ed",
		},
	},
	{
		id: 33,
		name: "Moonstone",
		colors: {
			center: "#7eb1b4",
			edge: "#588390",
			pattern: "#164552",
			text: "#daf5fd",
		},
	},
	{
		id: 34,
		name: "Pine Green",
		colors: {
			center: "#6ba97c",
			edge: "#3e7970",
			pattern: "#0b4833",
			text: "#d8f5e5",
		},
	},
	{
		id: 35,
		name: "Hunter Green",
		colors: {
			center: "#8fae78",
			edge: "#4b825b",
			pattern: "#1c491f",
			text: "#d8f5de",
		},
	},
	{
		id: 36,
		name: "Pistachio",
		colors: {
			center: "#97b07c",
			edge: "#5c814c",
			pattern: "#28471b",
			text: "#d9f2c9",
		},
	},
	{
		id: 37,
		name: "Khaki Green",
		colors: {
			center: "#adb070",
			edge: "#6b7d54",
			pattern: "#39501b",
			text: "#d3e6bb",
		},
	},
	{
		id: 38,
		name: "Desert Sand",
		colors: {
			center: "#b39f82",
			edge: "#7e735b",
			pattern: "#504429",
			text: "#f2e5cd",
		},
	},
	{
		id: 39,
		name: "Cappuccino",
		colors: {
			center: "#b1907e",
			edge: "#7c6356",
			pattern: "#4a3226",
			text: "#ebd4c8",
		},
	},
	{
		id: 40,
		name: "Rosewood",
		colors: {
			center: "#b77a77",
			edge: "#814c52",
			pattern: "#551c22",
			text: "#edcacd",
		},
	},
	{
		id: 41,
		name: "Ivory White",
		colors: {
			center: "#bab6b1",
			edge: "#a19d97",
			pattern: "#665f52",
			text: "#f5f4f2",
		},
	},
	{
		id: 42,
		name: "Platinum",
		colors: {
			center: "#b2aea7",
			edge: "#88847e",
			pattern: "#3d382d",
			text: "#e9e7e2",
		},
	},
	{
		id: 43,
		name: "Roman Silver",
		colors: {
			center: "#a3a8b5",
			edge: "#7c808a",
			pattern: "#3f4550",
			text: "#dadfe2",
		},
	},
	{
		id: 44,
		name: "Steel Grey",
		colors: {
			center: "#97a2ac",
			edge: "#63727c",
			pattern: "#334552",
			text: "#dfe4e8",
		},
	},
	{
		id: 45,
		name: "Silver Blue",
		colors: {
			center: "#80a4b8",
			edge: "#607c91",
			pattern: "#15374b",
			text: "#c9e4f4",
		},
	},
	{
		id: 46,
		name: "Burgundy",
		colors: {
			center: "#a35e66",
			edge: "#6d414a",
			pattern: "#340307",
			text: "#e7bcc0",
		},
	},
	{
		id: 47,
		name: "Indigo Dye",
		colors: {
			center: "#537991",
			edge: "#416479",
			pattern: "#031b29",
			text: "#c2dcee",
		},
	},
	{
		id: 48,
		name: "Midnight Blue",
		colors: {
			center: "#5c6985",
			edge: "#354057",
			pattern: "#030a18",
			text: "#bfcce0",
		},
	},
	{
		id: 49,
		name: "Onyx Black",
		colors: {
			center: "#4d5254",
			edge: "#313638",
			pattern: "#000000",
			text: "#a9abad",
		},
	},
	{
		id: 50,
		name: "Battleship Grey",
		colors: {
			center: "#8c8c85",
			edge: "#6c6c66",
			pattern: "#2b2a20",
			text: "#cfcec4",
		},
	},
	{
		id: 51,
		name: "Purple",
		colors: {
			center: "#ae6cae",
			edge: "#844784",
			pattern: "#470c47",
			text: "#f3cbf3",
		},
	},
	{
		id: 52,
		name: "Grape",
		colors: {
			center: "#9d74c1",
			edge: "#794da0",
			pattern: "#3e0a6b",
			text: "#e0bdfe",
		},
	},
	{
		id: 53,
		name: "Cobalt Blue",
		colors: {
			center: "#6088cf",
			edge: "#5162b8",
			pattern: "#13247c",
			text: "#c2d3f5",
		},
	},
	{
		id: 54,
		name: "French Blue",
		colors: {
			center: "#5c9bc4",
			edge: "#37739a",
			pattern: "#073b5c",
			text: "#c1e3f9",
		},
	},
	{
		id: 55,
		name: "Turquoise",
		colors: {
			center: "#5ec0b8",
			edge: "#3d928e",
			pattern: "#11534c",
			text: "#bdf8f2",
		},
	},
	{
		id: 56,
		name: "Jade Green",
		colors: {
			center: "#55c49c",
			edge: "#3b9977",
			pattern: "#044931",
			text: "#befee7",
		},
	},
	{
		id: 57,
		name: "Copper",
		colors: {
			center: "#d08656",
			edge: "#9d6531",
			pattern: "#602901",
			text: "#f4d8be",
		},
	},
	{
		id: 58,
		name: "Chestnut",
		colors: {
			center: "#be6f54",
			edge: "#994838",
			pattern: "#601508",
			text: "#fec6b9",
		},
	},
	{
		id: 59,
		name: "Chocolate",
		colors: {
			center: "#a46e58",
			edge: "#74443b",
			pattern: "#3e0a02",
			text: "#e4b6ac",
		},
	},
	{
		id: 60,
		name: "Marine Blue",
		colors: {
			center: "#4e689c",
			edge: "#3b4b7a",
			pattern: "#010821",
			text: "#bbcbf2",
		},
	},
	{
		id: 61,
		name: "Tactical Pine",
		colors: {
			center: "#44826b",
			edge: "#2f6369",
			pattern: "#002624",
			text: "#b7e6d3",
		},
	},
	{
		id: 62,
		name: "Gunship Green",
		colors: {
			center: "#558a65",
			edge: "#3d6657",
			pattern: "#07261d",
			text: "#b5e0d4",
		},
	},
	{
		id: 63,
		name: "Dark Green",
		colors: {
			center: "#516341",
			edge: "#2b452f",
			pattern: "#000501",
			text: "#bfd1a9",
		},
	},
	{
		id: 64,
		name: "Seal Brown",
		colors: {
			center: "#664d45",
			edge: "#47362e",
			pattern: "#0a0605",
			text: "#d4bcb5",
		},
	},
	{
		id: 65,
		name: "Rifle Green",
		colors: {
			center: "#64695c",
			edge: "#4b5241",
			pattern: "#0f120b",
			text: "#c3c7bd",
		},
	},
	{
		id: 66,
		name: "Ranger Green",
		colors: {
			center: "#5f7849",
			edge: "#3c4f3b",
			pattern: "#102209",
			text: "#b7c4b5",
		},
	},
	{
		id: 67,
		name: "Camo Green",
		colors: {
			center: "#75944d",
			edge: "#547341",
			pattern: "#163701",
			text: "#cfe8b9",
		},
	},
	{
		id: 68,
		name: "Feldgrau",
		colors: {
			center: "#899288",
			edge: "#5e6b63",
			pattern: "#1c261f",
			text: "#dee9e1",
		},
	},
	{
		id: 69,
		name: "Gunmetal",
		colors: {
			center: "#4c5d63",
			edge: "#2f3b42",
			pattern: "#04080a",
			text: "#b6c5cc",
		},
	},
	{
		id: 70,
		name: "Deep Cyan",
		colors: {
			center: "#31b5aa",
			edge: "#189599",
			pattern: "#004f4f",
			text: "#d1fffd",
		},
	},
	{
		id: 71,
		name: "Mexican Pink",
		colors: {
			center: "#e36692",
			edge: "#c9497c",
			pattern: "#750230",
			text: "#ffd6e6",
		},
	},
	{
		id: 72,
		name: "Tomato",
		colors: {
			center: "#e6793e",
			edge: "#d44e3f",
			pattern: "#800b00",
			text: "#ffccbd",
		},
	},
	{
		id: 73,
		name: "Fire Engine",
		colors: {
			center: "#f05f4f",
			edge: "#c43949",
			pattern: "#690009",
			text: "#ffb7a6",
		},
	},
	{
		id: 74,
		name: "Celtic Blue",
		colors: {
			center: "#45b8ed",
			edge: "#3886d9",
			pattern: "#003e85",
			text: "#c2e7ff",
		},
	},
	{
		id: 75,
		name: "Old Gold",
		colors: {
			center: "#b58d38",
			edge: "#946925",
			pattern: "#4f3302",
			text: "#ffdd8c",
		},
	},
	{
		id: 76,
		name: "Burnt Sienna",
		colors: {
			center: "#d66f3c",
			edge: "#b54b2d",
			pattern: "#6b0902",
			text: "#ffccb0",
		},
	},
	{
		id: 77,
		name: "Carmine",
		colors: {
			center: "#e0574a",
			edge: "#a8383b",
			pattern: "#4f0100",
			text: "#ffb7ad",
		},
	},
	{
		id: 78,
		name: "Mustard",
		colors: {
			center: "#d4980d",
			edge: "#c47712",
			pattern: "#7a2500",
			text: "#ffde9c",
		},
	},
	{
		id: 79,
		name: "French Violet",
		colors: {
			center: "#c260e6",
			edge: "#914ed9",
			pattern: "#4a018a",
			text: "#ebc7ff",
		},
	},
];

export const ContestThemes: ContestTheme[] = [
	// { backdrop: 0, symbol: "symbol-1" },
	{ backdrop: 1, symbol: "symbol-2" },
	{ backdrop: 2, symbol: "symbol-3" },
	{ backdrop: 3, symbol: "symbol-4" },
	{ backdrop: 4, symbol: "symbol-5" },
	{ backdrop: 5, symbol: "symbol-6" },
	{ backdrop: 6, symbol: "symbol-7" },
	{ backdrop: 7, symbol: "symbol-8" },
	{ backdrop: 8, symbol: "symbol-9" },
	{ backdrop: 9, symbol: "symbol-10" },
	{ backdrop: 10, symbol: "symbol-11" },
	{ backdrop: 11, symbol: "symbol-12" },
	{ backdrop: 12, symbol: "symbol-13" },
	{ backdrop: 13, symbol: "symbol-14" },
	{ backdrop: 14, symbol: "symbol-15" },
	{ backdrop: 15, symbol: "symbol-16" },
	{ backdrop: 16, symbol: "symbol-17" },
	{ backdrop: 17, symbol: "symbol-18" },
	{ backdrop: 18, symbol: "symbol-19" },
	{ backdrop: 19, symbol: "symbol-20" },
	{ backdrop: 20, symbol: "symbol-21" },
	{ backdrop: 21, symbol: "symbol-22" },
	{ backdrop: 22, symbol: "symbol-23" },
	{ backdrop: 23, symbol: "symbol-24" },
	{ backdrop: 24, symbol: "symbol-25" },
	{ backdrop: 25, symbol: "symbol-26" },
	{ backdrop: 26, symbol: "symbol-27" },
	{ backdrop: 27, symbol: "symbol-28" },
	{ backdrop: 28, symbol: "symbol-29" },
	{ backdrop: 29, symbol: "symbol-30" },
	{ backdrop: 30, symbol: "symbol-31" },
	{ backdrop: 31, symbol: "symbol-32" },
	{ backdrop: 32, symbol: "symbol-33" },
	{ backdrop: 33, symbol: "symbol-34" },
	{ backdrop: 34, symbol: "symbol-35" },
	{ backdrop: 35, symbol: "symbol-36" },
	{ backdrop: 36, symbol: "symbol-37" },
	{ backdrop: 37, symbol: "symbol-38" },
	{ backdrop: 38, symbol: "symbol-39" },
	{ backdrop: 39, symbol: "symbol-40" },
	{ backdrop: 40, symbol: "symbol-41" },
	{ backdrop: 41, symbol: "symbol-42" },
	{ backdrop: 42, symbol: "symbol-43" },
	{ backdrop: 43, symbol: "symbol-44" },
	{ backdrop: 44, symbol: "symbol-45" },
	{ backdrop: 45, symbol: "symbol-46" },
	{ backdrop: 46, symbol: "symbol-47" },
	{ backdrop: 47, symbol: "symbol-48" },
	{ backdrop: 48, symbol: "symbol-49" },
	{ backdrop: 49, symbol: "symbol-50" },
	{ backdrop: 50, symbol: "symbol-51" },
	{ backdrop: 51, symbol: "symbol-52" },
	{ backdrop: 52, symbol: "symbol-53" },
	{ backdrop: 53, symbol: "symbol-54" },
	{ backdrop: 54, symbol: "symbol-55" },
	{ backdrop: 55, symbol: "symbol-56" },
	{ backdrop: 56, symbol: "symbol-57" },
	{ backdrop: 57, symbol: "symbol-58" },
	{ backdrop: 58, symbol: "symbol-59" },
	{ backdrop: 59, symbol: "symbol-60" },
	{ backdrop: 60, symbol: "symbol-61" },
	{ backdrop: 61, symbol: "symbol-62" },
	{ backdrop: 62, symbol: "symbol-63" },
	{ backdrop: 63, symbol: "symbol-64" },
	{ backdrop: 64, symbol: "symbol-65" },
	{ backdrop: 65, symbol: "symbol-66" },
	{ backdrop: 66, symbol: "symbol-67" },
	{ backdrop: 67, symbol: "symbol-68" },
	{ backdrop: 68, symbol: "symbol-69" },
	{ backdrop: 69, symbol: "symbol-70" },
	{ backdrop: 70, symbol: "symbol-71" },
	{ backdrop: 71, symbol: "symbol-72" },
	{ backdrop: 72, symbol: "symbol-73" },
	{ backdrop: 73, symbol: "symbol-74" },
	{ backdrop: 74, symbol: "symbol-75" },
	{ backdrop: 75, symbol: "symbol-76" },
	{ backdrop: 76, symbol: "symbol-77" },
	{ backdrop: 77, symbol: "symbol-78" },
	{ backdrop: 78, symbol: "symbol-79" },
	{ backdrop: 79, symbol: "symbol-80" },
];
