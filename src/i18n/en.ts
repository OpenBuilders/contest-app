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
			moderator: "Moderator",
			participant: "Participant",
		},
		ok: "Ok",
		done: "Done",
		continue: "Continue",
		soon: "Soon",
		confirmOpenLink: {
			title: "Open Link",
			prompt: "Do you wish to continue to {link}?",
		},
	},
	errors: {
		fetch: "Failed to retrieve information.",
		moderators: {
			fetch: "Failed to retrieve moderation information.",
			join: "Failed to join the moderators list.",
			revoke: "Failed to revoke invitation link.",
			remove: "Failed to remove moderator.",
		},
		participate: {
			submit: "Failed to submit entry.",
		},
		options: {
			delete: "Failed to delete contest.",
			update: "Failed to save settings.",
		},
		placement: {
			update: "Failed to update placement.",
			add: "Failed to add placement.",
			delete: "Failed to delete placement.",
		},
		results: {
			announce: "Failed to announce results.",
		},
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
				create: {
					button: "Create Contest",
				},
				empty: {
					all: {
						title: "No Contests yet",
						subtitle: "Create one or wait for it",
					},
				},
				tabs: {
					all: {
						title: "All",
					},
					yours: {
						title: "Yours",
					},
					saved: {
						title: "Saved",
					},
				},
				topics: {
					open: "Open Contests",
					finished: "Finished",
					saved: "Saved",
					yours: "Yours",
					created: "Created",
					joined: "Joined",
					moderator: "Moderating",
				},
				items: {
					reward: "Reward: {reward}",
					participants: "{count} participants",
				},
				badges: {
					ended: "Ended",
					closed: "Closed",
					open: "Open",
				},
			},
		},
		create: {
			options: {
				image: {
					label: "Set New Photo",
					crop: "Crop Image",
				},
				name: {
					placeholder: "Contest Name",
				},
				description: {
					placeholder: "Tell more about contest",
				},
				instruction: {
					placeholder: "What to submit — links and format",
				},
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
				participants: {
					label: "Participants",
					anonymous: {
						label: "Anonymous",
						anonymous: {
							label: "Anonymous",
						},
						fee: {
							label: "Entry Fee",
							free: "Free",
						},
					},
				},
				fee: {
					label: "Entry Fee",
					free: "Free",
				},
				themes: {
					label: "Themes",
					symbol: {
						label: "Symbol",
					},
				},
			},
			wallet: {
				title: "Connect Wallet",
				description:
					"Connect a TON wallet to receive entry fees from participants.",
				hint: "{commission}% service fee applies to each entry.",
				button: {
					text: "Connect Wallet",
				},
			},
			done: {
				title: "Getting Ready...",
				description:
					"We are preparing your contest and you'll be notified as soon as we process your payment.",
			},
			button: {
				create: {
					text: "Create",
					for: "Create for {amount} TON",
				},
			},
			error: {
				create: "Failed to create contest.",
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
				status: {
					label: "Status",
					closed: "Closed",
				},
				results: {
					label: "Results",
					winners: "Winners",
				},
			},
			description: {
				title: "About Contest",
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
				delete: {
					title: "Delete Contest",
					confirm: "Delete",
					prompt: "Are you sure you want to delete this contest?",
					hint: "Deleted contests cannot be recovered.",
				},
				moderators: {
					title: "Moderators",
					description: "Can view and vote on submissions.",
					empty: {
						text: "No one here yet.",
					},
					buttons: {
						invite: "Invite",
						revoke: "Revoke Link",
					},
					invite: {
						text: "👮‍♂️ Join the moderation team of {title}",
						revoke: {
							title: "Revoke Link",
							prompt:
								"Are you sure you want to revoke the current invite link?",
							button: "Revoke",
						},
						remove: {
							title: "Remove Moderator",
							prompt:
								"Are you sure you want to remove this moderator from the contest?",
							button: "Remove",
						},
					},
				},
				submissions: {
					title: "Submissions",
					empty: {
						title: "No submissions yet.",
						subtitle: "Spread the word!",
						share: "Share contest",
					},
					sort: {
						text: "Sort By",
						votes: "Vote",
						date: "Date",
					},
					export: {
						button: "Export",
						confirm: {
							title: "Export Submissions",
							text: "Do you want to export all submissions as a CSV file?",
							export: "Export",
						},
					},
				},
				results: {
					title: "Results",
					description:
						"Create and arrange placements to announce your contest winners with ease.",
					empty: {
						text: "No placements yet.",
					},
					list: {
						reward: "Reward: {reward}",
						winners: "{count} winners",
					},
					add: {
						button: "Add placement",
					},
					announce: {
						title: "Announce Results",
						prompt:
							"Are you sure you want to announce the results? All participants will be notified.",
						button: "Announce",
					},
				},
				placement: {
					title: "A winner placement",
					delete: {
						button: "Delete Placement",
						prompt:
							"Are you sure you want to delete this placement from the results?",
					},
					participants: {
						title: "Participants",
					},
					name: {
						label: "Placement Name",
						placeholder: "1st Tier",
					},
					prize: {
						label: "Prize",
						hint: "Each participant in this placement will receive this prize.",
					},
					buttons: {
						add: "Add a Placement",
						update: "Update Placement",
					},
					error: {
						failed: "Failed to update placement.",
					},
				},
				options: {
					title: "Options",
					button: "Update Options",
					form: {
						name: {
							label: "Contest Name",
							placeholder: "My Contest",
						},
					},
				},
				settings: {
					button: "Update Options",
				},
			},
			results: {
				empty: "No Winners",
				self: "Your Entry",
			},
			footer: {
				manage: {
					text: "Manage Contest",
				},
				submissions: {
					text: "View Submissions",
				},
				view: {
					text: "View Contest",
				},
				participate: {
					text: "Join for {price}",
				},
				closed: {
					text: "Submissions are closed.",
				},
				submitted: {
					text: "You’ve already submitted an entry.",
				},
				ended: {
					text: "This contest has ended.",
				},
				placements: {
					announced: "Manage Results",
					unannounced: "Set Winners",
					moderators: "Set Moderators",
				},
			},
			admin: {
				results: {
					title: "Results",
				},
				submissions: {
					title: "Submissions",
					today: "Today",
				},
				about: {
					title: "About",
				},
			},
		},
		profile: {
			achievements: {
				title: "Achievements",
				empty: "No achievements yet.",
			},
		},
		contests: {
			empty: "There is nothing here yet.",
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
		moderators: {
			join: {
				prompt: "Do you want to join the moderator team for this contest?",
				button: "Join Moderators",
			},
		},
		anonymous: {
			title: "What Is Anonymous Mode?",
			description:
				"Participant identities are hidden from the public and replaced with fun aliases. The contest owner can still see who joined.",
		},
		participate: {
			title: "Join the contest",
			instruction: {
				title: "What to submit",
				default: "Please provide a link and brief description of your work",
			},
			form: {
				title: "submission",
				description: {
					placeholder: "Links to your work and description",
				},
				button: "Submit",
			},
			profile: "<b>{profile}</b> shown on the submission",
			confirm: {
				title: "Submit",
				prompt: "Do you want to submit your entry for this contest?",
				button: "Submit",
			},
			done: {
				title: "We’ve received your entry",
				description: "Now cross your fingers and wait for the results",
			},
		},
		submission: {
			description: {
				title: "Description",
				empty: "No description provided",
			},
			actions: {
				like: "Like",
				dislike: "Dislike",
				bad: "Bad",
				ok: "Nice",
				great: "Great",
				comment: "Optional Comment",
			},
			submission: {
				description: {
					label: "Description",
				},
				link: {
					label: "Shared Link",
				},
			},
			voters: {
				title: "Already Voted",
				empty: "No one has voted yet.",
			},
			date: "{date} at {time}",
			button: "Open Link",
		},
		settings: {
			title: "Settings",
			language: "Language",
			haptic: "Haptic Feedback",
			click: "Click Me!",
			footer: "$BUILD with <3 for Notcoin",
		},
	},
};

export { dict };
