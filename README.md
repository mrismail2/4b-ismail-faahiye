# Fasalkayga

App **React Native (Expo)** ah oo macalinku ku maamulo fasalkiisa: **magacyada
ardayda**, **xaadiriska maalinlaha ah**, iyo **lacagaha bilaha**.

Qaab-dhismeedka xogta waxaa laga tixraacay softiweerka **Kobciye**, laakiin
kani waa mid aad u fudud oo saddexdaas shaqo oo keliya diiradda saara.

---

## Doorarka — laba oo keliya

| Doorka | Isdiiwaan gelin | Waxa uu qabto |
|---|---|---|
| **Maamulaha Guud** (super admin) | Haa | Abuuraa fasalada, macalimiinta ayuu u qoondeeyaa, wuxuu arkaa warbixinta guud |
| **Macalin** | Haa | Wuxuu maamulaa fasaladiisa oo keliya: ardayda, xaadiriska, lacagaha |

> **Ardayda iyo waalidiintu akoon MA LAHA.** Ardaygu waa *xog* uu macalinku
> fasalka ku dhex qoro — ma aha isticmaale app-ka soo gala. Waalidka waxaa laga
> hayaa taleefan keliya (si loola xiriiro), akoonna ma leh.

---

## Saddexda shaqo ee muhiimka ah

### 1. Ardayda
Macalinku wuxuu ku darayaa: **magaca**, jinsiga, taleefanka waalidka, iyo
lacagta bisha. Arday kastaa wuxuu helaa laba aqoonsi:

- `student_internal_id` — furaha gudaha ah ee xiriiriya xaadiriska iyo lacagta
- `student_id` — aqoonsiga la arko (`ARD-000001`), oo si isdaba joog ah u kordha

Ardayga fasalka laga saaro **lama tirtiro** — waxaa loo calaamadiyaa `left` si
taariikhdiisu u sii jirto, laakiinna lagama xisaabiyo lacagta.

### 2. Xaadiriska
Maalin kasta, arday kasta wuxuu qaataa mid ka mid ah:

`Jooga` · `Maqan` · `Soo daahay` · `Fasax`

- Badhanka **"Dhammaan Jooga"** ayaa dhaqso u calaamadiya fasalka oo dhan
- Diiwaanka dib haddii loo kaydiyo wuu **beddelmaa**, mana **tarmo**
- Maalin kastaa waa madax bannaan tahay; taariikh mustaqbal ah lama gali karo

### 3. Lacagaha bilaha
Bil kasta (`2026-08`), arday kastaa wuxuu leeyahay:

- **Waajibka** — lacagta bisha ee ardayga (waxay ka dhaxashaa fasalka)
- **La bixiyay** — waxa macalinku diiwaan geliyay
- **Hadhaaga** — waajibka ka jar wixii la bixiyay

Xaaladdu waa `Ma bixin` · `Qayb bixiyay` · `Bixiyay`, waana la xisaabiyaa
si toos ah. Bil kastaa waa gooni; lacag dib loo qoro way beddelmaysaa,
mana tarmayso.

---

## Qaab-dhismeedka faylasha

```
src/
├── services/
│   ├── model.js       ← xisaabta OO DHAN (saafi, AsyncStorage ma taabto)
│   └── storage.js     ← kaydinta AsyncStorage + dib-u-dhoofinta model
├── context/
│   └── AppContext.js  ← store + qofka soo galay, `mutate()`
├── data/seed.js       ← xogta bilowga (akoonka tijaabada)
├── theme/theme.js     ← midabada iyo cabbirada
├── components/ui.js   ← Card, Button, Field, Badge, Avatar, Stat…
├── navigation/
│   └── RootNavigator.js  ← tabs kala duwan doorka
└── screens/
    ├── auth/AuthScreen.js        ← soo gal / isdiiwaan geli
    ├── admin/AdminHomeScreen.js  ← guudmarka iskuulka
    ├── admin/ClassesScreen.js    ← abuur fasal, qoondee macalin
    ├── admin/TeachersScreen.js   ← macalimiinta iyo fasaladooda
    ├── teacher/TeacherHomeScreen.js ← fasalada macalinka
    ├── ClassDetailScreen.js      ← Ardayda | Xaadiris | Lacag
    └── ProfileScreen.js          ← akoonka
```

