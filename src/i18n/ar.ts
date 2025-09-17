const dict_ar = {
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
			home: "الرئيسية",
			contests: "المسابقات",
			profile: "الملف الشخصي",
		},
		roles: {
			owner: "المالك",
			moderator: "المشرف",
			participant: "المشارك",
		},
		ok: "موافق",
		done: "تم",
		continue: "متابعة",
		soon: "قريباً",
		confirmOpenLink: {
			title: "فتح الرابط",
			prompt: "هل ترغب في المتابعة إلى {link}؟",
		},
	},
	errors: {
		fetch: "فشل في جلب المعلومات.",
		moderators: {
			fetch: "فشل في جلب معلومات الإشراف.",
			join: "فشل في الانضمام إلى قائمة المشرفين.",
			revoke: "فشل في إلغاء رابط الدعوة.",
			remove: "فشل في إزالة المشرف.",
		},
		participate: {
			submit: "فشل في إرسال المشاركة.",
		},
		options: {
			delete: "فشل في حذف المسابقة.",
			update: "فشل في حفظ الإعدادات.",
		},
		placement: {
			update: "فشل في تحديث الترتيب.",
			add: "فشل في إضافة الترتيب.",
			delete: "فشل في حذف الترتيب.",
		},
		results: {
			announce: "فشل في إعلان النتائج.",
		},
	},
	pages: {
		error: {
			title: "خطأ",
			description: "حدث خطأ.",
			data: {
				error: {
					title: "حدث شيء ما",
					description: "تعذر جلب البيانات، حاول إعادة تحميل التطبيق.",
				},
			},
		},
		errorInvalidEnv: {
			title: "بيئة غير صالحة",
			description:
				"تم تصميم هذا التطبيق للعمل في بيئة تطبيقات Telegram المصغرة.",
		},
		home: {
			contests: {
				create: { button: "إنشاء مسابقة" },
				empty: {
					all: {
						title: "لا توجد مسابقات بعد",
						subtitle: "قم بإنشاء واحدة أو انتظر ظهورها",
					},
				},
				tabs: {
					all: { title: "الكل" },
					yours: { title: "الخاصة بك" },
					saved: { title: "المحفوظة" },
				},
				topics: {
					open: "مسابقات مفتوحة",
					finished: "منتهية",
					saved: "محفوظة",
					yours: "الخاصة بك",
					created: "تم الإنشاء",
					joined: "تم الانضمام",
				},
				items: {
					reward: "الجائزة: {reward}",
					participants: "{count} مشارك",
				},
				badges: {
					ended: "منتهية",
					closed: "مغلقة",
					open: "مفتوحة",
				},
			},
		},
		create: {
			options: {
				image: { label: "تعيين صورة جديدة", crop: "قص الصورة" },
				name: { placeholder: "اسم المسابقة" },
				description: {
					placeholder: "الوصف",
					hint: "يمكنك إضافة وصف اختياري للمسابقة.",
				},
				duration: {
					label: "المدة",
					options: {
						day: "يوم واحد",
						week: "أسبوع واحد",
						month: "شهر واحد",
						custom: "تعيين وقت مخصص",
					},
					custom: {
						label: "تنتهي المسابقة في...",
						singular: "{day} يوم",
						plural: "{day} أيام",
					},
				},
				prize: { label: "صندوق الجوائز" },
				participants: {
					label: "المشاركون",
					anonymous: {
						label: "مجهول",
						anonymous: { label: "مجهول" },
						fee: { label: "رسوم المشاركة", free: "مجاني" },
					},
				},
				fee: { label: "رسوم المشاركة", free: "مجاني" },
				themes: { label: "الثيمات", symbol: { label: "رمز" } },
			},
			wallet: {
				title: "ربط المحفظة",
				description: "قم بربط محفظة TON لاستلام رسوم المشاركة من المستخدمين.",
				hint: "يتم تطبيق رسوم خدمة 5٪ على كل مشاركة.",
				button: { text: "ربط المحفظة" },
			},
			done: {
				title: "تم!",
				description:
					"يمكنك الآن عرض مسابقتك، دعوة المشرفين، أو مشاركتها مع الآخرين.",
				buttons: { view: "عرض المسابقة" },
			},
			button: { create: { text: "إنشاء" } },
			error: { create: "فشل إنشاء المسابقة." },
		},
		contest: {
			header: {
				entry: { title: "رسوم المشاركة", free: "مجاني" },
				prize: { title: "صندوق الجوائز", unknown: "غير معروف" },
				deadline: { title: "الموعد النهائي" },
				share: { text: "🏆 هيا نشارك في {name}!" },
				status: { label: "الحالة", closed: "مغلقة" },
				results: { label: "النتائج", winners: "الفائزون" },
			},
			description: { title: "عن المسابقة", empty: "لم يتم توفير وصف" },
			manage: {
				list: {
					submissions: "الإرسالات",
					moderators: "المشرفون",
					results: "النتائج",
					options: "الخيارات",
					statistics: "الإحصائيات",
					delete: "حذف المسابقة",
				},
				delete: {
					title: "حذف المسابقة",
					confirm: "حذف",
					prompt: "هل أنت متأكد أنك تريد حذف هذه المسابقة؟",
					hint: "لا يمكن استعادة المسابقات المحذوفة.",
				},
				moderators: {
					title: "المشرفون",
					empty: {
						text: "يمكن للمشرفين عرض الإرسالات والتصويت عليها.",
						button: "هيا ندعو المشرفين!",
					},
					invite: {
						text: "👮‍♂️ انضم إلى فريق إدارة {title}",
						revoke: {
							title: "إلغاء الرابط",
							prompt: "هل أنت متأكد أنك تريد إلغاء رابط الدعوة الحالي؟",
							button: "إلغاء",
						},
						remove: {
							title: "إزالة مشرف",
							prompt: "هل أنت متأكد أنك تريد إزالة هذا المشرف من المسابقة؟",
							button: "إزالة",
						},
					},
				},
				submissions: {
					title: "الإرسالات",
					empty: { text: "لا توجد إرسالات بعد. انشر الخبر!" },
				},
				results: {
					title: "النتائج",
					description: "قم بإنشاء وترتيب المراتب لإعلان الفائزين بسهولة.",
					empty: { text: "لا توجد مراتب بعد." },
					list: { reward: "الجائزة: {reward}", winners: "{count} فائز" },
					add: { button: "إضافة مرتبة" },
					announce: {
						title: "إعلان النتائج",
						prompt:
							"هل أنت متأكد أنك تريد إعلان النتائج؟ سيتم إعلام جميع المشاركين.",
						button: "إعلان النتائج",
					},
				},
				placement: {
					title: "مرتبة فائز",
					delete: {
						button: "حذف المرتبة",
						prompt: "هل أنت متأكد أنك تريد حذف هذه المرتبة من النتائج؟",
					},
					participants: { title: "المشاركون" },
					name: { label: "اسم المرتبة", placeholder: "المستوى الأول" },
					prize: {
						label: "الجائزة",
						hint: "سيحصل كل مشارك في هذه المرتبة على هذه الجائزة.",
					},
					buttons: { add: "إضافة مرتبة", update: "تحديث المرتبة" },
					error: { failed: "فشل تحديث المرتبة." },
				},
				options: {
					title: "الخيارات",
					button: "تحديث الخيارات",
					form: { name: { label: "اسم المسابقة", placeholder: "مسابقتي" } },
				},
				settings: {
					title: "الإعدادات",
					button: "تحديث الخيارات",
					tabs: {
						options: { title: "الخيارات" },
						moderators: { title: "المشرفون" },
					},
				},
			},
			results: { empty: "لا يوجد فائزون", self: "إرسالك" },
			footer: {
				manage: { text: "إدارة المسابقة" },
				submissions: { text: "عرض الإرسالات" },
				view: { text: "عرض المسابقة" },
				participate: { text: "الانضمام مقابل {price}" },
				closed: { text: "الإرسالات مغلقة." },
				submitted: { text: "لقد قمت بالفعل بإرسال مشاركة." },
				ended: { text: "انتهت هذه المسابقة." },
				placements: {
					announced: "إدارة النتائج",
					unannounced: "تحديد الفائزين",
				},
			},
			admin: {
				results: { title: "النتائج" },
				submissions: { title: "الإرسالات", today: "اليوم" },
				about: { title: "حول" },
			},
		},
		profile: {
			achievements: { title: "الإنجازات", empty: "لا توجد إنجازات بعد." },
		},
		contests: { empty: "لا يوجد شيء هنا بعد." },
	},
	components: {
		editor: { url: "يرجى إدخال رابط URL" },
		datepicker: { notSet: "غير محدد" },
	},
	modals: {
		moderators: {
			join: {
				prompt: "هل تريد الانضمام إلى فريق المشرفين لهذه المسابقة؟",
				button: "انضم إلى المشرفين",
			},
		},
		anonymous: {
			title: "ما هو الوضع المجهول؟",
			description:
				"يتم إخفاء هوية المشاركين عن الجمهور واستبدالها بأسماء مستعارة. لا يزال مالك المسابقة يستطيع رؤية من انضم.",
		},
		participate: {
			alias: {
				title: "أنت تشارك باسم:",
				hint_anonymous: "يمكن لمنظمي المسابقة رؤية ملفك الحقيقي.",
				hint_normal: "الجميع يمكنهم رؤية ملفك الحقيقي.",
			},
			form: {
				title: "إرسال",
				link: { placeholder: "الرابط" },
				description: {
					placeholder: "الوصف",
					hint: "يمكنك تقديم وصف اختياري للإرسال.",
				},
				button: "إرسال",
			},
		},
		submission: {
			description: { title: "الوصف", empty: "لم يتم توفير وصف" },
			actions: { like: "أعجبني", dislike: "لم يعجبني" },
			submission: {
				description: { label: "الوصف" },
				link: { label: "رابط المشاركة" },
			},
			date: "{date} في {time}",
			button: "فتح الرابط",
		},
		settings: {
			title: "الإعدادات",
			language: "اللغة",
			haptic: "ردود فعل لمسية",
			click: "اضغط هنا!",
			footer: "$BUILD مع <3 من أجل Notcoin",
		},
	},
};

export { dict_ar };
