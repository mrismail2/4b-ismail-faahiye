-- ============================================================
-- KAABE — Casuumaadda macalimiinta
--
-- Macalinku ISKIIS akoon ma abuuri karo. Maamulaha guud ayaa casuumaad
-- sameeya (koodh), macalinkuna koodhkaas ayuu ku sameeyaa akoonkiisa.
--
-- Muhiimadda ammaanka: doorka iyo iskuulka waxay ka yimaadaan CASUUMAADDA,
-- ma aha waxa qofku uu app-ka ku qoro. Sidaas qofna isma dhigi karo
-- maamule ama macalin iskuul aanu ka tirsanayn.
-- ============================================================

create table if not exists invites (
  id           uuid primary key default gen_random_uuid(),
  school_id    uuid not null references schools (id) on delete cascade,
  code         text not null unique,
  full_name    text not null,
  email        text not null,
  role         text not null default 'teacher' check (role = 'teacher'),
  class_ids    uuid[] not null default '{}',
  created_by   uuid references profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  expires_at   timestamptz not null default now() + interval '14 days',
  status       text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  accepted_by  uuid references profiles (id) on delete set null,
  accepted_at  timestamptz
);

create index if not exists invites_school_idx on invites (school_id);
create index if not exists invites_code_idx on invites (code);

-- Hal email hal casuumaad furan ayuu haysan karaa
create unique index if not exists invites_one_open_per_email
  on invites (school_id, lower(email))
  where status = 'pending';

alter table invites enable row level security;

-- Maamulaha guud oo keliya ayaa casuumaadaha arka/maamula.
-- Macalinka cusubi WAX policy ah uma baahna: `redeem_invite` waa
-- security definer, sidaas RLS wuu dhaafaa si xakameysan.
drop policy if exists "admin manages invites" on invites;
create policy "admin manages invites" on invites for all
  using (is_admin_of(school_id))
  with check (is_admin_of(school_id));

-- ---------- Koodhka ----------
-- 0/O/1/I waa laga saaray si aan qofku u khaldin marka uu akhriyo.

create or replace function make_invite_code()
returns text
language plpgsql
as $$
declare
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  body text;
  candidate text;
  i integer;
begin
  for attempt in 1..50 loop
    body := '';
    for i in 1..6 loop
      body := body || substr(alphabet, floor(random() * length(alphabet))::int + 1, 1);
    end loop;
    candidate := 'KAB-' || body;
    if not exists (select 1 from invites where code = candidate) then
      return candidate;
    end if;
  end loop;
  raise exception 'Koodh cusub lama abuuri karin.';
end;
$$;

-- Maamuluhu casuumaad buu sameeyaa. Koodhka database-ka ayaa soo saara
-- si aan laba maamule oo isku mar shaqeeya isku koodh u helin.
create or replace function create_invite(
  p_full_name text,
  p_email text,
  p_class_ids uuid[] default '{}'
)
returns invites
language plpgsql
security definer
set search_path = public
as $$
declare
  my_school_id uuid;
  new_row invites;
begin
  select school_id into my_school_id from profiles where id = auth.uid() and role = 'super_admin';
  if my_school_id is null then
    raise exception 'Maamulaha guud oo keliya ayaa casuumi kara.';
  end if;

  if exists (select 1 from profiles where lower(email) = lower(p_email)) then
    raise exception 'Emailkan hore ayuu akoon u lahaa.';
  end if;

  insert into invites (school_id, code, full_name, email, class_ids, created_by)
  values (my_school_id, make_invite_code(), trim(p_full_name), lower(trim(p_email)),
          coalesce(p_class_ids, '{}'), auth.uid())
  returning * into new_row;

  return new_row;
end;
$$;

-- Faahfaahin yar oo la tuso qofka koodhka haysta, KA HOR inta aanu
-- akoon samayn. Waxaa la soo celiyaa magaca iyo iskuulka OO KELIYA —
-- emailka lama soo celiyo si koodh la helay uusan email u shaacin.
create or replace function peek_invite(p_code text)
returns table (full_name text, school_name text, class_names text[])
language plpgsql
security definer
set search_path = public
as $$
declare
  inv invites;
begin
  select * into inv from invites where code = upper(trim(p_code));

  if inv.id is null then raise exception 'Koodhkan ma jiro.'; end if;
  if inv.status = 'accepted' then raise exception 'Koodhkan hore ayaa loo isticmaalay.'; end if;
  if inv.status = 'revoked' then raise exception 'Koodhkan waa la joojiyay.'; end if;
  if inv.expires_at < now() then raise exception 'Koodhkan wuu dhacay.'; end if;

  return query
    select inv.full_name,
           (select s.name from schools s where s.id = inv.school_id),
           coalesce(array(select c.name from classes c where c.id = any(inv.class_ids)), '{}');
end;
$$;

-- Macalinku marka uu akoonka Auth sameeyo, tan ayuu wacaa. Iyadu ayaa
-- profile-ka u abuurta, doorka iyo iskuulkana CASUUMAADDA ka soo qaadata.
create or replace function redeem_invite(p_code text)
returns profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  inv invites;
  my_email text;
  new_profile profiles;
begin
  if auth.uid() is null then
    raise exception 'Marka hore akoon samee.';
  end if;

  select * into inv from invites where code = upper(trim(p_code)) for update;

  if inv.id is null then raise exception 'Koodhkan ma jiro.'; end if;
  if inv.status = 'accepted' then raise exception 'Koodhkan hore ayaa loo isticmaalay.'; end if;
  if inv.status = 'revoked' then raise exception 'Koodhkan waa la joojiyay.'; end if;
  if inv.expires_at < now() then raise exception 'Koodhkan wuu dhacay.'; end if;

  -- Emailka akoonku waa inuu la mid noqdaa kii la casumay, si koodh
  -- la helay uusan qof kale u shaqayn.
  select lower(email) into my_email from auth.users where id = auth.uid();
  if my_email is distinct from lower(inv.email) then
    raise exception 'Emailkani kama mid aha kii la casumay.';
  end if;

  if exists (select 1 from profiles where id = auth.uid()) then
    raise exception 'Akoonkan hore ayuu profile u lahaa.';
  end if;

  insert into profiles (id, school_id, role, full_name)
  values (auth.uid(), inv.school_id, inv.role, inv.full_name)
  returning * into new_profile;

  -- fasalada maamuluhu casuumaadda kula soo daray
  update classes set teacher_id = auth.uid()
   where id = any(inv.class_ids) and school_id = inv.school_id;

  update invites
     set status = 'accepted', accepted_by = auth.uid(), accepted_at = now()
   where id = inv.id;

  return new_profile;
end;
$$;

-- ---------- Xidhid: profile iskaa uma abuuri kartid ----------
-- Hore, "insert own profile" wuxuu u oggolaanayay qof kasta inuu profile
-- isu abuuro isagoo dooran kara `role` iyo `school_id` — taasi waa god
-- ammaan. Hadda hal jid oo keliya ayaa jira: `redeem_invite` (ama
-- maamulaha). Maamulaha koowaad SQL ayaa lagu abuuraa (eeg README).

drop policy if exists "insert own profile" on profiles;
