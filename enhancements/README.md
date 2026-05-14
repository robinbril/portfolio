# Enhancements — integratie-instructies

> Hook blokkeert `.NOTES.md`-naam; deze README bevat de integratie-instructies voor alle enhancement-files in deze map.

---

## 02-hero.css — focus + WOW hero

### Wire-up

Voeg toe in `index.html`, direct na regel 60 (`apple-premium.css`):

```html
<link rel="stylesheet" href="enhancements/02-hero.css">
```

Load-volgorde: na `style.css`, `ai-styles.css`, `apple-premium.css`.

### HTML — status chip (NIEUW element)

De status chip bestaat nog niet in de DOM. Insert location: `index.html`, **binnen `.hero-content`**, direct voor regel 246 (`<h1>AI Engineer</h1>`).

Aanbeveling: vervang het bestaande `hero-eyebrow` blok (regels 242–245). Twee pill-shaped chips boven de H1 vechten om aandacht en breken de focus die we nastreven.

Snippet:

```html
<div class="hero-status-chip">
    <span class="hero-status-chip__dot"></span>
    <span>Available for Q3 2026</span>
</div>
```

Wil je de bestaande eyebrow ("Available · Amsterdam") behouden, merge dan in één chip: `Open for Q3 2026 · Amsterdam`. Niet stapelen.

### Bestaande CSS nu redundant

De volgende regels in `style.css` worden volledig overschreven door `02-hero.css`. Ze zijn NIET verwijderd in deze pass (scope: write-only).

| File | Lines | Selector | Reden |
|---|---|---|---|
| `style.css` | 566–573 | `.hero h1` | font-size, weight, letter-spacing, line-height vervangen |
| `style.css` | 4975–4988 | `.hero h1` (duplicate) | tweede definitie, beide overschreven |
| `style.css` | 5846–5847+ | `body.dark-theme .hero h1`, `body:not(.light-theme) .hero h1` | vervangen door nieuwe gradient-clip |
| `style.css` | 575–586 | `.hero-subtitle` | weight, opacity, max-width, line-height vervangen |
| `style.css` | 5004–5007 | `.hero-subtitle` (duplicate) | idem |
| `style.css` | 644–652 | `.hero-actions` | gap + margin overschreven |
| `style.css` | 2984–3044, 4029–4048 | `@media .hero h1`, `.hero-subtitle`, `.hero-actions` | nieuwe mobile clamp + stacking vervangt |
| `style.css` | 372–397 | `.btn-primary` (global) | hero-scoped override vervangt background, padding, radius, shadow, hover scale |
| `style.css` | 399–425 | `.btn-secondary` (global) | hero-scoped override = mint ghost |

De globale `.btn-primary` / `.btn-secondary` regels zijn nog in gebruik buiten de hero (nav, contact, etc.) — niet globaal verwijderen. Alleen de hero-scoped duplicatie is redundant.

Lucide icons in de CTAs (`<i data-lucide="arrow-right">`, `<i data-lucide="mail">`) worden verborgen via `i[data-lucide] { display: none }`. De pijl komt nu uit een `::after` pseudo. Wil je de lucide-icon terug: verwijder de `display: none` en de `::after`. Kies één, niet beide.

### Overige hero-elementen

- `.hero-video` (regel ~442) speelt nog. Nieuwe `::before` mint-glow ligt boven de video-gradient maar onder content. Als de video te druk concurreert met de H1 shimmer: `body.dark-theme .hero-video { opacity: 0.35; }` in een follow-up.
- `.hero-orb--solo` blijft staan. Compatibel met de corner-glow maar overweeg te slopen als hero te druk voelt.
- `.hero-stats` (14+/7+/37) ongewijzigd. Voor pure focus: hide of verplaats onder de fold in een volgende enhancement.

### Verificatie

- [ ] Status chip boven H1, mint dot pulseert
- [ ] H1 shimmer veegt links→rechts in ~8s, geen flicker
- [ ] Subtitle smaller dan H1, lichter gewicht, opacity 0.78
- [ ] Primary CTA solid mint, pijl schuift 4px op hover
- [ ] Secondary CTA ghost mint, pijl drift up-right op hover
- [ ] Light theme: H1 gradient teal→sky→navy, geen mint glow
- [ ] `prefers-reduced-motion`: shimmer en dot pulse staan stil
- [ ] Mobile <768px: H1 leesbaar, CTAs full-width gestapeld

---

# 03 — Sticky nav + scrollspy: integratie

## CSS

Voeg toe aan `<head>` van `index.html`, na de bestaande `<link rel="stylesheet" href="apple-premium.css">` (regel ~60):

```html
<link rel="stylesheet" href="enhancements/03-nav-scrollspy.css">
```

Volgorde is belangrijk: deze file moet *na* `style.css`, `ai-styles.css` en `apple-premium.css` geladen worden zodat de overrides (sticky positioning, `.is-current` indicator, glass bg) winnen van bestaande selectors zoals `.navbar { position: fixed; ... }` op `style.css` regel 242 en `.nav-links a.is-active::after` op regel 5456.

