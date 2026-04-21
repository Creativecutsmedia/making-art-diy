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

## Stripe Test → Live (før 1. juni 2026)

- [ ] Rotér Stripe Test-nøgle til Live-nøgle
- [ ] Opdater Netlify env vars til Live Stripe-nøgler (alle 4 deploy contexts)
