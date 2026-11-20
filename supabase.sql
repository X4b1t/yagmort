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
  ('rent', 'service', 'Прокат', 'img/bike.jpg', null, 300, 'от', 'event', 61.6663, 50.9886, 'Прокат велосипедов (500 ₽) и наборов для бадминтона (300 ₽).', array['Велосипед — 500 ₽','Бадминтон — 300 ₽']::text[], 10, true),
  ('parking', 'service', 'Парковка и вход', 'img/cover.jpg', null, null, null, null, 61.666219, 50.991075, 'Главный въезд и парковка. Администратор на территории с 9:00 до 21:00.', array['Звонок: 717-006']::text[], 11, true)
on conflict (id) do nothing;