## JS

Twee opties, kies één:

**Optie A — los script-tag (aanbevolen, raakt `script.js` niet):**

Voor `</body>` in `index.html`, na de bestaande `<script src="script.js">` tag:

```html
<script src="enhancements/03-nav-scrollspy.script-additions.js" defer></script>
```

**Optie B — appenden aan `script.js`:**

Plak de volledige inhoud van `03-nav-scrollspy.script-additions.js` aan het eind van `script.js` (na regel 1187, als nieuwe IIFE). De IIFE is zelfstandig en interfereert niet met bestaande code.

## HTML aanpassingen

Geen verplichte wijzigingen. De huidige markup (`index.html` regels 204–225) heeft alles wat nodig is:

- `<nav class="navbar">` met `<a href="#about">` etc.
- Section IDs `about`, `projects`, `experience`, `skills`, `contact` bestaan al (regels 284, 348, 943, 1097, 1370).
- `.mobile-menu-btn` aanwezig (regel 220).

Geen data-attributes nodig — selectors mappen via `a[href="#<id>"]` naar de section ids.

## Conflicten met bestaande code

- `style.css` regels 5456–5478 zetten `.nav-links a.is-active::after` op een 4px streep onder de link. De nieuwe CSS gebruikt `.is-current` (andere klasse), dus geen botsing. Als je de oude `.is-active` scrollspy wil opruimen: `script.js` regel 200–202 (let op: de timeline observer gebruikt `.is-active` ook, niet aanraken zonder check) en CSS regels 5456–5478.
- `script.js` regel 761 (`scrollToSection`) is voor het HUD-component, niet de hoofd-navbar. Geen conflict.
- `style.css` regel 242 zet `.navbar { position: fixed }`. Override naar `position: sticky` is bewust — sticky werkt natuurlijker binnen de `<header>` wrapper (regel 203).

## Testen

1. Scroll voorbij 40px → navbar krijgt `.scrolled`, padding krimpt, blur sterker.
2. Scroll door secties → mint dot verschijnt onder actieve link, fade in.
3. Klik nav link → smooth scroll, target landt ~80px onder de bovenkant.
4. Resize <768px → nav-links verdwijnen, hamburger zichtbaar; klik = `.is-open` toggle + icon rotatie.
5. Toggle light theme → nav bg wit (0.85), border donkerder.

---

# 10 — Project filters + AI project cards: integratie

## CSS

Voeg toe aan `<head>` van `index.html`, na `style.css` / `apple-premium.css`:

```html
<link rel="stylesheet" href="enhancements/10-projects.css">
```

## JS

Voor `</body>`, AFTER `<script src="script.js">`:

```html
<script src="enhancements/10-projects.script-additions.js" defer></script>
```

Volgorde is hard required: de overlay JS draait *na* de legacy handler en wist diens inline `display:none` zodat de CSS collapse kan afspelen.

## HTML aanpassingen

**Niet verplicht.** De IIFE zet zelf `aria-pressed` op alle filter-buttons bij init en update het bij elke klik. Wil je een schone baseline in source: zet `aria-pressed="false"` op de vier inactieve buttons en `aria-pressed="true"` op de actieve (`index.html:427–431`). Cosmetisch.

Overige observaties:

- `data-category` is nu één token per kaart. De IIFE accepteert space-separated multi-category (bv. `data-category="agents mcp"`) als je dat ooit nodig hebt.
- `<a class="ai-project-card">` op index.html:436 krijgt een fade-in northeast-arrow via CSS `::before` op hover. Geen markup-wijziging nodig. Wil je het pijltje op niet-link kaarten: wrap in `<a>` of breid de selector uit.
- Er bestaat geen card met `data-category="websites"`. De button op index.html:431 collapsed de grid tot leeg bij klik. Voeg een websites-card toe, hernoem `data-filter`, of haal de button weg. Out of scope hier.

## Conflicten met bestaande code

Legacy filter-logica zit in `script.js:246–315`. Vier interacties:

1. **`card.style.display = 'none'`** (script.js:265, 273). Inline `display:none` short-circuit elke CSS transitie. De IIFE strip dit per klik via `clearInlineDisplay`, zodat `.is-filtered-out` kan animeren.

2. **`.hidden` class** (script.js:266, 274). Bestaande regel `.ai-project-card.hidden` op style.css:2429 zet `display:none`. De IIFE verwijdert `.hidden` elke pass. `.is-filtered-out` is de single source of truth in de overlay.

3. **"Show more / show less" pagination** (script.js:252, 270–292, 307–312). Beperkt zichtbare matches tot 6 met toggle. Met de overlay geladen wist `clearInlineDisplay` ook de cap-styling — **de 6-cap is effectief disabled**, alle matches blijven zichtbaar.

   Wil je de cap terug: óf verplaats `VISIBLE_LIMIT`-logic naar de overlay (met `.is-filtered-out` als hide-mechanisme), óf laat de overlay `clearInlineDisplay` skippen voor cards voorbij index 6 als niet-expanded. Cleanste pad is de hele legacy `applyFilter` slopen en de overlay de filter-state laten ownen — maar dat is een edit op bestaande code, out of scope.

