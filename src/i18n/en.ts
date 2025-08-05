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
		roles: {
			owner: "Owner",
			creator: "Creator",
			participant: "Participant",
		},
		ok: "Ok",
		continue: "Continue",
		soon: "Soon",
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
				title: "My Contests",
				empty: {
					all: {
						title: "You’re not part of any contests yet.",
					},
					joined: {
						title: "You haven’t joined any contests yet.",
						button: "Let's join one!",
					},
					created: {
						title: "You haven’t created any contests yet.",
						button: "Let's create one!",
					},
				},
				tabs: {
					all: {
						title: "All",
					},
					joined: {
						title: "Joined",
					},
					created: {
						title: "Created",
					},
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
				image: {
					crop: "Crop Image",
				},
				name: {
					placeholder: "Contest Name",
				},
				description: {
					placeholder: "Contest Description",
					hint: "You can provide an optional description for your contest.",
				},
			},
			options: {
				contest: {
					label: "Contest",
					duration: {
						label: "Duration",
						options: {
							day: "1 Day",
							week: "1 Week",
							month: "1 Month",
							custom: "Set Custom Time",
						},
						custom: {
							label: "Contest ends in...",
							singular: "{day} day",
							plural: "{day} days",
						},
					},
					prize: {
						label: "Prize Pool",
					},
				},
				visibility: {
					label: "Visibility",
					description:
						"Control who can discover your contest. Make it <clickable id='public'>Public</clickable> so anyone can find and join, and assign a <clickable id='category'>Category</clickable> to help users explore similar contests.",
					public: {
						label: "Public",
					},
					category: {
						label: "Category",
						default: "Not Set",
					},
				},
				participants: {
					label: "Participants",
					description:
						"Enable <clickable id='anonymous'>Anonymous</clickable> mode to keep participant identities hidden. Choose whether joining is <b>Free</b> or requires an <b>Entry Fee</b>.",
					anonymous: {
						label: "Anonymous",
					},
					fee: {
						label: "Entry Fee",
						free: "Free",
					},
				},
				themes: {
					label: "Themes",
				},
			},
			done: {
				title: "Done!",
				description:
					"You can now view your contest, invite moderators, or share it with others.",
				buttons: {
					view: "View Contest",
				},
			},
		},
		contest: {
			header: {
				entry: {
					title: "Entry Fee",
					free: "Free",
				},
				prize: {
					title: "Prize Pool",
					unknown: "Unknown",
				},
				deadline: {
					title: "Deadline",
				},
				share: {
					text: "🏆 Let's join {name}!",
				},
			},
			description: {
				title: "Description",
				empty: "No description provided",
			},
			manage: {
				list: {
					submissions: "Submissions",
					moderators: "Moderators",
					results: "Results",
					options: "Options",
					statistics: "Statistics",
					delete: "Delete Contest",
				},
			},
			footer: {
				manage: {
					text: "Manage Contest",
				},
				view: {
					text: "View Contest",
				},
				participate: {
					text: "Participate",
				},
				closed: {
					text: "Submissions are closed.",
				},
				ended: {
					text: "This contest has ended.",
				},
			},
		},
	},
	components: {
		editor: {
			url: "Please enter the link URL",
		},
		datepicker: {
			notSet: "Not Set",
		},
	},
	modals: {
		create: {
			public: {
				title: "Public or Private?",
				description:
					"Public contests may appear in discovery and can be joined by anyone. Private contests are hidden and only accessible via a unique invite link.",
			},
			category: {
				title: "What Are Categories?",
				description:
					"Categories help users discover contests by topic—like Photography, Writing, or Design. Choose one that best fits your contest so the right audience can find it.",
			},
			anonymous: {
				title: "What Is Anonymous Mode?",
				description:
					"Participant identities are hidden from the public and replaced with fun aliases. Moderators and the contest owner can still see who joined.",
			},
		},
		participate: {
			alias: {
				title: "You're participating as:",
				hint_anonymous: "Contest organizers can see your real profile.",
				hint_normal: "Everyone can see your real profile.",
			},
			form: {
				title: "submission",
				link: {
					placeholder: "Link",
				},
				description: {
					placeholder: "Description",
					hint: "You can provide an optional description for your submission.",
				},
				button: "Submit",
			},
		},
	},
};

export { dict };
