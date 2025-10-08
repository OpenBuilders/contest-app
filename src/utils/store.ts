import { createStore } from "solid-js/store";

export type User = {
	user_id: number;
	first_name: string;
	last_name?: string;
	profile_photo?: string;
	anonymous_profile: [number, string[], string[]];
	language?: string;
	created_at?: string;
};

export type Contest = {
	id?: number;
	slug: string;
	slug_moderator?: string;
	owner_id?: number;
	moderators?: number[];
	title: string;
	description: string;
	instruction?: string;
	fee: number;
	fee_wallet?: string;
	prize?: string;
	anonymous: boolean;
	verified?: boolean;
	announced?: boolean;
	image?: string;
	theme?: {
		backdrop?: number;
		symbol?: string;
	};
	results?: Result[];
	date_end: number;
	created_at?: string;
};

export type ContestMetadata = {
	role?: "owner" | "moderator" | "participant";
	bookmarked?: boolean;
	moderators_count?: number;
	submissions_count?: number;
};

export type Placement = {
	id?: number;
	name: string;
	prize?: string;
	submissions:
		| number[]
		| Pick<
				Submission,
				| "anonymous_profile"
				| "first_name"
				| "last_name"
				| "profile_photo"
				| "user_id"
		  >[];
};

export type Result = {
	name: Placement["name"];
	prize: Placement["prize"];
	submissions: (Pick<
		User,
		| "anonymous_profile"
		| "first_name"
		| "last_name"
		| "profile_photo"
		| "user_id"
	> & {
		self?: boolean;
	})[];
};

export type AnnotatedContest = {
	contest: Contest;
	metadata: ContestMetadata;
};

export type Submission = {
	id: number;
	anonymous_profile: User["anonymous_profile"];
	user_id?: User["user_id"];
	first_name?: User["first_name"];
	last_name?: User["last_name"];
	profile_photo?: User["profile_photo"];
	submission: {
		description?: string;
	};
	likes: number;
	dislikes: number;
	liked_by: SubmissionVoter[];
	disliked_by: SubmissionVoter[];
	created_at?: string;
};

export type SubmissionVoter = {
	first_name: User["first_name"];
	last_name?: User["last_name"];
	profile_photo?: User["profile_photo"];
	user_id: User["user_id"];
	created_at?: string;
};

export type SubmissionMetadata = {
	liked_by_viewer: boolean;
	disliked_by_viewer: boolean;
};

export type AnnotatedSubmission = {
	submission: Submission;
	metadata: SubmissionMetadata;
};

export type Achievement = {
	slug: Contest["slug"];
	title: Contest["title"];
	image: Contest["image"];
	theme: Contest["theme"];
	placement: Pick<Placement, "name" | "prize">;
};

export type GallerySliderItem = {
	image: string;
	url: string;
};

export type GallerySlider = {
	type: "slider";
	id: string;
	items_per_view?: number;
	items: GallerySliderItem[];
};

export type GallerySection = {
	type: "section";
	id: string;
	title: string;
	items: AnnotatedContest[];
};

export type GalleryItem = GallerySlider | GallerySection;

export type Store = {
	token?: string;
	limits?: { [key: string]: any };
	contests: {
		my?: AnnotatedContest[];
		gallery?: GalleryItem[];
	};
	achievements: {
		my?: Achievement[];
	};
	user?: User;
	wallets: {
		master?: string,
	},
	version?: string;
};

export const [store, setStore] = createStore<Store>({
	contests: {},
	achievements: {},
   wallets: {},
});
