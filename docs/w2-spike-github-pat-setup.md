# W2 spike: GitHub PAT-setup i Netlify

**Status:** Complete — W2 de-risking-spike 3.1-prep.c, 2026-04-24.
**Formål:** Låse variabelnavn + dokumentere generér/gem/verificér-trin for den GitHub Personal Access Token som W3's save-flow skal bruge, så W3-dag-1 ikke går på token-setup.
**Output:** Step-by-step setup-guide + rotation-procedure. Ingen kode ændret.

**Læs først:** `project_phase_status.md` (roadmap, hvorfor W3 bruger GitHub write-back), `docs/w2-spike-github-api-latency.md` (latency-grundlag der begrundede PAT-valget).

---

## TL;DR

W3's admin-products-write flow kalder GitHub Contents API for at committe `products.json`. Det kræver en authenticated request. Vi bruger **én fine-grained PAT** med `Contents: Read and write` scope, repo-begrænset til `Creativecutsmedia/making-art-diy`, gemt i Netlify env var **`GITHUB_PAT`** (scope=Functions, alle deploy-contexts, 90 dages expiration).

Variabelnavnet `GITHUB_PAT` besluttes i denne doc (ingen tidligere reference i koden pr. 2026-04-24). W3+ Netlify Functions skal læse `process.env.GITHUB_PAT` uden debat.

---

## Setup notes (free tier)

Dokumentet blev oprindeligt skrevet som forskrift. Faktisk eksekvering 2026-04-24 afslørede at Netlify free tier låser to granularitets-options bag upgrade — Trin 2 beskriver begge paths nedenfor.

- **Scopes — "Upgrade to unlock":** Functions-only er ikke valgbart på free tier. Alle scopes tvinges samlet (Builds + Functions + Runtime). Paid tier kan begrænse til Functions-only, hvilket reducerer eksponering (PAT læses ikke under build, ikke i edge-runtime).
- **Deploy contexts — "Same value for all deploy contexts" låst:** PAT skal paste'es i 5 separate felter, præcis navngivet af Netlify: **Production**, **Deploy Previews**, **Branch deploys**, **Preview Server & Agent Runners**, **Local development (Netlify CLI)**. Paid tier tilbyder én checkbox der deler værdi på tværs.

**Konsekvens for rotation:** Regn med ~5 min ekstra på free tier pga. 5-felt-paste. Hvis tier opgraderes inden næste rotation (2026-07-23), følg paid tier-stien i Trin 2 og Trin 4.

---

## Hvorfor nu (W2) og ikke W3

W3 er første arbejdsuge med nyt backend-arbejde (`admin-products-write.js` Netlify Function). Hvis token-setup først påbegyndes W3-dag-1, taber vi kodnings-tid på browser-flows gennem GitHub + Netlify dashboards — specielt hvis noget driller (f.eks. scope-valg eller Netlify deploy-context edge case). 3.1-prep.c fjerner den friktion forud.

Spike'en er bevidst docs-only. Selve PAT-genereringen + indsættelse i Netlify er manuelle browser-trin Malik kører selv; docs beskriver præcist hvordan.

---

## Variabelnavn-beslutning

**Valgt:** `GITHUB_PAT`

**Status pr. 2026-04-24:** Ingen eksisterende reference i repo. `grep -rn "GITHUB_PAT\|GITHUB_TOKEN"` gav 0 hits på tværs af `.js/.mjs/.jsx/.md/.html/.toml`. Navnet låses her.

**Hvorfor `GITHUB_PAT` og ikke `GITHUB_TOKEN`:**
- `GITHUB_TOKEN` er et velkendt navn i CI/CD-verdenen (GitHub Actions sætter det automatisk i workflows). Ved eventuel fremtidig brug af Netlify + GitHub Actions sammen vil navnet være tvetydigt.
- `GITHUB_PAT` er eksplicit om **typen**: Personal Access Token, ikke en GitHub App installation token, OAuth-token eller Actions-runner-token. Fremtidig migration til GitHub App (post-launch v1.1-overvejelse) vil bruge et andet navn og ikke kollidere.
- Ingen kendte Netlify-interne build-vars hedder `GITHUB_PAT`.

**Kontrakt for W3+:**
- Netlify Functions læser udelukkende `process.env.GITHUB_PAT`
- Hvis navnet nogensinde skal ændres, sker det synkront i tre steder: denne doc, Netlify env var, alle `process.env.*` references i kode. Ingen dual-naming periode.