### Sababta `model.js` iyo `storage.js` loo kala saaray

`model.js` **ma taabto AsyncStorage**. Hawl kastaa waxay qaadataa `store` waxayna
soo celisaa `store` **cusub** (pure function). Taas macnaheedu waxaa weeye
xisaabta oo dhan waa lagu tijaabin karaa Node — eeg `npm run check`.

`storage.js` wuxuu qabtaa kaydinta oo keliya, kadibna `export * from './model'`
si shaashaduhu hal meel uga soo qaataan.

---

## Aqoonsiga (Kobciye ayaa laga soo tixraacay)

| Furaha | Tusaale | Loo isticmaalo |
|---|---|---|
| `school_id` | `school_001` | Furaha iskuulka |
| `class_id` | `school_001_class_fasalka_1a` | Caalami ahaan **gaar** — laba iskuul way lahaan karaan "Fasalka 1A" iyagoo aan isku dhicin |
| `student_internal_id` | `student_m3x9k2a4f` | Furaha xiriirka: xaadiris, lacag |
| `student_id` | `ARD-000001` | Aqoonsiga la arko / la daabaco |

Magacyadu (magaca fasalka, magaca ardayga) **waligood furaha xiriirka ma aha** —
tusmo muuqaal ah oo keliya ayay yihiin.

---

## Ordinta

```bash
npm install
npm run check     # hubinta aasaaska (21 hubin)
npm start         # Expo — QR-ka ku sawir Expo Go
npm run android
npm run ios
```

### Akoonka tijaabada
Marka ugu horreysa ee app-ka la furo waxaa jira hal akoon oo maamule ah:

- Taleefan: `0611111111`
- Fure: `admin123`

Macalimiintu naftooda ayay isku diiwaan geliyaan bogga **"Isdiiwaan geli"**,
kadibna maamuluhu fasal buu u qoondeeyaa.

---

## Hubinta (`npm run check`)

21 hubin ayaa xisaabta ku ordaya Node, iyagoo xaqiijinaya:

- doorka `super_admin` iyo `teacher` **oo keliya** in la aqbalo
- taleefan la iska diiwaan geliyay mar labaad in la diido
- `class_id` inuu gaar yahay, fasalna uu **hal** macalin lahaado
- macalinku inuu arko **oo keliya** fasaladiisa
- `student_id` inuusan is celcelin
- xaadiriska: kaydin, beddelid (aan tarmin), maalmo aan is faragelin
- lacagta: wadar sax ah, bilo aan is faragelin, arday la saaray oo aan la xisaabin

> Hubintani waxay muujisay cillad dhab ah intii la dhisayay: aqoonsiyada
> `Date.now()` ku salaysan way isku dhaci jireen marka laba diiwaan hal
> millisecond lagu abuuro — taasoo isku dari lahayd xaadiriska iyo lacagta
> laba arday. Hadda `uid()` wuxuu isticmaalaa waqti + tirin + random.

---

## Xaaladda

Waxaa la xaqiijiyay:

- `npm run check` — **21/21 way guuleysteen**
- `npx expo export --platform android` — **bundle wuu dhammaystirmay** (2.55 MB), khalad compile ah ma jiro

## Digniin

Kani waa **prototype frontend ah**. Xogta oo dhan waxay ku jirtaa qalabka
(AsyncStorage), furayaasha sirta ahna waxay ku jiraan qaab **plain text** ah.
Ka hor isticmaalka dhabta ah waa in la geliyaa backend leh:

- authentication sax ah (furayaal la hash-gareeyay)
- database dhexe iyo kaydin ammaan ah
- kala soocidda iskuulada iyo oggolaanshaha server-ka lagu xaqiijiyo
