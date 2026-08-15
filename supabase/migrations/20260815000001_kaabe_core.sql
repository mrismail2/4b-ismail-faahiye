-- ============================================================
-- KAABE — Schema-ga aasaasiga ah
--
-- Laba dood oo keliya ayaa akoon leh:
--   · super_admin — wuxuu maamulaa iskuulka oo dhan
--   · teacher     — wuxuu arkaa fasaladiisa OO KELIYA
--
-- Ardaydu MA aha isticmaalayaal — waa diiwaan uu macalinku maamulo.
--
-- Ammaanku wuxuu ku dhisan yahay RLS (Row Level Security). Ogolaanshuhu
-- database-ka ayuu ku jiraa — MA aha app-ka oo keliya badhamo qariya.
-- ============================================================

-- ---------- 1. Jaantusyada ----------

-- Iskuulka. App-ku wuxuu taageeraa iskuulo badan (multi-tenant).
create table if not exists schools (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  student_prefix  text not null default 'ARD',
  currency        text not null default '$',
  created_at      timestamptz not null default now()
);

-- Profile-ka isticmaalaha. `id` wuxuu la mid yahay auth.users.id.
create table if not exists profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  school_id    uuid not null references schools (id) on delete cascade,
  role         text not null check (role in ('super_admin', 'teacher')),
  full_name    text not null,
  phone        text,
  subject      text,           -- maadada uu macalinku dhigo
  bio          text,           -- wax yar oo isaga ku saabsan
  photo_path   text,           -- jidka bucket-ka 'avatars'
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists profiles_school_idx on profiles (school_id);

-- Fasalka. Hal macalin ayaa fasalka leh.
create table if not exists classes (
  id           uuid primary key default gen_random_uuid(),
  school_id    uuid not null references schools (id) on delete cascade,
  name         text not null,
  level        text,
  monthly_fee  numeric(10, 2) not null default 0 check (monthly_fee >= 0),
  teacher_id   uuid references profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  -- magaca fasalku wuu gaar yahay iskuulka gudihiisa, laakiin laba iskuul
  -- way lahaan karaan "Fasalka 1A" iyagoo aan isku dhicin
  unique (school_id, name)
);

create index if not exists classes_school_idx on classes (school_id);
create index if not exists classes_teacher_idx on classes (teacher_id);

