# KAABE

App **React Native (Expo)** ah oo backend-kiisu yahay **Supabase**. Macalinku
wuxuu ku maamulaa fasalkiisa: **ardayda**, **xaadiriska maalinlaha ah**, iyo
**lacagaha bilaha** — si fudud.

Qaab-dhismeedka xogta iyo ammaanka waxaa laga tixraacay softiweerka
**Kobciye**, laakiin kani waa mid aad u fudud oo saddexdaas shaqo oo keliya
diiradda saara.

---

## Doorarka — laba oo keliya

| Doorka | Sida loo helo | Waxa uu qabto |
|---|---|---|
| **Maamulaha Guud** | SQL (qofka koowaad) | Abuuraa fasalada, **macalimiinta ayuu casuumaa**, wuxuu arkaa warbixinta guud |
| **Macalin** | **Koodh casuumaad** | Fasaladiisa **oo keliya**: ardayda, xaadiriska, lacagaha |

### Macalinku iskiis akoon ma abuuro — email ayaa loo dirayaa

**Maamulaha guud OO KELIYA** ayaa casuumi kara:

1. Maamuluhu magaca + emailka macalinka geliyaa
2. Koodh (`KAB-K7QM2X`) ayaa la abuuraa, **emailkana toos ayaa loo dirayaa**
   (Edge Function + Resend)
3. Macalinku app-ka ka doortaa "Koodh casuumaad", koodhka geliyaa
4. Macalinku **fure sirta ah oo isaga u gaar ah** ayuu samaystaa

**Doorka iyo iskuulka casuumaadda ayay ka yimaadaan, ma aha waxa qofku qoro.**
Emailka akoonku waa inuu la mid noqdaa kii la casumay, koodhna hal mar ayuu
shaqeeyaa. Haddii adeegga emailku aanu diyaar ahayn, koodhka waa la tusayaa
maamulaha, badhanka **"Email u dir"**na app-ka emailka ayuu furayaa.

Faahfaahin: [`supabase/README.md`](supabase/README.md).

### Macalin kastaa gooni ayuu u shaqeeyaa

**Macalinku fasalkiisa isagaa samaysta** — kiisa ayuu noqonayaa, macalimiinta
kalena ma arkayaan. Maamuluhuna fasal buu u qoondayn karaa.

| Tallaabo | Macalin | Maamule |
|---|---|---|
| Casuumaad samee | **Maya** | Haa |
| Fasal samee | Haa — **kiisa** | Haa — cidduu doorto |
| Fasalka qof kale beddel | **Maya** | Haa |
| Arday ku dar / beddel / tirtir | Fasaladiisa | Dhammaan |
| Lacagta beddel | Fasaladiisa | Dhammaan |

> **Ardayda iyo waalidiintu akoon MA LAHA.** Ardaygu waa *xog* uu macalinku
> fasalka ku dhex qoro. Waalidka waxaa laga hayaa taleefan keliya.

---

## Shaqooyinka

### 1. Ardayda — magac, sawir, tirtirid
Arday walba: **sawir** (kamarad ama gallery), magac, jinsi, taleefanka
waalidka, lacag bileed. Wuxuu leeyahay bog isaga u gaar ah oo muujinaya
tirakoobka xaadiriska iyo taariikhda lacagta.

Macalinku wuxuu samayn karaa: **ku dar · wax ka beddel · sawir · ka saar ·
tirtir**. Laba jid oo kala duwan:

- **Ka saar** — liiska wuu ka baxayaa, lacagta lagama xisaabinayo, laakiin
  taariikhdiisu way sii jiraysaa (`status: left`)
- **Tirtir** — isaga, xaadiriskiisa iyo lacagihiisa oo dhan waa la tirtirayaa

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

Lacagta **mar walba waa la beddeli karaa** — arday kastaa qiimahiisa,
fasalkuna qiimaha caadiga ah. Beddelka fasalku ardaydii hore ma taabanayo;
mid walba kiisa ayuu leeyahay.

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

Afar ilaalin oo muhiim ah:

1. **Doorka iskaa uma beddeli kartid.** Trigger (`guard_profile_changes`)
   ayaa joojinaya in macalin isaga dhigo maamule.
2. **Lambarka ardayga database-ka ayaa soo saara.** `next_student_code()`
   wuxuu isticmaalaa `for update` — laba macalin oo isku mar arday galiya
   isku lambar ma helayaan (tan app-ku keligiis xamili kari waayay).
3. **Sawiradu bucket gaar ah ayay ku jiraan.** Jidka sawirka ardaygu wuxuu
   ku bilaabmaa `class_id`, sidaas RLS-ku isla `can_touch_class()` ayuu ku
   hubiyaa. Marka la akhrinayo waa **signed URL** (1 saac).
4. **Profile iskaa uma abuuri kartid.** Policy-gii `insert own profile` waa
   la tirtiray — wuxuu u oggolaanayay qof kasta inuu `role` iyo `school_id`
   iska doorto. Hadda hal jid oo keliya ayaa jira: `redeem_invite()`.

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
├── utils/dialog.js        ← confirm/notify (native + web)
├── theme/theme.js
├── components/
│   ├── ui.js              ← Card, Button, Field, Avatar, PhotoPicker…
│   └── blocks.js          ← GreetingHeader, QuickAccess, MetricRow, HeroCard
├── navigation/RootNavigator.js
└── screens/
    ├── auth/AuthScreen.js   ← soo gal | koodh casuumaad
    ├── ClassFormModal.js    ← foomka fasalka (maamule + macalin)
    ├── admin/{AdminHome,Classes,Teachers}Screen.js
    ├── teacher/TeacherHomeScreen.js
    ├── ClassDetailScreen.js     ← Ardayda | Xaadiris | Lacag
    ├── StudentProfileScreen.js
    └── ProfileScreen.js

