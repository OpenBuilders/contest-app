const dict = {
	locales: {
		en: "English",
		fa: "فارسی",
		ar: "العربية",
		de: "Deutsch",
		ru: "Русский",
		hi: "हिन्दी",
	},
	general: {
		bottombar: {
			home: "Home",
			contests: "Contests",
			profile: "Profile",
		},
		continue: "Continue",
	},
	pages: {
		error: {
			title: "Error",
			description: "An error occurred.",
			data: {
				error: {
					title: "Something went wrong",
					description: "We couldn’t fetch data, try reloading the app.",
				},
			},
		},
		errorInvalidEnv: {
			title: "Invalid Environment",
			description:
				"This app is designed to run in Telegram Mini Apps environment.",
		},
		home: {
			contests: {
				empty: {
					title: "You’re not part of any contests yet.",
					create: "Let's create one!",
				},
			},
		},
		create: {
			intro: {
				title: "What is a Contest?",
				description:
					"Contests are interactive events where creators set challenges, participants compete, and moderators pick winners—with prizes. They’re a fun way to engage your community, reward talent, and grow your audience.",
				button: "Create Contest",
			},
			basic: {
				image: {},
				name: {
					placeholder: "Contest Name",
				},
				description: {
					placeholder: "Contest Description",
					hint: "You can provide an optional description for your contest.",
				},
			},
		},
	},
	components: {
		editor: {
			url: "Please enter the link URL",
		},
	},
	modals: {},
};

export { dict };
