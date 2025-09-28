// @ts-expect-error
import Module from "../thorvg/thorvg.js";
import type {
	LottixConfig,
	PlayerEvent,
	PlayerState,
} from "../utils/lottix.js";

declare const self: Worker;

class ThorVGClass {
	public state: "uninit" | "initializing" | "done" = "uninit";
	public instance: Module;

	public async initialize() {
		if (this.state === "done") {
			return;
		}

		if (this.state === "initializing") {
			await sleep(100);
			await this.initialize();
			return;
		}

		if (this.state === "uninit") {
			this.state = "initializing";
			this.instance = await Module();
			this.state = "done";
		}
	}
}

const ThorVG = new ThorVGClass();
ThorVG.initialize();

const sleep = async (time: number) => {
	return new Promise((resolve) => setTimeout(resolve, time));
};

class LottixWorker {
	private config: LottixConfigWorker;
	private thorvg: any;
	private beginTime = 0;
	private counter = 1;
	private context: OffscreenCanvasRenderingContext2D;

	private currentFrame = 0;
	private totalFrame = 0;
	private state: PlayerState = "loading";
	private intermission = 1;

	private observable = false;

	constructor(config: LottixConfigWorker) {
		this.config = config;
		this.context = this.config.canvas.getContext("2d")!;
		this.initialize();
	}

	private async initialize() {
		if (ThorVG.state !== "done") {
			await ThorVG.initialize();
		}

		this.thorvg = new ThorVG.instance.TvgLottieAnimation(
			this.config.renderer,
			"",
		);

		const loaded = this.thorvg.load(
			this.config.animationData,
			"lot",
			this.config.canvas.width,
			this.config.canvas.height,
			"",
		);
		if (!loaded) return;

		this.render();
		this.emit("load");

		if (this.config.autoPlay) {
			this.play();
		}
	}

	private render() {
		const updated = this.thorvg.update();
		if (!updated) return;

		// webgpu & webgl
		if (this.config.renderer === "wg" || this.config.renderer === "gl") {
			this.thorvg.render();
			return;
		}

		const buffer = this.thorvg.render();
		const clampedBuffer = new Uint8ClampedArray(
			buffer.buffer,
			buffer.byteOffset,
			buffer.byteLength,
		);
		if (clampedBuffer.length < 1) {
			return;
		}

		this.context.putImageData(
			new ImageData(
				clampedBuffer,
				this.config.canvas.width,
				this.config.canvas.height,
			),
			0,
			0,
		);
	}

	private async renderLoop() {
		if (!this.thorvg) {
			return;
		}

		if (await this.update()) {
			if (this.observable) {
				this.render();
			}
			requestAnimationFrame(this.renderLoop.bind(this));
		}
	}

	private async update() {
		if (this.state !== "playing") {
			return false;
		}

		const duration = this.thorvg.duration();
		const currentTime = Date.now() / 1000;
		this.currentFrame =
			((currentTime - this.beginTime) / duration) *
			this.totalFrame *
			(this.config.speed ?? 1);
		if (this.config.direction === -1) {
			this.currentFrame = this.totalFrame - this.currentFrame;
		}

		if (
			(this.config.direction === 1 && this.currentFrame >= this.totalFrame) ||
			(this.config.direction === -1 && this.currentFrame <= 0)
		) {
			const totalCount = this.config.count
				? this.config.playMode === "bounce"
					? this.config.count * 2
					: this.config.count
				: 0;
			if (this.config.loop || (totalCount && this.counter < totalCount)) {
				if (this.config.playMode === "bounce") {
					this.config.direction = this.config.direction === 1 ? -1 : 1;
					this.currentFrame = this.config.direction === 1 ? 0 : this.totalFrame;
				}

				if (this.config.count) {
					this.counter += 1;
				}

				await sleep(this.intermission);
				this.play();
				return true;
			}

			this.emit("complete");
			this.setState("complete");
		}

		return this.thorvg.frame(this.currentFrame);
	}

	public play() {
		this.totalFrame = this.thorvg.totalFrame();
		if (this.totalFrame < 1) {
			return;
		}

		this.beginTime = Date.now() / 1000;
		if (this.state === "playing") {
			return;
		}

		if (this.observable) {
			this.setState("playing");

			requestAnimationFrame(this.renderLoop.bind(this));
			return;
		}

		this.setState("frozen");
	}

	public pause() {
		this.setState("paused");
		this.emit("pause");
	}

