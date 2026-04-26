# Søndags-review 2026-04-26

**Prep:** fredag 2026-04-24.
**Format-anker:** `project_phase_status.md` siger review-spørgsmålet er "Er Malik på track til 1. august?" → JA = fortsæt, NEJ = scope/dato-beslutning samme dag.

## 1. Status pr. 2026-04-26

### Afsluttet W1–W2
- W1 100% (3.0a–3.0e): PR #11, #13, #14, #15, #16
- W2 4/4 de-risking-spikes + 1 follow-up: PR #17, #18, #19, #20, #21
- Plus chore: PR #22 (gitignore products.json)
- Master HEAD: `235741c`
- **W1 landede 4 dage før plan; W2 afsluttet 14 dage før plan.**

### Tracking mod launch 2026-08-01
- Forløbet: W1, W2
- Tilbage: W3–W14 (12 uger, 99 dage)
- Buffer til planlagt W3-start 11. maj: **17 dage** (24. apr – 10. maj)

**Svar på "på track?":** JA — ingen blokerende findings i W1+W2.

---

## 2. Hoved-beslutning: W3 tidlig-start ja/nej

**Kontekst:** W3 planlagt 11.–17. maj (3.1a admin-products-write backend, 3.1b edit form, 3.1c vægt/dimensioner). Scope-regel: dato-beslutninger kun på søndags-review — dette er dagen.

### Ja-argumenter
- Pre-W3 recon leveret fredag — mental model er frisk
- W1-retrospective-pattern: "new integrations fail first attempt" → ekstra tid = buffer mod 3.1a-iteration
- GitHub PAT klar, verificeret, expirer 2026-07-23 → W3 kan starte dag-1 uden setup-friktion

### Nej-argumenter / alternative buffer-anvendelser
- 17 dage kan bruges til parkerede investigations, POC cleanup prep, rest-uge, eller ingen kode
- Tidlig start spiser buffer designet som slip-margin mod uforudsete blockers
- Scope-creep-risiko: "vi har jo tiden" → features tilføjet uden for MUST-listen

### Beslutning
- [x] **Ja** — start W3 [dato?]. Begynd med 3.1a admin-products-write backend.
- [ ] **Nej** — hold planlagt W3-start 11. maj. Buffer-aktivitet: __________.

---

## 3. Parkerede items — status

| Item | Status | Handling søndag |
|---|---|---|
| Netlify Blobs v2 auto-context failure | Post-launch investigation | Ingen (venter) |
| Edge-guard cookie mismatch (`_nf-auth` vs `nf_jwt`) | Partially resolved | Ingen (venter) |
| Identity APIUrl hardcoded → pragmatisk fixet via `window.location.origin` | Fixed, investigation parkeret | Ingen |
| 5 duplicate i18n-keys (`pay_mobilepay` m.fl.) | WON'T-scope (manuelle ordrer post-launch v1.1) | Ingen |
| POC cleanup (Cloudinary: `cloudinary-poc.html` + `test-poc-3.0b/`) | Afventer W4-produktbillede-upload-validering | Ingen |
| POC cleanup (Blobs: `blobs-poc.js` + `admin-poc-temp` store) | Afventer W8-ordre-state-validering | Ingen |

Ingen er launch-blokerende. Ingen kræver beslutning søndag.

---

## 4. Nye punkter siden sidst

1. **Netlify free tier env var-gotcha** (opdaget 2026-04-24)
   - Alle scopes tvinges samlet; 5-felt-paste pr. variabel (upgrade-locked)
   - Relevans: W13 Stripe Live-switch tilføjer 3+ env vars → planlæg ~15 min ekstra
   - Dokumenteret i `project_netlify_free_tier_env_vars.md`

2. **GitHub PAT rotation-reminder 2026-07-16**
   - Expiry 2026-07-23; 7-dages reminder
   - Handling: opret kalender-reminder hvis ikke allerede gjort

3. **Stale lokal branch `feature/admin-v2-2.1a-stats` force-slettet 2026-04-24**
   - Remote gone, arbejde bevaret i master via squash-commit `c3a9984` (PR #6)
   - Ikke noget at følge op på

4. **4. produkt-kategori "Værksted/Garage/Skur" — beslutning søndag**
   - Malik har produkter klar til kategorien, men ingen billeder endnu
   - Beslutning søndag: pre-launch (tilføj til MUST-scope) vs post-launch v1.1 (park)
   - Implementation rører mindst 6 filer: `update-products.py`, `_products/` YAML-schema, `shop.html` filter, `produkt.html` visning, `admin-v2/src/hooks.jsx` CATEGORY_SLUG map, `netlify/functions/admin-stats.js` categoryBySku
   - Ingen kode eller plan produceret — afventer beslutning

5. **npm audit findings — 5 moderate vulnerabilities (beslutning søndag)**
   - Alle 5 sporer til én CVE: `uuid < 14.0.0` (GHSA-w5hq-g745-h8pq, missing buffer bounds check)
   - Transitive paths: `@netlify/blobs` → `@netlify/dev-utils` → `uuid`, og `resend` → `svix` → `uuid`
   - `npm audit fix --force` ville downgrade `@netlify/blobs` til v8.2.0 — bryder W1-arkitektur-beslutning (v10+ CJS + connectLambda pattern, 3.0a PR #11)
   - Ingen handling kørt; alle opgraderings-beslutninger defereret

---

## 5. Næste uges plan (27. april–3. maj)

**Hvis ja til W3 tidlig-start:** detaljeret 3.1a–c plan lægges efter beslutning.

**Hvis nej:** valg af buffer-aktivitet kræver beslutning:
- [ ] Tackle én parkeret investigation (Blobs v2 / cookie / Identity APIUrl)
- [ ] POC cleanup prep
- [ ] Rest-uge (ingen kode)
- [ ] W3-forberedelse (læsning/referencer, ingen kode)

---

## 6. Decisions taken i dag

**1. W3 tidlig-start: JA**
Start 3.1a Phase 4 (function-implementation) nu. Rationale: pre-W3 recon + kontrakt-doc shippet 2026-04-25, mental model frisk; W1-pattern "new integrations fail first attempt" gør tidlig start til buffer mod 3.1a-iteration frem for buffer-spending. PAT klar i Netlify (`GITHUB_PAT`, expiry 2026-07-23), ingen setup-friktion.

**2. 4. kategori "Værksted/Garage/Skur": POST-LAUNCH v1.1**
Park i WON'T-pre-launch. Rationale: ingen billeder klar; implementation rører mindst 6 filer (`update-products.py`, `_products/` YAML-schema, `shop.html` filter, `produkt.html` visning, `admin-v2/src/hooks.jsx` CATEGORY_SLUG, `netlify/functions/admin-stats.js` categoryBySku); scope-creep-risiko mod 1. august cutoff vurderes højere end værdien af én ekstra kategori ved launch.

**3. npm audit (5 moderate, uuid<14): ACCEPT RISK**
Ingen handling. Rationale: alle 5 sporer til én transitive CVE (GHSA-w5hq-g745-h8pq, missing buffer bounds check i uuid). `npm audit fix --force` ville downgrade `@netlify/blobs` til v8.2.0 og bryde W1-arkitektur (v10+ CJS + connectLambda, PR #11). Risiko vurderes lav (admin-only paths, ingen user-supplied uuid-input). Revurderes post-launch v1.1.