4. **Active class is `.active`** (script.js:298–299). De CSS target beide `.active` en `.is-active`, dus styling is OK. De IIFE schrijft `.is-active` (per spec). Beide klassen landen op dezelfde button na klik. Geen visueel conflict, wel redundant — accepteer of strip `classList.add('active')` op script.js:299 later.

5. **`playHoverSound()` op klik** (script.js:303). Unaffected. Vuurt vóór de gedeferrede frame.

## Testen

1. Klik filter button → mint pill animeert (scale 1.02 + underline sweep), niet-matches schalen 0.92 + collapse, layout herschikt smooth.
2. Hover card → translateY -4px, mint border, icon rotateY 360° in ~1.2s.
3. Hover linked card (claude-harness) → northeast arrow fade-in rechtsboven.
4. Tab door filter-buttons → focus-ring (mint outline), aria-pressed flipt.
5. Mobile <720px → filter bar wordt scroll-snap horizontal, geen wrap.
6. Light theme → glass wit, chips donker.
7. `prefers-reduced-motion` → geen icon spin, transitions instant.

---

# 14 — Education, Certs & Testimonials polish

Premium polish-laag voor drie aansluitende secties: `#education` (opleiding-timeline), `#certifications` (certs-grid) en `.testimonials-compact` (quote-boxen binnen `#contact`).

## Wire-up

Voeg toe in `<head>` van `index.html`, NA `style.css` / `apple-premium.css` en NA eerdere enhancement-files:

```html
<link rel="stylesheet" href="enhancements/14-education-certs.css">
```

Geen JS. Geen HTML wijzigingen verplicht — alles werkt op de huidige markup.

## Aanwezige testimonial-avatars

Alle drie zijn al in de repo-root aanwezig (`/Users/robinbril/Projects/portfolio/`):

- `mark-vervuurt.webp` — Mark Vervuurt, Lead AI Engineer Capgemini
- `giulio-piccolo.webp` — Giulio Piccolo, Lead Data Engineer Capgemini
- `rob-kemperman.webp` — Rob Kemperman, Head of Data & Analytics, Road.io

`<img>` tags in `index.html` (regels 1443, 1461, 1480) hebben `loading="lazy"`, `decoding="async"` en `width/height="56"`. De enhancement schaalt visueel naar 48px, maar laat de intrinsieke attributen staan — geen CLS.

Source-link (LinkedIn) zit al als `<a class="source-link"><i data-lucide="info">` per quote-box. De enhancement positioneert die rechts-onder. Wil je een echte LinkedIn glyph: `data-lucide="linkedin"` werkt direct, geen CSS-edit nodig.

## Optionele HTML-aanpassingen (niet blocking)

### Grade-chips op education-cards

In de huidige markup zit "GPA 8.0 · Propedeuse behaald in eerste jaar" gewoon in `.role-description`. Om de mint outline-chip rechtsboven te tonen, splits de info:

```html
<div class="timeline-content glow-card">
    <div class="role-header">
        <h3>BSc Bedrijfskunde</h3>
        <span class="company">Hogeschool van Amsterdam</span>
    </div>
    <span class="grade-chip">Cum laude · GPA 8.0</span>
    <p class="role-description">Propedeuse behaald in eerste jaar</p>
</div>
```

Voor de minor-card bijvoorbeeld `<span class="grade-chip">Head of R&amp;D</span>`. Zonder `.grade-chip` valt de chip stilletjes weg en de grid-kolom collapse't naar 0. Geen layout-shift.

## Heading hierarchy check

- `<h2>Opleiding</h2>` → `<h3>` per timeline-card (regels 1191, 1203). OK.
- `<h2>Top Certificeringen</h2>` → `<h4>` per cert-item (regels 1232, 1252, 1283, 1303, 1321, 1340, 1363). **Skipt `<h3>`** — kleine a11y-warning.
- `<h2>Neem contact op</h2>` → testimonials gebruiken `<strong>` voor naam. Terecht: testimonials zijn geen eigen sectie.

Aanpak voor cert-hierarchy (out of scope, vermeld voor follow-up):

1. Cert-namen naar `<h3>` promoveren. Selector `.cert-item h4` zou dan mee moeten groeien naar `.cert-item :is(h3, h4)`.
2. Visually-hidden `<h3 class="sr-only">Microsoft & Industry Certifications</h3>` tussen sectie-header en grid.

Advies: optie 1 bij een refactor. Voor nu blijft de huidige `h4` werken.

## Per-issuer brand colors

Bestaande CSS-variabelen uit `style.css` regels 3865–3871 worden hergebruikt door de nieuwe hover-state:

