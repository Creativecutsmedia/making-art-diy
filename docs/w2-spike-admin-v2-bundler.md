# W2 spike: admin-v2 bundler-valg

**Status:** Complete — W2 de-risking-spike 3.1-prep.b, 2026-04-23.
**Formål:** Afgøre om admin-v2 skal introducere en bundler før W3-komplexitet rammer, eller fortsætte med nuværende CDN-pattern.
**Output:** Threshold-baseret anbefaling. Ingen kode ændret.

**Læs først:** `docs/w2-spike-github-api-latency.md` (3.1-prep.a, søster-spike), `project_phase_status.md` (W3-W6 scope).

---

## TL;DR

**Stay at status quo (babel-standalone + script tags) indtil et specifikt trigger fyrer.** Ingen umiddelbar migration. W3-scope (form-arbejde med ~150-300 ekstra linjer) er ikke kvalitativt anderledes end hvad nuværende setup kan håndtere.

**Upgrade-triggere med anbefalet target:**

| Hvis... | Så gå til | Migration |
|---|---|---|
| Page-load på Maliks mobil på 4G opleves som "træg" (>3s til interactive) | **Option B** (pre-transpile) | 1-2 sessions |
| Der opstår behov for en npm-pakke der ikke findes på CDN (fx `zod`, `date-fns-tz`, `immer`) | **Option C** (fuld Vite-setup) | 4-6 sessions |
| W7+ orders/customers kræver kompleks state hvor TypeScript ville spare tid | **Option C med TS** | 6-8 sessions |
| Vi får >2 ugers samlet schedule-slack ved starten af W7 | **Option C preemptively** | 4-6 sessions |

Ingen trigger fyret i dag. Default: bliv på A.

---

## Nuværende setup (kort resumé, detaljer i session-recon)

- **React 18.3.1** + **@babel/standalone 7.29.0** via unpkg.com CDN med SRI-hashes
- **27 JSX-filer, 4137 linjer, ~210 KB** source
- **`<script type="text/babel">`** — Babel parser + transpiler hver fil i browseren ved hver page-load
- **Ingen ES modules.** Filer registrerer komponenter via `window.X = X` i global scope
- **Ingen npm frontend-deps** (package.json har kun backend: Stripe/Blobs/Cloudinary/Resend)
- **Netlify build er Python-baseret** (`update-products.py`). Ingen Node/npm build-step for frontend.

**Hvad browseren faktisk gør ved hver admin-v2 page-load:**
1. Downloader @babel/standalone (~400 KB)
2. Downloader 27 `.jsx`-filer (~210 KB)
3. Transpiler alle 27 filer in-browser (100-500ms på slow devices)
4. Eksekverer script-tags i ordre

Samlet: **~600 KB initial + ~100-500ms transpile** før admin-v2 er interaktivt.

---

## Hurtig bundler-primer (hvis du læser det om 2 uger)

En **bundler** er et build-tool der samler flere kildefiler (JSX, TypeScript, CSS) til færre optimerede filer *inden* de lander på serveren. Tre vigtige fordele:

1. **Transpilering foran tiden** — JSX bliver til almindelig JavaScript på dit udviklingsmiljø, ikke i brugerens browser. Bruger får mindre at downloade og ingen parse-overhead.
2. **Modul-system** — filer importerer ting eksplicit (`import { X } from './foo'`) i stedet for at bruge global scope. Fejler tidligere hvis en import er forkert.
3. **Optimering** — ubrugt kode strippes væk (tree-shaking), filer minifies, dependencies dedupliceres.

Tre hovedspillere i 2026:
- **esbuild** — ultra-simpel, ultra-hurtig. Bundler fra kommandolinjen, ingen UI. Godt til "one and done"-setups.
- **Vite** — esbuild+Rollup under hood med framework-integration, hot-reload under udvikling, moderne default-config. Industri-standard for små/mellemstore React-projekter.
- **Webpack** — ældre, mere konfigurerbar, til komplekse legacy-projekter. Ikke relevant for os.

