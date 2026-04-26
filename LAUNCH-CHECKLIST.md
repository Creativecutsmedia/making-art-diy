# Launch-checkliste

Opgaver der skal løses før shoppen går live (**1. august 2026**, sekundær 8. august).
Markér afsluttede punkter med `[x]`. Tilføj flere efter behov.

Autoritativ status + 14-ugers roadmap: se memory `project_phase_status.md`.

---

## Uge-oversigt (high-level)

| Uge | Periode | Fase | Status |
|---|---|---|---|
| W1 | 27. apr – 3. maj | Infrastructure de-risking | ✓ komplet — 3.0a Blobs, 3.0b Cloudinary, 3.0c auth-gate, 3.0d CoolRunner spike, 3.0e denne oprydning |
| W2 | 4. – 10. maj | Buffer + Fase 1-spillover | ✓ komplet — 3.1-prep.a/.b/.b-exec/.c + .c free-tier follow-up |
| W3-W6 | 11. maj – 7. juni | Produkt-system (create/edit/delete + Cloudinary-upload) | 3.1a ✓ + 3.1b ✓ (PR #34); 3.1c pending |
| W7-W10 | 8. juni – 5. juli | Ordrer + Kunder + CoolRunner halv-auto | — |
| W11-W12 | 6. – 19. juli | Stats + rabatter + refunds + email + settings + fragt | — |
| W13 | 20. – 26. juli | **Stripe Live cutover + soft launch** | — |
| W14 | 27. juli – 2. aug | **Hard cutoff + code freeze + LAUNCH 1. aug** | — |

**Søndags-review hver uge** — se template nederst.

---

## Juridisk og adresser

- [ ] Find PO Box / erhvervsadresse (privat adresse må ikke være offentlig)
- [ ] Opdater privatlivspolitik (`privatliv.html` sektion 1) med adresse
      når PO Box er på plads
- [ ] Hold øje med 50.000 kr omsætningsgrænsen — momsregistrering + CVR
      kræves først hvis den passeres (se memory `project_cvr_status.md`
      for hvorfor vi forbliver privat indtil da)

## Markedsføring (e-mail)

- [ ] Tilføj checkout-fravalg til nyhedsmails (markedsføringslovens § 10 stk. 2)
- [ ] Tilføj afmeld-link til nyhedsmail-template

## GDPR-rettigheder (admin-værktøjer)

- [ ] Byg admin "Slet kunde"-funktion (GDPR Art. 17 — retten til at blive glemt)
- [ ] Byg admin "Eksportér kundedata"-funktion (GDPR Art. 20 — dataportabilitet)

## Sikkerhed

- [ ] **MUST før launch:** `admin-stats.js` mangler eksplicit admin-role-check.
      Read-only endpoint så lavere risiko end write-endpoints, men eksponerer
      session-data til alle Identity-brugere. Fix-mønster: kopiér role-check
      fra `admin-products-write.js` step 3. Tracket som F3 i memory
      `project_phase_status.md`.
- [ ] **MUST før launch:** admin-v2 mangler synlig log-ud-knap.
      Brugeren kan kun logge ud via DevTools cookie-sletning. Implementation:
      log-ud-knap i sidebar/header der kalder `netlifyIdentity.logout()`.
      Sikkerhedsmangel — auth uden synlig logout er minimumskrav.
- [ ] **MUST før launch:** admin-v2 session-udløb redirect.
      Når session udløber viser appen kun fejl-besked uden redirect til login.
      Implementation: detect 401 fra admin-endpoints, kald
      `netlifyIdentity.logout()` + redirect til login. Pre-launch UX-mangel.
- [ ] Flyt `internal_notes` og `internal_files` fra markdown-frontmatter til
      Netlify Blobs (fase 3 opgave — fjerner GitHub-lækage-risiko)
- [x] Upgrade admin-v2 fil-beskyttelse til server-side gate før fase 3a-data
      går live. ✓ Løst 2026-04-22 (commit `dbf80c3`, PR #3) via Netlify
      Edge Function `netlify/edge-functions/admin-v2-guard.ts` der validerer
      `nf_jwt`-cookie + `app_metadata.roles` indeholder `admin`. Allow-list:
      `/admin-v2/`, `index.html`, `styles.css` så Identity-widget kan rendre
      pre-login. Signatur-verifikation delegeret til Netlify Functions.
- [x] admin-v2 auth-gate `_nf-auth`/widget desync bug. ✓ Løst 2026-04-23
      (commit `20a4c7c`, PR #14) via `user.jwt()` session-validering i init-event.
      Se memory `project_admin_v2_auth_gate_bug.md` for diagnostik-protokol.
- [ ] Overvej 2FA på admin-v2. Nuværende setup:
      Netlify Identity med stærkt NordPass-genereret password. Mulige
      upgrades: GitHub OAuth external provider (nemt), Cloudflare Access
      (robust). **Post-launch beslutning** — accepteret risiko pre-launch
      per `project_phase_status.md` WON'T-liste.
- [x] Admin-v2 fase 3a-data: real-data wiring (products + stats).
      ✓ Løst 2026-04-22 (merge-commit 7842a4c, PR #5) via Netlify
      Function `admin-stats.js` + client-side hooks `useProducts` /
      `useStats` i admin-v2/src/hooks.jsx. Varer-siden viser ægte
      produkter fra products.json. Dashboard-wiring kommer i commit 2.1.

## Stripe Test → Live (W13: 20. – 26. juli 2026)

Planlagt cutover-uge før launch. Detaljeret procedure:

- [ ] **Dag 1 (mandag 20. juli): Registrér Live webhook**
      Stripe Dashboard → Live mode (ikke Sandbox) → Developers → Webhooks →
      Add endpoint. URL: `https://makingartdiy.dk/.netlify/functions/stripe-webhook`,
      event: `checkout.session.completed`.
- [ ] **Dag 1: Opdatér `STRIPE_WEBHOOK_SECRET` i Netlify**
      Kopiér nyt `whsec_...` fra Live webhook → Netlify env vars → **alle 5
      deploy contexts** (Production, Deploy Previews, Branch deploys, Preview
      Server & Agent Runners, Local development (Netlify CLI)) → scope: alle
      scopes (free tier-tvunget) → marked as secret.
- [ ] **Dag 1: Opdatér `STRIPE_SECRET_KEY` i Netlify**
      Hent `sk_live_...` fra Stripe Dashboard → Developers → API keys →
      Live mode → samme 5 contexts, alle scopes.

      **Gotcha (free tier):** Scopes + 5-felt-paste er upgrade-locked. Se memory
      `project_netlify_free_tier_env_vars.md` for detaljer + tidsestimat.
- [ ] **Dag 1: Netlify "Clear cache and deploy site"**
      Uden dette bruger functions stadig cachede Test-env-vars.
- [ ] **Dag 2 (tirsdag 21. juli): Live-test med eget køb**
      Selvkøbt test-ordre på Live (lav pris-produkt). Verificér:
      (1) webhook-event modtaget i Netlify logs,
      (2) kunde-email modtaget,
      (3) BCC til makingartdiy@gmail.com modtaget,
      (4) ordre-reference genereret korrekt,
      (5) alert-email virker ikke (happy path).
- [ ] **Dag 3-4: Soft launch til 5-10 venner/familie**
      Inviter via privat besked. Saml feedback i shared note. Ingen offentlig
      annoncering endnu.
- [ ] **Dag 5-7 (fre-søn): Bugfix-vindue**
      Alle feedback-rapporter triages. Launch-kritisk → fix. Nice-to-have →
      park i memory som post-launch.

Se også memory `project_stripe_live_switch.md` for autoritativ version af
disse trin. Fase 2 (webhook + email) dokumenteret i `docs/phase-2-status.md`.

## Udviklings-workflow

Note: Decap committer altid direkte til master via git-gateway, uanset hvor
host-siten er deployet fra. Undgå at gemme i Decap på deploy previews mens
en feature-branch er under review — det skaber divergent history. Når
admin-v2 er færdigt og Decap udfases, forsvinder problemet.

**Process-regler (fra memory `project_w1_retrospective.md`):**

- Hver commit har sin egen branch. Ikke genbrug branches mellem commits.
- Test deploy-preview grøn før merge (især backend-integrations).
- PR-approval manuelt hver gang. Ikke "don't ask again".
- Ingen parallelle Claude Code-sessioner.
- Hard cutoff: mandag 27. juli 2026. Kun bugfixes efter.
- Code freeze: fredag 31. juli 2026. Intet merges.

---

## Søndags-review-template

Hver søndag under W2-W14: gå igennem dette, skriv svar i en ugenote.

**Ugen der gik:**
- [ ] Hvilke commits/PRs landede på master?
- [ ] Er de planlagte W#-opgaver (se Uge-oversigt) færdige?
- [ ] Hvor mange sessions blev brugt? Var vi inden for 10-15/uge-budget?
- [ ] Opstod der blockers der stadig ikke er løst?

**Status vs. roadmap:**
- [ ] **Er Malik på track til 1. august 2026?**
- [ ] Hvis NEJ — beslutning i dag (aldrig midt i uge):
      (a) skub MUST-items til post-launch v1.1, eller
      (b) flyt launch til sekundær dato 8. august 2026
- [ ] Hvis JA — fortsæt planen uændret

**Scope-hygiejne:**
- [ ] Dukkede nye idéer op i løbet af ugen? → skriv dem i memory som
      "post-launch v1.1", tilføj dem IKKE til current scope
- [ ] Er der WON'T-items (se `project_phase_status.md`) der presser på
      at blive MUST? → kræver eksplicit scope/dato-beslutning

**Næste uge:**
- [ ] Hvad er W# og hvilke opgaver står øverst?
- [ ] Er der infrastructure-risici vi skal adressere tidligt?
      (iteration-budget: 2-3 PRs per infra-commit, se W1 retrospective)

**Noter / fritform:**
- Ting der overraskede mig denne uge
- Ting der gik nemmere end ventet
- Ting at tage med til næste uge

---

## Historik

- **2026-04-22** — oprettet som fase 3a-data completion-log (commit `b29390d`)
- **2026-04-23** — 3.0e oprydning: dato-korrektion (06-01 → 08-01), uge-oversigt,
  udvidet Stripe-sektion, søndags-review-template, link til memory-filer
- **2026-04-24** — W2 afsluttet 4/4: 3.1-prep.a/.b/.b-exec/.c + .c free-tier follow-up (PRs #17-21). Plus diverse cleanup og søndags-review-prep.
- **2026-04-26** — søndags-review låst (W3 tidlig-start JA, 4. kategori parkeret post-launch v1.1, npm audit accept-risk, PR #28). 3.1a admin-products-write endpoint shippet (PR #29 `805c43d`) via mini-PR throwaway-strategi (PR #30). 3 nye MUST-før-launch issues identificeret: admin-stats role-check (F3), admin-v2 log-ud-knap, admin-v2 session-udløb redirect. Senere samme dag: 3.1b admin-v2 product edit form shippet (PR #34 `69cc892`) via 4-PR-sekvens med Phase 4 build-pipeline-pivot. 2 nye post-launch polish-issues sporet: DA-oversættelse af backend validation_failed strings, Save-knap visuel disabled-state.
