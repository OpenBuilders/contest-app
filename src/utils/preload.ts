import { LottiePlayerFileCache } from "../components/LottiePlayer";
import { TGS } from "./animations";
import { inflateWorker } from "./inflate";

const preloadAnimations = async () => {
	return Promise.all(
		Object.entries(TGS).map(
			([_, animation]) =>
				new Promise((resolve) => {
					fetch(animation.url)
						.then(async (request) => {
							const buffer = await request.arrayBuffer();
							LottiePlayerFileCache[animation.url] = new Uint8Array(buffer);

							if (
								LottiePlayerFileCache[animation.url][0] === 0x1f &&
								LottiePlayerFileCache[animation.url][1] === 0x8b &&
								LottiePlayerFileCache[animation.url][2] === 0x08
							) {
								LottiePlayerFileCache[animation.url] = await inflateWorker(
									LottiePlayerFileCache[animation.url],
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
