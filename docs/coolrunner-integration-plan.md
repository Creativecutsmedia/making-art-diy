# CoolRunner-integration — Tech spike (3.0d)

**Status:** PLANNING — W1 tech spike, 2026-04-23. Ingen kode skrevet endnu. Implementation planlagt til W10 (8. juni – 5. juli 2026) som del af Fase 4-6.

**Formål:** Dokumentere hvordan CoolRunner-flowet skal virke, *før* vi bygger det. Fjerner åbne tekniske spørgsmål fra implementations-uge, så W10 bliver udelukkende execution.

**Læs først:** `project_phase_status.md` (scope + launch-dato), `project_w1_retrospective.md` (iteration-budget-mønster).

---

## 1. CoolRunner-konto-type: privat

Malik er ikke CVR-registreret (se memory `project_cvr_status.md`). Derfor oprettes **privat-konto** hos CoolRunner i W6 når produkt-systemet er klar og vi ved hvor meget der skal sendes.

**Konsekvenser af privat-konto:**
- Ingen officiel API-adgang. CoolRunners API kræver erhvervskonto.
- Priser: listepriser for privatkunder (ikke erhvervsrabatter).
- Betaling: saldo, kort eller MobilePay ved hver forsendelse. (Konkrete metoder TBD W6.)
- Kun manuelt flow via web-UI. Ingen programmatisk label-generering.

**Migration til erhvervskonto: se §6.**

---

## 2. Halv-automatiseret flow

Flowet er bevidst **halv-automatisk**: admin-v2 forbereder data og validerer resultat, men mennesket (Malik) klikker i CoolRunners UI. Det fjerner behov for API, holder os på privat-konto, og gør os fri af CoolRunner-UI-ændringer.

### Aktør-diagram

| Trin | Aktør | Handling |
|---|---|---|
| 1 | Admin (Malik) | Åbner ordre i admin-v2, klikker **"Send med CoolRunner"**-knap |
| 2 | admin-v2 | Kopierer forsendelses-felter til clipboard (ren tekst, format §3). Åbner coolrunner.dk i ny fane via `window.open()` |
| 3 | admin-v2 | Viser input-felt til 9-cifret kode + vejlednings-tekst |
| 4 | Admin | Logger ind på coolrunner.dk manuelt (én gang per browser-session, CoolRunner-cookie persister) |
| 5 | Admin | Opretter ny forsendelse, paster adresse-felter fra clipboard |
| 6 | CoolRunner | Genererer 9-cifret DAO-kode `XXX-XXX-XXX` |
| 7 | Admin | Kopierer koden fra CoolRunner-UI |
| 8 | Admin | Vender tilbage til admin-v2-fanen, paster kode i input-feltet |
| 9 | admin-v2 | Validerer format (regex §4), gemmer kode i ordrens state (Netlify Blobs), auto-skifter status til **Sendt**, logger i status-historik |
| 10 | Admin | Skriver koden på pakken med vandfast pen, afleverer i DAO-pakkeboks |

**Hvorfor ingen SSO-undersøgelse:** Besluttet 2026-04-23. Manuelt login tager ~10 sek, én gang per session pga. CoolRunner-cookie. Automation-værdi er lav. Post-launch revisit hvis det bliver et reelt problem.

---

## 3. Clipboard-copy teknisk spec

### Felter (besluttet)

Præcis seks felter, ingen andre:

1. **Navn** — fra `order.shipping.name`
2. **Adresse** — sammensat: `street + "\n" + postal_code + " " + city` (DK default, ingen country-field nødvendig pre-launch)
3. **Telefon** — fra `order.shipping.phone`
4. **Email** — fra `order.customer.email`
5. **Ordrenummer** — fra `order.id` (bruges til tracking-mapping)
6. **Vægt** — fra `order.total_weight` (gram, afrundet til nærmeste 100g for CoolRunners dropdown)

### Format (ren tekst, linje-separeret)

```
Navn: <navn>
Adresse:
<gade>
<postnr> <by>
Telefon: <telefon>
Email: <email>
Ordre: <id>
Vægt: <X> g
```

**Hvorfor ikke JSON/CSV:** CoolRunners web-UI har ikke en import-funktion. Admin skal paste felt-for-felt, så læsbar tekst er bedre end struktureret data. Bekræftet med Malik 2026-04-23.

### Teknisk implementation (W10)

