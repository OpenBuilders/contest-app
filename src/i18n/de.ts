const dict_de = {
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
			home: "Startseite",
			contests: "Wettbewerbe",
			profile: "Profil",
		},
		roles: {
			owner: "Eigentümer",
			moderator: "Moderator",
			participant: "Teilnehmer",
		},
		ok: "Ok",
		done: "Fertig",
		continue: "Fortfahren",
		soon: "Bald",
		confirmOpenLink: {
			title: "Link öffnen",
			prompt: "Möchten Sie {link} öffnen?",
		},
	},
	errors: {
		fetch: "Fehler beim Abrufen der Informationen.",
		moderators: {
			fetch: "Fehler beim Abrufen der Moderationsinformationen.",
			join: "Fehler beim Beitritt zur Moderatorenliste.",
			revoke: "Fehler beim Widerrufen des Einladungslinks.",
			remove: "Fehler beim Entfernen des Moderators.",
		},
		participate: {
			submit: "Fehler beim Einreichen des Beitrags.",
		},
		options: {
			delete: "Fehler beim Löschen des Wettbewerbs.",
			update: "Fehler beim Speichern der Einstellungen.",
		},
		placement: {
			update: "Fehler beim Aktualisieren der Platzierung.",
			add: "Fehler beim Hinzufügen der Platzierung.",
			delete: "Fehler beim Löschen der Platzierung.",
		},
		results: {
			announce: "Fehler beim Bekanntgeben der Ergebnisse.",
		},
	},
	pages: {
		error: {
			title: "Fehler",
			description: "Ein Fehler ist aufgetreten.",
			data: {
				error: {
					title: "Etwas ist schiefgelaufen",
					description:
						"Daten konnten nicht abgerufen werden, bitte App neu laden.",
				},
			},
		},
		errorInvalidEnv: {
			title: "Ungültige Umgebung",
			description:
				"Diese App ist für die Ausführung in der Telegram Mini Apps-Umgebung konzipiert.",
		},
		home: {
			contests: {
				create: { button: "Wettbewerb erstellen" },
				empty: {
					all: {
						title: "Noch keine Wettbewerbe",
						subtitle: "Erstellen Sie einen oder warten Sie darauf",
					},
				},
				tabs: {
					all: { title: "Alle" },
					yours: { title: "Deine" },
					saved: { title: "Gespeichert" },
				},
				topics: {
					open: "Offene Wettbewerbe",
					finished: "Abgeschlossen",
					saved: "Gespeichert",
					yours: "Deine",
					created: "Erstellt",
					joined: "Beigetreten",
				},
				items: {
					reward: "Belohnung: {reward}",
					participants: "{count} Teilnehmer",
				},
				badges: { ended: "Beendet", closed: "Geschlossen", open: "Offen" },
			},
		},
		create: {
			options: {
				image: { label: "Neues Bild setzen", crop: "Bild zuschneiden" },
				name: { placeholder: "Wettbewerbsname" },
				description: {
					placeholder: "Erzähl mehr über den Wettbewerb",
				},
				instruction: {
					placeholder: "Was einzureichen ist — Links und Format",
				},
				duration: {
					label: "Dauer",
					options: {
						day: "1 Tag",
						week: "1 Woche",
						month: "1 Monat",
						custom: "Benutzerdefinierte Zeit setzen",
					},
					custom: {
						label: "Wettbewerb endet in...",
						singular: "{day} Tag",
						plural: "{day} Tage",
					},
				},
				prize: { label: "Preispool" },
				participants: {
					label: "Teilnehmer",
					anonymous: {
						label: "Anonym",
						anonymous: { label: "Anonym" },
						fee: { label: "Teilnahmegebühr", free: "Kostenlos" },
					},
				},
				fee: { label: "Teilnahmegebühr", free: "Kostenlos" },
				themes: { label: "Themen", symbol: { label: "Symbol" } },
			},
			wallet: {
				title: "Wallet verbinden",
				description:
					"Verbinden Sie ein TON-Wallet, um Teilnahmegebühren von Teilnehmern zu erhalten.",
				hint: "Auf jede Teilnahme fällt eine Servicegebühr von 5 % an.",
				button: { text: "Wallet verbinden" },
			},
			done: {
				title: "Fertig!",
				description:
					"Sie können nun Ihren Wettbewerb ansehen, Moderatoren einladen oder mit anderen teilen.",
				buttons: { view: "Wettbewerb ansehen" },
			},
			button: { create: { text: "Erstellen" } },
			error: { create: "Erstellen des Wettbewerbs fehlgeschlagen." },
		},
		contest: {
			header: {
				entry: { title: "Teilnahmegebühr", free: "Kostenlos" },
				prize: { title: "Preispool", unknown: "Unbekannt" },
				deadline: { title: "Deadline" },
				share: { text: "🏆 Lass uns bei {name} mitmachen!" },
				status: { label: "Status", closed: "Geschlossen" },
				results: { label: "Ergebnisse", winners: "Gewinner" },
			},
			description: {
				title: "Über den Wettbewerb",
				empty: "Keine Beschreibung angegeben",
			},
			manage: {
				list: {
					submissions: "Einreichungen",
					moderators: "Moderatoren",
					results: "Ergebnisse",
					options: "Optionen",
					statistics: "Statistiken",
					delete: "Wettbewerb löschen",
				},
				delete: {
					title: "Wettbewerb löschen",
					confirm: "Löschen",
					prompt:
						"Sind Sie sicher, dass Sie diesen Wettbewerb löschen möchten?",
					hint: "Gelöschte Wettbewerbe können nicht wiederhergestellt werden.",
				},
				moderators: {
					title: "Moderatoren",
					empty: {
						text: "Moderatoren können Einreichungen sehen und bewerten.",
						button: "Moderatoren einladen!",
					},
					invite: {
						text: "👮‍♂️ Trete dem Moderationsteam von {title} bei",
						revoke: {
							title: "Link widerrufen",
							prompt: "Möchten Sie den aktuellen Einladungslink widerrufen?",
							button: "Widerrufen",
						},
						remove: {
							title: "Moderator entfernen",
							prompt: "Möchten Sie diesen Moderator wirklich entfernen?",
							button: "Entfernen",
						},
					},
				},
				submissions: {
					title: "Einreichungen",
					empty: {
						text: "Noch keine Einreichungen. Verbreiten Sie die Nachricht!",
					},
				},
				results: {
					title: "Ergebnisse",
					description:
						"Erstellen und ordnen Sie Platzierungen, um die Gewinner Ihres Wettbewerbs einfach anzukündigen.",
					empty: { text: "Noch keine Platzierungen." },
					list: { reward: "Belohnung: {reward}", winners: "{count} Gewinner" },
					add: { button: "Platzierung hinzufügen" },
					announce: {
						title: "Ergebnisse ankündigen",
						prompt:
							"Sind Sie sicher, dass Sie die Ergebnisse ankündigen möchten? Alle Teilnehmer werden benachrichtigt.",
						button: "Ankündigen",
					},
				},
				placement: {
					title: "Ein Gewinnerplatz",
					delete: {
						button: "Platzierung löschen",
						prompt:
							"Sind Sie sicher, dass Sie diese Platzierung aus den Ergebnissen löschen möchten?",
					},
					participants: { title: "Teilnehmer" },
					name: { label: "Platzierungsname", placeholder: "1. Rang" },
					prize: {
						label: "Preis",
						hint: "Jeder Teilnehmer dieser Platzierung erhält diesen Preis.",
					},
					buttons: {
						add: "Platzierung hinzufügen",
						update: "Platzierung aktualisieren",
					},
					error: { failed: "Platzierung konnte nicht aktualisiert werden." },
				},
				options: {
					title: "Optionen",
					button: "Optionen aktualisieren",
					form: {
						name: { label: "Wettbewerbsname", placeholder: "Mein Wettbewerb" },
					},
				},
				settings: {
					title: "Einstellungen",
					button: "Optionen aktualisieren",
					tabs: {
						options: { title: "Optionen" },
						moderators: { title: "Moderatoren" },
					},
				},
			},
			results: { empty: "Keine Gewinner", self: "Ihre Einreichung" },
			footer: {
				manage: { text: "Wettbewerb verwalten" },
				submissions: { text: "Einreichungen ansehen" },
				view: { text: "Wettbewerb ansehen" },
				participate: { text: "Teilnehmen für {price}" },
				closed: { text: "Einreichungen sind geschlossen." },
				submitted: { text: "Sie haben bereits eine Einreichung getätigt." },
				ended: { text: "Dieser Wettbewerb ist beendet." },
				placements: {
					announced: "Ergebnisse verwalten",
					unannounced: "Gewinner festlegen",
				},
			},
			admin: {
				results: { title: "Ergebnisse" },
				submissions: { title: "Einreichungen", today: "Heute" },
				about: { title: "Über" },
			},
		},
		profile: {
			achievements: { title: "Erfolge", empty: "Noch keine Erfolge." },
		},
		contests: { empty: "Hier ist noch nichts." },
	},
	components: {
		editor: { url: "Bitte geben Sie die URL ein" },
		datepicker: { notSet: "Nicht gesetzt" },
	},
	modals: {
		moderators: {
			join: {
				prompt: "Möchten Sie dem Moderationsteam dieses Wettbewerbs beitreten?",
				button: "Moderatoren beitreten",
			},
		},
		anonymous: {
			title: "Was ist der anonyme Modus?",
			description:
				"Teilnehmeridentitäten werden der Öffentlichkeit verborgen und durch lustige Aliasnamen ersetzt. Der Wettbewerbseigentümer kann weiterhin sehen, wer teilgenommen hat.",
		},
		participate: {
			title: "Am Wettbewerb teilnehmen",
			instruction: {
				title: "Was einreichen",
				default:
					"Bitte gib einen Link und eine kurze Beschreibung deiner Arbeit an",
			},
			form: {
				title: "Einreichung",
				description: {
					placeholder: "Links zu deiner Arbeit und Beschreibung",
				},
				button: "Einreichen",
			},
			profile: "<b>{profile}</b> wird bei der Einreichung angezeigt",
			confirm: {
				title: "Einreichen",
				prompt: "Möchtest du deinen Beitrag für diesen Wettbewerb einreichen?",
				button: "Einreichen",
			},
			done: {
				title: "Wir haben deinen Beitrag erhalten",
				description: "Jetzt drücke die Daumen und warte auf die Ergebnisse",
			},
		},
		submission: {
			description: {
				title: "Beschreibung",
				empty: "Keine Beschreibung angegeben",
			},
			actions: { like: "Gefällt mir", dislike: "Gefällt mir nicht" },
			submission: {
				description: { label: "Beschreibung" },
				link: { label: "Geteilter Link" },
			},
			date: "{date} um {time}",
			button: "Link öffnen",
		},
		settings: {
			title: "Einstellungen",
			language: "Sprache",
			haptic: "Haptisches Feedback",
			click: "Klicke mich!",
			footer: "$BUILD mit <3 für Notcoin",
		},
	},
};

export { dict_de };
