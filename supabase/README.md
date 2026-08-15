# KAABE — Backend-ka Supabase

Xogtu waxay ku jirtaa Supabase: **Postgres** (xogta), **Auth** (soo galitaanka)
iyo **Storage** (sawirada).

---

## 1. Abuur project

1. Tag [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
2. Xafid furaha database-ka (`Database password`) — mar keliya ayuu muuqdaa
3. Sug ilaa uu project-ku diyaar noqdo (~2 daqiiqo)

## 2. Ku shub schema-ga

**Dashboard** → **SQL Editor** → **New query** → ku dheji waxa ku jira
`migrations/20260815000001_kaabe_core.sql` → **Run**.

Ama haddii aad haysato Supabase CLI:

```bash
supabase link --project-ref <PROJECT-REF>
supabase db push
```

## 3. Xir furayaasha app-ka

**Dashboard** → **Settings** → **API**, ka soo qaad:

- `Project URL`
- `anon` / `public` key

Kadibna abuur `.env` (ka koobi `.env.example`):

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

> **Furaha `service_role` WELIGAA app-ka ha gelin.** Wuxuu RLS oo dhan
> dhaafaa. Waa inuu ku sii jiraa server-ka oo keliya.

## 4. Ku shub casuumaadda

Isla habka: SQL Editor → ku dheji `migrations/20260815000002_kaabe_invites.sql` → **Run**.

Tani waxay:
- abuurtaa jaantuska `invites`
- samaysaa `create_invite()`, `peek_invite()`, `redeem_invite()`
- **tirtirtaa** policy-gii `insert own profile` — kaasoo u oggolaanayay qof
  kasta inuu profile isu abuuro isagoo dooran kara `role` iyo `school_id`

## 5. Abuur iskuulka koowaad iyo maamulaha

Schema-gu wuxuu ku iman doonaa faaruq. Si aad u bilowdo, SQL Editor ku orod:

```sql
-- 1. iskuulka
insert into schools (name, student_prefix, currency)
values ('Iskuulka KAABE', 'ARD', '$')
returning id;
```

Kadib **Authentication → Users → Add user** ku samee maamulaha (email + fure),
ugana dhig profile:

```sql
-- 2. profile-ka maamulaha (beddel labada uuid)
insert into profiles (id, school_id, role, full_name, phone)
values (
  '<AUTH-USER-ID>',      -- Authentication → Users
  '<SCHOOL-ID>',         -- kii kore ka soo baxay
  'super_admin',
  'Magaca Maamulaha',
  '0611111111'
);
```

> Maamulaha koowaad **SQL ayaa lagu abuuraa**. Tani waa qasab: `redeem_invite`
> keliya ayaa profile abuuri kara, casuumaadna waxaa sameeya maamule — sidaas
> qofka koowaad meel kale kuma iman karo.

## 6. Casuumaadda macalimiinta

Macalinku **iskiis akoon ma abuuro**. Wareegu waa:

1. Maamuluhu app-ka ku sameeyaa casuumaad → `create_invite()` koodh soo saara
   (tusaale `KAB-K7QM2X`), 14 maalmood shaqaynaya
2. Maamuluhu koodhka macalinka u diraa (WhatsApp, SMS, iwm)
3. Macalinku app-ka ka doortaa **"Koodh casuumaad"**, koodhka geliyaa →
   `peek_invite()` wuxuu tusaa magaca iyo iskuulka
4. Macalinku fure cusub sameeyaa → akoon Auth ah + `redeem_invite()`

**Doorka iyo iskuulka casuumaadda ayay ka yimaadaan** — macalinku ma dooran
karo. Sidoo kale:

- emailka akoonku waa inuu la mid noqdaa kii la casumay (`redeem_invite`
  wuxuu ka hubiyaa `auth.users`), sidaas koodh la helay qof kale uma shaqeeyo
- koodh la aqbalay, la joojiyay ama dhacay lama isticmaali karo
- `for update` ayaa xiraya safka si laba qof aysan isku koodh u aqbalin
- hal email hal casuumaad furan ayuu haysan karaa (unique index)

---

## Sida ammaanku u shaqeeyo (RLS)

Ogolaanshuhu **database-ka** ayuu ku jiraa, ma aha app-ka oo keliya badhamo
qariya. Xitaa haddii qof toos u wacdo API-ga, isla xeerarka ayaa khusaya.

| Jaantus | Macalin | Maamule |
|---|---|---|
| `classes` | wuu akhriyaa iskuulkiisa | wuu abuuraa/beddelaa |
| `students` | fasaladiisa **oo keliya** | dhammaan iskuulka |
| `attendance` | fasaladiisa **oo keliya** | dhammaan iskuulka |
| `fees` | fasaladiisa **oo keliya** | dhammaan iskuulka |
| `profiles` | kiisa + liiska iskuulka | wuu maamulaa kuwa iskuulka |

Xudunta waa `can_touch_class(class_id)`:

```sql
p.role = 'super_admin' or c.teacher_id = p.id
```

### Ilaalinta doorka

Trigger (`guard_profile_changes`) ayaa joojinaya in isticmaaluhu **iskiis**
`role` ama `school_id` u beddelo — haddii kale macalin kastaa wuxuu isaga
dhigi kari lahaa maamule.

### Aqoonsiga ardayga

`next_student_code()` waa hawl **database** ah oo `for update` isticmaasha.
Haddii laba macalin isku mar arday galiyaan, midkoodna ma helayo lambar
isku mid ah — taasoo app-ku keligiis xamili kari waayay.

---

## Sawirada

Laba bucket oo **gaar ah** (public maaha):

| Bucket | Jidka | Yaa arka |
|---|---|---|
| `avatars` | `<profile_id>/avatar.jpg` | qof kastaa kiisa wuu beddelaa; xubnaha iskuulku way arkaan |
| `student-photos` | `<class_id>/<student_id>.jpg` | macalinka fasalka leh oo keliya |

Sawirka ardayga jidkiisu wuxuu ku bilaabmaa `class_id` — sidaas RLS-ku wuxuu
isla `can_touch_class()` ku hubin karaa.

Marka la akhrinayo waxaa la isticmaalaa **signed URL** (1 saac) — bucket-yadu
public ma aha.

---

## Habka maqan (offline mode)

Haddii `.env` la'aan la ordo, app-ku wuxuu u shaqeeyaa **local mode**:
xogtu waxay ku jirtaa AsyncStorage. Taasi waa tijaabo/demo — waa isla
UI-ga, laakiin xogtu qalabka ayay ku harsan tahay.

Marka `.env` la buuxiyo, app-ku wuxuu toos u galaa **live mode**
(`isSupabaseConfigured()` — eeg `src/services/supabase.js`).