-- Ardayga. Laba aqoonsi: id (gudaha) iyo student_code (la arko).
create table if not exists students (
  id             uuid primary key default gen_random_uuid(),
  school_id      uuid not null references schools (id) on delete cascade,
  class_id       uuid not null references classes (id) on delete cascade,
  student_code   text not null,          -- ARD-000001
  full_name      text not null,
  gender         text check (gender in ('male', 'female', '')),
  guardian_phone text,
  monthly_fee    numeric(10, 2) not null default 0 check (monthly_fee >= 0),
  photo_path     text,                   -- jidka bucket-ka 'student-photos'
  status         text not null default 'active' check (status in ('active', 'left')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (school_id, student_code)
);

create index if not exists students_class_idx on students (class_id);
create index if not exists students_school_idx on students (school_id);

-- Xaadiriska. Hal diiwaan arday/maalin — sidaas dib-u-kaydintu way beddeshaa,
-- mana tarmayso.
create table if not exists attendance (
  id                  uuid primary key default gen_random_uuid(),
  school_id           uuid not null references schools (id) on delete cascade,
  class_id            uuid not null references classes (id) on delete cascade,
  student_id          uuid not null references students (id) on delete cascade,
  attendance_date     date not null,
  status              text not null check (status in ('present', 'absent', 'late', 'excused')),
  recorded_by         uuid references profiles (id) on delete set null,
  recorded_at         timestamptz not null default now(),
  unique (student_id, attendance_date)
);

create index if not exists attendance_class_date_idx on attendance (class_id, attendance_date);

-- Lacagta bisha. Hal diiwaan arday/bil.
create table if not exists fees (
  id           uuid primary key default gen_random_uuid(),
  school_id    uuid not null references schools (id) on delete cascade,
  class_id     uuid not null references classes (id) on delete cascade,
  student_id   uuid not null references students (id) on delete cascade,
  month        text not null check (month ~ '^\d{4}-\d{2}$'),   -- 2026-08
  amount_due   numeric(10, 2) not null default 0 check (amount_due >= 0),
  amount_paid  numeric(10, 2) not null default 0 check (amount_paid >= 0),
  recorded_by  uuid references profiles (id) on delete set null,
  updated_at   timestamptz not null default now(),
  unique (student_id, month)
);

create index if not exists fees_class_month_idx on fees (class_id, month);

-- ---------- 2. Caawiyayaasha ammaanka ----------
-- Hawlahan waa `security definer` si aysan RLS naftooda isu haleelin
-- (haddii kale profiles-ka akhrintiisu wareeg bay geli lahayd).

create or replace function my_school()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select school_id from profiles where id = auth.uid();
$$;

create or replace function my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from profiles where id = auth.uid();
$$;

-- Maamulaha guud ee iskuulkan
create or replace function is_admin_of(target_school uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and school_id = target_school
      and role = 'super_admin'
  );
$$;

-- Ma fasalkan baa layga dhigay? (macalin) ama ma maamule baan ahay?
create or replace function can_touch_class(target_class uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from classes c
    join profiles p on p.id = auth.uid()
    where c.id = target_class
      and c.school_id = p.school_id
      and (p.role = 'super_admin' or c.teacher_id = p.id)
  );
$$;

-- ---------- 3. RLS ----------

alter table schools    enable row level security;
alter table profiles   enable row level security;
alter table classes    enable row level security;
alter table students   enable row level security;
alter table attendance enable row level security;
alter table fees       enable row level security;

-- Iskuulka: xubnihiisu way akhriyaan; maamuluhu wuu beddelaa
drop policy if exists "members read own school" on schools;
create policy "members read own school" on schools for select
  using (id = my_school());

drop policy if exists "admin updates own school" on schools;
create policy "admin updates own school" on schools for update
  using (is_admin_of(id));

-- Profiles: qof kastaa wuxuu akhriyaa/beddelaa kiisa. Shaqaaluhu way is
-- arkaan (macalinku wuxuu u baahan yahay inuu arko liiska). Maamuluhu
-- wuu maamulaa kuwa iskuulkiisa.
-- MUHIIM: doorka nafsadiisa lama beddeli karo — eeg trigger-ka hoose.
drop policy if exists "read own profile" on profiles;
create policy "read own profile" on profiles for select
  using (id = auth.uid());

drop policy if exists "school members read profiles" on profiles;
create policy "school members read profiles" on profiles for select
  using (school_id = my_school());

drop policy if exists "insert own profile" on profiles;
create policy "insert own profile" on profiles for insert
  with check (id = auth.uid());

drop policy if exists "update own profile" on profiles;
create policy "update own profile" on profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "admin manages school profiles" on profiles;
create policy "admin manages school profiles" on profiles for all
  using (is_admin_of(school_id))
  with check (is_admin_of(school_id));

-- Fasalada: shaqaalaha iskuulku way arkaan; maamuluhu keliya wuu abuuraa
drop policy if exists "school members read classes" on classes;
create policy "school members read classes" on classes for select
  using (school_id = my_school());

drop policy if exists "admin manages classes" on classes;
create policy "admin manages classes" on classes for all
  using (is_admin_of(school_id))
  with check (is_admin_of(school_id));

-- Ardayda: macalinku wuxuu maamulaa kuwa fasalkiisa OO KELIYA
drop policy if exists "class staff read students" on students;
create policy "class staff read students" on students for select
  using (can_touch_class(class_id));

drop policy if exists "class staff write students" on students;
create policy "class staff write students" on students for all
  using (can_touch_class(class_id))
  with check (can_touch_class(class_id));

-- Xaadiriska: sidoo kale — fasalka la ogolaaday oo keliya
drop policy if exists "class staff read attendance" on attendance;
create policy "class staff read attendance" on attendance for select
  using (can_touch_class(class_id));

drop policy if exists "class staff write attendance" on attendance;
create policy "class staff write attendance" on attendance for all
  using (can_touch_class(class_id))
  with check (can_touch_class(class_id));

-- Lacagaha: fasalka la ogolaaday oo keliya
drop policy if exists "class staff read fees" on fees;
create policy "class staff read fees" on fees for select
  using (can_touch_class(class_id));

drop policy if exists "class staff write fees" on fees;
create policy "class staff write fees" on fees for all
  using (can_touch_class(class_id))
  with check (can_touch_class(class_id));

-- ---------- 4. Ilaalinta doorka ----------
-- Isticmaaluhu ISKIIS uma bedeli karo `role` ama `school_id`. Haddii kale
-- macalin kastaa wuxuu isaga dhigi kari lahaa maamule.

create or replace function guard_profile_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- maamuluhu wuu beddeli karaa doorka kuwa kale; qofna kiisa ma beddeli karo
  if new.role is distinct from old.role and not is_admin_of(old.school_id) then
    raise exception 'Doorka lama beddeli karo.';
  end if;

  if new.school_id is distinct from old.school_id and not is_admin_of(old.school_id) then
    raise exception 'Iskuulka lama beddeli karo.';
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists guard_profile_changes_trg on profiles;
create trigger guard_profile_changes_trg
  before update on profiles
  for each row execute function guard_profile_changes();

-- `updated_at` toos u cusboonaysii
create or replace function touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists students_touch_trg on students;
create trigger students_touch_trg
  before update on students
  for each row execute function touch_updated_at();

-- ---------- 5. Aqoonsiga ardayga (ARD-000001) ----------
-- Lambarka waa in database-ku soo saaro, MAAHA app-ka: haddii laba macalin
-- isku mar arday galiyaan, app-ku wuxuu siin lahaa isku lambar.

create or replace function next_student_code(target_school uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  prefix text;
  next_n integer;
begin
  select student_prefix into prefix from schools where id = target_school;
  if prefix is null then prefix := 'ARD'; end if;

  -- `for update` ayaa xiraya safka si laba galitaan oo isku mar ah aysan
  -- isku lambar u helin
  perform 1 from schools where id = target_school for update;

  select coalesce(max(nullif(split_part(student_code, '-', 2), '')::integer), 0) + 1
    into next_n
    from students
   where school_id = target_school;

  return prefix || '-' || lpad(next_n::text, 6, '0');
end;
$$;

-- ---------- 6. Bucket-yada sawirada ----------

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('student-photos', 'student-photos', false)
on conflict (id) do nothing;

-- Sawirka macalinka: qof kastaa wuxuu maamulaa kiisa; xubnaha iskuulku way
-- arkaan. Jidku waa `<profile_id>/avatar.jpg`.
drop policy if exists "read school avatars" on storage.objects;
create policy "read school avatars" on storage.objects for select
  using (bucket_id = 'avatars' and auth.role() = 'authenticated');

drop policy if exists "write own avatar" on storage.objects;
create policy "write own avatar" on storage.objects for all
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- Sawirka ardayga: jidku waa `<class_id>/<student_id>.jpg`, sidaas RLS-ku
-- wuxuu hubin karaa in macalinku fasalka leeyahay.
drop policy if exists "class staff read student photos" on storage.objects;
create policy "class staff read student photos" on storage.objects for select
  using (
    bucket_id = 'student-photos'
    and can_touch_class(((storage.foldername(name))[1])::uuid)
  );

drop policy if exists "class staff write student photos" on storage.objects;
create policy "class staff write student photos" on storage.objects for all
  using (
    bucket_id = 'student-photos'
    and can_touch_class(((storage.foldername(name))[1])::uuid)
  )
  with check (
    bucket_id = 'student-photos'
    and can_touch_class(((storage.foldername(name))[1])::uuid)
  );