```javascript
button.addEventListener('click', function() {
  // Byg strengen SYNKRONT — ingen await/then før writeText på iOS Safari
  const text = buildClipboardText(order);
  navigator.clipboard.writeText(text)
    .then(() => showToast('Adresse kopieret'))
    .catch(err => showError('Kunne ikke kopiere. Kopier manuelt:', text));
  // Åbn CoolRunner samtidig
  window.open('https://coolrunner.dk/manifest', '_blank');
});
```

**Kritisk regel:** `buildClipboardText()` må ikke være async eller fetche data. Alt ordre-data skal være i memory før click. Hvis det ikke er, kald `writeText()` inde i selve click-handleren med det data der ER tilgængeligt — aldrig efter en `await`.

### Browser-compat matrix

| Browser | Min version | Support | Noter |
|---|---|---|---|
| Chrome desktop | 66 | ✓ | Ingen problemer |
| Firefox | 63 | ✓ | Ingen problemer |
| Safari desktop | 13.1 | ✓ | Kræver HTTPS + user gesture |
| iOS Safari | 13.4 | ⚠️ | Strikt: ingen async før `writeText()` |
| Chrome/Firefox iOS | nyere | ⚠️ | Bruger WebKit under hood — samme regler som iOS Safari |

**HTTPS-krav:** Opfyldt på makingartdiy.dk.

**Fallback:** Hvis `writeText()` rejecter (fx gamle browsere, tilladelse afvist), vis strengen i et `<textarea>` med select-all + besked "Klipp manuelt med ⌘/Ctrl+C".

---

## 4. 9-cifret kode validation

### Format (fra offentlig info, bekræftes W6)

- **DAO-kode:** `XXX-XXX-XXX` — 9 cifre, bindestreger mellem hvert 3. tegn. Eksempel fra CoolRunner-dokumentation: format observeret men ikke konkret eksempel før Malik har egen konto.
- **Bring-kode:** Format TBD W6.

### Regex-forslag

```javascript
// DAO-kode, accepterer med eller uden bindestreger + whitespace
const DAO_CODE_PATTERN = /^\s*(\d{3})[\s-]?(\d{3})[\s-]?(\d{3})\s*$/;

function normalizeDaoCode(input) {
  const match = input.match(DAO_CODE_PATTERN);
  if (!match) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;  // altid gem normaliseret
}
```

**Hvorfor accept-uden-bindestreger:** Admin kan kopiere forskelligt fra CoolRunner-UI afhængigt af kontekst. Bedre at normalisere input end at afvise gyldige koder på whitespace-forskelle.

**Ved ugyldig kode:** Vis inline-fejl `"Forventer 9 cifre, fx 123-456-789. Tjek om du har kopieret hele koden."` Behold input-feltet udfyldt så admin kan rette uden at kopiere igen.

**TBD W6:**
- Faktiske eksempel-koder (anonymiseret) fra Maliks første CoolRunner-brug
- Bring-kode-format
- Er der checksum-validering vi kan lave lokalt?

---

## 5. Edge cases

| Case | Håndtering |
|---|---|
| Admin mister forbindelse mellem copy og paste | Ordre-state er uændret i admin-v2. Admin skal blot paste koden når forbindelsen er tilbage — ingen datatab, CoolRunner-siden er stadig åben i egen fane. |
| CoolRunner ændrer kode-format | Regex fejler → admin får fejlbesked → rapporterer til Malik → vi opdaterer regex i en hotfix. Accepteret risiko (sandsynlighed lav). |
| Admin paster forkert (fx kopierer ordrenummer i stedet for DAO-kode) | Regex fejler → admin ser fejl → prøver igen. |
| Admin dobbelt-klikker "Send med CoolRunner" | Button skal disables efter første klik indtil kode er modtaget ELLER admin annullerer. Forhindrer duplikat-faner. |
| Admin annullerer midt i flow (lukker CoolRunner-fane uden at sende) | admin-v2 viser **"Annuller CoolRunner-forsendelse"**-knap der rydder in-progress state. Ordre-status skifter IKKE til Sendt. |
| Pakke afvises af DAO (fx forkert vægt) | Post-launch concern — kræver manuel håndtering. Ingen auto-detection pre-launch. |
| Kode allerede brugt på anden ordre | admin-v2 tjekker ved gem: er denne kode allerede registreret på en anden ordre? Hvis ja, advarsel + kræv bekræftelse. Forhindrer copy-paste-fejl mellem faner. |
| Browser blocker `window.open()` | Hvis popup-blocker aktiv → fallback: vis link admin kan klikke manuelt. |
| iOS Safari afviser clipboard.writeText | Fallback til `<textarea>` med select-all (beskrevet i §3). |