supabase/
├── migrations/
│   ├── 20260815000001_kaabe_core.sql             ← jaantusyada + RLS + storage
│   ├── 20260815000002_kaabe_invites.sql          ← casuumaadda + xidhidda profile
│   └── 20260815000003_kaabe_teacher_classes.sql  ← macalinku fasalkiisa
├── functions/invite-teacher/index.ts             ← emailka casuumaadda
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
npm run check     # 43 hubin
npm start         # Expo — QR-ka ku sawir Expo Go
npm run android
npm run ios
```

### Akoonka tijaabada (local mode oo keliya)
- Email: `maamule@kaabe.so`
- Fure: `kaabe123`

Kadib: **Macalimiin → Casuumaadaha → + Casuun macalin** → koodh ayaa soo
baxaya. Ka bax, dooro **"Koodh casuumaad"**, koodhka geli — macalinka ayaad
noqonaysaa.

---

## Hubinta

### `npm run check` — 43 hubin
Xisaabta ayaa Node lagu ordiyaa, iyadoo la xaqiijinayo doorarka, aqoonsiyada,
kala-soocidda macalimiinta, xaadiriska, lacagta, profile-ka, **casuumaadda**
(koodh gaar ah, email khaldan oo la diido, koodh la aqbalay/joojiyay/dhacay),
iyo **kala-soocidda macalimiinta** (mid kastaa fasalkiisa, isku ma dhex qasmayaan).

> Hubintani waxay muujisay **cillad dhab ah** intii la dhisayay: aqoonsiyada
> `Date.now()` ku salaysan way isku dhaci jireen marka laba diiwaan hal
> millisecond lagu abuuro — taasoo isku dari lahayd **xaadiriska iyo
> lacagta laba arday**. Shan hubin ayaa hal mar fashilantay, halkaas ayaana
> laga helay. Hadda `uid()` wuxuu isticmaalaa waqti + tirin + random,
> Supabase-na `gen_random_uuid()`.

### Screenshot — app-ka dhabta ah
Web build ayaa la sameeyay, Playwright-na wuxuu **wareega oo dhan** ku maray:
maamule soo gal → abuur fasalo → **casuun macalin** → koodhka shaashadda ka
qaad → ka bax → **macalinku koodhka ku soo galo** → **macalinku fasalkiisa
samaysto** → gali 5 arday → calaamadee xaadiris → qaad lacag →
fur profile-yada.
**19 shaashadood, 0 khalad JS ah, 0 digniin khalad ah.**

Saddex cillad ayaa halkaas laga helay oo la hagaajiyay:
- fasal aan arday lahayn wuxuu ku qorayay "Dhammaystiran" — hadda
  "Arday ma jiro"
- `Stat` saddexaad wuxuu ka bixi jiray geeska profile-ka — hadda hal saf
- **`Alert` oo badhamo leh web-ka kuma shaqaynayn** (react-native-web wuxuu
  u beddelaa `window.alert`, `onPress`na waligiis ma dhaco) — sidaas "Ka bax",
  "Tirtir" iyo "Ka saar" waxba ma qaban jirin web-ka. Hadda `utils/dialog.js`
  ayaa native `Alert` u isticmaala, web-na `window.confirm`.

### Bundle
`expo export` wuu dhammaystirmaa (web iyo android labadaba), khalad compile
ah ma jiro.

---

## UI-ga

Naqshaddu waa mid **kaar-ku-salaysan**: salaan + taariikh, kaararka
"Guudmarka maanta", badhamada midabka leh ee "Si dhaqso ah", kaarka madaxa
ee lacagta, iyo safafka tirakoobka (`components/blocks.js`).

### Midabada iyo farta (`theme/theme.js`)

| | | | |
|---|---|---|---|
| **Buluug** | `#0045AD` | `#005CE6` | `#B0CCF7` · `#D9E7FB` |
| **Casaan** | `#B43333` | `#F04444` | `#FAC5C5` · `#FDE3E3` |
| **Cagaar** | `#0F8A63` | `#14B888` | `#B7E9D8` · `#E3F7F0` |
| **Madow** | `#171717` | `#313131` | `#FBFBFB` · `#FFFFFF` |

Farta waa **Inter**, cabbirradana `type` ayaa hayaa (H1 → Tag), si qoraalku
uu shaashad kasta isku mid u ahaado.

| Shaashad | Waxa uu leeyahay |
|---|---|
| Maamulaha | Guudmar · Fasalada · Macalimiin · Akoon |
| Macalinka | Fasaladayda · Akoon |

Tab-yada macalinku waa laba oo keliya — wax uusan u baahnayn lama tuso.

---

## Digniin

Habka **local mode** furayaasha sirta ah plain text ayay ku jiraan — waa demo.
Wax dhab ah waxaad u isticmaashaa **Supabase**, halkaas oo furayaasha Auth
maamulo, ogolaanshahana RLS xaqiijiyo.

Furaha `service_role` **weligiis** app-ka ha gelin — wuxuu RLS oo dhan
dhaafaa.
