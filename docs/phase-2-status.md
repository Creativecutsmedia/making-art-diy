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

## Næste fase
Fase 2.5 (Shipmondo-integration) er parkeret indtil systemet har kørt stabilt
et stykke tid i produktion.