---

## 6. Post-launch migration-path til CoolRunner API

**Hvornår:** Ikke pre-launch. Overvej efter launch når:
- Ordre-volumen > ~5-10/dag (manuelt flow bliver flaskehals)
- Malik har CVR-registreret sig (erhvervsgrænse 50.000 kr/år — se `project_cvr_status.md`)
- Erhvervskonto oprettet hos CoolRunner

**Hvad kræver det:**
1. CVR-registrering (juridisk + regnskabsmæssigt — separat beslutning)
2. CoolRunner-erhvervskonto-ansøgning
3. API-key fra CoolRunner
4. Ny Netlify Function `coolrunner-create-shipment.js` der:
   - Tager ordre-ID
   - POST'er til CoolRunner API med adresse + vægt
   - Modtager label-PDF + tracking-kode
   - Gemmer begge i ordrens Blob-state
5. Admin-v2 UI: Én knap "Send" der gør alt. Ingen clipboard, ingen ny fane.

**Arkitektur-kompatibilitet:** Den halv-automatiske version *er* designet så migrationen er lokal. Alle felter vi kopierer til clipboard i §3 er præcis de samme felter API'et vil kræve. Ordre-state-strukturen (Blobs) har allerede plads til tracking-kode, så vi udskifter blot *hvordan* koden kommer ind.

**Estimat:** 1-2 uger post-launch arbejde, afhængigt af hvor godt CoolRunners API-docs matcher vores behov.

**Parkeret i memory:** `project_phase_status.md` WON'T-sektion nævner "CoolRunner API (kræver erhvervskonto)" som udskudt.

---

## 7. Åbne spørgsmål (bekræftes i W6 når konto er oprettet)

**Konto + priser:**
- Hvilke betalingsmetoder accepterer CoolRunner for privatkunder i 2026? (saldo? kort? MobilePay?)
- Er der min-volumen-krav for privatkonto?
- Hvad koster en typisk DAO-forsendelse (200g, 500g, 1kg) for en privatperson?

**Flow-detaljer:**
- Kan man gemme afsender-adresse på konto-niveau, eller skal den udfyldes hver gang?
- Persister CoolRunner-login længere end browser-session (remember-me checkbox)?
- Ved labelless-forsendelser: hvordan ser kode-visningen ud efter køb? Copy-knap? Simpel tekst? QR-kode også?

**Kode-format:**
- DAO-kode: konkret eksempel (anonymiseret) for regex-validering
- Bring-kode: format + regex
- Er der carrier-specifikke quirks vi skal håndtere (fx forskellig kode-længde per carrier)?

**Operationelt:**
- Hvor tæt er nærmeste DAO-pakkeboks på Maliks adresse? (påvirker om halv-auto-flow er acceptabelt i praksis)
- Hvad er Bring-alternativet hvis DAO-boksen er fuld/ude af drift?

**Ikke pre-launch-kritiske:**
- Tracking-link format (bruger vi CoolRunners eller linker direkte til DAO?)
- Email-template til kunde med tracking-kode (eksisterer allerede fra Fase 2 — skal bare have felt til kode)
- Refunds-flow hvis pakke er tabt

---

## 8. Referencer

**Interne memory-filer:**
- `project_phase_status.md` — W10 implementation-plan + MUST/WON'T scope
- `project_w1_retrospective.md` — iteration-budget for infrastructure-commits
- `project_cvr_status.md` — hvorfor privat-konto, ikke CVR
- `project_payment_methods.md` — CoolRunner-betaling separat fra kunde-betaling

**Eksterne:**
- CoolRunner FAQ: https://coolrunner.dk/faq/ (JS-rendered, brug browser ikke WebFetch)
- DAO-pakkeboks-net: https://dao.as/pakkeboks
- MDN Clipboard API: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
- WebKit async Clipboard blog (iOS-regler): https://webkit.org/blog/10855/async-clipboard-api/
- caniuse clipboard.writeText: https://caniuse.com/mdn-api_clipboard_writetext

---

## Historik

- **2026-04-23** — Tech spike skrevet (3.0d). Research baseret på offentligt tilgængelig info; Malik har ikke CoolRunner-konto endnu.
- **W6 (11. maj – 7. juni 2026)** — Konto oprettes. Forventede opdateringer: faktiske kode-eksempler, betalingsmetode, min-volumen-krav, Bring-kode-format.
- **W10 (29. juni – 5. juli 2026)** — Implementation. Dokument opdateres hvis virkeligheden afviger fra planen.
