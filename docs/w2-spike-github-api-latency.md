# W2 spike: GitHub API PUT-latency

**Status:** Complete — W2 de-risking-spike 3.1-prep.a, 2026-04-23.
**Formål:** Svare på "er GitHub API PUT hurtig nok til admin-v2's save-product UX?" før vi bygger W3.
**Output:** Data-drevet recommendation for W3 admin-v2 save-flow. Ingen kode ændret.

**Læs først:** `project_phase_status.md` (roadmap, hvorfor W3 bruger GitHub write-back), `docs/coolrunner-integration-plan.md` (lignende tech-spike template).

---

## TL;DR

GitHub API PUT til `contents`-endpoint tager **median 694 ms, p95 891 ms** fra min WSL-terminal. Det er under **1-sekunds-threshold** for instant-feeling UI, og godt under **3-sekunds-threshold** for spinner-acceptabel. **W3 bruger optimistisk UI + diskret loading-state** — ingen grund til at re-arkitektere mod Blobs.

Netlify build + CDN-propagation til produktion tager **ca. 30-60 sekunder** (build 11-21s observeret + CDN). Kunder ser eventual-consistency — acceptabelt ved hobby-volumen.

---

## Metodologi

### Baseline — Netlify build-tid (Fase A)

Inspiceret check-durationer fra 5 merged PRs i dag via `gh pr view`:

| PR | Build-check-tid |
|---|---|
| #11 (3.0a, `netlify/functions/*`) | 11s |
| #13 (3.0b, `netlify/functions/*`) | 12s |
| #14 (3.0c, HTML) | 19s |
| #15 (3.0d, docs) | 20s |
| #16 (3.0e, docs) | 21s |

**Median 19s, range 11-21s.** Ingen bundler i repoet (admin-v2 script-tags/CDN) → ingen `npm install`, ingen build-step. Når W3 laver commit til `products.json`, tager Netlify ~20s til build + typisk 10-30s CDN-propagation. Fuld eventual-consistency: ~30-60s.

### PUT-latency (Fase B)

10 PUT-iterationer mod `/repos/Creativecutsmedia/making-art-diy/contents/test-latency-<i>.txt` på en engangs-branch:

- **Auth:** fine-grained PAT med `contents: write` + `metadata: read`
- **Method:** `PUT /repos/{owner}/{repo}/contents/{path}` (samme endpoint W3's Netlify Function vil bruge)
- **Client:** curl fra WSL Ubuntu (~Malik's lokation i DK)
- **Payload:** ~60 byte tekst-fil pr. iteration
- **Timing:** `date +%s.%N` før/efter hver curl-call; omfatter TLS-handshake + request + GitHub-side-processering + response
- **Cleanup:** branch slettet efter måling, ingen artifacts tilbage

Råtal (ms): 801, 791, 696, 891, 643, 695, 670, 692, 693, 642

### Hvad målingen IKKE dækker

- **Netlify Function cold-start** (~100-300ms kendt overhead, ikke målt her)
- **Network-latency fra Netlify US-region til GitHub US-region** (vores lokale DK-US-latency er verbose; Netlify→GitHub er sandsynligvis hurtigere)
- **Samtidige PUTs** — ikke testet parallelt. Ved hobby-volumen sker dette ikke.
- **Rate-limit-scenarier** — fine-grained PATs har 5000 requests/time. Selv ved 100 admin-saves/dag bruger vi <1% af kvoten.
- **products.json med realistisk størrelse** — test-fil var ~60 byte. `products.json` er formentlig 5-50 KB. Latency kan stige marginalt, men ikke kvalitativt.

---

## UX-implikationer for W3

### Thresholds (Nielsen Norman Group reaktionstid)

| Tid | Brugerens oplevelse | UX-krav |
|---|---|---|
| <100 ms | Instant | Intet feedback nødvendigt |
| 100 ms – 1 s | "Hurtigt men mærkbart" | Ingen spinner nødvendig, men knappen må gerne blive disabled |
| 1 s – 3 s | Mærkbar pause | Spinner eller "Gemmer..."-tekst |
| 3 s – 10 s | Klar venting | Progress-indicator + forklarende tekst |
| >10 s | Bryder flow | Re-design mod async/background |

### Vores målinger mod thresholds

- **median 694 ms** → falder i "hurtigt men mærkbart"-zonen
- **p95 891 ms** → stadig under 1-sekunds-threshold
- **Ingen outliers over 1 s** i vores n=10

**Konklusion:** W3's save-button kan være i det midterste interval (100ms-1s). Minimalt UX-krav: disable button + subtle state-ændring (f.eks. knap bliver grå + tekst ændrer fra "Gem" til "Gemmer..."), ingen spinner strengt nødvendig. Spinner anbefales alligevel for klarhed.

### Anbefalede patterns for admin-v2 W3

**Save-button:**
```jsx
// Pseudokode, ikke prod
<button
  onClick={save}
  disabled={saving}
>
  {saving ? 'Gemmer...' : 'Gem'}
</button>
```

**State-flow:**
1. Bruger klikker "Gem" → button disables, tekst skifter til "Gemmer..."
2. Optimistisk UI: admin-v2-state opdateres med nye værdier øjeblikkeligt
3. Request til Netlify Function (der kalder GitHub API) sendes
4. Response ~1 sekund senere → button enabled igen, toast "Gemt — kunder ser ændringen om ca. 1 minut"
5. Ved fejl: rollback state + fejl-toast

**Eventual-consistency-kommunikation:**
Kort toast efter save: "Gemt — kunder ser ændringen om ca. 1 minut". Sætter forventning uden at forklare Netlify-pipeline.

---

## Anbefaling for W3 arkitektur

**Vælg GitHub API write-back (som planlagt i roadmap).** Ingen grund til at flytte `products.json` til Netlify Blobs af performance-hensyn.

**Argumenter for GitHub:**
- Sub-sekund save-UX (målingerne bekræfter)
- Git-historie bevaret (audit trail for produkt-ændringer gratis)
- Rollback via git revert hvis noget går galt
- Matcher eksisterende mental model (GitHub er kendt for Malik)

**Argumenter for Blobs (afvist):**
- Ville have marginalt hurtigere save (~200-400ms i stedet for 700-900ms) — ikke værd at betale for
- Ville miste git-historie (negativt for audit)
- Ville kræve separat "hvad så med existing products.json?"-migration

### Betingelser for re-review

Revisit denne beslutning hvis:
- Latency-målingerne fra produktion (Netlify Function i stedet for lokal terminal) viser p95 >2s
- `products.json` vokser over ~100 KB (encoding-overhead for base64 i body kan blive signifikant)
- Samtidige saves bliver et reelt scenario (flere admins — pre-launch ikke tilfældet)

---

## Referencer

**Interne:**
- `project_phase_status.md` — W3-W6 produkt-system roadmap
- `docs/coolrunner-integration-plan.md` — tech-spike template

**Eksterne:**
- GitHub Contents API: https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
- Fine-grained PATs: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token
- Nielsen Norman — Response times: https://www.nngroup.com/articles/response-times-3-important-limits/

---

## Historik

- **2026-04-23** — spike skrevet (W2 pre-planning). Måling kørt fra WSL-terminal med fine-grained PAT. Tidspunkt 17:57 CET.
- **W3 (11.-17. maj)** — opdateres med produktions-målinger hvis Netlify Function's faktiske latency afviger markant.
