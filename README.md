# 🏠 Casa Virtuală Inteligentă – Control prin Gesturi

> **Control smart home în timp real, direct din browser, folosind camera web și gesturi ale mâinii sau feței.**

---

## ✨ Prezentare Generală

**Casa Virtuală Inteligentă** este o aplicație web care permite controlul dispozitivelor dintr-o casă simulată — becuri, centrală termică, alarmă de securitate — prin **gesturi detectate automat** cu ajutorul camerei web, fără niciun click sau atingere.

Sistemul folosește **MediaPipe** (Google) pentru detecția în timp real a landmarks-urilor mâinii și feței, combinate cu o arhitectură modulară JavaScript ce mapează gesturile la acțiuni smart home.

---

## 🖥️ Interfață

```
┌─────────────────────────────────────────────────────────────────┐
│  🏠 Casa Virtuală Inteligentă       [✋ Mâini] [😃 Față]  🔄  │
├───────────────────────────┬─────────────────────────────────────┤
│  📷 Feed Cameră           │  🏠 Plan Casă                       │
│  ┌─────────────────────┐  │  ┌──────────┬──────────┐           │
│  │  [Canvas MediaPipe] │  │  │ 🛋 Living │ 🛏 Dorm. │           │
│  │  (overlay gesturi)  │  │  │   [💡]   │   [💡]   │           │
│  └─────────────────────┘  │  ├──────────┼──────────┤           │
│                           │  │ 🚿 Baie  │ 🍳 Bucăt.│           │
│  Gest detectat: 🖐️ Palm  │  │   [💡]   │   [💡]   │           │
│  [⏳ Inel confirmare]    │  └──────────┴──────────┘           │
│                           │  🔥 Centrală  🔒 Alarmă             │
│  📖 Referință Gesturi     │  📜 Jurnal Acțiuni                  │
└───────────────────────────┴─────────────────────────────────────┘
```

---

## 🕹️ Mapare Gesturi → Acțiuni

### ✋ Modul Mâini

| Gest | Emoji | Acțiune |
|---|:---:|---|
| Open Palm | 🖐️ | Aprinde becul din **Living** |
| Fist | ✊ | Stinge becul din **Living** |
| Thumbs Up | 👍 | Pornește **Centrala Termică** |
| Pinch | 🤙 | Oprește **Centrala Termică** |
| Peace / V | ✌️ | **Armează** alarma de securitate |
| Point | 👆 | **Dezarmează** alarma de securitate |

### 😃 Modul Față

| Gest | Emoji | Acțiune |
|---|:---:|---|
| Surprised (gură deschisă) | 😲 | Aprinde becul din **Dormitor** |
| Happy (zâmbet) | 😄 | **Mod Seară** – aprinde toate becurile |
| Blink (clipire) | 😑 | ⚠️ **Oprire urgență** – stinge totul |

---

## ⚙️ Mecanismul de Confirmare

Pentru a preveni activările accidentale, sistemul folosește un **debounce în 2 faze**:

```
Gest detectat → ⏳ Confirmare 1.5s → ✅ Acțiune executată → ⏱️ Cooldown 2s
```

- **Inelul de progres** (SVG animat) arată vizual progresul confirmării
- **Bara de cooldown** apare după execuție, blocând activări repetate

---

## 🗂️ Structura Proiectului

```
inoc_project_v3/
│
├── index.html                      # Layout principal (split-screen)
│
├── css/
│   └── style.css                   # Design dark premium, animații CSS
│
└── js/
    ├── app.js                      # Entry point, inițializare
    ├── camera.js                   # Wrapper MediaPipe Camera
    │
    ├── models/
    │   ├── hand-gesture.js         # Detectare & clasificare gesturi mână
    │   └── face-gesture.js         # Detectare & clasificare gesturi față
    │
    └── smart-home/
        ├── home-state.js           # Starea centralizată a dispozitivelor
        ├── home-ui.js              # Actualizare DOM / animații UI
        └── home-controller.js      # Logica de control + debounce
```

---

## 🚀 Cum rulezi proiectul

> ⚠️ **Browserul trebuie să aibă acces la cameră.** Nu este necesară nicio instalare sau server.

### Rapid (fișier local)

1. Clonează sau descarcă repozitoriul
2. Deschide `index.html` direct în **Google Chrome** sau **Microsoft Edge**
3. Permite accesul la cameră când browserul solicită
4. Selectează modul dorit (**Mâini** sau **Față**) și începe să faci gesturi!

### Cu un server local (recomandat pentru dev)

```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve .
```

Apoi accesează `http://localhost:8080` în browser.

---

## 📦 Dependențe (CDN – fără instalare)

| Librărie | Versiune | Scop |
|---|---|---|
| [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands) | latest | Detectare mână (21 landmarks) |
| [MediaPipe Face Mesh](https://google.github.io/mediapipe/solutions/face_mesh) | latest | Detectare față (468 landmarks) |
| [MediaPipe Camera Utils](https://google.github.io/mediapipe/getting_started/web) | latest | Wrapper cameră web |
| [MediaPipe Drawing Utils](https://google.github.io/mediapipe/getting_started/web) | latest | Desenare landmarks pe canvas |
| [Bootstrap 5.3](https://getbootstrap.com/) | 5.3.0 | Layout responsive |
| [Inter & JetBrains Mono](https://fonts.google.com/) | — | Tipografie premium |

---

## 🧩 Arhitectura Modulară

```
app.js
  ├── initHandsModel()       → hand-gesture.js
  │     └── detectHandGesture()
  │           └── HomeController.processGesture()
  │
  ├── initFaceModel()        → face-gesture.js
  │     └── detectFaceGesture()
  │           └── HomeController.processGesture()
  │
  └── initCamera()           → camera.js

HomeController
  ├── gestureActions{}       → mapare gest → acțiune
  ├── HomeState.setState()   → actualizare stare
  └── HomeUI.update()        → re-render interfață
```

---

## 🎨 Design System

| Token | Culoare | Utilizare |
|---|---|---|
| `--bg` | `#08080f` | Fundal principal |
| `--card` | `#181828` | Carduri camere |
| `--accent` | `#6366f1` | Indigo – accente UI |
| `--light-on` | `#fbbf24` | Galben – bec aprins |
| `--heat-on` | `#f97316` | Portocaliu – centrală |
| `--alarm-on` | `#ef4444` | Roșu – alarmă armată |

---

## 🤝 Contribuții

Proiect academic / demonstrativ — **INOC 2026**.  
Orice sugestii de noi gesturi sau funcționalități sunt binevenite!

---

*Construit cu ❤️ folosind MediaPipe + JavaScript Vanilla*