---

## Trin 1 — Generér fine-grained PAT

**Browser:** github.com/settings/personal-access-tokens → "Fine-grained tokens" (ikke Classic).

1. Klik "Generate new token"
2. **Token name:** `making-art-diy-netlify-products-writer` (beskrivende — fremtidig-Malik skal kunne se hvad det er uden at åbne Netlify)
3. **Resource owner:** din personlige konto (Creativecutsmedia)
4. **Expiration:** 90 dage. Notér expiry-dato i kalender (se Trin 4).
   - Tradeoff: GitHub tillader op til 1 år + custom. 90 dage er kompromis: lang nok til at rotation ikke bliver konstant-friktion, kort nok til at en lækket token ikke giver multi-måneders eksponering. Fine for solo hobby-scale. Ved multi-user admin post-launch: overvej 30 dage.
5. **Repository access:** "Only select repositories" → vælg **`making-art-diy`** (single repo). Ikke "All repositories" — PAT skal ikke kunne røre andre repos selv hvis den lækker.
6. **Permissions → Repository permissions:**
   - `Contents`: **Read and write** ← eneste påkrævede
   - `Metadata`: Read (tilføjes automatisk af GitHub UI, kan ikke fravælges)
   - Alt andet: **No access** (default)
7. Klik "Generate token" → token vises **én gang**. Kopiér nu.

**Hvis token lukkes før kopiering:** regenerér. Den oprindelige er ubrugelig uden at være blevet læst.

---

## Trin 2 — Gem i Netlify env vars

**Browser:** Netlify dashboard → making-art-diy site → **Site configuration** → **Environment variables** → **Add a variable** → "Add a single variable".

1. **Key:** `GITHUB_PAT` (præcis skrivemåde — case-sensitive)
2. **Values:**
   - **Scopes:**
     - **Free tier (nuværende 2026-04-24):** Alle scopes tvinges samlet (Builds + Functions + Runtime). Functions-only er "Upgrade to unlock" og kan ikke fravælges.
     - **Paid tier (fremtidig mulighed):** Vælg kun **Functions**. Fravælg "Builds", "Runtime", "Post processing". Build-step har ikke brug for tokenen; begrænsning reducerer eksponering.
   - **Deploy contexts:** Alle 5 contexts skal have PAT'en — W3's test-flow kører i deploy-previews og skal kunne committe til test-branches. Hvis kun Production, kan preview-URLs ikke verificere write-flowet.
     - **Free tier (nuværende 2026-04-24):** "Same value for all deploy contexts"-checkboxen er upgrade-locked. Paste PAT-værdien i alle 5 context-felter Netlify viser: **Production**, **Deploy Previews**, **Branch deploys**, **Preview Server & Agent Runners**, **Local development (Netlify CLI)**.
     - **Paid tier (fremtidig mulighed):** Én paste + enable "Same value for all deploy contexts".
3. **Value:** paste PAT-strengen (starter med `github_pat_...`)
4. Klik "Create variable"

**Efter gemning:** Netlify viser variablen som `••••••` (masked). Værdien kan ikke læses tilbage — kun overskrives. Dette er korrekt opførsel.

**Redeploy ikke nødvendig lige nu** — ingen Functions læser `GITHUB_PAT` endnu. Første gang den bruges er i W3.

---

## Trin 3 — Verificér uden kode

