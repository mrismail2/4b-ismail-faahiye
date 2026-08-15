# KAABE

App **React Native (Expo)** ah oo backend-kiisu yahay **Supabase**. Macalinku
wuxuu ku maamulaa fasalkiisa: **ardayda**, **xaadiriska maalinlaha ah**, iyo
**lacagaha bilaha** — si fudud.

Qaab-dhismeedka xogta iyo ammaanka waxaa laga tixraacay softiweerka
**Kobciye**, laakiin kani waa mid aad u fudud oo saddexdaas shaqo oo keliya
diiradda saara.

---

## Doorarka — laba oo keliya

| Doorka | Isdiiwaan gelin | Waxa uu qabto |
|---|---|---|
| **Maamulaha Guud** | Haa | Abuuraa fasalada, macalimiinta ayuu u qoondeeyaa, wuxuu arkaa warbixinta guud |
| **Macalin** | Haa | Fasaladiisa **oo keliya**: ardayda, xaadiriska, lacagaha |

> **Ardayda iyo waalidiintu akoon MA LAHA.** Ardaygu waa *xog* uu macalinku
> fasalka ku dhex qoro. Waalidka waxaa laga hayaa taleefan keliya.

---

## Shaqooyinka

### 1. Ardayda — magac iyo sawir
Arday walba: **sawir**, magac, jinsi, taleefanka waalidka, lacag bileed.
Wuxuu leeyahay bog isaga u gaar ah oo muujinaya tirakoobka xaadiriska iyo
taariikhda lacagta.

Laba aqoonsi ayuu leeyahay:
- `student_internal_id` — furaha gudaha ah ee xiriiriya xaadiriska iyo lacagta
- `student_id` — aqoonsiga la arko (`ARD-000001`)

Ardayga fasalka laga saaro **lama tirtiro** — waxaa loo calaamadiyaa `left` si
taariikhdiisu u sii jirto, laakiinna lagama xisaabiyo lacagta.

### 2. Xaadiriska
Maalin kasta: `Jooga` · `Maqan` · `Soo daahay` · `Fasax`, iyo badhanka
**"Dhammaan Jooga"**. Diiwaanka dib haddii loo kaydiyo wuu **beddelmaa**,
mana **tarmo**. Taariikh mustaqbal ah lama gali karo.

### 3. Lacagaha bilaha
Bil kasta: **waajibka**, **wixii la bixiyay**, **hadhaaga**. Xaaladdu waa
`Ma bixin` · `Qayb bixiyay` · `Bixiyay`, waana la xisaabiyaa si toos ah.

### 4. Profile-ka macalinka
Macalin walba wuxuu leeyahay profile: **sawir**, magac, taleefan, maadada uu
dhigo, iyo wax yar oo isaga ku saabsan.

---

## Backend-ka Supabase

Xogtu waxay ku jirtaa **Postgres**, soo galitaanku **Supabase Auth**,
sawiraduna **Supabase Storage**.

Habaynta oo dhan: [`supabase/README.md`](supabase/README.md)

```bash
cp .env.example .env      # buuxi URL + anon key
```

### Ammaanka — RLS

Ogolaanshuhu **database-ka** ayuu ku jiraa, ma aha app-ka oo keliya badhamo
qariya. Xudunta waa `can_touch_class(class_id)`:

```sql
p.role = 'super_admin' or c.teacher_id = p.id
```

`students`, `attendance` iyo `fees` dhammaantood isla xeerkaas ayay
isticmaalaan — macalin isku dayaya inuu fasal kale galo, database-ka ayaa
diidaya.

Saddex ilaalin oo muhiim ah:

1. **Doorka iskaa uma beddeli kartid.** Trigger (`guard_profile_changes`)
   ayaa joojinaya in macalin isaga dhigo maamule.
2. **Lambarka ardayga database-ka ayaa soo saara.** `next_student_code()`
   wuxuu isticmaalaa `for update` — laba macalin oo isku mar arday galiya
   isku lambar ma helayaan (tan app-ku keligiis xamili kari waayay).
3. **Sawiradu bucket gaar ah ayay ku jiraan.** Jidka sawirka ardaygu wuxuu
   ku bilaabmaa `class_id`, sidaas RLS-ku isla `can_touch_class()` ayuu ku
   hubiyaa. Marka la akhrinayo waa **signed URL** (1 saac).

### Habka maqan (offline)

