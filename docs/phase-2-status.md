# Fase 2 — status

**Status:** ✓ Live-testet og virker end-to-end i Stripe Test mode
**Testdato:** 2026-04-21
**Test-ordre-reference:** #ULJLH2VE

## Hvad Fase 2 dækker
Server-side ordre-bekræftelsesmail via Stripe webhook + Resend. Email sendes
uanset om kunden lander på `success.html` eller lukker browseren.

## Komponenter
- `netlify/functions/stripe-webhook.js` — verificerer Stripe-signatur,
  håndterer `checkout.session.completed`, sender email via Resend.
- `netlify/functions/lib/order-email.js` — dansk HTML + plaintext template,
  brand-farver #5C3D20 / #C9963A.
- `netlify/functions/lib/order-reference.js` — sidste 8 tegn af `session.id`
  i UPPERCASE som ordre-ref.

## Verificeret i end-to-end test 2026-04-21
- ✓ Test-køb med kort 4242... på makingartdiy.dk/shop.html gennemført
- ✓ Kunde-email modtaget (brune + guld farver, tabel-layout)
- ✓ Ordre-reference #ULJLH2VE (total 108 kr)
- ✓ BCC til makingartdiy@gmail.com modtaget
- ✓ From-adresse info@makingartdiy.dk virker

## Løst blocker fra 2026-04-20
Webhook var oprindeligt registreret i Stripe **Sandbox** i stedet for **Test
mode** — derfor modtog endpointet ingen events. Løst ved at slette Sandbox-
webhook'en, oprette ny i Test mode, kopiere nyt `whsec_...` til Netlify env
vars (alle 4 deploy contexts) og køre "Clear cache and deploy site".

## Før launch (planlagt 2026-06-01)
Skift fra Stripe Test mode til Live mode kræver:
- Ny webhook-endpoint registreret i Live mode → nyt `STRIPE_WEBHOOK_SECRET`
- Live API-nøgle → nyt `STRIPE_SECRET_KEY`
- Begge opdateres i Netlify env vars (alle 4 deploy contexts)
- Clear cache and deploy efter skift

## Fase 2.1 — i18n (DA/EN)

**Status:** ✓ Live-testet og virker end-to-end 2026-04-21

### Hvad Fase 2.1 dækker
Ordre-bekræftelsesmail understøtter nu både dansk og engelsk, baseret på
`session.metadata.locale` som sættes i `create-checkout-session` fra
frontend-sprogtoggle (DA/EN).

### Komponenter
- `netlify/functions/lib/order-email.js` — refaktoreret til ét HTML/plaintext
  template + `STRINGS[locale]`-tabel. **Alle** tekst-strings kommer fra
  tabellen (inkl. plaintext-headers `--- DINE VARER ---` / `--- YOUR ITEMS ---`
  og adresse-headers). `<html lang="...">` sættes dynamisk.
- `netlify/functions/stripe-webhook.js` — udtrækker
  `locale = session.metadata?.locale === 'en' ? 'en' : 'da'` og videresender
  til `buildOrderEmail`. Lokaliseret fallback for ukendt produkt. Locale
  logges i `[webhook]`-logs.

### Prisformat
- **DA:** `108 kr` / `1.234 kr` (dansk tusindseparator, "kr")
- **EN:** `108 DKK` / `1,234 DKK` (engelsk tusindseparator, ISO-valutakode)

### Fallback
Hvis `session.metadata.locale` mangler eller er en ugyldig værdi →
`'da'` (konsistent med resten af pipeline; primærmarked).

### Verificeret i end-to-end test 2026-04-21
- ✓ Engelsk testkøb gennemført via EN-sprogtoggle
- ✓ Email modtaget på engelsk med korrekt "DKK"-format
- ✓ Alle labels oversat (Order number, Quantity, Shipping, Total, Shipping address)
- ✓ Subject-linje på engelsk
- ✓ `<html lang="en">` sat korrekt

## Næste fase
Fase 2.5 (Shipmondo-integration) er parkeret indtil systemet har kørt stabilt
et stykke tid i produktion.
