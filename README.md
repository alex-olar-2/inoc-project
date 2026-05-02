# 🏠 Casa Virtuală Inteligentă – Control prin Gesturi

> **Control smart home în timp real, direct din browser, folosind camera web și gesturi ale mâinii sau feței.**

---

## 🎯 1. Obiectivele Aplicației și Viziunea Proiectului

**Casa Virtuală Inteligentă** a fost concepută ca un prototip de interfață om-calculator (HCI) care explorează eliminarea barierelor fizice în controlul mediului ambiant. Proiectul își propune să demonstreze cum tehnologiile de **Computer Vision** și **Machine Learning** pot fi integrate într-o aplicație web accesibilă pentru a simula gestionarea unei locuințe smart.

### Aspecte cheie vizate:

- **Accesibilitate Non-Tactilă:** Crearea unui sistem util pentru persoanele cu dizabilități motorii sau pentru situații în care atingerea unei suprafețe este imposibilă sau neigienică (ex: bucătărie, medii medicale).
- **Interacțiune Intuitivă:** Utilizarea gesturilor naturale (palma deschisă, pumn strâns, zâmbet) care sunt ușor de memorat și executat de către utilizatori de orice vârstă.
- **Procesare "On-Device":** Garantarea intimității prin procesarea fluxului video local, fără a trimite imagini către un server extern.

---

## 🛠️ 2. Mediul de Dezvoltare

Pentru realizarea acestui proiect, s-a optat pentru un ecosistem de dezvoltare modern, axat pe viteză și modularitate:

- **Editor de Cod:** [Visual Studio Code](https://code.visualstudio.com/) cu extensii pentru formatare (Prettier) și Live Server.
- **Limbaje:** HTML5 (pentru structură semantică), CSS3 (pentru design premium și animații hardware-accelerated) și JavaScript (ES6+ pentru logică).
- **Controlul Versiunilor:** Git pentru gestionarea istoricului de cod și GitHub pentru deployment (via GitHub Pages).
- **Testare și Debugging:** Chrome DevTools a fost instrumentul principal pentru optimizarea performanței modelelor ML și pentru monitorizarea ratei de cadre pe secundă (FPS).
- **Server Local:** Utilizarea `python -m http.server` sau `npx serve` pentru a simula un mediu de producție și a evita restricțiile de securitate ale browserului privind accesul la cameră în fișiere locale (`file://`).

---

## 🧠 3. Biblioteci Specifice Interacțiunii Gestuale

Sâmburele tehnologic al aplicației este reprezentat de ecosistemul **MediaPipe**, dezvoltat de Google, care oferă modele pre-antrenate de înaltă fidelitate:

1.  **MediaPipe Hands:**
    - **Funcționare:** Detectează 21 de puncte cheie (landmarks) 3D ale mâinii dintr-un singur cadru video.
    - **Utilizare în proiect:** Clasificăm gesturile prin calcularea distanțelor euclidiene între vârful degetelor și bază (ex: dacă vârful degetului mare este aproape de baza degetului arătător, detectăm un gest de "Pinch").
2.  **MediaPipe Face Mesh:**
    - **Funcționare:** Estimează 468 de puncte cheie ale feței în timp real.
    - **Utilizare în proiect:** Monitorizăm indici precum "Lip Distance" pentru a detecta o gură deschisă (Surprised) sau distanța dintre colțurile gurii pentru a detecta un zâmbet (Happy).
3.  **MediaPipe Camera & Drawing Utils:**
    - Asigură sincronizarea perfectă între frame-urile video și overlay-ul grafic pe Canvas, oferind feedback vizual utilizatorului despre ce "vede" algoritmul.

---

## ⚖️ 4. Avantajele și Dezavantajele Implementării

Alegerea unei implementări bazate pe browser (Client-Side JavaScript) vine cu un set specific de compromisuri:

### ✅ Avantaje:

- **Confidențialitate Totală:** Imaginile camerei web nu părăsesc niciodată dispozitivul utilizatorului.
- **Fără Instalare:** Utilizatorul trebuie doar să acceseze un URL; nu sunt necesare drivere sau software adițional.
- **Latență Minimă:** Deoarece detecția se face local, nu există lag-ul indus de rețea, rezultând într-o experiență fluidă.
- **Costuri Reduse:** Nu este necesară o infrastructură puternică de servere pentru procesarea video.

### ❌ Dezavantaje:

- **Consum de Resurse:** Rularea modelelor ML în browser este solicitantă pentru procesor (CPU) și placa video (GPU), putând reduce autonomia bateriei pe laptopuri.
- **Dependență de Iluminare:** Calitatea detecției scade drastic în condiții de luminozitate slabă sau dacă fundalul este foarte aglomerat.
- **Vocabular Limitat de Gesturi:** Algoritmii de clasificare custom (euristici) pot genera "false-positives" dacă mâna este ținută într-un unghi neobișnuit.

---

## 🔍 5. Elemente Concludente și Inovații

Pe parcursul dezvoltării, am identificat și implementat câteva elemente critice pentru succesul experienței de utilizare:

- **Mecanismul de Debounce (Confirmare):** Pentru a evita activările accidentale (ex: utilizatorul se scarpină la nas și sistemul crede că e un gest), am implementat un inel de confirmare de 1.5 secunde. Acțiunea se execută doar dacă gestul este menținut stabil.
- **Sistemul de Cooldown:** După fiecare comandă, sistemul intră într-o stare de repaus de 2 secunde pentru a preveni trimiterea de comenzi multiple pentru aceeași acțiune.
- **Feedback Vizual Dual:** Utilizatorul vede atât scheletul mâinii/feței pe camera video, cât și starea actualizată în timp real pe planul casei, creând o legătură mentală puternică între gest și efect.

---

## 🖥️ Interfață și Structură

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

### 🕹️ Mapare Gesturi → Acțiuni

| Mod          | Gest         | Acțiune                    |
| ------------ | ------------ | -------------------------- |
| **✋ Mâini** | 🖐️ Palm      | Aprinde becul din Living   |
| **✋ Mâini** | ✊ Fist      | Stinge becul din Living    |
| **✋ Mâini** | 👍 Thumbs Up | Pornește Centrala Termică  |
| **✋ Mâini** | 🤙 Pinch     | Oprește Centrala Termică   |
| **✋ Mâini** | ✌️ Peace     | Armează alarma             |
| **✋ Mâini** | 👆 Point     | Dezarmează alarma          |
| **😃 Față**  | 😲 Surprised | Aprinde becul din Dormitor |
| **😃 Față**  | 😄 Happy     | Mod Seară (totul ON)       |
| **😃 Față**  | 😑 Blink     | Oprire urgență (totul OFF) |

---

## 🗂️ Structura Proiectului

```
inoc_project_v3/
├── index.html                      # Layout principal
├── css/style.css                   # Design premium & animații
└── js/
    ├── app.js                      # Entry point
    ├── camera.js                   # Wrapper MediaPipe Camera
    ├── models/                     # Logica AI (Hand/Face)
    └── smart-home/                 # Logica de business (State/UI/Control)
```

---

## 🤝 Contribuții

Proiect academic demonstrativ realizat pentru **INOC 2026**.
