// Данные парка «Яг-Морт» — взяты из группы ВК vk.ru/vereypark (товары, обсуждения, посты)
const PARK = {
  name: 'Яг-Морт',
  title: 'Парк «Яг-Морт»',
  tagline: 'Пикник-парк в сосновом лесу — 25 минут от центра Сыктывкара',
  address: 'г. Сыктывкар, пгт Краснозатонский, Нювчимское шоссе, 3',
  center: [61.666219, 50.991075],
  busStop: { name: 'Остановка «Школа №9»', coords: [61.6668, 50.9810], walk: '10–15 минут по лесной дороге, следуйте стрелкам на деревьях' },
  phone: '+7 912 861-70-06',
  phoneRaw: '+79128617006',
  phoneShort: '717-006',
  email: '717006@mail.ru',
  vk: 'https://vk.com/vereypark',
  vkMessages: 'https://vk.com/im/convo/-213809195',
  adminHours: 'Администратор на территории с 9:00 до 21:00',
  byCar: [
    'Следуйте в сторону пгт Краснозатонский',
    'Проезжайте район «Грин вилидж»',
    'Поворот направо — в сторону «Технологической деревни»',
    'Через 1,5 км поверните направо и паркуйтесь',
  ],
  rules: [
    'Заселение в домики с 11:00 до 20:00, выезд до 10:00 следующего дня',
    'Позднее заселение (20:30–21:30) — по согласованию, +300 ₽ с домика',
    'Проживание с животными +500 ₽ за весь срок; с кошками нельзя',
    'Курение (в т.ч. кальян и электронные сигареты) в домике запрещено — штраф 5 000 ₽',
    'Для заселения нужен паспорт РФ на каждого гостя и свидетельство о рождении для детей',
    'Бесплатная отмена — не позднее чем за 10 суток до заезда',
    'При опоздании более чем на 10 минут на доп. услуги бронь может быть аннулирована',
    'В жару, засуху и сильный ветер костры запрещены — только мангал на специальном угле',
  ],
};

// Категории объектов на карте
const CATS = {
  house:    { label: 'Домики',     color: '#16a34a', icon: '🏡' },
  gazebo:   { label: 'Беседки',    color: '#ca8a04', icon: '⛺' },
  activity: { label: 'Активности', color: '#7c3aed', icon: '🎯' },
  service:  { label: 'Сервис',     color: '#0284c7', icon: 'ℹ️' },
};

// Позиции на карте ориентировочные — поправьте координаты под реальную схему парка
const PLACES = [
  { id: 'house1', cat: 'house', name: 'Домик «Сосна»', img: 'img/house.jpg', price: 5000, unit: 'сутки (11:00–10:00)', bookable: 'stay', coords: [61.6671, 50.9897],
    desc: 'Домик с панорамным окном на лес. Ванная комната, раскладной диван, обеденная зона, мангальная зона, садовая мебель, парковка на 2–3 машины.',
    facts: ['до 4 взрослых (макс. 8, +500 ₽ за каждого сверх 4)', '2 спальных места', 'Уголь и розжиг — за доплату'] },
  { id: 'house2', cat: 'house', name: 'Домик «Ель»', img: 'img/house.jpg', price: 5000, unit: 'сутки (11:00–10:00)', bookable: 'stay', coords: [61.6675, 50.9921],
    desc: 'Уютный домик в сосновом лесу с панорамным окном и мангальной зоной.',
    facts: ['до 4 взрослых (макс. 8)', '2 спальных места', 'Парковка рядом'] },
  { id: 'house3', cat: 'house', name: 'Домик «Кедр»', img: 'img/house.jpg', price: 5000, unit: 'сутки (11:00–10:00)', bookable: 'stay', coords: [61.6668, 50.9941],
    desc: 'Тихий домик на краю парка — только зелень, тишина и лёгкий ветерок.',
    facts: ['до 4 взрослых (макс. 8)', '2 спальных места', 'Можно с собакой (+500 ₽)'] },
  { id: 'gaz12', cat: 'gazebo', name: 'Беседка на 12 человек', img: 'img/gazebo12.jpg', price: 5000, unit: 'день (11:00–20:00)', bookable: 'day', coords: [61.6659, 50.9902],
    desc: 'Просторная беседка для компании 12+ человек: мангал, удобная мебель, парковка. Подходит для семейных праздников, корпоративов и встреч с друзьями.',
    facts: ['до 12+ гостей', 'Мангал', 'Парковка'] },
  { id: 'gaz4a', cat: 'gazebo', name: 'Беседка на 4 человека', img: 'img/gazebo4.jpg', price: 3500, unit: 'день (11:00–20:00)', bookable: 'day', coords: [61.6655, 50.9921],
    desc: 'Камерная беседка для небольшой компании в сосновом лесу.',
    facts: ['до 4 гостей', 'Мангал', 'Тишина и приватность'] },
  { id: 'gaz4b', cat: 'gazebo', name: 'Беседка на 4 человека (у поляны)', img: 'img/gazebo4.jpg', price: 3500, unit: 'день (11:00–20:00)', bookable: 'day', coords: [61.6651, 50.9895],
    desc: 'Беседка рядом с живописной поляной и сценой.',
    facts: ['до 4 гостей', 'Мангал', 'Рядом сцена'] },
  { id: 'brides', cat: 'activity', name: 'Поляна невест', img: 'img/brides.jpg', price: 5000, unit: 'аренда', bookable: 'day', coords: [61.6648, 50.9930],
    desc: 'Фотогеничная поляна для свадебных и тематических фотосессий и выездных церемоний.',
    facts: ['Фотозона', 'Выездные регистрации'] },
  { id: 'stage', cat: 'activity', name: 'Сцена на поляне', img: 'img/stage.jpg', price: 0, unit: 'по согласованию', bookable: 'day', coords: [61.6646, 50.9908],
    desc: 'Сцена на живописной поляне для концертов, праздников и мероприятий.',
    facts: ['Бесплатно', 'Мероприятия под ключ'] },
  { id: 'trail', cat: 'activity', name: 'Тропа Яг-Морта', img: 'img/trail.jpg', price: 1500, unit: 'человек', bookable: 'event', coords: [61.6680, 50.9910],
    desc: 'Прогулка по лесной тропе с историями о Яг-Морте — лесном великане из коми-легенд.',
    facts: ['Рейтинг 5,0', 'Для детей и взрослых'] },
  { id: 'rent', cat: 'service', name: 'Прокат', img: 'img/bike.jpg', price: 300, unit: 'от', bookable: 'event', coords: [61.6663, 50.9886],
    desc: 'Прокат велосипедов (500 ₽) и наборов для бадминтона (300 ₽).',
    facts: ['Велосипед — 500 ₽', 'Бадминтон — 300 ₽'] },
  { id: 'parking', cat: 'service', name: 'Парковка и вход', img: 'img/cover.jpg', price: null, unit: '', bookable: null, coords: [61.666219, 50.991075],
    desc: 'Главный въезд и парковка. Администратор на территории с 9:00 до 21:00.',
    facts: ['Звонок: 717-006'] },
];

