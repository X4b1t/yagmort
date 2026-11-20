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
  banya:    { label: 'Баня',       color: '#b45309', icon: '🧖' },
  service:  { label: 'Сервис',     color: '#0284c7', icon: 'ℹ️' },
};

// Позиции на карте ориентировочные — поправьте координаты под реальную схему парка
const PLACES = [
  { id: 'house1', cat: 'house', icon: 'img/cut/house.png', name: 'Домик «Сосна»', img: 'img/house.jpg', price: 5000, unit: 'сутки (11:00–10:00)', bookable: 'stay', coords: [61.6671, 50.9897],
    desc: 'Домик с панорамным окном на лес. Ванная комната, раскладной диван, обеденная зона, мангальная зона, садовая мебель, парковка на 2–3 машины.',
    facts: ['до 4 взрослых (макс. 8, +500 ₽ за каждого сверх 4)', '2 спальных места', 'Уголь и розжиг — за доплату'] },
  { id: 'house2', cat: 'house', icon: 'img/cut/house.png', name: 'Домик «Ель»', img: 'img/house.jpg', price: 5000, unit: 'сутки (11:00–10:00)', bookable: 'stay', coords: [61.6675, 50.9921],
    desc: 'Уютный домик в сосновом лесу с панорамным окном и мангальной зоной.',
    facts: ['до 4 взрослых (макс. 8)', '2 спальных места', 'Парковка рядом'] },
  { id: 'house3', cat: 'house', icon: 'img/cut/house.png', name: 'Домик «Кедр»', img: 'img/house.jpg', price: 5000, unit: 'сутки (11:00–10:00)', bookable: 'stay', coords: [61.6668, 50.9941],
    desc: 'Тихий домик на краю парка — только зелень, тишина и лёгкий ветерок.',
    facts: ['до 4 взрослых (макс. 8)', '2 спальных места', 'Можно с собакой (+500 ₽)'] },
  { id: 'gaz12', cat: 'gazebo', icon: 'img/cut/gazebo.png', name: 'Беседка на 12 человек', img: 'img/gazebo12_big.jpg', price: 5000, unit: 'день (11:00–20:00)', bookable: 'day', coords: [61.6659, 50.9902],
    desc: 'Просторная беседка для компании 12+ человек: мангал, удобная мебель, парковка. Подходит для семейных праздников, корпоративов и встреч с друзьями.',
    facts: ['до 12+ гостей', 'Мангал', 'Парковка'] },
  { id: 'gaz4a', cat: 'gazebo', icon: 'img/cut/gazebo.png', name: 'Беседка на 4 человека', img: 'img/gazebo4.jpg', price: 3500, unit: 'день (11:00–20:00)', bookable: 'day', coords: [61.6655, 50.9921],
    desc: 'Камерная беседка для небольшой компании в сосновом лесу.',
    facts: ['до 4 гостей', 'Мангал', 'Тишина и приватность'] },
  { id: 'gaz4b', cat: 'gazebo', icon: 'img/cut/gazebo.png', name: 'Беседка на 4 человека (у поляны)', img: 'img/gazebo4.jpg', price: 3500, unit: 'день (11:00–20:00)', bookable: 'day', coords: [61.6651, 50.9895],
    desc: 'Беседка рядом с живописной поляной и сценой.',
    facts: ['до 4 гостей', 'Мангал', 'Рядом сцена'] },
  { id: 'banya', cat: 'banya', icon: 'img/cut/banya.png', name: 'Баня Яг-Морта', img: 'img/banya.jpg', price: 5000, unit: '3 часа', bookable: 'day', coords: [61.6662, 50.9937],
    desc: 'Лесная баня с природным фасадом из необработанного бревна. Парьтесь с берёзовым веником, а потом отдыхайте в домике среди сосен.',
    facts: ['Берёзовые веники', 'Можно вместе с арендой домика', 'По предварительной записи'] },
  { id: 'brides', cat: 'activity', name: 'Поляна невест', img: 'img/brides.jpg', price: 5000, unit: 'аренда', bookable: 'day', coords: [61.6648, 50.9930],
    desc: 'Фотогеничная поляна для свадебных и тематических фотосессий и выездных церемоний.',
    facts: ['Фотозона', 'Выездные регистрации'] },
  { id: 'stage', cat: 'activity', name: 'Сцена на поляне', img: 'img/stage.jpg', price: 0, unit: 'по согласованию', bookable: 'day', coords: [61.6646, 50.9908],
    desc: 'Сцена на живописной поляне для концертов, праздников и мероприятий.',
    facts: ['Бесплатно', 'Мероприятия под ключ'] },
  { id: 'trail', cat: 'activity', name: 'Тропа Яг-Морта', img: 'img/trail.jpg', price: 1500, unit: 'человек', bookable: 'event', coords: [61.6680, 50.9910],
    desc: 'Прогулка по лесной тропе с историями о Яг-Морте — лесном великане из коми-легенд.',
    facts: ['Рейтинг 5,0', 'Для детей и взрослых'] },
  { id: 'rent', cat: 'service', icon: 'img/cut/bike.svg', name: 'Прокат', img: 'img/bike.jpg', price: 300, unit: 'от', bookable: 'event', coords: [61.6663, 50.9886],
    desc: 'Прокат велосипедов (500 ₽) и наборов для бадминтона (300 ₽).',
    facts: ['Велосипед — 500 ₽', 'Бадминтон — 300 ₽'] },
  { id: 'parking', cat: 'service', icon: 'img/cut/parking.svg', name: 'Парковка', img: 'img/cover.jpg', price: null, unit: '', bookable: null, coords: [61.668126, 50.991515],
    desc: 'Бесплатная парковка для гостей парка. У домиков есть свои места на 2–3 машины.',
    facts: ['Бесплатно', 'Рядом со входом'] },
  { id: 'entrance', cat: 'service', icon: 'img/cut/entrance.svg', name: 'Вход в парк', img: 'img/cover.jpg', price: null, unit: '', bookable: null, coords: [61.66795, 50.99118],
    desc: 'Главный вход в парк «Яг-Морт». Отсюда начинаются тропинки к домикам, беседкам и бане. Администратор на территории с 9:00 до 21:00.',
    facts: ['Администратор 9:00–21:00', 'Звонок: 717-006'] },
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
    // награды за друзей: число отдохнувших по коду приходит из базы (Api.refRewards)
    if (me.refCount > 0) history.push({ date: me.refCheckedAt || new Date().toISOString().slice(0, 10), text: `Друзья отдохнули по вашему коду: ${me.refCount}`, amount: me.refCount * LOYALTY.refReward });
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

/* ---------- База данных Supabase ---------- */
// Заполните после создания проекта: Supabase → Project Settings → API (Project URL и publishable/anon key).
// Ключ anon публичный: доступ к данным ограничен правилами из supabase.sql.
const SUPABASE_URL = 'https://rpjeusybzspgojbwlcdo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_D-7NoMziFCvFdv7h3x5Hgg_NSZyjfjY';
const REMOTE = !!(SUPABASE_URL && SUPABASE_KEY);

const newBookingId = () => 'B' + (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random()).replace(/[^a-z0-9]/gi, '').slice(0, 24).toUpperCase();
const shortId = id => String(id).slice(0, 8);

// поля в приложении (camelCase) ↔ колонки в базе (snake_case)
const COLS = { placeId: 'place_id', svcId: 'svc_id', itemName: 'item_name', coinsSpent: 'coins_spent', refDiscount: 'ref_discount', refBy: 'ref_by', loyaltyCode: 'loyalty_code', createdAt: 'created_at' };
const toRow = b => { const r = {}; ['id', 'placeId', 'svcId', 'itemName', 'date', 'guests', 'pet', 'late', 'name', 'phone', 'comment', 'base', 'total', 'coinsSpent', 'refDiscount', 'refBy', 'gift', 'loyaltyCode', 'status'].forEach(k => r[COLS[k] || k] = b[k] ?? null); return r; };
const fromRow = r => { const b = { ...r }; Object.entries(COLS).forEach(([k, c]) => { b[k] = r[c]; delete b[c]; }); return b; };

const Api = {
  session() { try { return JSON.parse(sessionStorage.getItem('yagmort.admin')) || null; } catch { return null; } },
  async req(path, { method = 'GET', body, auth = false, prefer } = {}) {
    const s = auth ? await this.fresh() : null;
    const headers = { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' };
    if (s) headers.Authorization = 'Bearer ' + s.access_token; // без сессии запрос идёт от имени anon по ключу apikey
    if (prefer) headers.Prefer = prefer;
    const r = await fetch(SUPABASE_URL + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
    if (!r.ok) throw new Error((await r.text()) || r.statusText);
    return r.status === 204 ? null : r.json().catch(() => null);
  },
  rpc(fn, args) { return this.req('/rest/v1/rpc/' + fn, { method: 'POST', body: args }); },
  // гость
  createBooking(b) { return this.req('/rest/v1/bookings', { method: 'POST', body: toRow(b), prefer: 'return=minimal' }); },
  statuses(ids) { return this.rpc('booking_statuses', { ids }); },
  cancel(id) { return this.rpc('cancel_booking', { bid: id }); },
  refRewards(code) { return this.rpc('ref_rewards', { code }); },
  busyDates(pid) { return this.rpc('busy_dates', { pid }); },
  // администратор
  async login(email, password) {
    const r = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=password', { method: 'POST', headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error_description || j.msg || 'Неверный e-mail или пароль');
    this.saveSession(j);
  },
  // письмо со ссылкой для смены пароля; ссылка вернёт на эту же страницу админки
  async recover(email) {
    const r = await fetch(SUPABASE_URL + '/auth/v1/recover?redirect_to=' + encodeURIComponent(location.origin + location.pathname), { method: 'POST', headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.msg || j.error_description || 'Не удалось отправить письмо'); }
  },
  async setPassword(password) {
    const s = await this.fresh();
    const r = await fetch(SUPABASE_URL + '/auth/v1/user', { method: 'PUT', headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + s.access_token, 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.msg || j.error_description || 'Не удалось сменить пароль');
  },
  saveSession(j) { sessionStorage.setItem('yagmort.admin', JSON.stringify({ access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Date.now() + j.expires_in * 1000, email: j.user?.email })); },
  logout() { sessionStorage.removeItem('yagmort.admin'); },
  async fresh() {
    const s = this.session();
    if (!s) throw new Error('Нужно войти');
    if (Date.now() < s.expires_at - 60000) return s;
    const r = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=refresh_token', { method: 'POST', headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: s.refresh_token }) });
    if (!r.ok) { this.logout(); throw new Error('Сессия истекла, войдите снова'); }
    this.saveSession({ ...(await r.json()), user: { email: s.email } });
    return this.session();
  },
  isAdmin() { return this.req('/rest/v1/rpc/is_admin', { method: 'POST', body: {}, auth: true }); },
  async list() { return (await this.req('/rest/v1/bookings?select=*&order=date.desc&limit=2000', { auth: true })).map(fromRow); },
  setStatus(id, status) { return this.req('/rest/v1/bookings?id=eq.' + encodeURIComponent(id), { method: 'PATCH', body: { status }, auth: true, prefer: 'return=minimal' }); },
  remove(id) { return this.req('/rest/v1/bookings?id=eq.' + encodeURIComponent(id), { method: 'DELETE', auth: true }); },
};

/* ---------- Объекты на карте: база (таблица places) или локально ---------- */
const DEFAULT_PLACES = PLACES.map(p => ({ ...p, coords: [...p.coords], facts: [...p.facts] }));
const placeToRow = (p, i = 0) => ({ id: p.id, cat: p.cat, name: p.name, img: p.img || null, icon: p.icon || null, price: p.price ?? null, unit: p.unit || null,
  bookable: p.bookable || null, lat: p.coords[0], lng: p.coords[1], descr: p.desc || '', facts: p.facts || [], sort: p.sort ?? i, active: p.active !== false });
const placeFromRow = r => ({ id: r.id, cat: r.cat, name: r.name, img: r.img, icon: r.icon, price: r.price, unit: r.unit || '', bookable: r.bookable,
  coords: [r.lat, r.lng], desc: r.descr || '', facts: r.facts || [], sort: r.sort, active: r.active });

Object.assign(Api, {
  async places(all = false) {
    const q = '/rest/v1/places?select=*&order=sort.asc' + (all ? '' : '&active=eq.true');
    return (await this.req(q, { auth: all })).filter(r => !isEventRow(r)).map(placeFromRow);
  },
  savePlace(p) { return this.req('/rest/v1/places?on_conflict=id', { method: 'POST', body: placeToRow(p), auth: true, prefer: 'resolution=merge-duplicates,return=minimal' }); },
  movePlace(id, coords) { return this.req('/rest/v1/places?id=eq.' + encodeURIComponent(id), { method: 'PATCH', body: { lat: coords[0], lng: coords[1], updated_at: new Date().toISOString() }, auth: true, prefer: 'return=minimal' }); },
  removePlace(id) { return this.req('/rest/v1/places?id=eq.' + encodeURIComponent(id), { method: 'DELETE', auth: true }); },
  // загрузка фото объекта в хранилище Supabase (публичная папка places)
  async upload(file) {
    const s = await this.fresh();
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
    const name = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;
    const r = await fetch(`${SUPABASE_URL}/storage/v1/object/places/${name}`, { method: 'POST', headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + s.access_token, 'Content-Type': file.type || 'image/jpeg' }, body: file });
    if (!r.ok) throw new Error(await r.text());
    return `${SUPABASE_URL}/storage/v1/object/public/places/${name}`;
  },
});

const PlacesStore = {
  key: 'yagmort.places.v1',
  local() { try { return JSON.parse(localStorage.getItem(this.key)); } catch { return null; } },
  saveLocal(list) { try { localStorage.setItem(this.key, JSON.stringify(list)); } catch {} },
  // all = true — с выключенными (для админки)
  async load(all = false) {
    let list = null;
    if (REMOTE) { try { const rows = await Api.places(all); if (rows.length) list = rows; } catch {} }
    list ||= this.local() || DEFAULT_PLACES;
    return all ? list : list.filter(p => p.active !== false);
  },
  async save(p) {
    if (REMOTE) return Api.savePlace(p);
    const l = this.local() || DEFAULT_PLACES.map(x => ({ ...x }));
    const i = l.findIndex(x => x.id === p.id);
    i >= 0 ? (l[i] = p) : l.push(p);
    this.saveLocal(l);
  },
  async move(id, coords) {
    if (REMOTE) return Api.movePlace(id, coords);
    const l = this.local() || DEFAULT_PLACES.map(x => ({ ...x }));
    const p = l.find(x => x.id === id); if (p) p.coords = coords;
    this.saveLocal(l);
  },
  async remove(id) {
    if (REMOTE) return Api.removePlace(id);
    this.saveLocal((this.local() || DEFAULT_PLACES).filter(x => x.id !== id));
  },
};
// подменяет содержимое PLACES (на него ссылаются все экраны)
const applyPlaces = list => { PLACES.splice(0, PLACES.length, ...list); };

/* ---------- События, программы и акции ----------
   Активности из группы ВК (SERVICES) видны гостям сразу. Идеи ниже — предложения владельцу:
   они лежат черновиками в админке, пока администратор не нажмёт «Показать гостям». */
const IDEAS = [
  { id: 'banya-thursday', tag: 'Акция', name: 'Банный четверг', img: 'img/banya.jpg', price: 8000, oldPrice: 10000, when: 'пн–чт, весь сезон',
    desc: 'Баня на 3 часа и домик на сутки в будни со скидкой 20%. Веники и чай включены.',
    pitch: 'Заполняет будни, когда домики пустуют. Работает вместе с шишками ×2 в будни из бонусной программы.' },
  { id: 'legends-night', tag: 'Событие', name: 'Ночь легенд Яг-Морта', img: 'img/trail.jpg', price: 1200, when: 'каждую пятницу, 19:00',
    desc: 'Вечерняя прогулка по лесной тропе с фонарями. Рассказчик ведёт по местам коми-легенд о лесном великане Яг-Морте, в конце — иван-чай у костра.',
    pitch: 'Формат, которого нет у конкурентов: он вырастает из названия парка. Затраты — гид, фонари и чай.' },
  { id: 'new-year-trail', tag: 'Событие', name: 'Новогодняя тропа: Дед Мороз в гостях у Яг-Морта', img: 'img/cover.jpg', price: 1800, when: '20–30 декабря, 11:00 и 15:00',
    desc: 'Детский квест по зимнему лесу: задания от Яг-Морта, встреча с Дедом Морозом, подарок и горячий чай.',
    pitch: 'Пик семейного спроса в году. Билеты продаются заранее, гости заодно бронируют домики на праздники.' },
  { id: 'maslenitsa', tag: 'Событие', name: 'Лесная Масленица', img: 'img/events.jpg', price: 300, when: 'последние выходные Масленицы',
    desc: 'Блины, хороводы, перетягивание каната, катание с горки и сжигание чучела на поляне.',
    pitch: 'Массовый семейный праздник с недорогим входом. Окупается арендой беседок и продажей еды.' },
  { id: 'team-building', tag: 'Программа', name: 'Тимбилдинг в лесу', img: 'img/quest.jpg', price: 25000, when: 'по заявке, лучше в будни',
    desc: 'Командный квест, беседка на 12 человек, мангал и ведущий. Цена за группу до 10 человек, каждый следующий — 2 000 ₽.',
    pitch: 'Корпоративные бюджеты и загрузка в будни. Одна заявка — сразу 10–30 гостей.' },
  { id: 'birthday', tag: 'Программа', name: 'День рождения в лесу', img: 'img/disco.jpg', price: 15000, when: 'по заявке',
    desc: 'Беседка на 12 человек, квест или детская дискотека с аниматором и зона для торта. Цена за группу до 12 гостей.',
    pitch: 'Готовый пакет продавать проще, чем отдельные услуги. Дети потом зовут на праздник в парк друзей.' },
  { id: 'kort-aika-craft', tag: 'Мастер-класс', name: 'Мастерские «Кӧрт Айка»', img: 'img/events.jpg', price: 900, when: 'по субботам, 12:00',
    desc: 'Коми ремёсла от мастеров: кузнечное дело, выпечка югыдтыдорского хлеба, роспись по дереву.',
    pitch: 'У группы уже есть альбомы про «Кӧрт Айку» и югыдтыдорский хлеб. Работа с мастерами даёт контент для соцсетей и интерес туристов.' },
  { id: 'forest-party', tag: 'Событие', name: 'Forest Party', img: 'img/stage.jpg', price: 700, when: 'раз в месяц, суббота 18:00',
    desc: 'Музыкальная вечеринка на лесной сцене: диджей, гирлянды между соснами, фудкорт.',
    pitch: 'В группе уже есть альбом Forest Party на 109 фото. Если сделать её регулярной, гости будут возвращаться каждый месяц.' },
  { id: 'plein-air', tag: 'Событие', name: 'Пленэр «Лесной человек»', img: 'img/trail.jpg', price: 300, when: 'раз в сезон',
    desc: 'Конкурс для художников и художественных школ: рисуем лес и Яг-Морта, лучшие работы выставляем в парке и в группе.',
    pitch: 'Такой пленэр в парке уже проводился. Он привлекает школы и родителей, а работы участников — бесплатное оформление парка.' },
  { id: 'forest-cinema', tag: 'Событие', name: 'Кино под соснами', img: 'img/stage.jpg', price: 350, when: 'июнь–август, суббота 22:00',
    desc: 'Летние кинопоказы на сцене: пледы, попкорн и иван-чай.',
    pitch: 'Сцена уже есть, нужны проектор и экран. Приводит пары и молодёжь вечером, когда парк обычно пустеет.' },
  { id: 'snowshoes', tag: 'Акция', name: 'Снегоступы и зимняя тропа', img: 'img/trail.jpg', price: 500, when: 'декабрь–март',
    desc: 'Прокат снегоступов на 2 часа и маршрут по зимнему лесу с указателями.',
    pitch: 'Зимний доход без больших вложений: снегоступы недорогие, маршрут — та же тропа.' },
  { id: 'gift-certificate', tag: 'Акция', name: 'Подарочный сертификат', img: 'img/house.jpg', price: 3000, when: 'круглый год',
    desc: 'Сертификат на домик, баню или беседку — в подарок на праздник. Действует год.',
    pitch: 'Деньги приходят заранее, а пик продаж — Новый год, 23 февраля и 8 марта. Каждый сертификат приводит нового гостя.' },
  { id: 'weekend-pass', tag: 'Акция', name: 'Абонемент «Лесные выходные»', img: 'img/gazebo12_big.jpg', price: 14000, oldPrice: 17500, when: 'на сезон',
    desc: '5 дней в беседке на 4 человека по цене 4. Можно делить с друзьями.',
    pitch: 'Удерживает постоянных гостей на весь сезон и даёт предоплату.' },
  { id: 'dawn-yoga', tag: 'Событие', name: 'Йога на рассвете', img: 'img/brides.jpg', price: 500, when: 'июнь–август, сб и вс 7:00',
    desc: 'Йога и дыхательные практики на поляне среди сосен с инструктором.',
    pitch: 'Регулярная аудитория с утра в выходные. Инструктор приводит своих учеников.' },
  { id: 'bride-photo', tag: 'Программа', name: 'Фотосессия на Поляне невест', img: 'img/brides.jpg', price: 4500, when: 'по записи',
    desc: 'Час съёмки с фотографом на Поляне невест и у домиков, 30 обработанных фото.',
    pitch: 'Поляна невест уже есть. Пакет с фотографом продаётся дороже простой аренды, а фото уходят в соцсети пар.' },
];
const DEFAULT_EVENTS = [
  ...SERVICES.map((s, i) => ({ ...s, when: s.when || '', pitch: '', published: true, sort: i })),
  ...IDEAS.map((e, i) => ({ ...e, published: false, sort: 100 + i })),
];
// События хранятся в таблице places: строки с id «ev-…» и меткой '__event__' в facts.
// Так не нужна отдельная таблица, а права те же: гости читают только active = true (опубликованные),
// администратор видит и меняет всё. Встроенный список (DEFAULT_EVENTS) — основа, записи в базе его переопределяют.
const EV_MARK = '__event__';
const isEventRow = p => String(p.id).startsWith('ev-') && (p.facts || [])[0] === EV_MARK;
const eventToPlaceRow = e => ({ id: 'ev-' + e.id, cat: 'activity', name: e.name, img: e.img || null, icon: null, price: e.price ?? null,
  unit: (e.when || '').slice(0, 60), bookable: null, lat: 0, lng: 0, descr: e.desc || '',
  facts: [EV_MARK, e.tag || 'Событие', e.oldPrice != null ? String(e.oldPrice) : '', e.pitch || '', e.deleted ? 'deleted' : '', e.published && !e.deleted ? '1' : '0'],
  sort: e.sort ?? 0, updated_at: new Date().toISOString(),
  // active = «гости могут прочитать запись». Черновики закрыты базой; запись о скрытии исходной активности
  // открыта, иначе гости показали бы её по встроенному списку.
  active: (!!e.published && !e.deleted) || !!DEFAULT_EVENTS.find(d => d.id === e.id && d.published) });
const eventFromPlaceRow = r => { const f = r.facts || [];
  return { id: r.id.slice(3), tag: f[1] || 'Событие', name: r.name, img: r.img, price: r.price, oldPrice: f[2] ? +f[2] : null, when: r.unit || '',
    desc: r.descr || '', pitch: f[3] || '', published: f[5] != null ? f[5] === '1' : !!r.active, deleted: f[4] === 'deleted', sort: r.sort }; };

Object.assign(Api, {
  async events(all = false) {
    const q = '/rest/v1/places?select=*&id=like.ev-*&order=sort.asc' + (all ? '' : '&active=eq.true');
    return (await this.req(q, { auth: all })).filter(isEventRow).map(eventFromPlaceRow);
  },
  saveEvent(e) { return this.req('/rest/v1/places?on_conflict=id', { method: 'POST', body: eventToPlaceRow(e), auth: true, prefer: 'resolution=merge-duplicates,return=minimal' }); },
});

const EventsStore = {
  key: 'yagmort.events.v1',
  local() { try { return JSON.parse(localStorage.getItem(this.key)); } catch { return null; } },
  saveLocal(list) { try { localStorage.setItem(this.key, JSON.stringify(list)); } catch {} },
  // all = true — вместе с черновиками (для админки)
  async load(all = false) {
    let saved = [];
    if (REMOTE) { try { saved = await Api.events(all); } catch {} }
    else saved = this.local() || [];
    const byId = new Map(DEFAULT_EVENTS.map(e => [e.id, { ...e }]));
    for (const e of saved) byId.set(e.id, e);
    const list = [...byId.values()].filter(e => !e.deleted && (all || e.published));
    return list.sort((a, b) => a.sort - b.sort);
  },
  async save(e) {
    if (REMOTE) return Api.saveEvent(e);
    const l = this.local() || [];
    const i = l.findIndex(x => x.id === e.id);
    i >= 0 ? (l[i] = e) : l.push(e);
    this.saveLocal(l);
  },
  // удаление = пометка deleted (встроенное событие иначе вернулось бы из кода)
  async remove(id, e) { return this.save({ ...e, id, published: false, deleted: true }); },
};
const applyEvents = list => { SERVICES.splice(0, SERVICES.length, ...list); };
