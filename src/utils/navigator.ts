import {
	type Location,
	type Navigator as SolidNavigator,
	useLocation,
	useNavigate,
} from "@solidjs/router";
import { randomLong } from "./number";

type NavigatorHistory = {
	id: number;
	path: string;
	options?: NavigationOptions;
};

type NavigationOptions = {
	skipHistory?: boolean;
	backable?: boolean;
	resolve?: boolean;
	params?: any;
};

class Navigator {
	public history: NavigatorHistory[] = [];
	public navigate: SolidNavigator | undefined = undefined;
	public location: Location | undefined = undefined;

	public initialize() {
		if (!this.navigate) {
			this.navigate = useNavigate();
		}

		if (!this.location) {
			this.location = useLocation();
		}
	}

	public go(path: string, options?: NavigationOptions) {
		if (!this.navigate) {
			this.initialize();
		}

		const navigationId = randomLong();

		if (!options?.skipHistory) {
			this.history.push({
				id: navigationId,
				path: path,
				options: options,
			});
		}

		this.navigate!(path, {
			replace: true,
			resolve: options?.resolve,
		});

		return navigationId;
	}

	public clearHistory() {
		this.history = [];
	}

	public getPreviousHistory() {
		if (this.history.length < 2) {
			return undefined;
		}

		return this.history[this.history.length - 2];
	}

	public getCurrentHistory() {
		if (this.history.length < 1) {
			return undefined;
		}

		return this.history[this.history.length - 1];
	}

	public getLatestHistoryByPath(path: string) {
		let item: NavigatorHistory | undefined;

		for (let i = this.history.length - 1; i >= 0; i--) {
			if (this.history[i].path === path) {
				item = this.history[i];
				break;
			}
		}

		return item;
	}

	public isBackable() {
		if (this.history.length < 2) {
			return false;
		}

		return this.history[this.history.length - 1].options?.backable;
	}

	public back(options?: NavigationOptions) {
		if (this.isBackable()) {
			this.go(this.history[this.history.length - 2].path, options);
		}
	}
}

export const navigator = new Navigator();
