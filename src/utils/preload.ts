import { LottiePlayerFileCache } from "../components/LottiePlayer";
import { TGS } from "./animations";
import { inflateWorker } from "./inflate";

const preloadAnimations = async () => {
	const list: (keyof typeof TGS)[] = ["duckEgg"];

	return Promise.all(
		list.map(
			(animation) =>
				new Promise((resolve) => {
					fetch(TGS[animation].url)
						.then(async (request) => {
							const buffer = await request.arrayBuffer();
							LottiePlayerFileCache[TGS[animation].url] = new Uint8Array(
								buffer,
							);

							if (
								LottiePlayerFileCache[TGS[animation].url][0] === 0x1f &&
								LottiePlayerFileCache[TGS[animation].url][1] === 0x8b &&
								LottiePlayerFileCache[TGS[animation].url][2] === 0x08
							) {
								LottiePlayerFileCache[TGS[animation].url] = await inflateWorker(
									LottiePlayerFileCache[TGS[animation].url],
								);
							}
						})
						.finally(() => resolve(true));
				}),
		),
	);
};

export const preloadPipeline = async () => {
	return Promise.all([preloadAnimations()]);
};