Haddii `.env` la banayo, app-ku wuxuu u shaqeeyaa **local mode** —
AsyncStorage, tijaabo ahaan. Isla UI-ga, laakiin xogtu qalabka ayay ku
harsan tahay. Marka `.env` la buuxiyo, wuxuu toos u galaa **live mode**.

---

## Qaab-dhismeedka

```
src/
├── services/
│   ├── model.js           ← xisaabta OO DHAN (saafi, la tijaabin karo)
│   ├── localProvider.js   ← hirgelinta AsyncStorage
│   ├── remoteProvider.js  ← hirgelinta Supabase
│   ├── provider.js        ← midkee la isticmaalayo
│   ├── supabase.js        ← client + tarjumaadda khaladaadka
│   └── photos.js          ← kamarad/gallery (native + web)
├── context/AppContext.js  ← store + session + `ops`
├── theme/theme.js
├── components/ui.js
├── navigation/RootNavigator.js
└── screens/
    ├── auth/AuthScreen.js
    ├── admin/{AdminHome,Classes,Teachers}Screen.js
    ├── teacher/TeacherHomeScreen.js
    ├── ClassDetailScreen.js     ← Ardayda | Xaadiris | Lacag
    ├── StudentProfileScreen.js
    └── ProfileScreen.js

supabase/
├── migrations/20260815000001_kaabe_core.sql
└── README.md
```

### Sababta laba provider loo sameeyay

Shaashaduhu waxay wacaan `ops.addStudent(...)` — ma oga inay xogtu ka timid
Supabase mise AsyncStorage. Labada provider isku interface ayay leeyihiin,
`provider.js`na wuxuu doortaa mid marka `.env` la eego.

Muhiimadda ugu weyn: `remoteProvider.loadSnapshot()` wuxuu safafka Supabase
u beddelaa **isla qaabka** store-ka maxalliga ah — sidaas hawlaha akhrinta
ee `model.js` (`classFeeSummary`, `studentsByClass`, `attendanceSummary`)
labada habba way u shaqeeyaan, hal jeer oo keliya ayaana la qoray.

---

## Ordinta

```bash
npm install
npm run check     # 27 hubin
npm start         # Expo — QR-ka ku sawir Expo Go
npm run android
npm run ios
```

### Akoonka tijaabada (local mode oo keliya)
- Email: `maamule@kaabe.so`
- Fure: `kaabe123`

Macalimiintu naftooda ayay isku diiwaan geliyaan, kadibna maamuluhu fasal
buu u qoondeeyaa.

---

## Hubinta

### `npm run check` — 27 hubin
Xisaabta ayaa Node lagu ordiyaa, iyadoo la xaqiijinayo doorarka, aqoonsiyada,
kala-soocidda macalimiinta, xaadiriska, lacagta iyo profile-ka.

> Hubintani waxay muujisay **cillad dhab ah** intii la dhisayay: aqoonsiyada
> `Date.now()` ku salaysan way isku dhaci jireen marka laba diiwaan hal
> millisecond lagu abuuro — taasoo isku dari lahayd **xaadiriska iyo
> lacagta laba arday**. Shan hubin ayaa hal mar fashilantay, halkaas ayaana
> laga helay. Hadda `uid()` wuxuu isticmaalaa waqti + tirin + random,
> Supabase-na `gen_random_uuid()`.

### Screenshot — app-ka dhabta ah
Web build ayaa la sameeyay, Playwright-na wuxuu app-ka dhabta ah ku maray:
soo gal → abuur fasalo → gali 5 arday → calaamadee xaadiris → qaad lacag →
fur profile-yada. **12 shaashadood, 0 khalad JS ah.**

Laba cillad muuqaal ah ayaa halkaas laga helay oo la hagaajiyay:
- fasal aan arday lahayn wuxuu ku qorayay "Dhammaystiran" — hadda
  "Arday ma jiro"
- `Stat` saddexaad wuxuu ka bixi jiray geeska profile-ka — hadda hal saf

### Bundle
`expo export` wuu dhammaystirmaa (web iyo android labadaba), khalad compile
ah ma jiro.

---

## Digniin

Habka **local mode** furayaasha sirta ah plain text ayay ku jiraan — waa demo.
Wax dhab ah waxaad u isticmaashaa **Supabase**, halkaas oo furayaasha Auth
maamulo, ogolaanshahana RLS xaqiijiyo.

Furaha `service_role` **weligiis** app-ka ha gelin — wuxuu RLS oo dhan
dhaafaa.
