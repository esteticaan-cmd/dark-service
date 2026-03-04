// scenes.js — All game scenes (150+), 5 chapters, 3 endings, 21 choice points
// Scene format:
// {
//   chapter, bg, chars, mood, ambience, sfx, flicker,
//   speaker, text, choices, next, spiritMod, setFlag, ending
// }

const SCENES = {

    // ============================================================
    // CHAPTER 1: ПРИБЫТИЕ (10 scenes)
    // ============================================================

    ch1_s1: {
        chapter: 1,
        bg: 'outside',
        chars: [],
        mood: 'dark',
        ambience: 'wind',
        speaker: null,
        text: 'Автобус остановился у обочины грунтовой дороги. Водитель даже не обернулся — просто открыл дверь и ждал.\n\nМарко подхватил рюкзак и вышел в серое октябрьское утро. Воздух пах мокрой землёй и соляркой.',
        next: 'ch1_s2',
    },

    ch1_s2: {
        bg: 'outside',
        chars: [],
        mood: 'dark',
        ambience: 'wind',
        speaker: null,
        text: 'Впереди — бетонный забор с колючей проволокой поверху. За ним — серые корпуса, плац, водонапорная башня. Военная часть номер 4012.\n\nТабличка у ворот проржавела настолько, что половину букв уже не разобрать. Краска на стенах КПП облупилась до бетона.',
        next: 'ch1_s3',
    },

    ch1_s3: {
        bg: 'guardpost',
        chars: [{ id: 'soldier', x: 0.5, scale: 0.9 }],
        mood: 'dark',
        sfx: 'footsteps',
        speaker: 'Дежурный',
        text: 'Ещё один? Документы давай. Быстро.',
        next: 'ch1_s4',
    },

    ch1_s4: {
        bg: 'guardpost',
        chars: [{ id: 'soldier', x: 0.5, scale: 0.9 }],
        mood: 'dark',
        speaker: 'Дежурный',
        text: 'Казарма три, второй этаж. Найдёшь старшину — он определит койку. И совет: не задавай лишних вопросов.',
        next: 'ch1_s5',
    },

    ch1_s5: {
        bg: 'barracks',
        chars: [],
        mood: 'dark',
        ambience: '',
        speaker: null,
        text: 'Казарма встретила запахом сырости и хлорки. Длинный коридор с потрескавшимся линолеумом, тусклые лампы под потолком — одна из трёх мигала, две не горели.\n\nПо стенам — облупившаяся зелёная краска. На доске объявлений — пожелтевший распорядок дня, которому явно никто не следует.',
        next: 'ch1_explore_choice',
    },

    ch1_explore_choice: {
        bg: 'barracks',
        chars: [],
        mood: 'dark',
        speaker: null,
        text: 'Коридор пуст. Где-то капает вода. Что делать?',
        choices: [
            {
                id: 'ch1_explore_look',
                text: 'Осмотреть казарму — понять, куда попал.',
                spirit: 3,
                setFlag: { explored: true },
                next: 'ch1_explore_look_1',
            },
            {
                id: 'ch1_explore_bed',
                text: 'Найти свободную койку и лечь. Сил нет.',
                spirit: -2,
                next: 'ch1_explore_bed_1',
            },
            {
                id: 'ch1_explore_quiet',
                text: 'Стоять тихо у входа. Не привлекать внимания.',
                spirit: 0,
                setFlag: { cautious: true },
                next: 'ch1_explore_quiet_1',
            },
        ],
    },

    ch1_explore_look_1: {
        bg: 'barracks',
        chars: [],
        mood: 'dark',
        speaker: null,
        text: 'Марко прошёл по казарме. Двадцать коек в два ряда, половина — с продавленными матрасами. На стене у входа — следы от кулака. На одной тумбочке — нацарапано: «Держись 347 дней».\n\nЗнание — это оружие. Даже здесь.',
        spiritMod: 2,
        next: 'ch1_s6',
    },

    ch1_explore_bed_1: {
        bg: 'barracks',
        chars: [],
        mood: 'dark',
        speaker: null,
        text: 'Марко бросил рюкзак на ближайшую свободную койку и сел. Пружины скрипнули жалобно.\n\nУсталость навалилась разом — дорога, нервы, незнакомое место. Хотелось закрыть глаза и проснуться дома.',
        next: 'ch1_s6',
    },

    ch1_explore_quiet_1: {
        bg: 'barracks',
        chars: [],
        mood: 'dark',
        speaker: null,
        text: 'Марко прижался к стене у двери. Инстинкт подсказывал: в незнакомом месте лучше наблюдать.\n\nОн простоял так минут пять, прислушиваясь к звукам казармы — скрип, капель, чьё-то бормотание за стеной.',
        spiritMod: 1,
        next: 'ch1_s6',
    },

    ch1_s6: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5, scale: 0.95 }],
        mood: 'dark',
        speaker: null,
        text: 'На одной из нижних коек сидел худой парень примерно его возраста. Он поднял голову, и Марко увидел усталые глаза и синяк под левым — уже пожелтевший, недельной давности.',
        next: 'ch1_s7',
    },

    ch1_s7: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5, scale: 0.95 }],
        mood: 'dark',
        speaker: 'Лука',
        text: 'Привет. Ты новый? Я Лука. Приехал неделю назад.\n\n...Не смотри на синяк. Упал. Все здесь «падают».',
        next: 'ch1_luka_choice',
    },

    ch1_luka_choice: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5, scale: 0.95 }],
        mood: 'dark',
        speaker: null,
        text: 'Лука смотрит на тебя выжидающе. Первый человек, с которым ты здесь заговорил.',
        choices: [
            {
                id: 'ch1_luka_trust',
                text: 'Протянуть руку: «Я Марко. Будем держаться вместе.»',
                spirit: 5,
                setFlag: { luka_trust: true },
                next: 'ch1_luka_trust_1',
            },
            {
                id: 'ch1_luka_distance',
                text: 'Кивнуть холодно. Не стоит привязываться.',
                spirit: -3,
                setFlag: { luka_distance: true },
                next: 'ch1_luka_distance_1',
            },
            {
                id: 'ch1_luka_ask',
                text: 'Спросить прямо: «Кто тебя ударил?»',
                spirit: 0,
                setFlag: { luka_asked: true },
                next: 'ch1_luka_ask_1',
            },
        ],
    },

    ch1_luka_trust_1: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5, scale: 0.95 }],
        mood: 'dark',
        speaker: 'Лука',
        text: 'Лука пожал руку — крепко, как утопающий хватается за верёвку.\n\n«Спасибо, Марко. Здесь... здесь трудно без кого-то рядом. Рад, что ты нормальный.»',
        spiritMod: 3,
        next: 'ch1_s8',
    },

    ch1_luka_distance_1: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5, scale: 0.95 }],
        mood: 'dark',
        speaker: null,
        text: 'Лука опустил глаза. Уголки губ дрогнули.\n\n«Ладно. Понимаю. Здесь каждый сам за себя.»\n\nОн отвернулся к стене. Марко остался один посреди казармы.',
        spiritMod: -2,
        next: 'ch1_s8',
    },

    ch1_luka_ask_1: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5, scale: 0.95 }],
        mood: 'dark',
        speaker: 'Лука',
        text: 'Лука вздрогнул. Помолчал.\n\n«Сержант Горан. Он тут... главный. По-настоящему главный. Офицеры закрывают глаза. Бьёт за всё — за взгляд, за слово, за то, что дышишь не так.\n\nНе лезь к нему, Марко. Просто не лезь.»',
        spiritMod: 1,
        setFlag: { knows_goran: true },
        next: 'ch1_s8',
    },

    ch1_s8: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.3 }, { id: 'goran', x: 0.75, scale: 1.05 }],
        mood: 'tension',
        sfx: 'footsteps',
        flicker: true,
        speaker: null,
        text: 'Дверь казармы распахнулась с грохотом. В проёме стоял широкоплечий человек в расстёгнутом кителе. Лицо — как вырубленное из камня. Глаза — холодные, оценивающие.\n\nЛука мгновенно вскочил, вытянулся.',
        next: 'ch1_s9',
    },

    ch1_s9: {
        bg: 'barracks',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'tension',
        speaker: 'Сержант Горан',
        text: 'Новенький? Встать. Имя, фамилия.',
        next: 'ch1_s10',
    },

    ch1_s10: {
        bg: 'barracks',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'tension',
        speaker: 'Сержант Горан',
        text: 'Марко, значит. Запомни, щенок: здесь ты — никто. Ноль. Пустое место. Ты дышишь, потому что я разрешаю тебе дышать. Ты спишь, потому что я разрешаю тебе спать.\n\nПонял?',
        next: 'ch1_s11',
    },

    ch1_s11: {
        bg: 'barracks',
        chars: [{ id: 'goran', x: 0.6, scale: 1.05 }, { id: 'dragan', x: 0.3, scale: 1.0 }],
        mood: 'tension',
        speaker: null,
        text: 'Из-за спины Горана вышел ещё один — Драган. Ниже ростом, но жилистый, с бритой головой и шрамом на подбородке. Он усмехнулся, глядя на Марко.',
        next: 'ch1_s12',
    },

    ch1_s12: {
        bg: 'barracks',
        chars: [{ id: 'goran', x: 0.6, scale: 1.05 }, { id: 'dragan', x: 0.3, scale: 1.0 }],
        mood: 'tension',
        speaker: 'Драган',
        text: 'Этот тощий? Горан, что нам с ним делать? Даже автомат не удержит.',
        next: 'ch1_s13',
    },

    ch1_s13: {
        bg: 'barracks',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'dread',
        speaker: 'Сержант Горан',
        text: 'Научим. У нас тут хорошая школа. Быстро учим.\n\nСегодня ночью — твоё посвящение, новенький. Готовься.',
        next: 'ch1_s14',
    },

    ch1_s14: {
        bg: 'night_barracks',
        chars: [],
        mood: 'dread',
        ambience: 'wind',
        speaker: null,
        text: 'Ночь. Марко лежал на жёсткой койке, уставившись в потолок. Матрас пах чем-то кислым. Одеяло — тонкое, армейское, давно потерявшее цвет.\n\nРядом на койке ворочался Лука. Где-то капала вода. Лампа в коридоре мигала.',
        next: 'ch1_s15',
    },

    ch1_s15: {
        bg: 'night_barracks',
        chars: [{ id: 'goran', x: 0.4 }, { id: 'dragan', x: 0.65 }],
        mood: 'dread',
        sfx: 'impact',
        flicker: true,
        speaker: null,
        text: 'Грохот. Свет включился — режущий, беспощадный.\n\n«ПОДЪЁМ, МРАЗИ!»\n\nГоран и Драган стояли в проходе. Горан держал в руке ремень.',
        next: 'ch1_s16',
    },

    ch1_s16: {
        bg: 'night_barracks',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'dread',
        speaker: 'Сержант Горан',
        text: 'Посвящение, духи. Встали в строй. Быстро!\n\nМарко, ты первый. Подойди сюда.',
        next: 'ch1_choice',
    },

    ch1_choice: {
        bg: 'night_barracks',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'dread',
        speaker: null,
        text: 'Горан стоит перед тобой. Ремень покачивается в его руке. За спиной слышно тихое всхлипывание — кто-то из новобранцев.',
        choices: [
            {
                id: 'ch1_submit',
                text: 'Подчиниться молча. Стиснуть зубы.',
                spirit: 5,
                setFlag: { ch1: 'submit' },
                next: 'ch1_submit_1',
            },
            {
                id: 'ch1_resist',
                text: 'Попытаться возразить: «Вы не имеете права»',
                spirit: -10,
                setFlag: { ch1: 'resist' },
                next: 'ch1_resist_1',
            },
            {
                id: 'ch1_allies',
                text: 'Оглянуться на других призывников. Они ведь тоже здесь.',
                spirit: 0,
                setFlag: { ch1: 'allies' },
                next: 'ch1_allies_1',
            },
        ],
    },

    ch1_submit_1: {
        bg: 'night_barracks',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'dread',
        sfx: 'impact',
        speaker: null,
        text: 'Марко молча встал перед Гораном. Стиснул зубы. Первый удар ремнём пришёлся по спине — обжигающий, вышибающий воздух из лёгких.\n\nВторой. Третий.\n\nОн не закричал. Горан остановился, посмотрел с чем-то вроде удивления.',
        next: 'ch1_submit_2',
    },

    ch1_submit_2: {
        bg: 'night_barracks',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'dread',
        speaker: 'Сержант Горан',
        text: 'Крепкий. Ладно, может, из тебя толк и выйдет.\n\nСледующий!',
        spiritMod: 3,
        next: 'ch1_morning_choice',
    },

    ch1_resist_1: {
        bg: 'night_barracks',
        chars: [{ id: 'goran', x: 0.4 }, { id: 'dragan', x: 0.7 }],
        mood: 'dread',
        sfx: 'impact',
        flicker: true,
        speaker: 'Марко',
        text: 'Вы не имеете права. Это незаконно.',
        next: 'ch1_resist_2',
    },

    ch1_resist_2: {
        bg: 'night_barracks',
        chars: [{ id: 'goran', x: 0.4 }, { id: 'dragan', x: 0.7 }],
        mood: 'dread',
        sfx: 'impact',
        speaker: null,
        text: 'Тишина длилась секунду. Потом Горан рассмеялся — тихо, без веселья.\n\nУдар пришёл сбоку — Драган. Марко упал. Потом били вдвоём, молча и методично. Дольше, чем остальных.',
        next: 'ch1_resist_3',
    },

    ch1_resist_3: {
        bg: 'night_barracks',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'dread',
        speaker: 'Сержант Горан',
        text: 'Право? Здесь нет права. Здесь есть я.\n\nЗапомни это, умник. В следующий раз будет хуже.',
        spiritMod: -5,
        next: 'ch1_morning_choice',
    },

    ch1_allies_1: {
        bg: 'night_barracks',
        chars: [{ id: 'luka', x: 0.3 }, { id: 'goran', x: 0.7 }],
        mood: 'dread',
        speaker: null,
        text: 'Марко обернулся. Пятеро призывников стояли за ним — бледные, трясущиеся. Лука встретил его взгляд, еле заметно кивнул.\n\nНо никто не двинулся. Страх сковал всех.',
        next: 'ch1_allies_2',
    },

    ch1_allies_2: {
        bg: 'night_barracks',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'dread',
        sfx: 'impact',
        speaker: 'Сержант Горан',
        text: 'Что, ищешь помощь? Здесь каждый сам за себя, дух.\n\nНа колени. Живо.',
        next: 'ch1_allies_3',
    },

    ch1_allies_3: {
        bg: 'night_barracks',
        chars: [],
        mood: 'dread',
        speaker: null,
        text: 'Били всех. Но после, когда Горан и Драган ушли, Лука подошёл к Марко в темноте.\n\n«Спасибо, что посмотрел на нас. Хоть кто-то.»\n\nМаленькая искра — но в этой тьме и она была чем-то.',
        spiritMod: 3,
        next: 'ch1_morning_choice',
    },

    ch1_morning_choice: {
        bg: 'night_barracks',
        chars: [],
        mood: 'dark',
        ambience: 'rain',
        speaker: null,
        text: 'Под утро казарма затихла. Тело болело. Но голова работала — лихорадочно, ясно. Что дальше?',
        choices: [
            {
                id: 'ch1_morning_letter',
                text: 'Написать письмо домой. Маме. Хоть что-то нормальное.',
                spirit: 5,
                setFlag: { wrote_home: true },
                next: 'ch1_morning_letter_1',
            },
            {
                id: 'ch1_morning_adapt',
                text: 'Запомнить правила. Выучить систему. Адаптироваться.',
                spirit: 0,
                setFlag: { adapting: true },
                next: 'ch1_morning_adapt_1',
            },
            {
                id: 'ch1_morning_rage',
                text: 'Лежать в темноте и чувствовать, как внутри растёт ярость.',
                spirit: -5,
                setFlag: { anger_growing: true },
                next: 'ch1_morning_rage_1',
            },
        ],
    },

    ch1_morning_letter_1: {
        bg: 'night_barracks',
        chars: [],
        mood: 'dark',
        speaker: null,
        text: 'Марко достал мятый листок и огрызок карандаша. Писал в темноте, на ощупь.\n\n«Мама, у меня всё хорошо. Кормят нормально. Ребята в казарме хорошие.»\n\nВсё — ложь. Но эта ложь давала силы.',
        spiritMod: 3,
        next: 'ch1_end',
    },

    ch1_morning_adapt_1: {
        bg: 'night_barracks',
        chars: [],
        mood: 'dark',
        speaker: null,
        text: 'Горан бьёт после отбоя. Драган — днём, когда офицеров нет. Капитан пьёт. Фельдшер пишет «падение».\n\nМарко запоминал. Каждую деталь, каждое правило невидимой иерархии. Знание — защита.',
        spiritMod: 2,
        next: 'ch1_end',
    },

    ch1_morning_rage_1: {
        bg: 'night_barracks',
        chars: [],
        mood: 'dread',
        speaker: null,
        text: 'Кулаки сжимались сами. В темноте, под тонким одеялом, Марко чувствовал что-то новое — горячее, тёмное, живое.\n\nЯрость. Не страх — ярость.\n\nПока она была бесформенной. Но она росла.',
        spiritMod: -3,
        next: 'ch1_end',
    },

    ch1_end: {
        bg: 'night_barracks',
        chars: [],
        mood: 'dark',
        ambience: 'rain',
        speaker: null,
        text: 'Утро пришло серым и безразличным. За окном шёл дождь. На спине горели полосы от ремня.\n\nПервая ночь закончилась. Впереди — месяцы.\n\nМарко лежал на койке и слушал дождь. Где-то далеко, за забором из бетона и колючей проволоки, шла нормальная жизнь. Но здесь о ней нужно забыть.',
        next: 'ch2_s1',
    },

    // ============================================================
    // CHAPTER 2: ПЕРВЫЕ НЕДЕЛИ (10+ scenes)
    // ============================================================

    ch2_s1: {
        chapter: 2,
        bg: 'parade',
        chars: [{ id: 'goran', x: 0.7, scale: 1.05 }],
        mood: 'tension',
        ambience: 'wind',
        speaker: null,
        text: 'Дни потянулись одинаковые, как серые бетонные блоки казармы.\n\nПодъём в пять. Плац. Муштра до завтрака — бег, отжимания, строевая. Горан орал так, что птицы снимались с деревьев за забором.',
        next: 'ch2_s2',
    },

    ch2_s2: {
        bg: 'parade',
        chars: [{ id: 'goran', x: 0.6, scale: 1.05 }, { id: 'dragan', x: 0.3 }],
        mood: 'tension',
        speaker: 'Сержант Горан',
        text: 'Бегом! Бегом, я сказал! Кто последний — будет мыть сортиры зубной щёткой!\n\nМарко, что ты плетёшься? Ноги в руки!',
        next: 'ch2_s3',
    },

    ch2_s3: {
        bg: 'mess',
        chars: [{ id: 'luka', x: 0.4 }],
        mood: 'dark',
        ambience: '',
        speaker: null,
        text: 'Столовая. Каша, которая вчера была супом. Хлеб цвета стен. Чай из ржавого бака.\n\nЛука сидел напротив, ковыряя еду ложкой. Под глазами — тёмные круги. Руки дрожали.',
        next: 'ch2_s4',
    },

    ch2_s4: {
        bg: 'mess',
        chars: [{ id: 'luka', x: 0.4 }],
        mood: 'dark',
        speaker: 'Лука',
        text: 'Я не сплю уже третью ночь. Каждый раз, когда закрываю глаза — слышу шаги в коридоре.\n\nМарко... как ты это выдерживаешь?',
        next: 'ch2_respond_choice',
    },

    ch2_respond_choice: {
        bg: 'mess',
        chars: [{ id: 'luka', x: 0.4 }],
        mood: 'dark',
        speaker: null,
        text: 'Лука ждёт ответа. Его ложка замерла над тарелкой.',
        choices: [
            {
                id: 'ch2_respond_honest',
                text: '«Не знаю, Лука. Считаю дни. Один за другим.»',
                spirit: 3,
                next: 'ch2_respond_honest_1',
            },
            {
                id: 'ch2_respond_tough',
                text: '«Не думай об этом. Ешь. Тебе нужны силы.»',
                spirit: 0,
                next: 'ch2_respond_tough_1',
            },
            {
                id: 'ch2_respond_dark',
                text: '«Выдерживаю? Я не выдерживаю. Я просто ещё не сломался.»',
                spirit: -3,
                next: 'ch2_respond_dark_1',
            },
        ],
    },

    ch2_respond_honest_1: {
        bg: 'mess',
        chars: [{ id: 'luka', x: 0.4 }],
        mood: 'dark',
        speaker: 'Лука',
        text: 'Считаешь дни... Да. Это хороший способ.\n\nЛука достал огрызок карандаша и начал чертить чёрточки на салфетке. Одна за другой. Маленький ритуал выживания.',
        spiritMod: 2,
        next: 'ch2_s5',
    },

    ch2_respond_tough_1: {
        bg: 'mess',
        chars: [{ id: 'luka', x: 0.4 }],
        mood: 'dark',
        speaker: null,
        text: 'Лука молча кивнул и начал есть. Механически, не чувствуя вкуса.\n\nПравильный совет. Тело должно работать, даже когда душа не хочет.',
        next: 'ch2_s5',
    },

    ch2_respond_dark_1: {
        bg: 'mess',
        chars: [{ id: 'luka', x: 0.4 }],
        mood: 'dark',
        speaker: 'Лука',
        text: 'Лука посмотрел на Марко. В его глазах мелькнуло что-то — узнавание. Два человека на краю.\n\n«Значит, мы оба. Два не-сломавшихся. Пока.»',
        spiritMod: -1,
        next: 'ch2_s5',
    },

    ch2_s5: {
        bg: 'night_barracks',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'dread',
        sfx: 'impact',
        flicker: true,
        ambience: '',
        speaker: null,
        text: 'Ночная побудка. Третья за неделю.\n\nГоран врывался в казарму, переворачивал кровати, орал. Заставлял стоять по стойке «смирно» часами — до тех пор, пока кто-нибудь не падал.',
        next: 'ch2_night_raid_choice',
    },

    ch2_night_raid_choice: {
        bg: 'night_barracks',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'dread',
        speaker: null,
        text: 'Свет врезается в глаза. Крик: «ПОДЪЁМ!» Секунда на решение.',
        choices: [
            {
                id: 'ch2_raid_first',
                text: 'Вскочить первым. Показать, что готов.',
                spirit: 3,
                setFlag: { obedient: true },
                next: 'ch2_raid_first_1',
            },
            {
                id: 'ch2_raid_slow',
                text: 'Медленно встать. Не давать им удовольствия.',
                spirit: -3,
                next: 'ch2_raid_slow_1',
            },
            {
                id: 'ch2_raid_hide',
                text: 'Притвориться спящим. Может, пронесёт.',
                spirit: -5,
                next: 'ch2_raid_hide_1',
            },
        ],
    },

    ch2_raid_first_1: {
        bg: 'night_barracks',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'dread',
        speaker: 'Сержант Горан',
        text: 'Марко уже стоял, когда другие ещё ворочались. Горан скользнул по нему взглядом.\n\n«Хм. Этот хотя бы учится.»\n\nВ ту ночь Марко не тронули. Маленькая победа.',
        spiritMod: 2,
        next: 'ch2_s6',
    },

    ch2_raid_slow_1: {
        bg: 'night_barracks',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'dread',
        sfx: 'impact',
        speaker: null,
        text: 'Марко встал — нарочито медленно. Посмотрел Горану в глаза.\n\nГоран ухмыльнулся. Удар — не сильный, но обидный, по затылку.\n\n«Быстрее, дух. В следующий раз я не буду таким добрым.»',
        spiritMod: -2,
        next: 'ch2_s6',
    },

    ch2_raid_hide_1: {
        bg: 'night_barracks',
        chars: [{ id: 'dragan', x: 0.5 }],
        mood: 'dread',
        sfx: 'impact',
        flicker: true,
        speaker: 'Драган',
        text: 'Одеяло сорвали. Драган схватил за ворот и швырнул с койки на пол.\n\n«Дрыхнешь? Сейчас проснёшься!»\n\nБили долго. Притворяться — худшая идея в казарме.',
        spiritMod: -5,
        next: 'ch2_s6',
    },

    ch2_s6: {
        bg: 'night_barracks',
        chars: [{ id: 'dragan', x: 0.5 }],
        mood: 'dread',
        sfx: 'impact',
        speaker: 'Драган',
        text: 'Эй, тощий! Да, ты, Лука. Иди сюда. Говорят, ты плохо убрал в туалете.\n\nНа колени. Будешь вылизывать, пока не засверкает.',
        next: 'ch2_s7',
    },

    ch2_s7: {
        bg: 'night_barracks',
        chars: [{ id: 'luka', x: 0.4 }, { id: 'dragan', x: 0.65 }],
        mood: 'dread',
        speaker: null,
        text: 'Лука стоял на коленях. Его трясло. Драган пнул его — несильно, лениво, как пинают собаку.\n\nОстальные призывники смотрели в пол. Никто не шевелился.',
        next: 'ch2_witness_choice',
    },

    ch2_witness_choice: {
        bg: 'night_barracks',
        chars: [{ id: 'luka', x: 0.4 }, { id: 'dragan', x: 0.65 }],
        mood: 'dread',
        speaker: null,
        text: 'Драган замахивается снова. Лука закрывает голову руками. Время — секунда.',
        choices: [
            {
                id: 'ch2_witness_step',
                text: 'Шагнуть вперёд: «Хватит. Он понял.»',
                spirit: 5,
                setFlag: { defended_luka: true },
                next: 'ch2_witness_step_1',
            },
            {
                id: 'ch2_witness_look',
                text: 'Смотреть в пол, как все. Выживание важнее.',
                spirit: -5,
                next: 'ch2_witness_look_1',
            },
            {
                id: 'ch2_witness_memorize',
                text: 'Запоминать. Каждый удар. Когда-нибудь пригодится.',
                spirit: -2,
                setFlag: { witness_memory: true },
                next: 'ch2_witness_memorize_1',
            },
        ],
    },

    ch2_witness_step_1: {
        bg: 'night_barracks',
        chars: [{ id: 'dragan', x: 0.5 }],
        mood: 'dread',
        sfx: 'impact',
        speaker: 'Драган',
        text: 'О, герой нашёлся? Хочешь вместо него?\n\nДраган ударил Марко — коротко, в живот. Но отошёл. Лука поднялся с пола.\n\nМаленькая победа. Маленькая, но настоящая.',
        spiritMod: 3,
        next: 'ch2_s8',
    },

    ch2_witness_look_1: {
        bg: 'night_barracks',
        chars: [{ id: 'dragan', x: 0.65 }],
        mood: 'dread',
        speaker: null,
        text: 'Марко уставился в пол. Считал трещины в линолеуме. Слышал звуки ударов.\n\nКогда Драган ушёл, Марко не мог посмотреть Луке в глаза.',
        spiritMod: -3,
        next: 'ch2_s8',
    },

    ch2_witness_memorize_1: {
        bg: 'night_barracks',
        chars: [{ id: 'dragan', x: 0.65 }],
        mood: 'dread',
        speaker: null,
        text: 'Марко смотрел. Не отводя глаз. Запоминал — лицо Драгана, его движения, его самодовольную ухмылку.\n\nВсё это ляжет в копилку. Информация — единственное оружие, которое нельзя отобрать.',
        next: 'ch2_s8',
    },

    ch2_s8: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5 }],
        mood: 'dark',
        ambience: 'rain',
        speaker: null,
        text: 'После отбоя Лука сидел на своей койке, обхватив колени руками. Он раскачивался туда-сюда, как маятник.\n\nМарко видел — Лука ломается. Медленно, но неотвратимо. Как стена, в которой появляется трещина.',
        next: 'ch2_s9',
    },

    ch2_s9: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5 }],
        mood: 'dark',
        speaker: 'Лука',
        text: 'Я больше не могу, Марко. Я думал — потерплю, пройдёт. Но становится только хуже.\n\nМне некуда идти. Если сбежишь — посадят. Если останешься — сломают. Что делать?',
        next: 'ch2_choice',
    },

    ch2_choice: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5 }],
        mood: 'dark',
        speaker: null,
        text: 'Лука смотрит на тебя. В его глазах — последняя надежда. Он ждёт ответа.',
        choices: [
            {
                id: 'ch2_support',
                text: 'Поддержать Луку: «Мы справимся вместе. Я рядом.»',
                spirit: 10,
                setFlag: { ch2: 'support', luka_supported: true },
                next: 'ch2_support_1',
            },
            {
                id: 'ch2_self',
                text: 'Думать о себе: «Мне и за себя тяжело. Каждый сам.»',
                spirit: -5,
                setFlag: { ch2: 'self' },
                next: 'ch2_self_1',
            },
            {
                id: 'ch2_complain',
                text: 'Пойти к капитану Зорану и пожаловаться.',
                spirit: 0,
                setFlag: { ch2: 'complain' },
                next: 'ch2_complain_1',
            },
        ],
    },

    ch2_support_1: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5 }],
        mood: 'dark',
        speaker: 'Марко',
        text: 'Послушай. Я знаю, что тяжело. Мне тоже. Но мы не одни — нас тут пятеро таких же.\n\nДержись рядом со мной. Будем прикрывать друг друга.',
        next: 'ch2_support_2',
    },

    ch2_support_2: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5 }],
        mood: 'calm',
        speaker: 'Лука',
        text: 'Спасибо, Марко. Правда... спасибо.\n\nЯ попробую. Ради нас обоих.',
        spiritMod: 3,
        next: 'ch2_end',
    },

    ch2_self_1: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5 }],
        mood: 'dark',
        speaker: 'Марко',
        text: 'Лука, мне самому тяжело. Я не могу тащить и тебя, и себя.\n\nКаждый должен выживать сам. Так устроено это место.',
        next: 'ch2_self_2',
    },

    ch2_self_2: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5 }],
        mood: 'dark',
        speaker: null,
        text: 'Лука ничего не ответил. Просто отвернулся к стене и замер.\n\nМарко лёг на свою койку. Что-то внутри подсказывало, что он только что потерял единственного друга. Но в этом месте дружба — роскошь.',
        spiritMod: -3,
        next: 'ch2_end',
    },

    ch2_complain_1: {
        bg: 'outside',
        chars: [{ id: 'zoran', x: 0.5, scale: 1.0 }],
        mood: 'tension',
        ambience: '',
        speaker: null,
        text: 'Кабинет капитана Зорана располагался в отдельном корпусе — единственном месте, где было тепло.\n\nКапитан сидел за столом. Перед ним — полупустая бутылка. Лицо одутловатое, глаза мутные.',
        next: 'ch2_complain_2',
    },

    ch2_complain_2: {
        bg: 'outside',
        chars: [{ id: 'zoran', x: 0.5, scale: 1.0 }],
        mood: 'tension',
        speaker: 'Капитан Зоран',
        text: 'Жалоба? На сержанта Горана? Мальчик, ты хоть понимаешь, что говоришь?\n\nГоран — хребет этой части. Без него тут всё развалится. А ты — призывник, который через год уедет.\n\nИди обратно. И не вздумай трепать языком.',
        next: 'ch2_complain_3',
    },

    ch2_complain_3: {
        bg: 'barracks',
        chars: [],
        mood: 'dread',
        speaker: null,
        text: 'Марко вернулся в казарму. Через час Горан уже знал о жалобе — в части секретов не бывает.\n\nТой ночью Марко получил двойную «порцию». Горан бил молча, сосредоточенно. Потом наклонился и прошептал:',
        next: 'ch2_complain_4',
    },

    ch2_complain_4: {
        bg: 'night_barracks',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'dread',
        sfx: 'impact',
        speaker: 'Сержант Горан',
        text: 'Ещё раз пойдёшь к капитану — следующий раз будет последним. Понял?',
        spiritMod: -8,
        next: 'ch2_end',
    },

    ch2_end: {
        bg: 'outside',
        chars: [],
        mood: 'dark',
        ambience: 'rain_wind',
        speaker: null,
        text: 'Недели складывались в месяц. Тело привыкало к побоям — или просто переставало чувствовать. Разум учился отключаться, уходить куда-то внутрь.\n\nЗа забором часть наступала зима. Холодная, равнодушная, как всё в этом месте.',
        next: 'ch2_winter_choice',
    },

    ch2_winter_choice: {
        bg: 'outside',
        chars: [],
        mood: 'dark',
        ambience: 'rain_wind',
        speaker: null,
        text: 'Ночь перед первым снегом. Что помогает держаться?',
        choices: [
            {
                id: 'ch2_winter_home',
                text: 'Воспоминания о доме. Мамин голос. Запах хлеба.',
                spirit: 5,
                setFlag: { anchor: 'home' },
                next: 'ch2_winter_home_1',
            },
            {
                id: 'ch2_winter_anger',
                text: 'Злость. Чистая, холодная злость на весь этот мир.',
                spirit: -5,
                setFlag: { anchor: 'anger' },
                next: 'ch2_winter_anger_1',
            },
            {
                id: 'ch2_winter_bond',
                text: 'Лука. Ребята. Те, кто рядом — в одной грязи.',
                spirit: 5,
                setFlag: { anchor: 'bonds' },
                next: 'ch2_winter_bond_1',
            },
        ],
    },

    ch2_winter_home_1: {
        bg: 'night_barracks',
        chars: [],
        mood: 'calm',
        speaker: null,
        text: 'Марко закрыл глаза и увидел кухню. Мать у плиты, отец за столом с газетой. Простые вещи. Обычные.\n\nНо сейчас они казались чем-то невозможным. Раем, который ждёт за бетонным забором.\n\nТриста дней. Он выдержит.',
        spiritMod: 3,
        next: 'ch3_s1',
    },

    ch2_winter_anger_1: {
        bg: 'night_barracks',
        chars: [],
        mood: 'dread',
        speaker: null,
        text: 'Злость грела лучше одеяла. Горячая, живая, настоящая.\n\nМарко лежал и сжимал кулаки. Каждый удар Горана, каждое унижение — всё это копилось внутри, как порох в снаряде.\n\nКогда-нибудь рванёт.',
        spiritMod: -3,
        next: 'ch3_s1',
    },

    ch2_winter_bond_1: {
        bg: 'night_barracks',
        chars: [],
        mood: 'calm',
        speaker: null,
        text: 'Лука на соседней койке. Ещё один призывник — Ненад — через две кровати. Тихое «спокойной ночи» в темноте.\n\nВместе проще. Не легче — проще. Есть разница.\n\nМарко впервые за месяц уснул спокойно.',
        spiritMod: 3,
        next: 'ch3_s1',
    },

    // ============================================================
    // CHAPTER 3: ТОЧКА КИПЕНИЯ (10+ scenes)
    // ============================================================

    ch3_s1: {
        chapter: 3,
        bg: 'barracks',
        chars: [],
        mood: 'tension',
        ambience: 'wind',
        speaker: null,
        text: 'Третий месяц. Зима вошла в полную силу — в казарме изо рта шёл пар. Отопление работало два часа в день.\n\nГоран становился злее. Говорили, что у него проблемы — то ли долги, то ли жена ушла. Никто точно не знал. Но расплачивались за это призывники.',
        next: 'ch3_s2',
    },

    ch3_s2: {
        bg: 'parade',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'tension',
        sfx: 'impact',
        speaker: 'Сержант Горан',
        text: 'НА ПЛАЦ! ВСЕ! БЕГОМ!\n\nНа улице минус десять, а на призывниках — только кители и сапоги. Горан заставил их стоять два часа. Без движения. Без разговоров.\n\nТрое упали в обморок.',
        next: 'ch3_s3',
    },

    ch3_s3: {
        bg: 'barracks',
        chars: [{ id: 'dragan', x: 0.5 }],
        mood: 'dread',
        speaker: null,
        text: 'Драган устроил «проверку тумбочек». Это означало: всё содержимое — на пол. Письма из дома, фотографии, мыло, зубная щётка — всё втаптывалось в грязный линолеум.',
        next: 'ch3_s4',
    },

    ch3_s4: {
        bg: 'barracks',
        chars: [{ id: 'dragan', x: 0.5 }],
        mood: 'dread',
        speaker: 'Драган',
        text: 'О, что тут у нас? Фотка мамочки? Красивая.\n\nДраган порвал фотографию Луки пополам и бросил на пол.',
        next: 'ch3_photo_choice',
    },

    ch3_photo_choice: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.3 }, { id: 'dragan', x: 0.65 }],
        mood: 'dread',
        speaker: null,
        text: 'Половинки фотографии лежат на грязном полу. Лука побелел. Его руки трясутся.',
        choices: [
            {
                id: 'ch3_photo_grab',
                text: 'Быстро поднять обрывки фото, пока Драган не заметил.',
                spirit: 3,
                setFlag: { saved_photo: true },
                next: 'ch3_photo_grab_1',
            },
            {
                id: 'ch3_photo_freeze',
                text: 'Замереть. Любое движение — повод для побоев.',
                spirit: -2,
                next: 'ch3_photo_freeze_1',
            },
            {
                id: 'ch3_photo_speak',
                text: '«Зачем? Это просто фотография.»',
                spirit: -5,
                setFlag: { challenged_dragan: true },
                next: 'ch3_photo_speak_1',
            },
        ],
    },

    ch3_photo_grab_1: {
        bg: 'barracks',
        chars: [{ id: 'dragan', x: 0.65 }],
        mood: 'dread',
        speaker: null,
        text: 'Марко наклонился и подобрал обе половинки. Сунул в карман. Драган не заметил — он уже перешёл к следующей тумбочке.\n\nПозже, в темноте, Марко отдаст фото Луке. Тот склеит его скотчем из медсанчасти.',
        spiritMod: 2,
        next: 'ch3_s5',
    },

    ch3_photo_freeze_1: {
        bg: 'barracks',
        chars: [{ id: 'dragan', x: 0.65 }],
        mood: 'dread',
        speaker: null,
        text: 'Марко стоял, стиснув зубы. Половинки фотографии лежали на полу, и по ним прошлись чьи-то сапоги.\n\nВечером Лука искал обрывки. Нашёл только один — маму без лица.',
        spiritMod: -2,
        next: 'ch3_s5',
    },

    ch3_photo_speak_1: {
        bg: 'barracks',
        chars: [{ id: 'dragan', x: 0.5 }],
        mood: 'dread',
        sfx: 'impact',
        speaker: 'Драган',
        text: 'Что ты сказал? «Просто фотография»? А ты — просто мясо.\n\nУдар в скулу. Марко устоял на ногах, но во рту появился вкус крови.\n\nДраган запомнит. Марко тоже.',
        spiritMod: -3,
        next: 'ch3_s5',
    },

    ch3_s5: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.3 }, { id: 'dragan', x: 0.65 }],
        mood: 'dread',
        sfx: 'impact',
        flicker: true,
        speaker: null,
        text: (function() {
            return 'Лука бросился на Драгана. Без крика, без предупреждения — просто кинулся, как загнанный зверь.\n\nДраган перехватил его одним движением, ударил в живот. Лука согнулся, упал. Драган пнул его — раз, два, три.';
        })(),
        next: 'ch3_s6',
    },

    ch3_s6: {
        bg: 'medbay',
        chars: [],
        mood: 'dark',
        ambience: '',
        speaker: null,
        text: 'Луку унесли в медсанчасть. Два сломанных ребра, разбитое лицо.\n\nВоенный фельдшер записал: «Падение с лестницы». Как всегда.',
        next: 'ch3_s7',
    },

    ch3_s7: {
        bg: 'outside',
        chars: [{ id: 'zoran', x: 0.5 }],
        mood: 'tension',
        speaker: null,
        text: 'Марко снова пошёл к капитану. На этот раз не один — с ним был ещё один призывник, Ненад.\n\nКапитан Зоран выслушал, не поднимая глаз от стакана.',
        next: 'ch3_s8',
    },

    ch3_s8: {
        bg: 'outside',
        chars: [{ id: 'zoran', x: 0.5 }],
        mood: 'tension',
        speaker: 'Капитан Зоран',
        text: 'Ребра? Бывает. Армия — не санаторий.\n\nПослушай, парень. Я через три месяца на пенсию. Мне не нужны проблемы. Тебе тоже.\n\nИди. И Ненада своего забери.',
        next: 'ch3_s9',
    },

    ch3_s9: {
        bg: 'barracks',
        chars: [{ id: 'milosh', x: 0.5 }],
        mood: 'dark',
        speaker: null,
        text: 'В казарме Марко столкнулся с Милошем — ещё одним старослужащим. Милош отличался от Горана и Драгана. Он не бил новобранцев, не орал. Но и не вмешивался.',
        next: 'ch3_s10',
    },

    ch3_s10: {
        bg: 'barracks',
        chars: [{ id: 'milosh', x: 0.5 }],
        mood: 'dark',
        speaker: 'Милош',
        text: 'Слышал про Луку. Хреново.\n\nМарко, послушай. Я не могу остановить Горана — он старше меня по сроку. Но могу дать совет: не высовывайся. Терпи. Время пройдёт.\n\nИли...',
        next: 'ch3_milosh_choice',
    },

    ch3_milosh_choice: {
        bg: 'barracks',
        chars: [{ id: 'milosh', x: 0.5 }],
        mood: 'dark',
        speaker: null,
        text: 'Милош замолчал, ожидая реакции. Его глаза — усталые, но не злые.',
        choices: [
            {
                id: 'ch3_milosh_listen',
                text: '«Говори. Я слушаю.»',
                spirit: 0,
                setFlag: { milosh_ally: true },
                next: 'ch3_s11',
            },
            {
                id: 'ch3_milosh_reject',
                text: '«Мне не нужны советы от тех, кто молчит, когда бьют.»',
                spirit: -3,
                next: 'ch3_milosh_reject_1',
            },
            {
                id: 'ch3_milosh_why',
                text: '«Почему тебе не всё равно? Ты ведь один из них.»',
                spirit: 2,
                setFlag: { milosh_questioned: true },
                next: 'ch3_milosh_why_1',
            },
        ],
    },

    ch3_milosh_reject_1: {
        bg: 'barracks',
        chars: [{ id: 'milosh', x: 0.5 }],
        mood: 'dark',
        speaker: 'Милош',
        text: 'Милош вздрогнул. Потом кивнул — медленно, тяжело.\n\n«Ты прав. Я молчу. Потому что знаю, что будет, если не молчать.\n\nНо я пытаюсь, Марко. По-своему.»\n\nОн ушёл. Марко остался один.',
        spiritMod: -2,
        next: 'ch3_s12',
    },

    ch3_milosh_why_1: {
        bg: 'barracks',
        chars: [{ id: 'milosh', x: 0.5 }],
        mood: 'dark',
        speaker: 'Милош',
        text: 'Милош долго молчал. Потом:\n\n«Потому что три года назад я был на твоём месте. И мне никто ничего не сказал. Никто не предупредил.\n\nЯ сломался, Марко. Просто это не видно снаружи.»',
        spiritMod: 2,
        setFlag: { milosh_backstory: true },
        next: 'ch3_s11',
    },

    ch3_s11: {
        bg: 'barracks',
        chars: [{ id: 'milosh', x: 0.5 }],
        mood: 'dark',
        speaker: 'Милош',
        text: 'Или подпиши контракт. Останься на сверхсрочную. Через полгода ты будешь «дедом», и никто тебя не тронет.\n\nЗнаю, звучит дико. Но тут так устроено.',
        next: 'ch3_s12',
    },

    ch3_s12: {
        bg: 'night_barracks',
        chars: [],
        mood: 'dread',
        ambience: 'rain',
        speaker: null,
        text: 'Той ночью Горан устроил самую жестокую побудку. Заставил призывников ползти по коридору, пока Драган лил на пол воду.\n\nОдин из новобранцев — Ненад — не встал. Его увезли на скорой.',
        next: 'ch3_s13',
    },

    ch3_s13: {
        bg: 'barracks',
        chars: [],
        mood: 'dread',
        speaker: null,
        text: 'Ненад не вернулся. Говорили — комиссовали. Или перевели. Никто точно не знал.\n\nГоран ходил довольный, как кот. «Одним духом меньше — одной проблемой меньше».\n\nЧто-то внутри Марко менялось. Страх уступал место чему-то другому. Чему-то тёмному.',
        next: 'ch3_choice',
    },

    ch3_choice: {
        bg: 'night_barracks',
        chars: [],
        mood: 'dread',
        speaker: null,
        text: 'Ночь. Тишина. Марко лежит на койке и думает. Впереди ещё месяцы этого ада. Нужно решить — что делать дальше.',
        choices: [
            {
                id: 'ch3_endure',
                text: 'Терпеть. Время пройдёт, это не навсегда.',
                spirit: 10,
                setFlag: { ch3: 'endure' },
                next: 'ch3_endure_1',
            },
            {
                id: 'ch3_revenge',
                text: 'Начать планировать. Горан должен заплатить.',
                spirit: -15,
                setFlag: { ch3: 'revenge' },
                next: 'ch3_revenge_1',
            },
            {
                id: 'ch3_escape',
                text: 'Попытаться сбежать. Найти дыру в заборе.',
                spirit: -5,
                setFlag: { ch3: 'escape' },
                next: 'ch3_escape_1',
            },
        ],
    },

    ch3_endure_1: {
        bg: 'barracks',
        chars: [],
        mood: 'dark',
        speaker: null,
        text: 'Марко решил терпеть. Закрыть глаза, стиснуть зубы, считать дни.\n\nОн начал отмечать числа на стене за шкафом — маленькие царапины ногтем. Каждая черточка — один прожитый день.',
        next: 'ch3_endure_2',
    },

    ch3_endure_2: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5 }],
        mood: 'calm',
        speaker: 'Лука',
        text: 'Лука вернулся из медсанчасти через неделю. Тихий, с забинтованными рёбрами.\n\n«Мы выживем, Марко. Но мне нужен план. Не просто терпеть — а как-то... бороться. По-умному.»',
        spiritMod: 3,
        next: 'ch3_plan_choice',
    },

    ch3_plan_choice: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5 }],
        mood: 'dark',
        speaker: null,
        text: 'Лука смотрит серьёзно. Он ждёт идеи.',
        choices: [
            {
                id: 'ch3_plan_document',
                text: '«Будем записывать всё. Даты, имена, травмы. Для прокуратуры.»',
                spirit: 5,
                setFlag: { documenting: true },
                next: 'ch3_plan_document_1',
            },
            {
                id: 'ch3_plan_invisible',
                text: '«Станем невидимыми. Не выделяться. Пережить — и забыть.»',
                spirit: 2,
                next: 'ch3_plan_invisible_1',
            },
            {
                id: 'ch3_plan_together',
                text: '«Объединить остальных призывников. Вместе нас не сломать.»',
                spirit: 3,
                setFlag: { united: true },
                next: 'ch3_plan_together_1',
            },
        ],
    },

    ch3_plan_document_1: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5 }],
        mood: 'dark',
        speaker: 'Лука',
        text: '«Прокуратура...» Лука задумался. Потом кивнул.\n\n«Мне дали тетрадь в медсанчасти. Буду писать мелко, между строк. Даты, кто, что, какие следы.»\n\nОпасный план. Но хоть какой-то.',
        spiritMod: 2,
        next: 'ch3_end',
    },

    ch3_plan_invisible_1: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5 }],
        mood: 'dark',
        speaker: 'Лука',
        text: '«Невидимыми... да. Серые мыши. Не первые, не последние. Середина строя.»\n\nЛука грустно улыбнулся.\n\n«Я уже почти невидимый. Осталось научить тебя.»',
        next: 'ch3_end',
    },

    ch3_plan_together_1: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5 }],
        mood: 'dark',
        speaker: 'Лука',
        text: '«Объединить? Кого — Ненада, которого трясёт от каждого звука? Или тех двоих, которые уже сами начали бить младших?»\n\nПауза.\n\n«Но... можно попробовать. Хотя бы трое-четверо. Этого хватит.»',
        spiritMod: 2,
        setFlag: { has_group: true },
        next: 'ch3_end',
    },

    ch3_revenge_1: {
        bg: 'night_barracks',
        chars: [],
        mood: 'dread',
        speaker: null,
        text: 'В голове Марко начал складываться план. Пока неясный, как утренний туман, но с каждым днём — чётче.\n\nСкоро учения по стрельбе. Впервые в руках окажется настоящее оружие. Настоящие патроны.',
        next: 'ch3_revenge_2',
    },

    ch3_revenge_2: {
        bg: 'night_barracks',
        chars: [],
        mood: 'dread',
        speaker: null,
        text: 'Мысль была страшной. Марко гнал её, но она возвращалась, как навязчивый шёпот.\n\nОн знал, что переступает черту. Но после всего, что произошло... есть ли ещё черта?',
        spiritMod: -5,
        next: 'ch3_end',
    },

    ch3_escape_1: {
        bg: 'outside',
        chars: [],
        mood: 'tension',
        ambience: 'rain_wind',
        speaker: null,
        text: 'Три ночи Марко изучал забор. Нашёл место — у старого склада, где проволока провисла и бетон треснул.\n\nНа четвёртую ночь он попытался.',
        next: 'ch3_escape_2',
    },

    ch3_escape_2: {
        bg: 'outside',
        chars: [{ id: 'milosh', x: 0.5 }],
        mood: 'tension',
        speaker: null,
        text: 'Его поймал Милош. Не Горан — Милош.\n\nСтарослужащий стоял у склада и курил. Молча посмотрел на Марко, на его рюкзак. Покачал головой.',
        next: 'ch3_escape_react_choice',
    },

    ch3_escape_react_choice: {
        bg: 'outside',
        chars: [{ id: 'milosh', x: 0.5 }],
        mood: 'tension',
        speaker: null,
        text: 'Милош молча курит. Ждёт. Рюкзак на плече тянет вниз.',
        choices: [
            {
                id: 'ch3_escape_beg',
                text: '«Пожалуйста, не сдавай. Я не могу больше.»',
                spirit: -3,
                next: 'ch3_escape_beg_1',
            },
            {
                id: 'ch3_escape_defiant',
                text: '«Что, доложишь Горану? Давай.»',
                spirit: -5,
                next: 'ch3_escape_defiant_1',
            },
        ],
    },

    ch3_escape_beg_1: {
        bg: 'outside',
        chars: [{ id: 'milosh', x: 0.5 }],
        mood: 'dark',
        speaker: 'Милош',
        text: 'Милош затушил сигарету. Тихо:\n\n«Я знаю, Марко. Знаю. Но побег — это не выход. Это конец.\n\nВозвращайся. Я промолчу.»',
        next: 'ch3_escape_3',
    },

    ch3_escape_defiant_1: {
        bg: 'outside',
        chars: [{ id: 'milosh', x: 0.5 }],
        mood: 'tension',
        speaker: 'Милош',
        text: '«Нет, не доложу. Я не Горан.»\n\nМилош подошёл ближе. Голос стал жёстче:\n\n«Но ты сам себя погубишь. За побег — трибунал. Два года. Подумай.»',
        spiritMod: -2,
        next: 'ch3_escape_3',
    },

    ch3_escape_3: {
        bg: 'outside',
        chars: [{ id: 'milosh', x: 0.5 }],
        mood: 'dark',
        speaker: 'Милош',
        text: 'Не надо, Марко. За побег — трибунал. Два года тюрьмы. А там хуже, чем здесь.\n\nВозвращайся. Я никому не скажу.\n\nНо больше не пробуй. В следующий раз поймает не я.',
        spiritMod: -3,
        next: 'ch3_end',
    },

    ch3_end: {
        bg: 'outside',
        chars: [],
        mood: 'dark',
        ambience: 'wind',
        speaker: null,
        text: 'Зима подходила к концу. Снег таял, обнажая грязь и мусор. Как эта часть — под тонким слоем порядка скрывалась гниль.\n\nВпереди — учения по стрельбе. Впереди — решение, которое изменит всё.',
        next: 'ch4_s1',
    },

    // ============================================================
    // CHAPTER 4: РЕШЕНИЕ (10+ scenes)
    // ============================================================

    ch4_s1: {
        chapter: 4,
        bg: 'barracks',
        chars: [],
        mood: 'tension',
        ambience: '',
        speaker: null,
        text: 'Весна. Мокрый ветер, запах оттаявшей земли.\n\nОбъявили учения по стрельбе — через неделю. Первый раз за всю службу призывникам выдадут боевое оружие.',
        next: 'ch4_s2',
    },

    ch4_s2: {
        bg: 'barracks',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'tension',
        speaker: 'Сержант Горан',
        text: 'Учения, значит. Дадут вам пострелять по мишеням. Может, научитесь хоть что-то делать правильно.\n\nТолько попробуйте опозорить меня перед комиссией. Пожалеете, что родились.',
        next: 'ch4_s3',
    },

    ch4_s3: {
        bg: 'parade',
        chars: [],
        mood: 'tension',
        ambience: 'wind',
        speaker: null,
        text: 'Неделя подготовки. Строевая, физо, теория оружия. Горан гонял их до изнеможения — ему нужна была «картинка» для комиссии.\n\nИрония: чтобы произвести впечатление, он на неделю перестал бить.',
        next: 'ch4_s4',
    },

    ch4_s4: {
        bg: 'barracks',
        chars: [{ id: 'milosh', x: 0.5 }],
        mood: 'dark',
        speaker: null,
        text: 'Милош нашёл Марко в курилке вечером. Огляделся, убедился, что рядом никого.',
        next: 'ch4_s5',
    },

    ch4_s5: {
        bg: 'barracks',
        chars: [{ id: 'milosh', x: 0.5 }],
        mood: 'dark',
        speaker: 'Милош',
        text: 'Марко, разговор есть. Серьёзный.\n\nЯ вижу, как ты держишься. Ты крепкий. Таких мало. Подумай — может, стоит подписать контракт? Остаться на сверхсрочную.\n\nЧерез полгода ты будешь «своим». Горан не тронет. Наоборот — станешь с ним за одним столом.',
        next: 'ch4_s6',
    },

    ch4_s6: {
        bg: 'barracks',
        chars: [{ id: 'milosh', x: 0.5 }],
        mood: 'dark',
        speaker: 'Милош',
        text: 'Я знаю, о чём ты думаешь. «Стать таким же?» Нет. Не обязательно.\n\nМожно просто... жить. Нормально есть, нормально спать. Без побоев. Без страха.\n\nПодумай. Бланки у меня.',
        next: 'ch4_react_choice',
    },

    ch4_react_choice: {
        bg: 'barracks',
        chars: [{ id: 'milosh', x: 0.5 }],
        mood: 'dark',
        speaker: null,
        text: 'Милош ждёт ответа. Бланк контракта — в нагрудном кармане его кителя.',
        choices: [
            {
                id: 'ch4_react_consider',
                text: '«Дай подумать до учений.»',
                spirit: 0,
                setFlag: { considering_contract: true },
                next: 'ch4_react_consider_1',
            },
            {
                id: 'ch4_react_refuse',
                text: '«Нет. Я уеду отсюда. Свободным.»',
                spirit: 5,
                setFlag: { refused_contract: true },
                next: 'ch4_react_refuse_1',
            },
            {
                id: 'ch4_react_conditions',
                text: '«Какие условия? Что конкретно я должен делать?»',
                spirit: -2,
                setFlag: { asked_conditions: true },
                next: 'ch4_react_conditions_1',
            },
        ],
    },

    ch4_react_consider_1: {
        bg: 'barracks',
        chars: [{ id: 'milosh', x: 0.5 }],
        mood: 'dark',
        speaker: 'Милош',
        text: '«Хорошо. Подумай. Но не тяни — после учений будет поздно. Комиссия уедет, и бланки уедут с ней.»\n\nМилош хлопнул Марко по плечу и ушёл.',
        next: 'ch4_s7',
    },

    ch4_react_refuse_1: {
        bg: 'barracks',
        chars: [{ id: 'milosh', x: 0.5 }],
        mood: 'dark',
        speaker: 'Милош',
        text: '«Свободным...»\n\nМилош усмехнулся — без злости, с чем-то похожим на зависть.\n\n«Ладно, Марко. Уважаю. Но если передумаешь — ты знаешь, где меня найти.»',
        spiritMod: 3,
        next: 'ch4_s7',
    },

    ch4_react_conditions_1: {
        bg: 'barracks',
        chars: [{ id: 'milosh', x: 0.5 }],
        mood: 'dark',
        speaker: 'Милош',
        text: '«Условия? Три года службы. Зарплата — копейки, но кормёжка, жильё, форма. Через полгода — ефрейтор. Через год — сержант.\n\nИ да — ты будешь поддерживать порядок. Как Горан. Это... часть работы.»\n\nМарко молча кивнул. Информация для размышления.',
        spiritMod: -1,
        next: 'ch4_s7',
    },

    ch4_s7: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5 }],
        mood: 'dark',
        ambience: 'rain',
        speaker: null,
        text: 'Марко нашёл Луку на его койке. Тот читал письмо из дома — помятое, перечитанное десятки раз.',
        next: 'ch4_s8',
    },

    ch4_s8: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5 }],
        mood: 'dark',
        speaker: 'Лука',
        text: 'Мама пишет, что ждёт. Каждый день ходит на почту.\n\nМарко, ты ведь не подпишешь контракт? Скажи мне, что не подпишешь.\n\nМне нужно знать, что хоть кто-то отсюда вернётся нормальным человеком.',
        next: 'ch4_promise_choice',
    },

    ch4_promise_choice: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5 }],
        mood: 'dark',
        speaker: null,
        text: 'Лука смотрит снизу вверх. Письмо смято в кулаке. Глаза блестят.',
        choices: [
            {
                id: 'ch4_promise_yes',
                text: '«Обещаю, Лука. Не подпишу. Мы оба вернёмся.»',
                spirit: 5,
                setFlag: { promised_luka: true },
                next: 'ch4_promise_yes_1',
            },
            {
                id: 'ch4_promise_honest',
                text: '«Я не знаю, Лука. Честно — не знаю.»',
                spirit: -2,
                next: 'ch4_promise_honest_1',
            },
            {
                id: 'ch4_promise_deflect',
                text: '«Расскажи мне про маму. Что она пишет?»',
                spirit: 2,
                next: 'ch4_promise_deflect_1',
            },
        ],
    },

    ch4_promise_yes_1: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5 }],
        mood: 'calm',
        speaker: 'Лука',
        text: 'Лука выдохнул. Плечи опустились — напряжение, которое держало его неделями, ослабло на секунду.\n\n«Спасибо, Марко. Это... это важно. Для меня.»\n\nОн снова развернул письмо и начал читать — на этот раз с тенью улыбки.',
        spiritMod: 3,
        next: 'ch4_s9',
    },

    ch4_promise_honest_1: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5 }],
        mood: 'dark',
        speaker: 'Лука',
        text: 'Лука опустил голову. Долго молчал.\n\n«Хотя бы честно. Спасибо и за это.»\n\nОн лёг на койку лицом к стене. Письмо осталось лежать на подушке — раскрытое, как рана.',
        spiritMod: -1,
        next: 'ch4_s9',
    },

    ch4_promise_deflect_1: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5 }],
        mood: 'calm',
        speaker: 'Лука',
        text: '«Мама...» — Лука впервые за недели улыбнулся.\n\n«Пишет, что посадила помидоры. Что кот опять разодрал занавески. Что соседка родила двойню.»\n\nОбычная жизнь. Нормальная, простая жизнь — где-то там, за забором.',
        spiritMod: 2,
        next: 'ch4_s9',
    },

    ch4_s9: {
        bg: 'night_barracks',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'dread',
        sfx: 'impact',
        flicker: true,
        speaker: null,
        text: 'Последняя ночь перед учениями.\n\nГоран пришёл. На этот раз — один, без Драгана. Тихо, почти нежно, подошёл к койке Марко.',
        next: 'ch4_s10',
    },

    ch4_s10: {
        bg: 'night_barracks',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'dread',
        speaker: 'Сержант Горан',
        text: 'Не спишь? Правильно.\n\nЗавтра учения. Будут патроны, будут автоматы. И я знаю, о чём ты думаешь.\n\nНе вздумай. Я таких, как ты, видел десятки. Все думали — все передумали. Потому что знали: я их достану. Даже с того света.\n\nСпи, дух. Завтра тяжёлый день.',
        next: 'ch4_s11',
    },

    ch4_s11: {
        bg: 'range',
        chars: [],
        mood: 'tension',
        ambience: 'wind',
        sfx: 'footsteps',
        speaker: null,
        text: 'Утро. Полигон.\n\nСерое небо, ветер несёт запах пороха с прошлых стрельб. Мишени стоят в ряд — чёрные силуэты на фоне леса.\n\nОфицер из комиссии — полковник с уставшим лицом — наблюдает с вышки.',
        next: 'ch4_s12',
    },

    ch4_s12: {
        bg: 'range',
        chars: [{ id: 'goran', x: 0.3 }, { id: 'dragan', x: 0.7 }],
        mood: 'tension',
        speaker: null,
        text: 'Автоматы раздали. Тяжёлые, промасленные, пахнущие металлом и смазкой.\n\nМарко сжал цевьё. Оружие в руках — впервые за всю службу. Настоящее. С патронами.',
        next: 'ch4_choice',
    },

    ch4_choice: {
        bg: 'range',
        chars: [{ id: 'goran', x: 0.3 }, { id: 'dragan', x: 0.7 }],
        mood: 'dread',
        speaker: null,
        text: 'Автомат в руках. Горан стоит в двадцати метрах, спиной к тебе, что-то говорит Драгану.\n\nЭто момент. Тот самый. Решение, которое определит всё.',
        choices: [
            {
                id: 'ch4_endure',
                text: 'Стрелять по мишеням. Дотерпеть. Вернуться домой.',
                spirit: 15,
                setFlag: { ch4: 'endure', ending_path: 'survivor' },
                next: 'ch4_endure_1',
            },
            {
                id: 'ch4_contract',
                text: 'Вспомнить слова Милоша. Может, контракт — выход.',
                spirit: 0,
                setFlag: { ch4: 'contract', ending_path: 'system' },
                next: 'ch4_contract_1',
            },
            {
                id: 'ch4_weapon',
                text: 'Развернуть оружие. Хватит.',
                spirit: -25,
                setFlag: { ch4: 'weapon', ending_path: 'lastshot' },
                next: 'ch4_weapon_1',
            },
        ],
    },

    ch4_endure_1: {
        bg: 'range',
        chars: [],
        mood: 'tension',
        speaker: null,
        text: 'Марко поднял автомат. Мишень. Просто мишень — чёрный силуэт на фоне серого неба.\n\nВыстрел. Отдача толкнула в плечо. Пуля ушла в цель. Второй выстрел. Третий.\n\nКаждый выстрел — как выдох. Как будто с пулями уходила ярость.',
        next: 'ch4_endure_2',
    },

    ch4_endure_2: {
        bg: 'range',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'tension',
        speaker: 'Сержант Горан',
        text: 'Неплохо, Марко. Неплохо. Может, хоть стрелять научился за эти месяцы.',
        next: 'ch4_endure_reflect',
    },

    ch4_endure_reflect: {
        bg: 'range',
        chars: [],
        mood: 'dark',
        speaker: null,
        text: 'Горан отвернулся. Автомат ещё в руках. Мишень — впереди. Горан — сбоку.\n\nМысль мелькнула — быстро, как вспышка.',
        choices: [
            {
                id: 'ch4_reflect_peace',
                text: 'Нет. Это не я. Сдать автомат.',
                spirit: 10,
                next: 'ch4_endure_3',
            },
            {
                id: 'ch4_reflect_hesitate',
                text: 'Задержать взгляд на Горане... и сдать автомат.',
                spirit: 2,
                setFlag: { hesitated: true },
                next: 'ch4_endure_hesitate_1',
            },
        ],
    },

    ch4_endure_hesitate_1: {
        bg: 'range',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'tension',
        speaker: null,
        text: 'Горан перехватил его взгляд. На секунду — только на секунду — в глазах сержанта мелькнул страх. Настоящий, животный страх.\n\nПотом Марко сдал автомат. Руки не дрожали.\n\nГоран больше не подходил к нему до конца учений.',
        spiritMod: 2,
        next: 'ch4_endure_3',
    },

    ch4_endure_3: {
        bg: 'range',
        chars: [],
        mood: 'dark',
        speaker: null,
        text: 'Марко сдал автомат. Руки не дрожали.\n\nОн выбрал — дотерпеть. Вернуться домой. Жить дальше, какой бы ни была эта жизнь.\n\nЧерез три месяца — демобилизация. Девяносто дней. Он будет считать каждый.',
        next: 'ch5_survivor_1',
    },

    ch4_contract_1: {
        bg: 'range',
        chars: [],
        mood: 'dark',
        speaker: null,
        text: 'Марко стрелял по мишеням. Механически, точно. Потом сдал автомат и пошёл искать Милоша.\n\nСлова крутились в голове: «Станешь своим. Нормально есть, нормально спать. Без побоев.»',
        next: 'ch4_contract_2',
    },

    ch4_contract_2: {
        bg: 'barracks',
        chars: [{ id: 'milosh', x: 0.5 }],
        mood: 'dark',
        speaker: 'Марко',
        text: 'Милош. Дай бланк контракта.',
        next: 'ch4_contract_3',
    },

    ch4_contract_3: {
        bg: 'barracks',
        chars: [{ id: 'milosh', x: 0.5 }],
        mood: 'dark',
        speaker: 'Милош',
        text: 'Ты уверен?\n\n...Хорошо. Вот. Подпиши здесь и здесь.\n\nДобро пожаловать в систему, Марко.',
        next: 'ch5_system_1',
    },

    ch4_weapon_1: {
        bg: 'range',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'dread',
        sfx: 'footsteps',
        speaker: null,
        text: 'Марко поднял автомат. Мишень была впереди — чёрный силуэт.\n\nНо он не видел мишень. Он видел Горана. Его широкую спину, его затылок.\n\nМир замедлился. Звуки стали далёкими, как сквозь воду.',
        next: 'ch4_weapon_2',
    },

    ch4_weapon_2: {
        bg: 'range',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'dread',
        speaker: null,
        text: 'Руки двигались сами. Ствол повернулся влево — мимо мишеней, мимо деревьев.\n\nНа Горана.\n\nСекунда. Тишина. Палец на спусковом крючке.',
        next: 'ch5_lastshot_1',
    },


    // ============================================================
    // CHAPTER 5: ФИНАЛ — КОНЦОВКА 1 (Выживший)
    // ============================================================

    ch5_survivor_1: {
        chapter: 5,
        bg: 'barracks',
        chars: [],
        mood: 'dark',
        ambience: 'rain',
        speaker: null,
        text: 'Три месяца. Девяносто дней.\n\nМарко считал каждый. Царапины на стене за шкафом множились — ровные, аккуратные, как зарубки на прикладе.',
        next: 'ch5_survivor_2',
    },

    ch5_survivor_2: {
        bg: 'barracks',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'tension',
        speaker: null,
        text: 'Горан не стал мягче. Побои продолжались — ночные побудки, унижения, бессмысленная муштра. Но теперь Марко знал: у этого есть конец.\n\nОн научился отключаться. Тело терпело, а разум уходил куда-то далеко — домой, к матери, к запаху хлеба на кухне.',
        next: 'ch5_survivor_3',
    },

    ch5_survivor_3: {
        bg: 'barracks',
        chars: [{ id: 'luka', x: 0.5 }],
        mood: 'dark',
        speaker: null,
        text: (function() {
            return 'Лука тоже держался. Они не говорили об этом вслух — просто были рядом. Иногда этого достаточно.\n\nНочами они лежали на своих койках и молчали. В этом молчании было больше, чем в словах.';
        })(),
        next: 'ch5_survivor_4',
    },

    ch5_survivor_4: {
        bg: 'outside',
        chars: [],
        mood: 'hope',
        ambience: 'wind',
        speaker: null,
        text: 'Ноябрь. Серое утро. Моросит дождь.\n\nНа доске объявлений — список демобилизованных. Марко нашёл свою фамилию. Буквы расплывались — не от дождя, от слёз, которые он не мог сдержать.',
        next: 'ch5_survivor_5',
    },

    ch5_survivor_5: {
        bg: 'barracks',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'dark',
        speaker: 'Сержант Горан',
        text: 'Уезжаешь, значит? Ну, бывай, Марко.\n\nТы был крепким. Крепче большинства. Не забудешь меня, а?\n\nГоран усмехнулся. В его глазах не было ни раскаяния, ни злости — только пустота.',
        next: 'ch5_farewell_choice',
    },

    ch5_farewell_choice: {
        bg: 'barracks',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'dark',
        speaker: null,
        text: 'Горан протянул руку. Рукопожатие — традиция.',
        choices: [
            {
                id: 'ch5_farewell_shake',
                text: 'Пожать руку. Молча. Это просто рука.',
                spirit: 3,
                next: 'ch5_farewell_shake_1',
            },
            {
                id: 'ch5_farewell_refuse',
                text: 'Развернуться и уйти. Без слов.',
                spirit: 5,
                next: 'ch5_farewell_refuse_1',
            },
            {
                id: 'ch5_farewell_speak',
                text: '«Я тебя не забуду, Горан. Точно.»',
                spirit: -3,
                setFlag: { threatened_goran: true },
                next: 'ch5_farewell_speak_1',
            },
        ],
    },

    ch5_farewell_shake_1: {
        bg: 'barracks',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'dark',
        speaker: null,
        text: 'Марко пожал руку. Крепко — может, слишком крепко.\n\nГоран усмехнулся. Отпустил.\n\n«Бывай, дух.»\n\nВ последний раз. В последний, чёртов раз.',
        next: 'ch5_survivor_6',
    },

    ch5_farewell_refuse_1: {
        bg: 'barracks',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'tension',
        speaker: null,
        text: 'Марко посмотрел на протянутую руку. На ту самую руку, которая держала ремень.\n\nМолча развернулся и пошёл к выходу. За спиной — тишина.\n\nГоран опустил руку. Впервые за долгое время он выглядел... растерянным.',
        spiritMod: 3,
        next: 'ch5_survivor_6',
    },

    ch5_farewell_speak_1: {
        bg: 'barracks',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'tension',
        speaker: 'Сержант Горан',
        text: 'Горан прищурился. Улыбка сползла.\n\n«Это что, угроза, дух? Ты же знаешь — никто тебе не поверит.»\n\nМарко промолчал. Развернулся. Ушёл.\n\nНо они оба знали: это были не пустые слова.',
        spiritMod: -2,
        next: 'ch5_survivor_6',
    },

    ch5_survivor_6: {
        bg: 'outside',
        chars: [{ id: 'luka', x: 0.5 }],
        mood: 'hope',
        speaker: 'Лука',
        text: 'Мне ещё месяц. Но я дождусь, Марко. Обещаю.\n\nСпасибо. За всё.',
        next: 'ch5_survivor_7',
    },

    ch5_survivor_7: {
        bg: 'outside',
        chars: [],
        mood: 'ending',
        ambience: 'rain',
        speaker: null,
        text: 'Автобус стоял у ворот — тот же, что привёз его сюда год назад. Или другой. Какая разница.\n\nМарко закинул рюкзак на плечо — тот же потёртый рюкзак. Только сам он стал другим.',
        next: 'ch5_survivor_8',
    },

    ch5_survivor_8: {
        bg: 'outside',
        chars: [],
        mood: 'ending',
        speaker: null,
        text: 'Он не обернулся. Не посмотрел на казарму, на плац, на забор с колючей проволокой.\n\nДвери закрылись. Автобус тронулся. За окном поплыли серые поля, мокрые деревья, низкое небо.\n\nМарко свободен.',
        ending: 'survivor',
    },

    // ============================================================
    // CHAPTER 5: ФИНАЛ — КОНЦОВКА 2 (Система)
    // ============================================================

    ch5_system_1: {
        chapter: 5,
        bg: 'barracks',
        chars: [{ id: 'milosh', x: 0.5 }],
        mood: 'dark',
        ambience: '',
        speaker: null,
        text: 'Контракт подписан. Три года сверхсрочной службы.\n\nЛука узнал первым. Посмотрел на Марко — долго, молча. Потом отвернулся. Больше они не разговаривали.',
        next: 'ch5_system_2',
    },

    ch5_system_2: {
        bg: 'barracks',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'tension',
        speaker: 'Сержант Горан',
        text: 'О! Марко решил остаться? Правильный выбор, парень. Правильный.\n\nТеперь ты — один из нас. Добро пожаловать.\n\nГоран впервые протянул ему руку. Рукопожатие было крепким и холодным.',
        next: 'ch5_system_3',
    },

    ch5_system_3: {
        bg: 'mess',
        chars: [{ id: 'goran', x: 0.3 }, { id: 'dragan', x: 0.7 }],
        mood: 'dark',
        speaker: null,
        text: 'Впервые Марко сел за стол с «дедами». Нормальная еда — не каша, а мясо. Нормальный чай. Сигареты.\n\nДраган хлопнул его по плечу: «Свой парень!»\n\nМарко улыбнулся. И сам не узнал эту улыбку.',
        next: 'ch5_system_4',
    },

    ch5_system_4: {
        bg: 'barracks',
        chars: [],
        mood: 'dark',
        speaker: null,
        text: 'Прошло полгода. Потом — год.\n\nМарко получил лычки. Новая форма, новая койка — нижняя, у окна. Новые призывники смотрели на него снизу вверх.',
        next: 'ch5_system_doubt_choice',
    },

    ch5_system_doubt_choice: {
        bg: 'night_barracks',
        chars: [],
        mood: 'dark',
        speaker: null,
        text: 'Новый призывник не убрал в каптёрке. Мелочь. Но Горан посмотрел на Марко — выжидающе.\n\nТест. Проверка лояльности.',
        choices: [
            {
                id: 'ch5_system_hit',
                text: 'Ударить. Так положено. Так работает система.',
                spirit: -10,
                next: 'ch5_system_5',
            },
            {
                id: 'ch5_system_shout',
                text: 'Только крикнуть. Голосом, не кулаком.',
                spirit: -3,
                next: 'ch5_system_shout_1',
            },
            {
                id: 'ch5_system_hesitate',
                text: 'Замешкаться. Посмотреть парню в глаза.',
                spirit: 5,
                next: 'ch5_system_hesitate_1',
            },
        ],
    },

    ch5_system_shout_1: {
        bg: 'night_barracks',
        chars: [{ id: 'goran', x: 0.7, scale: 1.05 }],
        mood: 'dread',
        speaker: 'Сержант Горан',
        text: 'Марко заорал на призывника — голосом, которого сам от себя не ожидал.\n\nПарень вздрогнул. Побежал убирать.\n\nГоран хмыкнул: «Мягко. Но для начала сойдёт.»\n\nВ следующий раз пришлось ударить. И в следующий.',
        spiritMod: -3,
        next: 'ch5_system_5',
    },

    ch5_system_hesitate_1: {
        bg: 'night_barracks',
        chars: [{ id: 'goran', x: 0.7, scale: 1.05 }],
        mood: 'dread',
        speaker: 'Сержант Горан',
        text: 'Марко замер. Призывник смотрел на него — те же глаза, что год назад были у самого Марко.\n\nГоран подошёл: «Что, жалко? Ничего, привыкнешь.»\n\nИ ударил сам. А Марко стоял и смотрел.\n\nНо привыкать — пришлось.',
        spiritMod: 2,
        next: 'ch5_system_5',
    },

    ch5_system_5: {
        bg: 'night_barracks',
        chars: [{ id: 'soldier', x: 0.5 }],
        mood: 'dread',
        speaker: null,
        text: 'Первый раз он ударил новобранца ночью. Парень не убрал в каптёрке — или Марко так решил.\n\nУдар был несильный. Почти. Парень не закричал, только всхлипнул.\n\nМарко почувствовал что-то. Не удовольствие — нет. Власть. Контроль.',
        next: 'ch5_system_6',
    },

    ch5_system_6: {
        bg: 'barracks',
        chars: [],
        mood: 'dread',
        speaker: null,
        text: 'Это стало привычкой. Сначала — «за дело». Потом — просто так. Потому что можно. Потому что так устроена система.\n\nОн научился бить, как Горан — точно, без следов. Научился орать так, чтобы ломать волю одним голосом.',
        next: 'ch5_system_7',
    },

    ch5_system_7: {
        bg: 'night_barracks',
        chars: [],
        mood: 'dark',
        speaker: null,
        text: 'Иногда, глубокой ночью, когда казарма спала, Марко лежал на своей койке и вспоминал.\n\nТого восемнадцатилетнего парня с рюкзаком. Автобус. Первый день. Страх.\n\nНо воспоминание гасло — быстро, как окурок в луже.',
        next: 'ch5_system_8',
    },

    ch5_system_8: {
        bg: 'barracks',
        chars: [],
        mood: 'ending',
        speaker: null,
        text: 'Осень. Новый призыв. Автобус остановился у ворот — из него вышли пятеро парней с рюкзаками и страхом в глазах.\n\nМарко стоял у КПП и смотрел на них. Он знал, что будет дальше.\n\nПотому что он сам это теперь делал.',
        ending: 'system',
    },

    // ============================================================
    // CHAPTER 5: ФИНАЛ — КОНЦОВКА 3 (Последний выстрел)
    // ============================================================

    ch5_lastshot_1: {
        chapter: 5,
        bg: 'range',
        chars: [{ id: 'goran', x: 0.5, scale: 1.05 }],
        mood: 'dread',
        ambience: '',
        speaker: null,
        text: 'Время остановилось.\n\nМарко видел всё: серое небо, мишени, лес за ними. Горана — его спину, его руки, его затылок.',
        sfx: 'gunshot',
        next: 'ch5_lastshot_2',
    },

    ch5_lastshot_2: {
        bg: 'range',
        chars: [],
        mood: 'dread',
        flicker: true,
        sfx: 'gunshot',
        speaker: null,
        text: 'ВЫСТРЕЛ.\n\nГоран упал. Не сразу — сначала качнулся, как будто споткнулся. Потом — мешком.\n\nКрики. Хаос. Кто-то бежал, кто-то упал на землю.',
        next: 'ch5_lastshot_3',
    },

    ch5_lastshot_3: {
        bg: 'range',
        chars: [{ id: 'dragan', x: 0.5 }],
        mood: 'dread',
        sfx: 'gunshot',
        speaker: null,
        text: 'Марко повернулся. Драган стоял в пяти метрах, с открытым ртом, с белым лицом.\n\nВторой выстрел.\n\nДраган упал рядом с Гораном.',
        next: 'ch5_lastshot_4',
    },

    ch5_lastshot_4: {
        bg: 'range',
        chars: [],
        mood: 'dread',
        speaker: null,
        text: 'Тишина. Три секунды абсолютной тишины — как будто мир задержал дыхание.\n\nМарко стоял с автоматом. Дым поднимался из ствола. Пороховой запах — горький, металлический.',
        next: 'ch5_lastshot_final_choice',
    },

    ch5_lastshot_final_choice: {
        bg: 'range',
        chars: [],
        mood: 'dread',
        speaker: null,
        text: 'Два тела на земле. Автомат в руках. Офицер кричит с вышки. Мир замедлился.\n\nСекунда, чтобы решить.',
        choices: [
            {
                id: 'ch5_lastshot_continue',
                text: 'Поднять ствол к небу. Закончить.',
                spirit: -20,
                next: 'ch5_lastshot_5',
            },
            {
                id: 'ch5_lastshot_drop',
                text: 'Бросить автомат. Упасть на колени.',
                spirit: 5,
                next: 'ch5_lastshot_drop_1',
            },
        ],
    },

    ch5_lastshot_drop_1: {
        bg: 'range',
        chars: [],
        mood: 'dread',
        sfx: 'impact',
        speaker: null,
        text: 'Автомат упал в грязь. Марко рухнул на колени.\n\nРуки — в земле. Слёзы — по лицу. Крик — из горла, нечеловеческий, животный.\n\nНабежали солдаты. Навалились. Скрутили.',
        next: 'ch5_lastshot_drop_2',
    },

    ch5_lastshot_drop_2: {
        bg: 'range',
        chars: [],
        mood: 'ending',
        speaker: null,
        text: 'Трибунал. Двадцать лет строгого режима.\n\nГоран выжил — пуля прошла навылет через плечо. Драган — нет.\n\nВ камере Марко тихо. Стены — серые, как казарма. Но здесь не бьют. Здесь просто тишина.\n\nМного, много тишины.',
        ending: 'lastshot',
    },

    ch5_lastshot_5: {
        bg: 'range',
        chars: [{ id: 'zoran', x: 0.7 }],
        mood: 'dread',
        speaker: null,
        text: 'Офицер кричал что-то — далеко, как сквозь воду. Марко не слышал.\n\nОн посмотрел на небо. Серое, низкое, безразличное. Как всегда.\n\nОн почувствовал странное спокойствие.',
        next: 'ch5_lastshot_6',
    },

    ch5_lastshot_6: {
        bg: 'range',
        chars: [],
        mood: 'ending',
        sfx: 'gunshot',
        flicker: true,
        speaker: null,
        text: 'Выстрел — чужой, откуда-то сзади.\n\nМарко не почувствовал боли. Только толчок — как будто кто-то сильно толкнул в спину.\n\nЗемля приблизилась. Небо стало шире. Потом — темнота.',
        next: 'ch5_lastshot_7',
    },

    ch5_lastshot_7: {
        bg: 'range',
        chars: [],
        mood: 'ending',
        speaker: null,
        text: 'На полигоне нашли три тела.\n\nРасследование длилось неделю. Заключение: «Несчастный случай на плановых учениях».\n\nГазеты не написали ни строчки. Семья получила гроб, флаг и молчание.\n\nКазарма продолжила жить. Осенью приехали новые призывники.',
        ending: 'lastshot',
    },
};