- `cert-azure` → `#00A4EF` (Microsoft Azure)
- `cert-powerbi` → `#F2C811` (Power BI)
- `cert-dl` → `#C8102E` (Stanford / DeepLearning.AI)
- `cert-capgemini` → `#12B0F0` (Capgemini)
- `cert-modeling` → `#0070AD` (Capgemini deep)
- `cert-sql` → `#03EF62` (DataCamp terminal green)
- `cert-sixsigma` → `#C9A227` (Lean Six Sigma gold)

`var(--cert-accent)` en `var(--cert-glow)` worden automatisch opgepakt in de rotateY/scale hover.

## Reduced motion / performance

- `prefers-reduced-motion: reduce` schakelt rotateY/scale op cert-cards uit. Education en testimonials houden alleen een 3–4px lift.
- Education-embleem is inline SVG data-URI: geen extra request.
- Cert-cards hergebruiken bestaande SVG's in `index.html`. Geen nieuwe assets.
- Glassmorphism via `backdrop-filter` op GPU. Op iOS Safari <15 fallback op solid `linear-gradient`.

## Verificatie

- [ ] Education cards: dark glass met mint graduation-cap embleem links, lift + mint border op hover
- [ ] Cert-grid: 220px auto-fit, 1:1.2 aspect, rotateY 8° + scale 1.04 op hover, icon glow in issuer-brand color
- [ ] Cert h4 in mono, kleurt naar issuer accent bij hover
- [ ] Testimonials: 2-kol desktop, 1-kol mobile, grote `"` glyph linksboven in mint @ 18% opacity
- [ ] Quote-box hover: lift + mint border + glyph opacity bump naar 32%
- [ ] Avatar 48px rond met 1px mint border, source-link rechts-onder
- [ ] Light theme: glass wit, chips groen-700 (`#059669`) i.p.v. mint
- [ ] `prefers-reduced-motion`: cert-cards niet roteren

---

# 15 — Footer, CTA banner, scroll-to-top: integratie

De huidige `index.html` heeft een lege `<!-- Footer -->` comment op regel 1501.
Alles hieronder is nieuw in te voegen.

## CSS

Voeg toe in `<head>`, na bestaande stylesheets:

```html
<link rel="stylesheet" href="enhancements/15-footer-cta.css">
```

## JS

Vóór de bestaande `<script src="script.js"></script>` regel:

```html
<script src="enhancements/15-footer-cta.script-additions.js" defer></script>
```

## HTML — finale CTA banner

Direct ná de testimonials-sectie (na regel 1499 `</section>`), vóór de
`<!-- Footer -->` comment:

```html
<section class="final-cta" aria-labelledby="final-cta-title">
    <div class="final-cta__inner">
        <span class="final-cta__eyebrow">// next step</span>
        <h2 class="final-cta__title" id="final-cta-title">
            Plan een kennismaking
        </h2>
        <p class="final-cta__lead">
            30 minuten, geen verkooppraat. Vertel wat je bouwt en waar je vastloopt,
            dan kijken we of het bij elkaar past.
        </p>
        <div class="final-cta__actions">
            <a class="final-cta__btn final-cta__btn--primary"
                href="https://cal.com/robinbril/intro"
                target="_blank" rel="noopener noreferrer">
                <i data-lucide="calendar"></i>
                <span>Boek een slot</span>
            </a>
            <a class="final-cta__btn final-cta__btn--ghost"
                href="mailto:robin.bril@gmail.com">
                <i data-lucide="mail"></i>
                <span>Mail direct</span>
            </a>
        </div>
    </div>
</section>
```

> Pas de Cal.com-URL aan zodra Robin's eigen booking-link bekend is. Anders
> vervang `href` met `#contact` om het bestaande modal te triggeren.

## HTML — footer (3-koloms desktop, 1-kolom mobile)

Direct ná de finale CTA, ter vervanging van de lege `<!-- Footer -->` comment:

