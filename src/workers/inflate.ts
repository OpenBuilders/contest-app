import { inflate } from "pako";

declare const self: Worker;

export type InflateWorkerMessage = {
	id: string;
	buffer: Uint8Array;
};

export type InflateWorkerResponse = {
	id: string;
	buffer: Uint8Array;
};

self.addEventListener(
	"message",
	async (message: MessageEvent<InflateWorkerMessage>) => {
		const { data } = message;
		const buffer = inflate(new Uint8Array(data.buffer));
		self.postMessage(
			{
				id: data.id,
				buffer,
			} satisfies InflateWorkerResponse,
			[buffer.buffer],
		);
	},
);
