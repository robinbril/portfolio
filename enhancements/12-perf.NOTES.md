# 12-perf - Performance audit notes

Audit van `/Users/robinbril/Projects/portfolio/` op CSS/JS perf, image loading,
font-loading en mobile compositor cost.

---

## 1. Issue-tabel (file:regel | issue | fix)

| Locatie | Issue | Fix |
|---|---|---|
| `index.html:63` | Lucide CDN script is render-blocking, geen `defer`/`async` | Vervang door `<script defer src="https://unpkg.com/lucide@latest"></script>` zodat parsing niet stalt. `lucide.createIcons()` op regel 1585 moet dan in DOMContentLoaded. |
| `index.html:1583-1586` | `script.js` is sync, en `lucide.createIcons()` draait inline na script.js | `<script defer src="script.js"></script>` + verplaats `lucide.createIcons()` naar een DOMContentLoaded handler binnen script.js. |
| `index.html:54-55` | Google Fonts stylesheet is render-blocking (preload + stylesheet, allebei) | Houd alleen de `<link rel="stylesheet">`, of swap naar `<link rel="preload" as="style" onload="this.rel='stylesheet'">` pattern. Huidige opzet is redundant: preload + sync stylesheet doet beide en blokkeert alsnog. |
| `index.html:231-234` | Hero video `<video autoplay>` met 1.3MB `hero-bg.mp4` zonder dimensies = CLS + 1.3MB op LCP-pad | Voeg `width="1920" height="1080"` toe aan `<video>`. Overweeg mp4 helemaal te schrappen (zie sectie 3). |
| `index.html:231` | `<video>` zonder `<img>` fallback voor reduced-motion of slow networks | Reeds `poster="hero-bg.webp"`, prima. Maar overweeg `<picture>` met `hero-bg.webp` als statisch alternatief op mobiel. |
| `index.html:46-47` | `favicon.png` is 253KB als apple-touch-icon | Genereer 180x180 apple-touch-icon (typisch <20KB) en gebruik die ipv de 253KB favicon. |
| `style.css:249, 1440, 2041, 2122, 2268, 2385, 3422` | 9 instanties `backdrop-filter: blur(...)` - duur op low-end mobile GPU | Aangepakt in `12-perf.css` regel 56-71: backdrop-filter uit op `<=480px`. |
| `script.js:65` | `mousemove` listener op document zonder throttle/rAF | Wrap callback in `requestAnimationFrame` met `ticking` flag, of debounce. Mousemove fireert 60-120Hz op moderne hardware. |
| `script.js:603` | Tweede `mousemove` listener (cursor-glow trail) | Idem: rAF-batched updates. |
| `script.js:445, 586` | `resize` listeners zonder debounce | Wrap in `requestAnimationFrame` of debounce (150ms). |
| `script.js:870, 783, 997` | Meerdere `setInterval` voor typing/cursor effects - draaien ook offscreen | Combineer met `IntersectionObserver` zodat ze pauzeren wanneer de sectie niet zichtbaar is. Pattern is al gebruikt op regel 1054, 1097, 1175 - uitbreiden naar deze 3. |
| `script.js:65, 603` | Geen `{ passive: true }` op mousemove (geen scroll, dus niet kritiek) | Niet vereist voor mousemove. Geen scroll listeners gevonden - `window.scrollTo` is geen listener. OK. |
| Geen `<link rel="preload">` op kritieke assets | LCP candidate (hero-video poster of hero-bg.webp) wordt pas laat gefetched | Voeg `<link rel="preload" as="image" href="hero-bg.webp" fetchpriority="high">` toe boven de fonts. |
| `style.css` (hele bestand) | Geen `@font-face` definities - fonts komen van Google met `&display=swap` in URL | OK, `font-display: swap` is al actief via Google's CSS. Geen actie. |
| Geen `content-visibility` gebruikt | Browser doet layout op secties die nog niet in viewport zijn | Aangepakt in `12-perf.css` regel 16-25. |

---

## 2. `<img>` audit

De **3 quote-avatars** zijn al correct geconfigureerd:

```html
<!-- index.html:1443-1444, 1461-1462, 1480-1481 - alle drie al goed -->
<img class="quote-avatar" src="mark-vervuurt.webp"
    alt="Mark Vervuurt" loading="lazy" decoding="async" width="56" height="56">
```

Geen actie nodig. Alle andere visuals zijn SVG inline (logos vanaf regel 1225).
Geen `<img>` tags ontbreken `loading`/`decoding`/`width`/`height`.

**Edit-snippet voor het hero `<video>` element** (CLS-fix):

