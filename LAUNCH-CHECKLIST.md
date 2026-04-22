# Launch-checkliste

Opgaver der skal løses før shoppen går live (1. juni 2026).
Markér afsluttede punkter med `[x]`. Tilføj flere efter behov.

## Juridisk og adresser

- [ ] Find PO Box / erhvervsadresse (privat adresse må ikke være offentlig)
- [ ] Opdater privatlivspolitik (`privatliv.html` sektion 1) med adresse
      når PO Box er på plads
- [ ] Hold øje med 50.000 kr omsætningsgrænsen — momsregistrering + CVR
      kræves når den passeres

## Markedsføring (e-mail)

- [ ] Tilføj checkout-fravalg til nyhedsmails (markedsføringslovens § 10 stk. 2)
- [ ] Tilføj afmeld-link til nyhedsmail-template

## GDPR-rettigheder (admin-værktøjer)

- [ ] Byg admin "Slet kunde"-funktion (GDPR Art. 17 — retten til at blive glemt)
- [ ] Byg admin "Eksportér kundedata"-funktion (GDPR Art. 20 — dataportabilitet)

## Sikkerhed

- [ ] Flyt `internal_notes` og `internal_files` fra markdown-frontmatter til
      Netlify Blobs (fase 3 opgave — fjerner GitHub-lækage-risiko)
- [x] Upgrade admin-v2 fil-beskyttelse til server-side gate før fase 3a-data
      går live. ✓ Løst 2026-04-22 (commit `dbf80c3`, PR #3) via Netlify
      Edge Function `netlify/edge-functions/admin-v2-guard.ts` der validerer
      `nf_jwt`-cookie + `app_metadata.roles` indeholder `admin`. Allow-list:
      `/admin-v2/`, `index.html`, `styles.css` så Identity-widget kan rendre
      pre-login. Signatur-verifikation delegeret til Netlify Functions.
- [ ] Overvej 2FA på admin-v2. Nuværende setup:
      Netlify Identity med stærkt NordPass-genereret password. Mulige
      upgrades: GitHub OAuth external provider (nemt), Cloudflare Access
      (robust). Se session-summary fra 21. april 2026 for detaljer.
- [x] Admin-v2 fase 3a-data: real-data wiring (products + stats).
      ✓ Løst 2026-04-22 (merge-commit 7842a4c, PR #5) via Netlify
      Function `admin-stats.js` + client-side hooks `useProducts` /
      `useStats` i admin-v2/src/hooks.jsx. Varer-siden viser ægte
      produkter fra products.json. Dashboard-wiring kommer i commit 2.1.

## Stripe Test → Live (før 1. juni 2026)

- [ ] Rotér Stripe Test-nøgle til Live-nøgle
- [ ] Opdater Netlify env vars til Live Stripe-nøgler (alle 4 deploy contexts)

## Udviklings-workflow

Note: Decap committer altid direkte til master via git-gateway, uanset hvor
host-siten er deployet fra. Undgå at gemme i Decap på deploy previews mens
en feature-branch er under review — det skaber divergent history. Når
admin-v2 er færdigt og Decap udfases, forsvinder problemet.
