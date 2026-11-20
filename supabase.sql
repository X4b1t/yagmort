-- Схема базы данных парка «Яг-Морт» для Supabase.
-- Выполнить один раз: Supabase → SQL Editor → New query → вставить → Run.

-- Брони
create table if not exists public.bookings (
  id            text primary key check (length(id) between 16 and 64),
  created_at    timestamptz not null default now(),
  place_id      text,
  svc_id        text,
  item_name     text not null check (length(item_name) <= 120),
  date          date not null,
  guests        int  not null check (guests between 1 and 50),
  pet           boolean not null default false,
  late          boolean not null default false,
  name          text not null check (length(name) between 1 and 100),
  phone         text not null check (length(phone) between 10 and 30),
  comment       text check (length(comment) <= 1000),
  base          int  not null default 0 check (base >= 0),
  total         int  not null default 0 check (total >= 0),
  coins_spent   int  not null default 0 check (coins_spent >= 0),
  ref_discount  int  not null default 0 check (ref_discount between 0 and 500),
  ref_by        text check (length(ref_by) <= 12),
  gift          boolean not null default false,
  loyalty_code  text check (length(loyalty_code) <= 12),
  status        text not null default 'new' check (status in ('new','confirmed','checkedin','done','cancelled'))
);
create index if not exists bookings_date_idx on public.bookings (date);
create index if not exists bookings_ref_idx on public.bookings (ref_by);

-- Администраторы: только эти e-mail видят и меняют брони
create table if not exists public.admins (email text primary key);

alter table public.bookings enable row level security;
alter table public.admins   enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where email = auth.jwt() ->> 'email');
$$;

drop policy if exists "guest can create booking" on public.bookings;
create policy "guest can create booking" on public.bookings
  for insert to anon, authenticated with check (status = 'new');

drop policy if exists "admin full access" on public.bookings;
create policy "admin full access" on public.bookings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin reads admins" on public.admins;
create policy "admin reads admins" on public.admins
  for select to authenticated using (public.is_admin());

-- Гость узнаёт статусы только своих броней (по секретным id, сохранённым на телефоне)
create or replace function public.booking_statuses(ids text[])
returns table (id text, status text)
language sql stable security definer set search_path = public as $$
  select b.id, b.status from bookings b where b.id = any(ids) limit 200;
$$;

-- Гость отменяет свою бронь
create or replace function public.cancel_booking(bid text) returns void
language sql security definer set search_path = public as $$
  update bookings set status = 'cancelled' where id = bid and status in ('new','confirmed');
$$;

-- Сколько друзей отдохнуло по коду приглашения (только число, без личных данных)
create or replace function public.ref_rewards(code text) returns int
language sql stable security definer set search_path = public as $$
  select count(*)::int from bookings where ref_by = code and status = 'done';
$$;

-- Занятые даты объекта (без имён и телефонов)
create or replace function public.busy_dates(pid text) returns setof date
language sql stable security definer set search_path = public as $$
  select distinct date from bookings where place_id = pid and status <> 'cancelled' and date >= current_date;
$$;

revoke all on function public.booking_statuses(text[]), public.cancel_booking(text), public.ref_rewards(text), public.busy_dates(text) from public;
grant execute on function public.booking_statuses(text[]), public.cancel_booking(text), public.ref_rewards(text), public.busy_dates(text) to anon, authenticated;
grant execute on function public.is_admin() to authenticated;

-- Права на таблицы (что именно разрешено — решают политики RLS выше)
grant insert on public.bookings to anon, authenticated;
grant select, update, delete on public.bookings to authenticated;
grant select on public.admins to authenticated;
-- Объекты на карте и фото объектов. Выполнить после supabase.sql.
create table if not exists public.places (
  id          text primary key check (id ~ '^[a-z0-9_-]{2,40}$'),
  cat         text not null check (cat in ('house','gazebo','banya','activity','service')),
  name        text not null check (length(name) between 1 and 80),
  img         text check (length(img) <= 500),
  icon        text check (length(icon) <= 500),
  price       int check (price >= 0),
  unit        text check (length(unit) <= 60),
  bookable    text check (bookable in ('stay','day','event')),
  lat         double precision not null check (lat between -90 and 90),
  lng         double precision not null check (lng between -180 and 180),
  descr       text check (length(descr) <= 2000),
  facts       text[] not null default '{}',
  sort        int not null default 0,
  active      boolean not null default true,
  updated_at  timestamptz not null default now()
);
alter table public.places enable row level security;

drop policy if exists "everyone reads places" on public.places;
create policy "everyone reads places" on public.places
  for select to anon, authenticated using (active or public.is_admin());

drop policy if exists "admin edits places" on public.places;
create policy "admin edits places" on public.places
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant select on public.places to anon, authenticated;
grant insert, update, delete on public.places to authenticated;