```html
<!-- index.html:231-234 - voeg width/height toe -->
<video class="hero-video" width="1920" height="1080"
    autoplay muted loop playsinline preload="metadata"
    poster="hero-bg.webp">
    <source src="hero-bg.mp4" type="video/mp4">
</video>
```

**Edit-snippet voor defer op scripts** (TBT-fix):

```html
<!-- index.html:63 -->
<script defer src="https://unpkg.com/lucide@latest"></script>

<!-- index.html:1583-1586 -->
<script defer src="script.js"></script>
```

Met `defer` op beide is de inline `lucide.createIcons()` op regel 1585 niet meer geldig (lucide is nog niet geladen). Verplaats naar script.js binnen een DOMContentLoaded handler.

**Edit-snippet voor LCP preload** (boven de fonts plakken, na regel 47):

```html
<link rel="preload" as="image" href="hero-bg.webp" fetchpriority="high">
```

---

## 3. `hero-bg.mp4` (1.3MB) - aanbeveling

**Schrap de mp4.** Drie redenen:

1. Op het LCP-pad. 1.3MB op een 4G verbinding (~5 Mbps) = ~2 seconden extra LCP.
2. `hero-bg.webp` (72KB, ook al geladen als `poster`) doet visueel 90% hetzelfde werk op mobile waar autoplay vaak alsnog geblokkeerd wordt.
3. Op desktop is een statische webp + CSS-animatie (subtle parallax of orb-beweging - al aanwezig via `.hero-orb`) goedkoper en consistenter.

**Als de video moet blijven**: serve hem alleen op desktop via `<source media="(min-width: 1024px)" ...>`, encode korter (3-5s loop), target 400-500KB met `ffmpeg -crf 30 -preset slow`.

**Ongebruikte assets om te verwijderen**:
- `hero-bg.png` (947KB) - wordt nergens gerefereerd in index.html, alleen webp en mp4
- `giulio-piccolo.png` (381KB) - HTML gebruikt alleen `.webp`

Allebei kunnen weg uit de repo, scheelt 1.3MB aan deploy-size.

---

## 4. Lighthouse Performance targets

Huidige verwachte scores (op basis van inhoud):
- LCP: 3.5-4.5s op mobile (hero-video op LCP-pad)
- CLS: 0.05-0.15 (hero-video zonder dimensies is risico)
- TBT: 200-400ms (lucide CDN + sync script.js)

**Targets na fixes** (mobile 4G, Moto G Power profile):
- LCP < 2.5s
- CLS < 0.05
- TBT < 200ms
- Score: 85+ (van geschatte 65-75)

**Wins gerangschikt op impact**:

1. **Schrap hero-bg.mp4** - bespaart 1.3MB op LCP-pad. Grootste enkele win. Verwacht: -1.5s LCP op 4G.
2. **`defer` op lucide en script.js** - unblock parsing van de body. Verwacht: -150ms FCP, -200ms TBT.
3. **Preload `hero-bg.webp` met `fetchpriority="high"`** - LCP candidate eerder beschikbaar. Verwacht: -300ms LCP.
4. **`content-visibility: auto` op below-fold secties** (in 12-perf.css) - kortere initial layout pass. Verwacht: -100ms FCP, -50ms TBT.
5. **Backdrop-filter uit op mobile** (in 12-perf.css) - stabielere 60fps tijdens scroll op low-end Android. Verwacht: scroll jank -50%.
6. **Width/height op `<video>`** - CLS van ~0.10 naar <0.02.
7. **favicon.png 253KB naar 20KB apple-touch-icon** - niet kritiek pad, maar gratis 230KB.
8. **rAF-batching op mousemove handlers** in script.js - main-thread breathing room tijdens cursor-trail. Verwacht: TBT -50ms op mid-range.
9. **IntersectionObserver-pause voor setInterval typing animaties** - bespaart CPU wanneer secties offscreen.

---

## 5. Wat NIET aanpakken

- `font-display: swap` is al via Google Fonts URL geregeld - geen `@font-face` herdefiniëren in 12-perf.css.
- Scroll-listeners met `{ passive: true }` - geen scroll-listeners gevonden in script.js. Mousemove kent geen passive flag.
- `will-change: transform` op alle cards - bewust alleen onder `:hover` gezet in 12-perf.css om GPU-memory niet te bloaten.

---

## 6. Wiring (wanneer je deze layer activeert)

Toevoegen aan `index.html` na regel 60 (`apple-premium.css`):

```html
<link rel="stylesheet" href="enhancements/12-perf.css">
```

Plaats deze als LAATSTE stylesheet, zodat `content-visibility` en `contain`
declarations niet door eerdere regels overschreven worden.