---

## Options-analyse

### Option A — Status quo (ingen bundler)

**Hvordan det virker nu:** `<script type="text/babel" src="...">` + @babel/standalone transpiler i browseren.

**Pros:**
- Zero migration cost
- Kendt pattern, ingen læring krævet
- Ingen ekstra build-step at vedligeholde
- Fungerer uden Node/npm i deploy-pipelinen
- Debugging = åbn DevTools, se din faktiske JSX-source

**Cons:**
- Hver bruger downloader 400 KB babel-standalone (ikke cached med SRI-bump hver version)
- Transpile-tid 100-500ms hver page-load
- Ingen type-checking, ingen ESLint ved build-tid
- SRI-hashes skal manuelt opdateres ved React/Babel version-bumps
- Global-scope pattern er skrøbeligt: typo i component-navn opdages først runtime
- [Babels egen dokumentation](https://babeljs.io/docs/babel-standalone) advarer: "not suitable for production"

**Best when:** Lav trafik, ét brug-scenario, launch-fokus > perf-fokus.

### Option B — Pre-transpile (minimal bundler)

**Hvordan det ville virke:** Netlify build kører esbuild på `admin-v2/src/*.jsx` før publish. Output-filer (almindelig JavaScript) serveres direkte. `<script>`-tags i `index.html` skifter `type="text/babel"` til ingen type + peger på `dist/*.js`. @babel/standalone fjernes helt fra `index.html`.

**Pros:**
- Fjerner 400 KB runtime-download og transpile-tid
- Source-filer uændrede (behold global-scope pattern, behold script-tag-ordering)
- Lille migration: ~1-2 sessions
- Netlify's `node_bundler = "esbuild"` er allerede i `netlify.toml` for functions — tilføjer analog frontend-variant
- Fejler ved build-tid på JSX-syntaks-fejl (hurtigere feedback)

**Cons:**
- Stadig global-scope pattern; stadig 27 script-tags i ordre
- Stadig ingen type-checking (kun syntax-check)
- Build-pipeline vokser med ét step
- Debugging kræver sourcemaps for at se original JSX

**Best when:** Vi vil have perf-win uden source-refaktor.

### Option C — Fuld bundler (Vite)

**Hvordan det ville virke:** `npm create vite@latest admin-v2 -- --template react`-style setup. 27 JSX-filer får `import`/`export`-statements. `index.html` har kun ét `<script type="module" src="/dist/main.js">`. Vite bundler alt, inkl. React.

**Pros:**
- Alle Option B-fordele plus:
- Tree-shaking (ubrugt kode strippes)
- Hot Module Replacement (HMR) i dev — komponenter opdateres live uden reload
- ES modules giver eksplicitte imports (catches typos ved build)
- Path til TypeScript hvis vi senere vil
- Nem at tilføje npm-deps (zod, date-fns, etc.)
- [Industri-standard](https://vite.dev/guide/why) for små/mellemstore React-apps i 2026

**Cons:**
- 4-6 sessions migration: tilføj imports til 27 filer, flyt `ReactDOM.createRoot`, opdatér `index.html`, verify hver side fungerer som før
- Ny mental model (moduler vs global scope)
- Flere dependencies i `package.json`
- Dev-server-workflow skal læres
- Netlify build-tid stiger fra ~20s til ~45-60s

**Best when:** Projektet fortsat vokser, eller TypeScript/npm-deps bliver nødvendige.

### Option D — Hybrid (Vite men CDN for React)

**Hvordan det ville virke:** Som C, men React + ReactDOM loades stadig fra unpkg.com. `vite.config.js` sætter `external: ['react', 'react-dom']`.

**Pros:**
- React stays familiar i `index.html`
- Slightly smaller bundle (React ikke inkluderet)
- Ingen anden forskel fra C i praksis

**Cons:**
- Stort set samme migration-cost som C
- Gør build-config en smule mere kompleks
- Minimal bundle-størrelse-gevinst i praksis

**Best when:** Meget sjældent — C eller B dækker de fleste cases bedre.

---

## Threshold-baseret anbefaling

**Default i dag: Option A (status quo).**

Bliv på A indtil et af følgende fyrer. Når det gør, gå til den angivne option:

| Trigger | Hvorfor det ændrer regnestykket | Target | Estimeret migration |
|---|---|---|---|
| **Page-load >3s på Maliks mobil på 4G** | User-facing perf-problem. Pre-transpile er billigste fix. | B | 1-2 sessions |
| **Behov for npm-pakke ikke på CDN** (zod/date-fns/immer osv.) | npm-deps kræver bundler. CDN-world kan ikke importere vilkårlige pakker. | C | 4-6 sessions |
| **TypeScript-behov for W7+ kompleks state** (ordre-state-machine, kunde-data-merging) | TS kræver build-step per se. Vite er nemmeste TS-setup. | C med TS | 6-8 sessions |
| **Schedule-slack >2 uger ved W7-start** | Vi har råd til at preemptively upgrade fordi launch-risk er lavt. | C preemptively | 4-6 sessions |
| **admin-v2 vokser til >60 filer eller >10k linjer** | Global-scope + script-tag-ordering bliver kaos. | C | Hvis ikke gjort tidligere: 8-10 sessions (større refactor) |

**Ingen trigger fyret 2026-04-23.** Nuværende 4137 linjer og W3's ~150-300 ekstra linjer er håndterbart med A.

---

## Migration-cost-estimat (kort)

| Overgang | Estimat | Største post | Risiko |
|---|---|---|---|
| A → B | 1-2 sessions | Netlify build-config + verificér alle 27 script-tags peger på transpileret output | Lav — source uændret |
| A → C | 4-6 sessions | Tilføj `import`/`export` til alle 27 filer, håndter `window.X`-globaler som eksplicitte imports, opdatér `index.html`, test hver side | Mellem — masse mekanisk refaktor, nem at glemme én fil |
| A → C med TS | 6-8 sessions | Som A→C plus: tilføj `tsconfig.json`, konvertér evt. `.jsx` til `.tsx`, håndter JSX-type-fejl | Mellem-høj — hvis TS-fejl er mange bliver det slæbsomt |
| B → C (hvis vi først går via B) | 3-5 sessions | Kun modul-konvertering og Vite-setup; transpile-step findes allerede | Mellem — færre moving parts |

**Implikation:** A → B er gratis-nok til at tage når som helst hvis page-load bliver et problem. A → C er en reel investering; venter til der er en konkret grund.

---

## Betingelser for re-review

Revisit denne beslutning når:
- Vi måler Maliks oplevede page-load på forskellige enheder (post-launch)
- Nogen funktion kræver en npm-pakke der ikke findes på CDN
- W7+ kompleksitet gør debugging svært uden type-checking
- admin-v2 vokser hurtigere end forventet (>10 nye filer/måned post-launch)
- Netlify bumper buildtime-priser eller free-tier-grænser

---

## Referencer

**Interne:**
- `project_phase_status.md` — W3-W6 scope, hvad der faktisk skal bygges
- `docs/w2-spike-github-api-latency.md` — 3.1-prep.a spike for sammenligning af format

**Eksterne:**
- @babel/standalone advarsel: https://babeljs.io/docs/babel-standalone (søg "not suitable for production")
- Vite guide: https://vite.dev/guide/why
- React without npm (LogRocket 2026): https://blog.logrocket.com/building-without-bundling/
- esbuild vs Vite sammenligning: https://betterstack.com/community/guides/scaling-nodejs/esbuild-vs-vite/

---

## Historik

- **2026-04-23** — spike skrevet (W2 pre-planning). Fase A-recon afslørede 4137 linjer / 27 filer / in-browser Babel. Fase B research bekræftede @babel/standalone ikke er production-grade.
- **2026-04-23** — Malik valgte at eksekvere A→B migration preemptivt som infrastructure-investering før W3.
- **Triggered-upgrade dato** — udfyldes hvis/når vi går fra B til C.
