-- ============================================================
-- KAABE — Macalinku fasalkiisa ayuu samaystaa
--
-- Hore: maamulaha guud oo keliya ayaa fasal abuuri karay.
-- Hadda: macalinkuna wuu samayn karaa — laakiin KIISA oo keliya.
--
-- Xeerka muhiimka ah: macalin ma samayn karo fasal uu cid kale u
-- qoondeeyo, mana wareejin karo fasalkiisa macalin kale. Sidaas
-- macalimiintu isku ma dhex qasmayaan.
-- ============================================================

-- ---------- Fasalada ----------

-- Akhrinta sidii hore ayay ahayd (xubnaha iskuulka), laakiin qorista
-- waxaa loo kala saarayaa: maamule vs macalin.
drop policy if exists "admin manages classes" on classes;

create policy "admin manages classes" on classes for all
  using (is_admin_of(school_id))
  with check (is_admin_of(school_id));

-- Macalinku fasal wuu abuuri karaa — hadduu KIISA yahay oo keliya.
drop policy if exists "teacher creates own class" on classes;
create policy "teacher creates own class" on classes for insert
  with check (
    school_id = my_school()
    and my_role() = 'teacher'
    and teacher_id = auth.uid()
  );

-- Macalinku fasalkiisa wuu beddeli karaa (magac, heer, lacag) — laakiin
-- `with check` ayaa joojinaya inuu cid kale u wareejiyo.
drop policy if exists "teacher updates own class" on classes;
create policy "teacher updates own class" on classes for update
  using (teacher_id = auth.uid() and school_id = my_school())
  with check (teacher_id = auth.uid() and school_id = my_school());

-- Macalinku fasalkiisa wuu tirtiri karaa (ardaydiisa way la baxayaan —
-- `on delete cascade`).
drop policy if exists "teacher deletes own class" on classes;
create policy "teacher deletes own class" on classes for delete
  using (teacher_id = auth.uid() and school_id = my_school());

-- ---------- Ilaalinta wareejinta ----------
-- `with check` kore wuu joojinayaa wareejinta, laakiin farriin cad ayaa
-- ka roon khalad RLS ah oo aan la fahmi karin.

create or replace function guard_class_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.teacher_id is distinct from old.teacher_id
     and not is_admin_of(old.school_id) then
    raise exception 'Fasalka macalin kale uma wareejin kartid. Maamulaha guud ayaa taas qaba.';
  end if;
  return new;
end;
$$;

drop trigger if exists guard_class_owner_trg on classes;
create trigger guard_class_owner_trg
  before update on classes
  for each row execute function guard_class_owner();

-- ---------- Ardayda: tirtirid dhab ah ----------
-- `can_touch_class` hore ayuu u oggolaanayay `for all`, taasoo delete-ka
-- ku jirto. Xaqiijin ahaan:
--   · macalinku wuxuu tirtiri karaa ardayda FASALKIISA oo keliya
--   · xaadiriska iyo lacagta waxaa qaadaya `on delete cascade`
-- Wax policy ah oo cusub uma baahna — halkan waa xusuusin.

comment on table students is
  'Ardayda. Macalinku fasalkiisa oo keliya ayuu maamulaa (can_touch_class). '
  'Tirtiriddu waxay la qaadaysaa xaadiriska iyo lacagta (on delete cascade).';