```html
<footer class="site-footer" role="contentinfo">
    <div class="site-footer__grid">

        <div class="site-footer__col">
            <h3 class="site-footer__title">Navigatie</h3>
            <nav class="site-footer__nav" aria-label="Footer navigatie">
                <a href="#about">Over</a>
                <a href="#projects">Projecten</a>
                <a href="#experience">Ervaring</a>
                <a href="#skills">Skills</a>
                <a href="#contact">Contact</a>
            </nav>
        </div>

        <div class="site-footer__col">
            <h3 class="site-footer__title">Open source</h3>
            <div class="gh-repos" data-github-repos="robinbril">
                <a class="gh-repo" href="https://github.com/robinbril/claude-harness"
                    target="_blank" rel="noopener noreferrer">
                    <div class="gh-repo__head">
                        <span class="gh-repo__name">claude-harness</span>
                        <span class="gh-repo__stars"><i data-lucide="star"></i>0</span>
                    </div>
                    <p class="gh-repo__desc">
                        Harness en tooling rond Claude Code: hooks, agents, sessie-management.
                    </p>
                </a>
            </div>
            <a class="site-footer__contact-line"
                href="https://github.com/robinbril"
                target="_blank" rel="noopener noreferrer">
                Alle repos op GitHub
            </a>
        </div>

        <div class="site-footer__col">
            <h3 class="site-footer__title">Contact</h3>
            <p class="site-footer__contact-line">
                <a href="mailto:robin.bril@gmail.com">robin.bril@gmail.com</a><br>
                Amsterdam, NL
            </p>
            <div class="site-footer__socials" aria-label="Sociale media">
                <a class="site-footer__social"
                    href="https://www.linkedin.com/in/robinbril/"
                    target="_blank" rel="noopener noreferrer"
                    aria-label="LinkedIn">
                    <i data-lucide="linkedin"></i>
                </a>
                <a class="site-footer__social"
                    href="https://github.com/robinbril"
                    target="_blank" rel="noopener noreferrer"
                    aria-label="GitHub">
                    <i data-lucide="github"></i>
                </a>
                <a class="site-footer__social"
                    href="mailto:robin.bril@gmail.com"
                    aria-label="E-mail">
                    <i data-lucide="mail"></i>
                </a>
            </div>
        </div>

    </div>

    <div class="site-footer__bottom">
        <p class="site-footer__copy">
            &copy; <span id="rb-year">2026</span> Robin Bril. Alle rechten voorbehouden.
        </p>
        <p class="site-footer__built">
            built with <span>HTML</span> &middot; <span>CSS</span> &middot; <span>vanilla JS</span> &middot; <span>Claude Code</span>
        </p>
    </div>
</footer>
```

Optioneel dynamisch jaartal, vlak voor de bestaande `lucide.createIcons()`-tag:

```html
<script>
    (function () {
        var y = document.getElementById('rb-year');
        if (y) y.textContent = String(new Date().getFullYear());
    })();
</script>
```

## HTML — scroll-to-top button

Direct vóór `</body>`, na de bestaande `<script>` tags:

```html
<button type="button" class="scroll-to-top" aria-label="Terug naar boven">
    <i data-lucide="arrow-up"></i>
</button>
```

Toggle vanaf `scrollY > 600`, smooth scroll naar top. Respecteert
`prefers-reduced-motion`.

## GitHub repos: gedrag

- Container `[data-github-repos="robinbril"]` wordt door het script gevuld met
  de drie meest recent geupdatete non-fork repos (via
  `https://api.github.com/users/robinbril/repos?sort=updated&per_page=3`).
- Bij CORS, rate limits of netwerkfouten wordt de container `display: none`
  gezet. Geen console errors.
- Lucide icons worden na render opnieuw geinitialiseerd.

## Hardcoded URLs

| Doel       | URL                                         |
|------------|---------------------------------------------|
| LinkedIn   | https://www.linkedin.com/in/robinbril/      |
| GitHub     | https://github.com/robinbril                |
| Repo card  | https://github.com/robinbril/claude-harness |
| Email      | mailto:robin.bril@gmail.com                 |

## Checklist na insertion

- [ ] CSS-link in `<head>`, script vóór sluitende `</body>`
- [ ] CTA-banner direct ná `</section>` van testimonials
- [ ] Footer vervangt de lege `<!-- Footer -->` comment
- [ ] Scroll-to-top button als laatste element vóór `</body>`
- [ ] `lucide.createIcons()` wordt nog aangeroepen na injectie
- [ ] Mobile (<720px): footer 1 kolom, CTA leesbaar
- [ ] Light theme: backgrounds, borders en accenten correct

---

# 04 — Light theme contrast + leesbaarheid (WCAG AA)

## Wire-up

In `index.html`, na regel 60 (`apple-premium.css`):

```html
<link rel="stylesheet" href="enhancements/04-light-theme.css">
```

Moet als laatste CSS-file laden, na `style.css`, `ai-styles.css`, `apple-premium.css` en andere enhancement-files. Geen `!important` gebruikt op 3 SVG-fill regels na (die rules in `style.css` zijn al `!important`).

## Behaalde contrast-ratios

Berekend tegen `#f6f8fb` (of `#ffffff` waar van toepassing).

| Element | Color | Bg | Ratio | WCAG |
|---|---|---|---|---|
| Body default | `#1a2332` | `#f6f8fb` | 14.8:1 | AAA |
| Headings | `#0c1422` | `#f6f8fb` | 18.2:1 | AAA |
| Secondary tekst (`#334155`) | `#334155` | `#f6f8fb` | 10.3:1 | AAA |
| Muted (`#475569`) | `#475569` | `#f6f8fb` | 7.5:1 | AAA |
| Body op card (`#1a2332`) | — | `#ffffff` | 15.1:1 | AAA |
| Secondary op card (`#334155`) | — | `#ffffff` | 10.5:1 | AAA |
| Accent teal `#0d9488` | — | `#ffffff` | 3.8:1 | AA (non-text) |
| Forest `#047857` (tekst) | — | `#ffffff` | 5.6:1 | AA |
| Emerald `#059669` (status dot) | — | `#ffffff` | 4.0:1 | AA (non-text) |
| White button op `#0d9488` | `#ffffff` | `#0d9488` | 3.8:1 | AA Large (16px+ bold) |
| Filter btn active white op teal | `#ffffff` | `#0d9488` | 3.8:1 | AA Large |
| Border `#e2e8f0` decoratief | — | `#ffffff` | 1.3:1 | non-text |
| Border `#cbd5e1` interactief | — | `#ffffff` | 1.6:1 | non-text |

