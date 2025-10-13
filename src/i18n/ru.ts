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
	errors: {
		fetch: "Не удалось получить информацию.",
		moderators: {
			fetch: "Не удалось получить информацию о модерации.",
			join: "Не удалось присоединиться к списку модераторов.",
			revoke: "Не удалось отозвать ссылку-приглашение.",
			remove: "Не удалось удалить модератора.",
		},
		participate: {
			submit: "Не удалось отправить заявку.",
		},
		options: {
			delete: "Не удалось удалить конкурс.",
			update: "Не удалось сохранить настройки.",
		},
		placement: {
			update: "Не удалось обновить место.",
			add: "Не удалось добавить место.",
			delete: "Не удалось удалить место.",
		},
		results: {
			announce: "Не удалось объявить результаты.",
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
					open: "Активные",
					finished: "Завершённые",
					saved: "Сохранённые",
					yours: "Ваши",
					created: "Созданные",
					joined: "Участвуете",
					moderator: "Модерация",
				},
				items: { reward: "Приз: {reward}", participants: "{count} участников" },
				badges: { ended: "Завершено", closed: "Закрыто", open: "Открыто" },
			},
		},
		create: {
			options: {
				image: { label: "Загрузить обложку", crop: "Обрезать изображение" },
				name: { placeholder: "Название конкурса" },
				description: {
					placeholder: "Расскажи больше о конкурсе",
				},
				instruction: {
					placeholder: "Что отправлять — ссылки и формат",
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
					label: "участие",
					anonymous: {
						label: "Анонимно",
						anonymous: { label: "Анонимно" },
						fee: { label: "вход", free: "Бесплатно" },
					},
				},
				fee: { label: "вход", free: "Бесплатно" },
				themes: { label: "Темы", symbol: { label: "Символ" } },
			},
			wallet: {
				title: "Подключить кошелёк",
				description:
					"Подключите кошелёк TON, чтобы получать входные взносы от участников.",
				hint: "Сервисный сбор {commission}% применяется к каждому взносу.",
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
				entry: { title: "вход", free: "Бесплатно" },
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
					options: "Общее",
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
						button: "Пригласить!",
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
						button: "Объявить",
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
					title: "Общее",
					button: "Обновить Общее",
					form: {
						name: { label: "Название конкурса", placeholder: "Мой конкурс" },
					},
				},
				settings: {
					title: "Настройки",
					button: "Обновить Общее",
					tabs: {
						options: { title: "Общее" },
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
			title: "Присоединиться к конкурсу",
			instruction: {
				title: "Что отправить",
				default: "Пожалуйста, укажите ссылку и краткое описание вашей работы",
			},
			form: {
				title: "Заявка",
				description: {
					placeholder: "Ссылки на вашу работу и описание",
				},
				button: "Отправить",
			},
			profile: "<b>{profile}</b> отображается в заявке",
			confirm: {
				title: "Отправить",
				prompt: "Вы хотите отправить свою работу на этот конкурс?",
				button: "Отправить",
			},
			done: {
				title: "Мы получили вашу заявку",
				description: "Теперь скрестите пальцы и ждите результатов",
			},
		},
		submission: {
			description: { title: "Описание", empty: "Описание не предоставлено" },
			actions: { like: "Нравится", dislike: "Не нравится" },
			submission: {
				description: { label: "Описание" },
				link: { label: "Ссылка для поделиться" },
			},
			voters: {
				title: "Проголосовавшие",
				empty: "Ещё никто не проголосовал.",
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
