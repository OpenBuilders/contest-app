const dict_fa = {
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
			home: "خانه",
			contests: "مسابقات",
			profile: "پروفایل",
		},
		roles: {
			owner: "مالک",
			moderator: "مدیر",
			participant: "شرکت‌کننده",
		},
		ok: "تأیید",
		done: "انجام شد",
		continue: "ادامه",
		soon: "به‌زودی",
		confirmOpenLink: {
			title: "باز کردن لینک",
			prompt: "می‌خواهید به {link} بروید؟",
		},
	},
	errors: {
		fetch: "دریافت اطلاعات ناموفق بود.",
		moderators: {
			fetch: "دریافت اطلاعات مدیریت ناموفق بود.",
			join: "پیوستن به فهرست مدیران ناموفق بود.",
			revoke: "لغو لینک دعوت ناموفق بود.",
			remove: "حذف مدیر ناموفق بود.",
		},
		participate: {
			submit: "ارسال شرکت ناموفق بود.",
		},
		options: {
			delete: "حذف مسابقه ناموفق بود.",
			update: "ذخیره تنظیمات ناموفق بود.",
		},
		placement: {
			update: "به‌روزرسانی رتبه‌بندی ناموفق بود.",
			add: "افزودن رتبه‌بندی ناموفق بود.",
			delete: "حذف رتبه‌بندی ناموفق بود.",
		},
		results: {
			announce: "اعلام نتایج ناموفق بود.",
		},
	},
	pages: {
		error: {
			title: "خطا",
			description: "یک خطا رخ داد.",
			data: {
				error: {
					title: "مشکلی پیش آمد",
					description:
						"نمی‌توانیم داده‌ها را بارگیری کنیم، لطفاً دوباره تلاش کنید.",
				},
			},
		},
		errorInvalidEnv: {
			title: "محیط نامعتبر",
			description: "این برنامه برای اجرا در محیط تلگرام مینی اپ طراحی شده است.",
		},
		home: {
			contests: {
				create: {
					button: "ایجاد مسابقه",
				},
				empty: {
					all: {
						title: "هنوز مسابقه‌ای وجود ندارد",
						subtitle: "یکی ایجاد کنید یا منتظر بمانید",
					},
				},
				tabs: {
					all: { title: "همه" },
					yours: { title: "مال شما" },
					saved: { title: "ذخیره‌شده" },
				},
				topics: {
					open: "مسابقات باز",
					finished: "پایان‌یافته",
					saved: "ذخیره‌شده",
					yours: "مال شما",
					created: "ساخته‌شده",
					joined: "پیوسته",
				},
				items: {
					reward: "جایزه: {reward}",
					participants: "{count} شرکت‌کننده",
				},
				badges: {
					ended: "پایان‌یافته",
					closed: "بسته‌شده",
					open: "باز",
				},
			},
		},
		create: {
			options: {
				image: { label: "انتخاب عکس جدید", crop: "برش تصویر" },
				name: { placeholder: "نام مسابقه" },
				description: {
					placeholder: "توضیحات",
					hint: "می‌توانید توضیحات اختیاری برای مسابقه خود ارائه دهید.",
				},
				duration: {
					label: "مدت زمان",
					options: {
						day: "۱ روز",
						week: "۱ هفته",
						month: "۱ ماه",
						custom: "زمان دلخواه",
					},
					custom: {
						label: "مسابقه تا...",
						singular: "{day} روز",
						plural: "{day} روز",
					},
				},
				prize: { label: "جایزه کل" },
				participants: {
					label: "شرکت‌کنندگان",
					anonymous: {
						label: "ناشناس",
						anonymous: { label: "ناشناس" },
						fee: { label: "هزینه ورود", free: "رایگان" },
					},
				},
				fee: { label: "هزینه ورود", free: "رایگان" },
				themes: { label: "تم‌ها", symbol: { label: "نماد" } },
			},
			wallet: {
				title: "اتصال کیف پول",
				description:
					"یک کیف پول TON متصل کنید تا هزینه ورود شرکت‌کنندگان دریافت شود.",
				hint: "۵٪ کارمزد خدمات برای هر ورود اعمال می‌شود.",
				button: { text: "اتصال کیف پول" },
			},
			done: {
				title: "انجام شد!",
				description:
					"اکنون می‌توانید مسابقه خود را مشاهده، مدیران را دعوت یا با دیگران به اشتراک بگذارید.",
				buttons: { view: "مشاهده مسابقه" },
			},
			button: { create: { text: "ایجاد" } },
			error: { create: "ایجاد مسابقه ناموفق بود." },
		},
		contest: {
			header: {
				entry: { title: "هزینه ورود", free: "رایگان" },
				prize: { title: "جایزه کل", unknown: "نامشخص" },
				deadline: { title: "مهلت" },
				share: { text: "🏆 بیایید در {name} شرکت کنیم!" },
				status: { label: "وضعیت", closed: "بسته‌شده" },
				results: { label: "نتایج", winners: "برندگان" },
			},
			description: { title: "درباره مسابقه", empty: "توضیحی ارائه نشده" },
			manage: {
				list: {
					submissions: "ارسال‌ها",
					moderators: "مدیران",
					results: "نتایج",
					options: "گزینه‌ها",
					statistics: "آمار",
					delete: "حذف مسابقه",
				},
				delete: {
					title: "حذف مسابقه",
					confirm: "حذف",
					prompt: "آیا مطمئن هستید که می‌خواهید این مسابقه را حذف کنید؟",
					hint: "مسابقات حذف‌شده قابل بازیابی نیستند.",
				},
				moderators: {
					title: "مدیران",
					empty: {
						text: "مدیران می‌توانند ارسال‌ها را مشاهده و رأی دهند.",
						button: "بیایید مدیران را دعوت کنیم!",
					},
					invite: {
						text: "👮‍♂️ به تیم مدیریت {title} بپیوندید",
						revoke: {
							title: "لغو لینک",
							prompt: "آیا مطمئن هستید که می‌خواهید لینک دعوت فعلی را لغو کنید؟",
							button: "لغو",
						},
						remove: {
							title: "حذف مدیر",
							prompt:
								"آیا مطمئن هستید که می‌خواهید این مدیر را از مسابقه حذف کنید؟",
							button: "حذف",
						},
					},
				},
				submissions: {
					title: "ارسال‌ها",
					empty: { text: "هنوز ارسالی وجود ندارد. اطلاع‌رسانی کنید!" },
				},
				results: {
					title: "نتایج",
					description: "ایجاد و مرتب‌سازی رتبه‌بندی‌ها برای اعلام برندگان مسابقه.",
					empty: { text: "هنوز رتبه‌ای وجود ندارد." },
					list: { reward: "جایزه: {reward}", winners: "{count} برنده" },
					add: { button: "افزودن رتبه" },
					announce: {
						title: "اعلام نتایج",
						prompt:
							"آیا مطمئن هستید که می‌خواهید نتایج را اعلام کنید؟ تمام شرکت‌کنندگان مطلع خواهند شد.",
						button: "اعلام",
					},
				},
				placement: {
					title: "یک رتبه برنده",
					delete: {
						button: "حذف رتبه",
						prompt:
							"آیا مطمئن هستید که می‌خواهید این رتبه را از نتایج حذف کنید؟",
					},
					participants: { title: "شرکت‌کنندگان" },
					name: { label: "نام رتبه", placeholder: "رده اول" },
					prize: {
						label: "جایزه",
						hint: "هر شرکت‌کننده در این رتبه این جایزه را دریافت می‌کند.",
					},
					buttons: { add: "افزودن رتبه", update: "به‌روزرسانی رتبه" },
					error: { failed: "به‌روزرسانی رتبه ناموفق بود." },
				},
				options: {
					title: "گزینه‌ها",
					button: "به‌روزرسانی گزینه‌ها",
					form: { name: { label: "نام مسابقه", placeholder: "مسابقه من" } },
				},
				settings: {
					title: "تنظیمات",
					button: "به‌روزرسانی گزینه‌ها",
					tabs: {
						options: { title: "گزینه‌ها" },
						moderators: { title: "مدیران" },
					},
				},
			},
			results: { empty: "بدون برنده", self: "ارسال شما" },
			footer: {
				manage: { text: "مدیریت مسابقه" },
				submissions: { text: "مشاهده ارسال‌ها" },
				view: { text: "مشاهده مسابقه" },
				participate: { text: "شرکت با {price}" },
				closed: { text: "ارسال‌ها بسته شده‌اند." },
				submitted: { text: "شما قبلاً یک ارسال ثبت کرده‌اید." },
				ended: { text: "این مسابقه به پایان رسیده است." },
				placements: { announced: "مدیریت نتایج", unannounced: "تنظیم برندگان" },
			},
			admin: {
				results: { title: "نتایج" },
				submissions: { title: "ارسال‌ها", today: "امروز" },
				about: { title: "درباره" },
			},
		},
		profile: {
			achievements: { title: "دستاوردها", empty: "هنوز دستاوردی وجود ندارد." },
		},
		contests: { empty: "هنوز چیزی وجود ندارد." },
	},
	components: {
		editor: { url: "لطفاً لینک را وارد کنید" },
		datepicker: { notSet: "تنظیم نشده" },
	},
	modals: {
		moderators: {
			join: {
				prompt: "می‌خواهید به تیم مدیران این مسابقه بپیوندید؟",
				button: "پیوستن به مدیران",
			},
		},
		anonymous: {
			title: "حالت ناشناس چیست؟",
			description:
				"هویت شرکت‌کنندگان از عموم مخفی می‌شود و با نام مستعار جایگزین می‌گردد. مالک مسابقه هنوز می‌تواند ببیند چه کسی پیوسته است.",
		},
		participate: {
			alias: {
				title: "شما با هویت:",
				hint_anonymous: "سازندگان مسابقه می‌توانند پروفایل واقعی شما را ببینند.",
				hint_normal: "همه می‌توانند پروفایل واقعی شما را ببینند.",
			},
			form: {
				title: "ارسال",
				link: { placeholder: "لینک" },
				description: {
					placeholder: "توضیحات",
					hint: "می‌توانید توضیحات اختیاری برای ارسال خود ارائه دهید.",
				},
				button: "ارسال",
			},
		},
		submission: {
			description: { title: "توضیحات", empty: "توضیحی ارائه نشده" },
			actions: { like: "پسندیدم", dislike: "نپسندیدم" },
			submission: {
				description: { label: "توضیحات" },
				link: { label: "لینک به اشتراک‌گذاری" },
			},
			date: "{date} در {time}",
			button: "باز کردن لینک",
		},
		settings: {
			title: "تنظیمات",
			language: "زبان",
			haptic: "بازخورد لمسی",
			click: "کلیک کن!",
			footer: "$BUILD با <3 برای Notcoin",
		},
	},
};

export { dict_fa };
