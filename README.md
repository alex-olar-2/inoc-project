# ✋😃 Detectare Gesturi: Mâini & Față

Aplicație web de **detectare a gesturilor** în timp real, folosind camera web-ul și biblioteca **MediaPipe**. Proiectul identifică gesturi ale mâinilor și expresii faciale, afișând rezultatele vizual pe un canvas suprapus peste feed-ul video.

> **Proiect academic — INOC (Interacțiunea Naturală Om-Calculator)**

---

## 🎯 Funcționalități

### Detectare Gesturi Mâini
| Gest | Emoji | Descriere |
|------|-------|-----------|
| Peace / V | ✌️ | Index și mijlociu ridicate |
| Thumbs Up | 👍 | Degetul mare ridicat, restul strânse |
| Fist | ✊ | Pumn închis |
| Open Palm | 🖐️ | Toate degetele ridicate |
| Point | 👆 | Doar indexul ridicat |
| Pinch | 🤙 | Degetul mare și indexul apropiați |

### Detectare Expresii Faciale
| Expresie | Emoji | Descriere |
|----------|-------|-----------|
| Happy | 😄 | Zâmbet detectat |
| Sad | 😢 | Expresie tristă |
| Surprised | 😲 | Gură deschisă |
| Blink | 😑 | Clipire (ambii ochi închiși) |
| Neutru | 😐 | Fără expresie clară |

---

## 🏗️ Arhitectura Proiectului

```
inoc_project_v3/
├── gesturi.html                  # Pagina principală (HTML + Bootstrap 5)
├── css/
│   └── style.css                 # Stiluri custom (dark theme, culori gesturi)
├── js/
│   ├── app.js                    # Logica principală (inițializare, event listeners)
│   ├── camera.js                 # Modul cameră (MediaPipe Camera Utils)
│   └── models/
│       ├── hand-gesture.js       # Model detectare gesturi mâini (MediaPipe Hands)
│       └── face-gesture.js       # Model detectare expresii faciale (MediaPipe Face Mesh)
└── README.md
```

Proiectul este organizat **modular**, cu separarea clară a responsabilităților:

- **`app.js`** — Punct de intrare: inițializează modelele, camera și gestionează comutarea între moduri (Mâini / Față).
- **`camera.js`** — Configurarea și pornirea camerei web prin `MediaPipe Camera Utils`, cu rutare a fiecărui cadru către modelul activ.
- **`hand-gesture.js`** — Inițializarea modelului `MediaPipe Hands` și algoritmul de clasificare a gesturilor pe baza landmark-urilor mâinii.
- **`face-gesture.js`** — Inițializarea modelului `MediaPipe Face Mesh` și algoritmul de clasificare a expresiilor faciale pe baza landmark-urilor feței.

---

## 🛠️ Tehnologii Utilizate

| Tehnologie | Versiune | Rol |
|------------|----------|-----|
| [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands.html) | Latest (CDN) | Detectare și tracking landmark-uri mâini |
| [MediaPipe Face Mesh](https://google.github.io/mediapipe/solutions/face_mesh.html) | Latest (CDN) | Detectare și tracking landmark-uri faciale |
| [MediaPipe Drawing Utils](https://google.github.io/mediapipe/solutions/drawing_utils.html) | Latest (CDN) | Desenare conectori și landmark-uri pe canvas |
| [Bootstrap 5](https://getbootstrap.com/) | 5.3.0 | Layout responsive, stilizare UI |
| HTML5 Canvas | — | Randare vizuală a landmark-urilor |
| JavaScript (Vanilla) | ES6+ | Logica aplicației |

---

## 🚀 Instalare & Rulare

### Precondiții
- Un browser modern (Chrome, Edge, Firefox) cu suport pentru `getUserMedia`
- O cameră web funcțională
- Conexiune la internet (pentru încărcarea bibliotecilor MediaPipe de pe CDN)

### Pași

1. **Clonează repository-ul:**
   ```bash
   git clone https://github.com/alex-olar-2/inoc-project.git
   cd inoc-project
   ```

2. **Deschide aplicația:**

   Poți deschide `gesturi.html` direct în browser, sau poți folosi un server local:
   ```bash
   # Folosind Python
   python -m http.server 8080

   # Sau folosind Node.js (npx)
   npx serve .
   ```

3. **Accesează aplicația** la `http://localhost:8080/gesturi.html`

4. **Acordă permisiunea** pentru accesul la cameră când browser-ul o solicită.

---

## 📖 Utilizare

1. La deschiderea aplicației, camera pornește automat în modul **Mâini** (✋).
2. Folosește **butoanele radio** din partea de sus pentru a comuta între:
   - **✋ Mâini** — detectare gesturi ale mâinii
   - **😃 Față** — detectare expresii faciale
3. Gestul sau expresia detectată este afișat(ă) deasupra feed-ului video, cu culoare specifică fiecărui tip.

---

## ⚙️ Cum Funcționează

### Fluxul de procesare

```
Camera Web → MediaPipe Camera Utils → Model Activ (Hands / Face Mesh)
                                            ↓
                                    Landmark-uri detectate
                                            ↓
                                    Algoritm clasificare gest/expresie
                                            ↓
                                    Desenare pe Canvas + Afișare rezultat
```

### Detectare Gesturi Mâini
Algoritmul analizează **21 de landmark-uri** ale mâinii furnizate de MediaPipe Hands:
- Verifică pozițiile relative ale vârfurilor degetelor față de articulațiile lor
- Calculează distanțe euclidiene (ex: pinch = distanța dintre degetul mare și index)
- Clasifică gestul pe baza combinației de degete ridicate/coborâte

### Detectare Expresii Faciale
Algoritmul analizează **468 de landmark-uri** ale feței furnizate de MediaPipe Face Mesh:
- Măsoară distanța verticală între pleoapele superioare și inferioare (clipire)
- Calculează deschiderea gurii (surpriză)
- Analizează pozițiile colțurilor gurii față de centru (zâmbet / tristețe)

---

## 📝 Licență

Proiect academic — Universitatea din Suceava, INOC.