// Услуги и события — каталог товаров группы
const SERVICES = [
  { id: 'knight', name: '«Рыцарский день»', img: 'img/knight.jpg', price: 2000, tag: 'Событие', desc: 'Тематический день в парке: рыцарские испытания и игры для всей семьи.' },
  { id: 'trail',  name: 'Тропа Яг-Морта',   img: 'img/trail.jpg',  price: 1500, tag: 'Прогулка', desc: 'Лесная тропа с легендами о Яг-Морте. Рейтинг 5,0.' },
  { id: 'quest',  name: 'Командный Хогвардс-квест', img: 'img/quest.jpg', price: 1200, oldPrice: 1500, tag: 'Квест', desc: 'Командный квест в волшебной тематике для детей и взрослых.' },
  { id: 'disco',  name: 'Пикник в лесу: детская дискотека', img: 'img/disco.jpg', price: 500, tag: 'Дети', desc: 'Танцы, игры и пикник на свежем воздухе.' },
  { id: 'bike',   name: 'Прокат велосипеда', img: 'img/bike.jpg', price: 500, tag: 'Прокат', desc: 'Покатайтесь по лесным дорожкам парка.' },
  { id: 'badm',   name: 'Прокат бадминтона', img: 'img/badminton.jpg', price: 300, tag: 'Прокат', desc: 'Ракетки и воланы для игры на поляне.' },
  { id: 'events', name: 'Тематические мероприятия', img: 'img/events.jpg', price: 0, tag: 'Событие', desc: 'Праздники в парке — следите за анонсами в группе.' },
];

const EXTRAS = {
  extraGuest: 500, // за каждого гостя сверх 4 в домике
  pet: 500,
  lateCheckin: 300,
};

const STATUSES = [
  { id: 'new',       label: 'Новые',        color: '#0284c7' },
  { id: 'confirmed', label: 'Подтверждены', color: '#16a34a' },
  { id: 'checkedin', label: 'Заселены',     color: '#7c3aed' },
  { id: 'done',      label: 'Завершены',    color: '#64748b' },
  { id: 'cancelled', label: 'Отменены',     color: '#dc2626' },
];

// Хранилище броней (localStorage — общий для приложения и админки в одном браузере)
const Store = {
  key: 'yagmort.bookings.v1',
  all() {
    try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch { return []; }
  },
  save(list) {
    try { localStorage.setItem(this.key, JSON.stringify(list)); } catch {}
  },
  add(b) { const l = this.all(); l.unshift(b); this.save(l); return b; },
  update(id, patch) { const l = this.all().map(b => b.id === id ? { ...b, ...patch } : b); this.save(l); },
  remove(id) { this.save(this.all().filter(b => b.id !== id)); },
};