Sanity-check at tokenen virker før W3 bygger oven på den. **Kør fra lokal terminal** med PAT-værdien som `$PAT` (ikke commit PAT'en nogen steder):

```bash
export PAT="github_pat_..."  # paste den rigtige værdi midlertidigt

# Test 1: repo-read — skal returnere 200 + JSON med repo-info
curl -sS -o /dev/null -w "HTTP %{http_code}\n" \
  -H "Authorization: Bearer $PAT" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/Creativecutsmedia/making-art-diy

# Test 2: permission-echo — skal vise "contents": "write" i response
curl -sS \
  -H "Authorization: Bearer $PAT" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/Creativecutsmedia/making-art-diy \
  | grep -o '"permissions":{[^}]*}'

unset PAT  # ryd fra shell-miljø
```

**Forventet output:**
- Test 1: `HTTP 200`
- Test 2: JSON-fragment med `"push":true` (fine-grained PATs rapporterer permissions via `push`/`pull` flags på repo-niveau, ikke `contents` direkte — hvis `push:true` er token skrive-kapabel).

**Hvis `HTTP 401`:** tokenen er forkert kopieret eller udløbet. Regenerér Trin 1.
**Hvis `HTTP 403`:** tokenen har ikke adgang til dette specifikke repo. Gå tilbage til Trin 1, punkt 5, og vælg det korrekte repo.
**Hvis `HTTP 404`:** repo-navnet er forkert, eller tokenen er scopet til andet repo. Tjek owner/repo-stavning.

**Fuld write-test** (faktisk PUT til `/contents`) sker først i W3's første commit af `admin-products-write.js` — ingen grund til throw-away test-commits i master nu.

---

## Trin 4 — Rotation-procedure

PAT expirer efter 90 dage. Uden rotation bryder W3-save-flow tavst med `HTTP 401` efter udløb.

**Notér NU:**
- **Expiry-dato:** _udfyldes af Malik ved generering_ — skriv her i docs på commit-tidspunktet. Eksempel: `2026-07-23`.
- **Kalender-reminder:** opret event 7 dage før expiry med titel "Rotér GITHUB_PAT i Netlify (making-art-diy)".

**Rotation-trin (når reminder fyrer):**
1. Generér ny PAT med samme settings som Trin 1 (samme name + permissions + repo-scope, ny expiry 90 dage ud)
2. Netlify dashboard → Environment variables → `GITHUB_PAT` → "Edit" → paste ny værdi → Save
3. Trigger redeploy af seneste production-deploy (Deploys → seneste → "Retry deploy" → "Deploy site") — nødvendigt for at Functions picker den nye værdi op
4. Kør Trin 3 curl-verifikation mod ny token
5. Revoker den gamle PAT i github.com/settings/personal-access-tokens (undgå dobbelt-aktive tokens)
6. Opdatér expiry-dato i denne doc via PR

**Hvis token kompromitteres før expiry** (f.eks. ved et uheld committet):
1. Revoker øjeblikkeligt i GitHub
2. Generér ny
3. Opdatér Netlify env var
4. Redeploy
5. Audit: tjek GitHub repo-insights for uventede commits i perioden mellem lækage og revoke

---

## Åbne spørgsmål (deferred)

- **Machine User vs. personal account.** Nuværende PAT hænger på Maliks personlige GitHub-konto. Ved multi-user admin post-launch bør vi overveje en dedikeret "making-art-diy-bot"-konto — separation of concerns + kontinuitet hvis Malik roterer personlige credentials. Overkill pre-launch.
- **GitHub App i stedet for PAT.** GitHub Apps har finere permission-kontrol, installation-tokens rotérer automatisk (ingen 90-dages manuel friktion), og er bedst practice for servers der committer på vegne af brugere. Setup er tungere (app-registrering + private key + JWT-exchange). Post-launch v1.1-overvejelse — ikke værd for solo hobby-scale.
- **Secret scanning for lækage.** GitHub secret scanning fanger fine-grained PATs på push. Aktivér "Push protection" for repo'et post-launch hvis ikke allerede aktiv.

---

## Referencer

**Interne:**
- `project_phase_status.md` — W3 save-flow bruger GitHub write-back
- `docs/w2-spike-github-api-latency.md` — latency-måling der bekræftede arkitektur-valget

**Eksterne:**
- GitHub fine-grained PATs: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token
- GitHub Contents API: https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
- Netlify environment variables: https://docs.netlify.com/environment-variables/overview/
- Netlify deploy contexts: https://docs.netlify.com/site-deploys/overview/#deploy-contexts

---

## Historik

- **2026-04-24 (spike-skrivning)** — spike skrevet som forskrift. Variabelnavn `GITHUB_PAT` låst. Merged som PR #20 (`b1795ee`).
- **2026-04-24 (post-execution)** — PAT genereret, indsat i Netlify, curl-verificeret (HTTP 200). Expiry 2026-07-23. Docs opdateret med "Setup notes (free tier)"-sektion + korrigeret Trin 2 til at afspejle at Netlify free tier låser Functions-only og per-context-values bag upgrade.
- **W3 (11.-17. maj)** — første faktisk brug i `admin-products-write.js`. Opdatér historik hvis setup-trin afslørede uklarheder i docs.
- **Ved første rotation (~2026-07-23)** — opdatér expiry-dato + verificér at rotation-proceduren matcher faktisk oplevelse.