	public stop() {
		this.setState("stopped");
		this.currentFrame = 0;
		this.counter = 1;
		this.seek(0);
		this.emit("stop");
	}

	public freeze() {
		this.setState("frozen");
		this.emit("freeze");
	}

	public frame(frame: number) {
		this.pause();
		this.currentFrame = frame;
		this.thorvg.frame(frame);
	}

	public async seek(frame: number): Promise<void> {
		this.frame(frame);
		await this.update();
		this.render();
	}

	public resize(width: number, height: number) {
		this.config.canvas.width = width;
		this.config.canvas.height = height;

		if (this.state !== "playing") {
			this.render();
		}
	}

	public destroy(): void {
		if (!this.thorvg) {
			return;
		}

		this.observable = false;

		this.thorvg.delete();
		this.thorvg = null;
		this.setState("destroyed");

		this.emit("destroyed");
	}

	public setLooping(value: boolean): void {
		if (!this.thorvg) {
			return;
		}

		this.config.loop = value;
	}

	public setDirection(value: number): void {
		if (!this.thorvg) {
			return;
		}

		this.config.direction = value;
	}

	public setSpeed(value: number): void {
		if (!this.thorvg) {
			return;
		}

		this.config.speed = value;
	}

	public setObservable(value: boolean) {
		this.observable = value;

		if (this.observable) {
			if (this.state === "frozen") {
				this.play();
			}
		} else if (this.state === "playing") {
			this.freeze();
			this.emit("freeze");
		}
	}

	protected setState(state: PlayerState) {
		this.state = state;

		self.postMessage({
			state,
			id: this.config.id,
			type: "state",
		} satisfies LottixWorkerResponse);
	}

	protected emit(event: PlayerEvent): void {
		self.postMessage({
			event,
			id: this.config.id,
			type: "event",
		} satisfies LottixWorkerResponse);
	}
}

type LottixConfigWorker = Omit<LottixConfig, "src" | "canvas"> & {
	id: string;
	canvas: OffscreenCanvas;
	animationData: Uint8Array;
};

export type LottixWorkerMessage =
	| LottixWorkerMessageInit
	| LottixWorkerMessageObservability
	| LottixWorkerMessageState
	| LottixWorkerMessageTweak;

type LottixWorkerMessageInit = {
	type: "init";
	id: string;
	config: LottixConfigWorker;
};

type LottixWorkerMessageObservability = {
	type: "observability";
	id: string;
	observable: boolean;
};

type LottixWorkerMessageState = {
	type: "state";
	action: "play" | "pause" | "stop" | "destroy" | "demolish";
	id: string;
};

type LottixWorkerMessageTweak = {
	type: "tweak";
	action: "looping" | "direction" | "speed";
	value: number | boolean;
	id: string;
};

export type LottixWorkerResponse =
	| LottixWorkerResponseEvent
	| LottixWorkerResponseState;

type LottixWorkerResponseEvent = {
	type: "event";
	id: string;
	event: PlayerEvent;
};

type LottixWorkerResponseState = {
	type: "state";
	id: string;
	state: PlayerState;
};

const instances: { [key: string]: LottixWorker } = {};

const pendingObservabilities: { [key: string]: boolean } = {};

self.addEventListener(
	"message",
	async (message: MessageEvent<LottixWorkerMessage>) => {
		const { data } = message;

		switch (data.type) {
			case "init":
				instances[data.id] = new LottixWorker(data.config);
				break;

			case "observability":
				pendingObservabilities[data.id] = data.observable;
				while (!(data.id in instances)) {
					await sleep(100);
				}
				if (data.id in pendingObservabilities) {
					instances[data.id].setObservable(pendingObservabilities[data.id]);
					delete pendingObservabilities[data.id];
				}
				break;

			case "state":
				if (data.id in instances) {
					switch (data.action) {
						case "play":
							instances[data.id].play();
							break;
						case "pause":
							instances[data.id].pause();
							break;
						case "stop":
							instances[data.id].stop();
							break;
						case "destroy":
							instances[data.id].destroy();
							break;
						case "demolish":
							instances[data.id].destroy();
							delete instances[data.id];
							break;
					}
				}
				break;

			case "tweak":
				if (data.id in instances) {
					switch (data.action) {
						case "direction":
							instances[data.id].setDirection(data.value as number);
							break;
						case "looping":
							instances[data.id].setLooping(data.value as boolean);
							break;
						case "speed":
							instances[data.id].setSpeed(data.value as number);
							break;
					}
				}
				break;
		}
	},
);
