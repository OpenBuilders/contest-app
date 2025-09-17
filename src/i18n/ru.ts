const dict_ru = {
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
			home: "Главная",
			contests: "Конкурсы",
			profile: "Профиль",
		},
		roles: {
			owner: "Владелец",
			moderator: "Модератор",
			participant: "Участник",
		},
		ok: "Ок",
		done: "Готово",
		continue: "Продолжить",
		soon: "Скоро",
		confirmOpenLink: {
			title: "Открыть ссылку",
			prompt: "Вы хотите перейти по ссылке {link}?",
		},
	},
	pages: {
		error: {
			title: "Ошибка",
			description: "Произошла ошибка.",
			data: {
				error: {
					title: "Что-то пошло не так",
					description:
						"Не удалось получить данные, попробуйте перезагрузить приложение.",
				},
			},
		},
		errorInvalidEnv: {
			title: "Неверная среда",
			description:
				"Это приложение предназначено для работы в среде Telegram Mini Apps.",
		},
		home: {
			contests: {
				create: { button: "Создать конкурс" },
				empty: {
					all: {
						title: "Конкурсов пока нет",
						subtitle: "Создайте новый или подождите",
					},
				},
				tabs: {
					all: { title: "Все" },
					yours: { title: "Ваши" },
					saved: { title: "Сохранённые" },
				},
				topics: {
					open: "Открытые",
					finished: "Завершённые",
					saved: "Сохранённые",
					yours: "Ваши",
				},
				items: { reward: "Приз: {reward}", participants: "{count} участников" },
				badges: { ended: "Завершено", closed: "Закрыто", open: "Открыто" },
			},
		},
		create: {
			options: {
				image: { label: "Установить новое фото", crop: "Обрезать изображение" },
				name: { placeholder: "Название конкурса" },
				description: {
					placeholder: "Описание",
					hint: "Вы можете добавить необязательное описание конкурса.",
				},
				duration: {
					label: "Продолжительность",
					options: {
						day: "1 день",
						week: "1 неделя",
						month: "1 месяц",
						custom: "Установить своё время",
					},
					custom: {
						label: "Конкурс заканчивается через...",
						singular: "{day} день",
						plural: "{day} дней",
					},
				},
				prize: { label: "Призовой фонд" },
				participants: {
					label: "Участники",
					anonymous: {
						label: "Анонимный",
						anonymous: { label: "Анонимный" },
						fee: { label: "Входной взнос", free: "Бесплатно" },
					},
				},
				fee: { label: "Входной взнос", free: "Бесплатно" },
				themes: { label: "Темы", symbol: { label: "Символ" } },
			},
			wallet: {
				title: "Подключить кошелёк",
				description:
					"Подключите кошелёк TON, чтобы получать входные взносы от участников.",
				hint: "Сервисный сбор 5% применяется к каждому взносу.",
				button: { text: "Подключить кошелёк" },
			},
			done: {
				title: "Готово!",
				description:
					"Теперь вы можете просматривать конкурс, приглашать модераторов или делиться им с другими.",
				buttons: { view: "Просмотреть конкурс" },
			},
			button: { create: { text: "Создать" } },
			error: { create: "Не удалось создать конкурс." },
		},
		contest: {
			header: {
				entry: { title: "Входной взнос", free: "Бесплатно" },
				prize: { title: "Призовой фонд", unknown: "Неизвестно" },
				deadline: { title: "Дедлайн" },
				share: { text: "🏆 Давайте участвовать в {name}!" },
				status: { label: "Статус", closed: "Закрыто" },
				results: { label: "Результаты", winners: "Победители" },
			},
			description: { title: "О конкурсе", empty: "Описание не предоставлено" },
			manage: {
				list: {
					submissions: "Заявки",
					moderators: "Модераторы",
					results: "Результаты",
					options: "Опции",
					statistics: "Статистика",
					delete: "Удалить конкурс",
				},
				delete: {
					title: "Удалить конкурс",
					confirm: "Удалить",
					prompt: "Вы уверены, что хотите удалить этот конкурс?",
					hint: "Удалённые конкурсы невозможно восстановить.",
				},
				moderators: {
					title: "Модераторы",
					empty: {
						text: "Модераторы могут просматривать и голосовать за заявки.",
						button: "Пригласим модераторов!",
					},
					invite: {
						text: "👮‍♂️ Присоединяйтесь к команде модераторов {title}",
						revoke: {
							title: "Отозвать ссылку",
							prompt:
								"Вы уверены, что хотите отозвать текущую ссылку-приглашение?",
							button: "Отозвать",
						},
						remove: {
							title: "Удалить модератора",
							prompt:
								"Вы уверены, что хотите удалить этого модератора с конкурса?",
							button: "Удалить",
						},
					},
				},
				submissions: {
					title: "Заявки",
					empty: { text: "Пока нет заявок. Расскажите о конкурсе!" },
				},
				results: {
					title: "Результаты",
					description:
						"Создавайте и расставляйте места для объявления победителей.",
					empty: { text: "Места ещё не назначены." },
					list: { reward: "Приз: {reward}", winners: "{count} победителей" },
					add: { button: "Добавить место" },
					announce: {
						title: "Объявить результаты",
						prompt:
							"Вы уверены, что хотите объявить результаты? Все участники будут уведомлены.",
						button: "Объявить результаты",
					},
				},
				placement: {
					title: "Место победителя",
					delete: {
						button: "Удалить место",
						prompt: "Вы уверены, что хотите удалить это место из результатов?",
					},
					participants: { title: "Участники" },
					name: { label: "Название места", placeholder: "1-е место" },
					prize: {
						label: "Приз",
						hint: "Каждый участник на этом месте получит этот приз.",
					},
					buttons: { add: "Добавить место", update: "Обновить место" },
					error: { failed: "Не удалось обновить место." },
				},
				options: {
					title: "Опции",
					button: "Обновить опции",
					form: {
						name: { label: "Название конкурса", placeholder: "Мой конкурс" },
					},
				},
				settings: {
					title: "Настройки",
					button: "Обновить опции",
					tabs: {
						options: { title: "Опции" },
						moderators: { title: "Модераторы" },
					},
				},
			},
			results: { empty: "Нет победителей", self: "Ваша заявка" },
			footer: {
				manage: { text: "Управление конкурсом" },
				submissions: { text: "Просмотреть заявки" },
				view: { text: "Просмотреть конкурс" },
				participate: { text: "Принять участие за {price}" },
				closed: { text: "Приём заявок закрыт." },
				submitted: { text: "Вы уже отправили заявку." },
				ended: { text: "Этот конкурс завершён." },
				placements: {
					announced: "Управление результатами",
					unannounced: "Назначить победителей",
				},
			},
			admin: {
				results: { title: "Результаты" },
				submissions: { title: "Заявки", today: "Сегодня" },
				about: { title: "О конкурсе" },
			},
		},
		profile: {
			achievements: { title: "Достижения", empty: "Достижений пока нет." },
		},
		contests: { empty: "Здесь пока ничего нет." },
	},
	components: {
		editor: { url: "Пожалуйста, введите URL ссылки" },
		datepicker: { notSet: "Не установлено" },
	},
	modals: {
		moderators: {
			join: {
				prompt: "Хотите присоединиться к команде модераторов этого конкурса?",
				button: "Присоединиться к модераторам",
			},
		},
		anonymous: {
			title: "Что такое анонимный режим?",
			description:
				"Идентичность участников скрыта от публики и заменена псевдонимами. Владелец конкурса всё ещё видит, кто присоединился.",
		},
		participate: {
			alias: {
				title: "Вы участвуете как:",
				hint_anonymous: "Организаторы конкурса видят ваш настоящий профиль.",
				hint_normal: "Все видят ваш настоящий профиль.",
			},
			form: {
				title: "заявка",
				link: { placeholder: "Ссылка" },
				description: {
					placeholder: "Описание",
					hint: "Вы можете добавить необязательное описание для вашей заявки.",
				},
				button: "Отправить",
			},
		},
		submission: {
			description: { title: "Описание", empty: "Описание не предоставлено" },
			actions: { like: "Нравится", dislike: "Не нравится" },
			submission: {
				description: { label: "Описание" },
				link: { label: "Ссылка для поделиться" },
			},
			date: "{date} в {time}",
			button: "Открыть ссылку",
		},
		settings: {
			title: "Настройки",
			language: "Язык",
			haptic: "Тактильная отдача",
			click: "Нажми меня!",
			footer: "$BUILD с <3 для Notcoin",
		},
	},
};

export { dict_ru };
