const dict_hi = {
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
			home: "होम",
			contests: "प्रतियोगिताएँ",
			profile: "प्रोफ़ाइल",
		},
		roles: {
			owner: "स्वामी",
			moderator: "संपादक",
			participant: "प्रतिभागी",
		},
		ok: "ठीक है",
		continue: "जारी रखें",
		soon: "शीघ्र",
		confirmOpenLink: {
			title: "लिंक खोलें",
			prompt: "क्या आप {link} पर जाना चाहते हैं?",
		},
	},
	pages: {
		error: {
			title: "त्रुटि",
			description: "एक त्रुटि हुई।",
			data: {
				error: {
					title: "कुछ गलत हुआ",
					description: "डेटा लाने में असमर्थ, कृपया ऐप को पुनः लोड करें।",
				},
			},
		},
		errorInvalidEnv: {
			title: "अमान्य पर्यावरण",
			description:
				"यह ऐप Telegram Mini Apps पर्यावरण में चलाने के लिए डिज़ाइन किया गया है।",
		},
		home: {
			contests: {
				create: { button: "प्रतियोगिता बनाएं" },
				empty: {
					all: {
						title: "अभी कोई प्रतियोगिता नहीं",
						subtitle: "एक बनाएँ या प्रतीक्षा करें",
					},
				},
				tabs: {
					all: { title: "सभी" },
					yours: { title: "आपकी" },
					saved: { title: "सहेजी गई" },
				},
				topics: {
					open: "खुली प्रतियोगिताएँ",
					finished: "समाप्त",
					saved: "सहेजी गई",
					yours: "आपकी",
				},
				items: { reward: "इनाम: {reward}", participants: "{count} प्रतिभागी" },
				badges: { ended: "समाप्त", closed: "बंद", open: "खुला" },
			},
		},
		create: {
			options: {
				image: { label: "नई फोटो सेट करें", crop: "इमेज क्रॉप करें" },
				name: { placeholder: "प्रतियोगिता का नाम" },
				description: {
					placeholder: "विवरण",
					hint: "आप अपनी प्रतियोगिता के लिए वैकल्पिक विवरण दे सकते हैं।",
				},
				duration: {
					label: "अवधि",
					options: {
						day: "1 दिन",
						week: "1 सप्ताह",
						month: "1 महीना",
						custom: "कस्टम समय सेट करें",
					},
					custom: {
						label: "प्रतियोगिता समाप्त होगी...",
						singular: "{day} दिन",
						plural: "{day} दिन",
					},
				},
				prize: { label: "इनाम राशि" },
				participants: {
					label: "प्रतिभागी",
					anonymous: {
						label: "गुमनाम",
						anonymous: { label: "गुमनाम" },
						fee: { label: "प्रवेश शुल्क", free: "मुफ़्त" },
					},
				},
				fee: { label: "प्रवेश शुल्क", free: "मुफ़्त" },
				themes: { label: "थीम", symbol: { label: "चिह्न" } },
			},
			wallet: {
				title: "वॉलेट कनेक्ट करें",
				description:
					"प्रतिभागियों से प्रवेश शुल्क प्राप्त करने के लिए एक TON वॉलेट कनेक्ट करें।",
				hint: "प्रत्येक प्रवेश पर 5% सेवा शुल्क लागू होता है।",
				button: { text: "वॉलेट कनेक्ट करें" },
			},
			done: {
				title: "पूर्ण!",
				description:
					"अब आप अपनी प्रतियोगिता देख सकते हैं, मॉडरेटर आमंत्रित कर सकते हैं, या इसे दूसरों के साथ साझा कर सकते हैं।",
				buttons: { view: "प्रतियोगिता देखें" },
			},
			button: { create: { text: "बनाएँ" } },
			error: { create: "प्रतियोगिता बनाने में विफल।" },
		},
		contest: {
			header: {
				entry: { title: "प्रवेश शुल्क", free: "मुफ़्त" },
				prize: { title: "इनाम राशि", unknown: "अज्ञात" },
				deadline: { title: "समय सीमा" },
				share: { text: "🏆 चलो {name} में शामिल हों!" },
				status: { label: "स्थिति", closed: "बंद" },
				results: { label: "परिणाम", winners: "विजेता" },
			},
			description: {
				title: "प्रतियोगिता के बारे में",
				empty: "कोई विवरण नहीं दिया गया",
			},
			manage: {
				list: {
					submissions: "सबमिशन",
					moderators: "मॉडरेटर",
					results: "परिणाम",
					options: "विकल्प",
					statistics: "सांख्यिकी",
					delete: "प्रतियोगिता हटाएँ",
				},
				delete: {
					title: "प्रतियोगिता हटाएँ",
					confirm: "हटाएँ",
					prompt: "क्या आप निश्चित रूप से इस प्रतियोगिता को हटाना चाहते हैं?",
					hint: "हटाई गई प्रतियोगिताएँ पुनर्प्राप्त नहीं की जा सकतीं।",
				},
				moderators: {
					title: "मॉडरेटर",
					empty: {
						text: "मॉडरेटर सबमिशन देख और वोट कर सकते हैं।",
						button: "चलो मॉडरेटर आमंत्रित करें!",
					},
					invite: {
						text: "👮‍♂️ {title} की मॉडरेशन टीम में शामिल हों",
						revoke: {
							title: "लिंक रद्द करें",
							prompt: "क्या आप सुनिश्चित हैं कि वर्तमान आमंत्रण लिंक रद्द करना चाहते हैं?",
							button: "रद्द करें",
						},
						remove: {
							title: "मॉडरेटर हटाएँ",
							prompt:
								"क्या आप सुनिश्चित हैं कि इस मॉडरेटर को प्रतियोगिता से हटाना चाहते हैं?",
							button: "हटाएँ",
						},
					},
				},
				submissions: {
					title: "सबमिशन",
					empty: { text: "अभी कोई सबमिशन नहीं है। प्रचार करें!" },
				},
				results: {
					title: "परिणाम",
					description:
						"आसानी से विजेताओं की घोषणा के लिए प्लेसमेंट बनाएँ और व्यवस्थित करें।",
					empty: { text: "अभी कोई प्लेसमेंट नहीं है।" },
					list: { reward: "इनाम: {reward}", winners: "{count} विजेता" },
					add: { button: "प्लेसमेंट जोड़ें" },
					announce: {
						title: "परिणाम घोषित करें",
						prompt:
							"क्या आप सुनिश्चित हैं कि परिणाम घोषित करना चाहते हैं? सभी प्रतिभागियों को सूचित किया जाएगा।",
						button: "परिणाम घोषित करें",
					},
				},
				placement: {
					title: "विजेता प्लेसमेंट",
					delete: {
						button: "प्लेसमेंट हटाएँ",
						prompt: "क्या आप सुनिश्चित हैं कि इस प्लेसमेंट को परिणामों से हटाना चाहते हैं?",
					},
					participants: { title: "प्रतिभागी" },
					name: { label: "प्लेसमेंट का नाम", placeholder: "पहला स्तर" },
					prize: {
						label: "इनाम",
						hint: "इस प्लेसमेंट में प्रत्येक प्रतिभागी यह इनाम प्राप्त करेगा।",
					},
					buttons: { add: "प्लेसमेंट जोड़ें", update: "प्लेसमेंट अपडेट करें" },
					error: { failed: "प्लेसमेंट अपडेट करने में विफल।" },
				},
				options: {
					title: "विकल्प",
					button: "विकल्प अपडेट करें",
					form: {
						name: { label: "प्रतियोगिता का नाम", placeholder: "मेरी प्रतियोगिता" },
					},
				},
				settings: {
					title: "सेटिंग्स",
					button: "विकल्प अपडेट करें",
					tabs: {
						options: { title: "विकल्प" },
						moderators: { title: "मॉडरेटर" },
					},
				},
			},
			results: { empty: "कोई विजेता नहीं", self: "आपकी प्रविष्टि" },
			footer: {
				manage: { text: "प्रतियोगिता प्रबंधित करें" },
				submissions: { text: "सबमिशन देखें" },
				view: { text: "प्रतियोगिता देखें" },
				participate: { text: "{price} में शामिल हों" },
				closed: { text: "सबमिशन बंद हैं।" },
				submitted: { text: "आपने पहले ही एक प्रविष्टि सबमिट की है।" },
				ended: { text: "यह प्रतियोगिता समाप्त हो गई है।" },
				placements: {
					announced: "परिणाम प्रबंधित करें",
					unannounced: "विजेताओं को सेट करें",
				},
			},
			admin: {
				results: { title: "परिणाम" },
				submissions: { title: "सबमिशन", today: "आज" },
				about: { title: "के बारे में" },
			},
		},
		profile: {
			achievements: { title: "उपलब्धियां", empty: "अभी कोई उपलब्धियां नहीं।" },
		},
		contests: { empty: "यहाँ अभी कुछ नहीं है।" },
	},
	components: {
		editor: { url: "कृपया लिंक URL दर्ज करें" },
		datepicker: { notSet: "सेट नहीं किया गया" },
	},
	modals: {
		moderators: {
			join: {
				prompt: "क्या आप इस प्रतियोगिता की मॉडरेटर टीम में शामिल होना चाहते हैं?",
				button: "मॉडरेटर में शामिल हों",
			},
		},
		anonymous: {
			title: "अनाम मोड क्या है?",
			description:
				"प्रतिभागियों की पहचान सार्वजनिक से छिपी होती है और मजेदार उपनाम से बदल दी जाती है। प्रतियोगिता का मालिक अभी भी देख सकता है कि कौन शामिल हुआ।",
		},
		participate: {
			alias: {
				title: "आप के रूप में भाग ले रहे हैं:",
				hint_anonymous: "प्रतियोगिता आयोजक आपका असली प्रोफ़ाइल देख सकते हैं।",
				hint_normal: "सभी आपका असली प्रोफ़ाइल देख सकते हैं।",
			},
			form: {
				title: "सबमिशन",
				link: { placeholder: "लिंक" },
				description: {
					placeholder: "विवरण",
					hint: "आप अपनी सबमिशन के लिए वैकल्पिक विवरण दे सकते हैं।",
				},
				button: "सबमिट करें",
			},
		},
		submission: {
			description: { title: "विवरण", empty: "कोई विवरण प्रदान नहीं किया गया" },
			actions: { like: "पसंद करें", dislike: "नापसंद" },
			submission: {
				description: { label: "विवरण" },
				link: { label: "साझा लिंक" },
			},
			date: "{date} को {time}",
			button: "लिंक खोलें",
		},
		settings: {
			title: "सेटिंग्स",
			language: "भाषा",
			haptic: "हैप्टिक फीडबैक",
			click: "मुझ पर क्लिक करें!",
			footer: "$BUILD <3 के साथ Notcoin के लिए",
		},
	},
};

export { dict_hi };