const rub = n => n === 0 ? 'бесплатно' : n == null ? '' : n.toLocaleString('ru-RU') + ' ₽';
const placeById = id => PLACES.find(p => p.id === id);
const serviceById = id => SERVICES.find(s => s.id === id);

// Ключ Яндекс Карт (бесплатно: developer.tech.yandex.ru → «JavaScript API и HTTP Геокодер»). Без ключа карта работает, но с предупреждением.
const YMAPS_KEY = '';

/* ---------- Бонусная программа «Шишки Яг-Морта» ---------- */
const LOYALTY = {
  welcome: 300,          // шишек за вступление
  refFriendDiscount: 500, // скидка другу на первую бронь, ₽
  refReward: 500,        // шишек пригласившему после визита друга
  maxSpendShare: 0.3,    // шишками можно оплатить до 30% брони
  weekdayMultiplier: 2,  // пн–чт шишки ×2
  stampsForGift: 5,      // каждый 5-й визит — беседка на 4 в подарок
  levels: [
    { id: 'sprout',   name: 'Росток',         icon: '🌱', from: 0, rate: 0.05, perks: ['5% шишками с каждой брони', '300 шишек за вступление'] },
    { id: 'pine',     name: 'Сосна',          icon: '🌲', from: 2, rate: 0.07, perks: ['7% шишками с каждой брони', 'Бесплатное позднее заселение'] },
    { id: 'guardian', name: 'Хранитель леса', icon: '🛡️', from: 5, rate: 0.10, perks: ['10% шишками с каждой брони', 'Бесплатное позднее заселение', 'Подарок в день рождения'] },
  ],
};
const levelFor = visits => [...LOYALTY.levels].reverse().find(l => visits >= l.from);
const isWeekday = d => { const w = new Date(d + 'T12:00').getDay(); return w >= 1 && w <= 4; };
const refCodeFromPhone = phone => {
  const digits = String(phone).replace(/\D/g, '');
  let h = 0; for (const c of digits) h = (h * 31 + c.charCodeAt(0)) % 1679616;
  return 'YAG-' + h.toString(36).toUpperCase().padStart(4, '0');
};

const Loyalty = {
  key: 'yagmort.loyalty.v1',
  get() { try { return JSON.parse(localStorage.getItem(this.key)) || {}; } catch { return {}; } },
  set(patch) { const v = { ...this.get(), ...patch }; try { localStorage.setItem(this.key, JSON.stringify(v)); } catch {} return v; },
  // Полный расчёт по броням этого гостя: баланс, уровень, история
  summary(bookings = Store.all()) {
    const me = this.get();
    const history = [];
    if (me.joinedAt) history.push({ date: me.joinedAt.slice(0, 10), text: 'Вступление в программу', amount: LOYALTY.welcome });
    const mine = bookings.filter(b => b.mine).sort((a, b) => a.date.localeCompare(b.date));
    let visits = 0;
    for (const b of mine) {
      if (b.coinsSpent && b.status !== 'cancelled') history.push({ date: b.date, text: 'Оплата шишками: ' + b.itemName, amount: -b.coinsSpent });
      if (b.status === 'done') {
        const lvl = levelFor(visits);
        const x = isWeekday(b.date) ? LOYALTY.weekdayMultiplier : 1;
        const earn = Math.round(b.total * lvl.rate * x);
        if (earn) history.push({ date: b.date, text: `${b.itemName} · ${Math.round(lvl.rate * 100)}%${x > 1 ? ' ×2 будни' : ''}`, amount: earn });
        if (b.placeId) visits++;
      }
    }
    // награды за друзей (видно на этом устройстве или начислено администратором)
    (me.refRewards || []).forEach(r => history.push({ date: r.date, text: 'Друг пришёл по вашему коду', amount: LOYALTY.refReward }));
    const balance = me.joinedAt ? history.reduce((s, h) => s + h.amount, 0) : 0;
    const level = levelFor(visits);
    const next = LOYALTY.levels.find(l => l.from > visits);
    const giftsUsed = mine.filter(b => b.gift && b.status !== 'cancelled').length;
    const giftsAvailable = Math.floor(visits / LOYALTY.stampsForGift) - giftsUsed;
    const pending = mine.filter(b => ['new', 'confirmed', 'checkedin'].includes(b.status)).reduce((s, b) => s + Math.round(b.total * level.rate * (isWeekday(b.date) ? 2 : 1)), 0);
    const hasBooked = mine.some(b => b.status !== 'cancelled');
    return { me, joined: !!me.joinedAt, balance: Math.max(0, balance), visits, level, next, history: history.reverse(), giftsAvailable, stamps: visits % LOYALTY.stampsForGift, pending, hasBooked };
  },
};