-- Публичная папка для фото объектов; загружать может только администратор
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('places', 'places', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

drop policy if exists "admin uploads place photos" on storage.objects;
create policy "admin uploads place photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'places' and public.is_admin());

drop policy if exists "admin changes place photos" on storage.objects;
create policy "admin changes place photos" on storage.objects
  for update to authenticated using (bucket_id = 'places' and public.is_admin());

drop policy if exists "admin deletes place photos" on storage.objects;
create policy "admin deletes place photos" on storage.objects
  for delete to authenticated using (bucket_id = 'places' and public.is_admin());

-- Начальные объекты
insert into public.places (id, cat, name, img, icon, price, unit, bookable, lat, lng, descr, facts, sort, active) values
  ('house1', 'house', 'Домик «Сосна»', 'img/house.jpg', 'img/cut/house.png', 5000, 'сутки (11:00–10:00)', 'stay', 61.6671, 50.9897, 'Домик с панорамным окном на лес. Ванная комната, раскладной диван, обеденная зона, мангальная зона, садовая мебель, парковка на 2–3 машины.', array['до 4 взрослых (макс. 8, +500 ₽ за каждого сверх 4)','2 спальных места','Уголь и розжиг — за доплату']::text[], 0, true),
  ('house2', 'house', 'Домик «Ель»', 'img/house.jpg', 'img/cut/house.png', 5000, 'сутки (11:00–10:00)', 'stay', 61.6675, 50.9921, 'Уютный домик в сосновом лесу с панорамным окном и мангальной зоной.', array['до 4 взрослых (макс. 8)','2 спальных места','Парковка рядом']::text[], 1, true),
  ('house3', 'house', 'Домик «Кедр»', 'img/house.jpg', 'img/cut/house.png', 5000, 'сутки (11:00–10:00)', 'stay', 61.6668, 50.9941, 'Тихий домик на краю парка — только зелень, тишина и лёгкий ветерок.', array['до 4 взрослых (макс. 8)','2 спальных места','Можно с собакой (+500 ₽)']::text[], 2, true),
  ('gaz12', 'gazebo', 'Беседка на 12 человек', 'img/gazebo12_big.jpg', 'img/cut/gazebo.png', 5000, 'день (11:00–20:00)', 'day', 61.6659, 50.9902, 'Просторная беседка для компании 12+ человек: мангал, удобная мебель, парковка. Подходит для семейных праздников, корпоративов и встреч с друзьями.', array['до 12+ гостей','Мангал','Парковка']::text[], 3, true),
  ('gaz4a', 'gazebo', 'Беседка на 4 человека', 'img/gazebo4.jpg', 'img/cut/gazebo.png', 3500, 'день (11:00–20:00)', 'day', 61.6655, 50.9921, 'Камерная беседка для небольшой компании в сосновом лесу.', array['до 4 гостей','Мангал','Тишина и приватность']::text[], 4, true),
  ('gaz4b', 'gazebo', 'Беседка на 4 человека (у поляны)', 'img/gazebo4.jpg', 'img/cut/gazebo.png', 3500, 'день (11:00–20:00)', 'day', 61.6651, 50.9895, 'Беседка рядом с живописной поляной и сценой.', array['до 4 гостей','Мангал','Рядом сцена']::text[], 5, true),
  ('banya', 'banya', 'Баня Яг-Морта', 'img/banya.jpg', 'img/cut/banya.png', 5000, '3 часа', 'day', 61.6662, 50.9937, 'Лесная баня с природным фасадом из необработанного бревна. Парьтесь с берёзовым веником, а потом отдыхайте в домике среди сосен.', array['Берёзовые веники','Можно вместе с арендой домика','По предварительной записи']::text[], 6, true),
  ('brides', 'activity', 'Поляна невест', 'img/brides.jpg', null, 5000, 'аренда', 'day', 61.6648, 50.993, 'Фотогеничная поляна для свадебных и тематических фотосессий и выездных церемоний.', array['Фотозона','Выездные регистрации']::text[], 7, true),
  ('stage', 'activity', 'Сцена на поляне', 'img/stage.jpg', null, 0, 'по согласованию', 'day', 61.6646, 50.9908, 'Сцена на живописной поляне для концертов, праздников и мероприятий.', array['Бесплатно','Мероприятия под ключ']::text[], 8, true),
  ('trail', 'activity', 'Тропа Яг-Морта', 'img/trail.jpg', null, 1500, 'человек', 'event', 61.668, 50.991, 'Прогулка по лесной тропе с историями о Яг-Морте — лесном великане из коми-легенд.', array['Рейтинг 5,0','Для детей и взрослых']::text[], 9, true),
  ('rent', 'service', 'Прокат', 'img/bike.jpg', 'img/cut/bike.svg', 300, 'от', 'event', 61.6663, 50.9886, 'Прокат велосипедов (500 ₽) и наборов для бадминтона (300 ₽).', array['Велосипед — 500 ₽','Бадминтон — 300 ₽']::text[], 10, true),
  ('parking', 'service', 'Парковка', 'img/cover.jpg', 'img/cut/parking.svg', null, null, null, 61.668126, 50.991515, 'Бесплатная парковка для гостей парка. У домиков есть свои места на 2–3 машины.', array['Бесплатно','Рядом со входом']::text[], 11, true),
  ('entrance', 'service', 'Вход в парк', 'img/cover.jpg', 'img/cut/entrance.svg', null, null, null, 61.66795, 50.99118, 'Главный вход в парк «Яг-Морт». Отсюда начинаются тропинки к домикам, беседкам и бане. Администратор на территории с 9:00 до 21:00.', array['Администратор 9:00–21:00','Звонок: 717-006']::text[], 12, true)
on conflict (id) do nothing;

-- События, программы и акции. published = false — черновик, его видит только администратор.
create table if not exists public.events (
  id          text primary key check (id ~ '^[a-z0-9_-]{2,40}$'),
  tag         text not null default 'Событие' check (length(tag) <= 30),
  name        text not null check (length(name) between 1 and 100),
  img         text check (length(img) <= 500),
  price       int check (price >= 0),
  old_price   int check (old_price >= 0),
  when_text   text check (length(when_text) <= 100),
  descr       text check (length(descr) <= 2000),
  pitch       text check (length(pitch) <= 2000),
  published   boolean not null default false,
  sort        int not null default 0,
  updated_at  timestamptz not null default now()
);
alter table public.events enable row level security;

drop policy if exists "everyone reads published events" on public.events;
create policy "everyone reads published events" on public.events
  for select to anon, authenticated using (published or public.is_admin());

drop policy if exists "admin edits events" on public.events;
create policy "admin edits events" on public.events
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant select on public.events to anon, authenticated;
grant insert, update, delete on public.events to authenticated;

insert into public.events (id, tag, name, img, price, old_price, when_text, descr, pitch, published, sort) values
  ('knight', 'Событие', '«Рыцарский день»', 'img/knight.jpg', 2000, null, '', 'Тематический день в парке: рыцарские испытания и игры для всей семьи.', '', true, 0),
  ('trail', 'Прогулка', 'Тропа Яг-Морта', 'img/trail.jpg', 1500, null, '', 'Лесная тропа с легендами о Яг-Морте. Рейтинг 5,0.', '', true, 1),
  ('quest', 'Квест', 'Командный Хогвардс-квест', 'img/quest.jpg', 1200, 1500, '', 'Командный квест в волшебной тематике для детей и взрослых.', '', true, 2),
  ('disco', 'Дети', 'Пикник в лесу: детская дискотека', 'img/disco.jpg', 500, null, '', 'Танцы, игры и пикник на свежем воздухе.', '', true, 3),
  ('bike', 'Прокат', 'Прокат велосипеда', 'img/bike.jpg', 500, null, '', 'Покатайтесь по лесным дорожкам парка.', '', true, 4),
  ('badm', 'Прокат', 'Прокат бадминтона', 'img/badminton.jpg', 300, null, '', 'Ракетки и воланы для игры на поляне.', '', true, 5),
  ('events', 'Событие', 'Тематические мероприятия', 'img/events.jpg', 0, null, '', 'Праздники в парке — следите за анонсами в группе.', '', true, 6),
  ('banya-thursday', 'Акция', 'Банный четверг', 'img/banya.jpg', 8000, 10000, 'пн–чт, весь сезон', 'Баня на 3 часа и домик на сутки в будни со скидкой 20%. Веники и чай включены.', 'Заполняет будни, когда домики пустуют. Работает вместе с шишками ×2 в будни из бонусной программы.', false, 100),
  ('legends-night', 'Событие', 'Ночь легенд Яг-Морта', 'img/trail.jpg', 1200, null, 'каждую пятницу, 19:00', 'Вечерняя прогулка по лесной тропе с фонарями. Рассказчик ведёт по местам коми-легенд о лесном великане Яг-Морте, в конце — иван-чай у костра.', 'Формат, которого нет у конкурентов: он вырастает из названия парка. Затраты — гид, фонари и чай.', false, 101),
  ('new-year-trail', 'Событие', 'Новогодняя тропа: Дед Мороз в гостях у Яг-Морта', 'img/cover.jpg', 1800, null, '20–30 декабря, 11:00 и 15:00', 'Детский квест по зимнему лесу: задания от Яг-Морта, встреча с Дедом Морозом, подарок и горячий чай.', 'Пик семейного спроса в году. Билеты продаются заранее, гости заодно бронируют домики на праздники.', false, 102),
  ('maslenitsa', 'Событие', 'Лесная Масленица', 'img/events.jpg', 300, null, 'последние выходные Масленицы', 'Блины, хороводы, перетягивание каната, катание с горки и сжигание чучела на поляне.', 'Массовый семейный праздник с недорогим входом. Окупается арендой беседок и продажей еды.', false, 103),
  ('team-building', 'Программа', 'Тимбилдинг в лесу', 'img/quest.jpg', 25000, null, 'по заявке, лучше в будни', 'Командный квест, беседка на 12 человек, мангал и ведущий. Цена за группу до 10 человек, каждый следующий — 2 000 ₽.', 'Корпоративные бюджеты и загрузка в будни. Одна заявка — сразу 10–30 гостей.', false, 104),
  ('birthday', 'Программа', 'День рождения в лесу', 'img/disco.jpg', 15000, null, 'по заявке', 'Беседка на 12 человек, квест или детская дискотека с аниматором и зона для торта. Цена за группу до 12 гостей.', 'Готовый пакет продавать проще, чем отдельные услуги. Дети потом зовут на праздник в парк друзей.', false, 105),
  ('kort-aika-craft', 'Мастер-класс', 'Мастерские «Кӧрт Айка»', 'img/events.jpg', 900, null, 'по субботам, 12:00', 'Коми ремёсла от мастеров: кузнечное дело, выпечка югыдтыдорского хлеба, роспись по дереву.', 'У группы уже есть альбомы про «Кӧрт Айку» и югыдтыдорский хлеб. Работа с мастерами даёт контент для соцсетей и интерес туристов.', false, 106),
  ('forest-party', 'Событие', 'Forest Party', 'img/stage.jpg', 700, null, 'раз в месяц, суббота 18:00', 'Музыкальная вечеринка на лесной сцене: диджей, гирлянды между соснами, фудкорт.', 'В группе уже есть альбом Forest Party на 109 фото. Если сделать её регулярной, гости будут возвращаться каждый месяц.', false, 107),
  ('plein-air', 'Событие', 'Пленэр «Лесной человек»', 'img/trail.jpg', 300, null, 'раз в сезон', 'Конкурс для художников и художественных школ: рисуем лес и Яг-Морта, лучшие работы выставляем в парке и в группе.', 'Такой пленэр в парке уже проводился. Он привлекает школы и родителей, а работы участников — бесплатное оформление парка.', false, 108),
  ('forest-cinema', 'Событие', 'Кино под соснами', 'img/stage.jpg', 350, null, 'июнь–август, суббота 22:00', 'Летние кинопоказы на сцене: пледы, попкорн и иван-чай.', 'Сцена уже есть, нужны проектор и экран. Приводит пары и молодёжь вечером, когда парк обычно пустеет.', false, 109),
  ('snowshoes', 'Акция', 'Снегоступы и зимняя тропа', 'img/trail.jpg', 500, null, 'декабрь–март', 'Прокат снегоступов на 2 часа и маршрут по зимнему лесу с указателями.', 'Зимний доход без больших вложений: снегоступы недорогие, маршрут — та же тропа.', false, 110),
  ('gift-certificate', 'Акция', 'Подарочный сертификат', 'img/house.jpg', 3000, null, 'круглый год', 'Сертификат на домик, баню или беседку — в подарок на праздник. Действует год.', 'Деньги приходят заранее, а пик продаж — Новый год, 23 февраля и 8 марта. Каждый сертификат приводит нового гостя.', false, 111),
  ('weekend-pass', 'Акция', 'Абонемент «Лесные выходные»', 'img/gazebo12_big.jpg', 14000, 17500, 'на сезон', '5 дней в беседке на 4 человека по цене 4. Можно делить с друзьями.', 'Удерживает постоянных гостей на весь сезон и даёт предоплату.', false, 112),
  ('dawn-yoga', 'Событие', 'Йога на рассвете', 'img/brides.jpg', 500, null, 'июнь–август, сб и вс 7:00', 'Йога и дыхательные практики на поляне среди сосен с инструктором.', 'Регулярная аудитория с утра в выходные. Инструктор приводит своих учеников.', false, 113),
  ('bride-photo', 'Программа', 'Фотосессия на Поляне невест', 'img/brides.jpg', 4500, null, 'по записи', 'Час съёмки с фотографом на Поляне невест и у домиков, 30 обработанных фото.', 'Поляна невест уже есть. Пакет с фотографом продаётся дороже простой аренды, а фото уходят в соцсети пар.', false, 114)
on conflict (id) do nothing;