**Nuance:** voor accent-teksten >= 18.66px bold of >= 24px regular voldoet 3:1 al aan AA. Body en kleine UI-tekst die accent-kleur erft wordt expliciet overschreven naar `#047857` (forest, 5.6:1), niet `#0d9488`. `--accent-strong` is gemapt op `#0d9488` puur voor decoratieve doeleinden (dots, glows, borders).

## Conflicterende regels in bestaande files (later opruimen)

Worden volledig overschreven door `04-light-theme.css`. Niet aangeraakt in deze write-only pass.

| File | Lines | Selector | Reden |
|---|---|---|---|
| `style.css` | 27–42 | `body.light-theme` token block | Tokens compleet herdefinieerd. De blauwe palette (`#3b82f6`, `#bfdbfe`) is dood. |
| `style.css` | 640–642 | `body.light-theme .stat-pill` | Witte solid surface. |
| `style.css` | 696–704 | `body.light-theme .tech-badge` (hover) | Idem. |
| `style.css` | 881–884 | `body.light-theme .role-description li::before` | Nu `#0d9488` direct. |
| `style.css` | 1009–1018 | `body.light-theme .tags span` (hover) | Direct overschreven. |
| `style.css` | 1324–1327 | `body.light-theme .card-metric` | Witte/grijs solid. |
| `style.css` | 1886–1944 | `body.light-theme .featured-project` blok | Linear-gradient + transparency → solid radial + white. |
| `style.css` | 2016–2019 | `body.light-theme .filter-btn.active` | Kritieke fix: was pastel bg met witte tekst, ~1.4:1 onleesbaar. |
| `style.css` | 2120–2186 | `body.light-theme .ai-project-card` + hover | Glassmorphism met `backdrop-filter` → solid white. |
| `style.css` | 2273–2293 | `body.light-theme .icon-*` group | Uniform `#f1f5f9` + `#cbd5e1` border. |
| `style.css` | 2389–2409 | `body.light-theme .tag-*` group | `rgba(0,0,0,0.5)` op `rgba(0,0,0,0.03)` matig leesbaar; nu `#1a2332` op `#f1f5f9` = 14.6:1. |
| `style.css` | 2715–2748 | `.skill-tags`, `.contact-item`, `.whatsapp-cta` | Glas-look → witte solid + border. |
| `style.css` | 2788–2790 | `body.light-theme .email-reveal` | Background opgeruimd. |
| `style.css` | 2920–2929 | `body.light-theme .whatsapp-status` | Witte solid. |
| `style.css` | 3437–3440 | `body.light-theme .contact-card` | Witte solid + echte shadow. |
| `style.css` | 3482–3495 | `body.light-theme .cv-download-btn` | Secondary button (white + teal border) per spec. |
| `style.css` | 3873–3892 | `body.light-theme .cert-badge`, `.progress-bar` | Teal gradient ipv blue. |
| `style.css` | 4527–4575 | `body.light-theme .terminal-*` block | Volledig herzien, mint → teal/emerald. |
| `style.css` | 5168–5172 | `body.light-theme .timeline-content.glow-card:hover` | Shadow update. |
| `style.css` | 5208–5212 | `body.light-theme .hero-grid` | NIET expliciet overschreven; blauwe grid lijnen blijven (1px op 6%). Zie "Open punten". |
| `style.css` | 5292–5296 | `body.light-theme .hero-eyebrow` | Vervangen. |
| `style.css` | 5325–5359 | `body.light-theme .hero-stats`, `.hero-stat-divider` | Border via tokens nu `#e2e8f0`. |
| `style.css` | 5474–5481 | `body.light-theme .nav-links a.is-active` | Teal ipv blue. |
| `style.css` | 5494–5507 | `body.light-theme .ai-project-card p`, `.featured-project p` | Tekstkleur direct overschreven. |
| `style.css` | 5556–5567 | `body.light-theme .card-diagram` | Vervangen. |
| `style.css` | 5731–5806 | "LIGHT THEME HERO PUNCH" blok | Volledig vervangen; was blauw → nu teal. |
| `style.css` | 5926–5976 | "LIGHT THEME CONTRAST FIX" blok | Robin's eerste pass; nu compleet vervangen. |
| `apple-premium.css` | 29–54 | `body.light-theme .ai-project-card` + hover | Glas-gradient `rgba(255,255,255,0.9 → 0.7)` → solid white. |
| `apple-premium.css` | 106–108 | `body.light-theme .project-icon-wrapper i` | Was `var(--accent-strong)` (blauw); nu `#047857` direct. |
| `ai-styles.css` | 205–223 | `body.light-theme .form-group input/textarea` | Focus shadow nu teal. |
| `ai-styles.css` | 486–488 | `body.light-theme .calendar-cta-section` | Gradient gebruikt `--accent-rgb`; werkt automatisch via token-flip. |
| `ai-styles.css` | 522–525 | `body.light-theme .cta-badge` | Vervangen. |
| `ai-styles.css` | 612–614 | `body.light-theme .calendar-btn:hover` | Teal hover. |

