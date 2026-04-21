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

## Stripe Test → Live (før 1. juni 2026)

- [ ] Rotér Stripe Test-nøgle til Live-nøgle
- [ ] Opdater Netlify env vars til Live Stripe-nøgler (alle 4 deploy contexts)

## Udviklings-workflow

Note: Decap committer altid direkte til master via git-gateway, uanset hvor
host-siten er deployet fra. Undgå at gemme i Decap på deploy previews mens
en feature-branch er under review — det skaber divergent history. Når
admin-v2 er færdigt og Decap udfases, forsvinder problemet.