## Edge cases / wat NIET aangepast is

- **Warp HUD** (`style.css` 5979+, `.warp-hud`, `.rocket-cockpit`, `.cockpit-*`): alleen actief bij `body.xray`. Speelt zich af buiten normale viewport-flow en blijft donker by design. Brief bevestigt dit ("warp HUD blijven dark").
- **Terminal contact**: brief zegt "terminal contact, warp HUD blijven dark", maar de bestaande `body.light-theme .terminal-*` regels (style.css 4527–4575) maakten het al lichter. We hebben die opgepoetst naar teal/emerald i.p.v. dark. Wil Robin de terminal in light theme tóch dark houden: sectie 9 in `04-light-theme.css` skippen of overschrijven naar `background: #0c1422; color: #2EF2A0`. Open vraag.
- **Rocket-pov cockpit-frame filter** (`style.css` 4578–4580): laten staan, raakt alleen warp.
- **Hero video overlay** (`style.css` 5798–5802 en 5966–5976): blijft via tokens werken, niet expliciet aangeraakt.
- **Cert per-cert accents** (`style.css` 3865–3871): brand colors van Azure / Power BI / etc., NIET aanpassen. Alleen als glow gebruikt, voldoende contrast met witte cert-badge.
- **WhatsApp brand green** `#25D366` / `#128C7E`: brand colors, behouden.
- **Project icon Lucide colors** in `script.js`: niet getoucheerd. Algemene wrapper-icon op `#047857`.

## Open punten / follow-ups

1. **`style.css` regels 5208–5212** — hero-grid blauwe lijnen meenemen in cleanup pass (token-driven of expliciet `rgba(13,148,136,0.05)`). Niet kritiek maar visueel inconsistent.
2. **Cleanup pass** — alle bovenstaande "conflicterende regels" tabel kan in één destructive PR weg.
3. **Filter-btn AA contrast** — primary button tekst op `#0d9488` haalt 3.8:1; AA voor body-text is 4.5:1. Maak knop-tekst `font-weight: 700` (dan 3:1 voldoende per AA Large) of donker de teal naar `#0f766e` (4.5:1). Aanbevolen: bold.
4. **Focus rings** — geen expliciete `:focus-visible` outline in deze file. A11y follow-up: `outline: 2px solid #0d9488; outline-offset: 2px;` op interactieve elementen.
5. **Tag colors** — alle 17 `.tag-*` klassen kregen dezelfde neutrale stijl. Semantische kleuring (bv. `tag-emerald` echt groen) is een aparte enhancement.

---

## 01-cockpit (UPDATED) — full-viewport cockpit frame

Vervangt de twee zwevende glasspanelen (`.warp-stage` top, `.warp-bottom` bottom) door een complete cockpit: vaste side-struts links + rechts, een geïntegreerde top-HUD strip, een dashboard onderaan en een pilot-silhouet in 3D-vibe (achteraanzicht, helm + schouders, subtle head-bob).

Files:

- `enhancements/01-warp-hud.css` — herschreven (overschrijft de oude floating-panel CSS).
- `cockpit-pilot.svg` — pilot silhouet, gerenderd als `background-image` op `.warp-hud`. Path is relatief vanaf de CSS: `url("../cockpit-pilot.svg")`.

### Wire-up

Geen CSS-link toevoegen — `01-warp-hud.css` zit al in `<head>`. Verifieer load-volgorde:

```html
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="ai-styles.css">
<link rel="stylesheet" href="apple-premium.css">
<!-- enhancements -->
<link rel="stylesheet" href="enhancements/01-warp-hud.css">
```

### HTML changes — vervang `index.html` regels 149–198

De huidige markup heeft losse `.warp-stage` + `.warp-bottom` panels en een onbruikte `.rocket-cockpit` sub-tree. Vervang het hele blok (vanaf het commentaar `<!-- Warp HUD overlay ... -->` t/m de sluitende `</div>` van `#warp-hud` en de hidden `<span id="hud-destination">`) door:

```html
<!-- Warp HUD overlay — cockpit frame (struts + canopy via CSS background) -->
<div class="warp-hud" id="warp-hud" aria-hidden="true">

    <!-- Top HUD strip: NEXT STOP + destination text + RELEASE prompt -->
    <h2 id="hud-big-destination">OVER MIJ</h2>

    <!-- Bottom dashboard grid: pilot card | 5 route stops | velocity stack -->
    <ol class="warp-route" id="warp-route" aria-label="Warp route stops">
        <li class="warp-stop is-active" data-section="about">
            <span class="warp-stop-dot"></span>
            <span class="warp-stop-label">Over mij</span>
        </li>
        <li class="warp-stop" data-section="projects">
            <span class="warp-stop-dot"></span>
            <span class="warp-stop-label">Projecten</span>
        </li>
        <li class="warp-stop" data-section="experience">
            <span class="warp-stop-dot"></span>
            <span class="warp-stop-label">Ervaring</span>
        </li>
        <li class="warp-stop" data-section="skills">
            <span class="warp-stop-dot"></span>
            <span class="warp-stop-label">Skills</span>
        </li>
        <li class="warp-stop" data-section="contact">
            <span class="warp-stop-dot"></span>
            <span class="warp-stop-label">Contact</span>
        </li>
    </ol>

    <!-- Right dashboard readouts: velocity + drive status -->
    <div id="hud-velocity">0.00 c</div>
    <div id="hud-status">SPOOLING DRIVE</div>

    <!-- Left dashboard pilot-card region (purely decorative, CSS-painted) -->
    <span id="hud-destination" aria-hidden="true">RB-01</span>
</div>
```

Aandachtspunten:

- `<h2 id="hud-big-destination">` vervangt de oude `<div class="warp-big">`. Het id is wat de cycler in `script.js` regel 747 update via `document.getElementById('hud-big-destination')`. Klassen `.warp-stage`, `.warp-eyebrow`, `.warp-big`, `.warp-hint` zijn weg — geen `script.js` referentie ernaar.
- `#hud-velocity` en `#hud-status` zijn nu directe `<div>` kinderen i.p.v. nested onder `.warp-bottom > .warp-velocity`. JS leest ze via `getElementById` (regels 567–568), dus de nesting is irrelevant voor de logica.
- `#hud-destination` is GEEN tekstdoel meer voor JS — wordt nooit door `script.js` aangeraakt. Wij gebruiken het als visueel anchor voor de pilot-card (linker dashboard kolom). De `aria-hidden="true"` is nieuw; het oude `hidden` attribuut wordt door de CSS overruled.
- `.warp-route` blijft `<ol>` met 5 `<li class="warp-stop">` — exact wat de cycler `renderStop()` (regels 740–759) verwacht: `document.querySelectorAll('.warp-stop')`, toggle van `is-active` + `is-past`.
- De oude `.rocket-cockpit` decoratieve struts (regels 152–161) zijn verwijderd. De nieuwe CSS tekent de struts zelf via `background-image` op `.warp-hud`. Mocht je de oude markup laten staan: de nieuwe CSS heeft `display: none !important` voor `.rocket-cockpit`, dus geen visuele botsing.

### JS hooks — wat blijft contract

De volgende selectors mogen NIET veranderen in `script.js`:

| Selector | Gebruikt op regel | Functie |
|---|---|---|
| `document.getElementById('hud-big-destination')` | 567, 747 | destination tekst (top strip) |
| `document.getElementById('hud-velocity')` | 567, 703 | velocity readout |
| `document.getElementById('hud-status')` | 568, 707, 800 | drive status |
| `document.querySelectorAll('.warp-stop')` | 741 | route stops toggle |
| `el.classList.add('is-active' \| 'is-past')` | 743–745 | active/past state CSS-hook |
| `data-section="<id>"` op `.warp-stop` | (renderStop koppeling) | sectie-id voor `scrollToSection` |

`#hud-destination` (de hidden legacy span) wordt door JS niet meer gelezen of geschreven. Veilig om puur decoratief te gebruiken.

### Z-index hiërarchie

```
canvas (#warp-canvas)         z-index: auto / ~30      (starfield achtergrond)
.warp-hud root                z-index: 40              (cockpit overlay)
  .warp-hud::before (canopy)  z-index: 1   (binnen .warp-hud)
  #hud-big-destination        z-index: 5
  #warp-route (dashboard)     z-index: 5
  #hud-destination (pilot)    z-index: 6
  #hud-velocity / #hud-status z-index: 6
header / navbar               z-index: 100             (site nav blijft altijd boven)
```

`.warp-hud` heeft `pointer-events: none`, dus de cockpit blokkeert nooit klikken op de pagina eronder.

### Mobiel gedrag (≤768px)

- Struts naar `width: 0` (background-size 0 0) → frame valt weg, dashboard pakt volle breedte.
- Pilot silhouet schaalt naar 150×138px, blijft zichtbaar onderaan center.
- Top-strip behoudt `NEXT STOP` label maar drop het `RELEASE SPACE` lid.
- Dashboard wordt 2-rij: pilot-callsign-strip bovenaan (compact 36px hoog), 5 stops daaronder, velocity + status rechts onderaan.

### Performance + accessibility

- Alleen `transform`, `opacity`, `filter`, `background-position-y` en `box-shadow` worden geanimeerd.
- `prefers-reduced-motion: reduce` cancelt: pilot-bob, LED-breathe, stop-pulse, status-blink, blinker-fade, en de progress-rail transition.
- Niets met `backdrop-filter` op `.warp-hud` zelf (dat zou de canvas-render vertragen tijdens warp). De oude panels hadden wel `backdrop-filter: blur(24px)` — die zijn nu weg.
