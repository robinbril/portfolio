# 13 — Experience timeline + Skills polish

## Inclusion

Voeg deze regel toe in `index.html`, na de bestaande `<link>` voor `style.css` en idealiter ná `apple-premium.css`:

```html
<link rel="stylesheet" href="enhancements/13-experience-skills.css">
```

Geen JS verplicht. CSS scoped op `#experience` en `#skills`, dus zero side effects op andere secties.

---

## Zaken die EXPLICIET zo blijven

- **De twee Capgemini-bij-Defensie kaarten blijven gescheiden.** Eén "AI Engineer" (2024–2026), één "Data Consultant" (2024–2026). Niet samenvoegen. Robin heeft dit benoemd.
- Volgorde van timeline items niet aanpassen.
- Skill categorieën in hun huidige volgorde laten staan — de per-categorie kleurtints in deze CSS zijn nth-child based.

---

## Optionele HTML aanpassingen (alle backwards-compatible)

### A. Company link met external arrow

Zet de bedrijfsnaam in een `<a class="company" href="…" target="_blank" rel="noopener">…</a>`. CSS toont automatisch een `↗` met hover-shift.

```html
<a class="company" href="https://fellowmind.nl" target="_blank" rel="noopener">
  Reforge Consultancy, opdracht bij Fellowmind
</a>
```

Niet doen voor cards zonder publieke URL (Defensie). De bestaande `<span class="company">` blijft gewoon werken.

### B. Skill chip levels (volledig optioneel)

Voeg `data-level="1|2|3"` toe aan skill chips om mini progress-dots te tonen. Geen attribute = geen dots:

```html
<span data-level="3">RAG Pipelines</span>
<span data-level="2">Rust</span>
<span data-level="1">ABAP</span>
<span>Python</span>   <!-- geen dots -->
```

Kleur van de dots volgt de category-tint via `--cat-rgb`.

### C. Scroll cascade (optioneel, nice-to-have)

CSS toont items na 800ms automatisch (failsafe). Voor een echte scroll-triggered cascade: voeg dit toe aan `script.js` of als losse `enhancement` script:

```js
const tlObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.setAttribute('data-in-view', '');
      tlObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

document.querySelectorAll('#experience .timeline-item').forEach((el) => tlObserver.observe(el));
```

De CSS herkent zowel `[data-in-view]` als `.in-view` — kies wat past bij bestaande observer-patterns in `script.js`.

---

## Conflicting rules in `style.css` (later op te ruimen, NIET nu)

Deze enhancement override functioneel via `#experience` / `#skills` scope. Bij latere refactor:

| style.css | Wat | Vervangen door |
|-----------|-----|----------------|
| r.799–803 `.timeline` | harde `border-left: 2px solid` | gradient pseudo `::before` |
| r.810–822 `.timeline-item::before` | 14px dot, solid mint, 3px border | 12px hollow ring + filled past-state |
| r.5106–5126 timeline polish + pulse | bestaande pulse via `box-shadow` only | nieuwe `tl13-pulse` met ring expansion |
| r.5129–5172 `.timeline-content.glow-card` | links-edge accent | rechts-edge mint glow |
| r.5175–5183 `.tags span` (timeline) | rounded pill 50px | mono mini-chip 4px radius met dot delimiter |
| r.2520–2545 `.skills-container` | 12-col grid + nth-child(4/5) span-6 | `repeat(auto-fit, minmax(240px, 1fr))` |
| r.2571–2590 `.skill-tags span` base | 36px min-height block-style chips | mono dark-glass chips |
| r.5028–5104 skills polish | enkele mint accent | per-category `--cat-rgb` tint |

De huidige enhancement laat alles in `style.css` staan en wint op specificity. Geen breaking changes. Cleanup is een aparte refactor-task.

---

## Performance

- `backdrop-filter: blur(8px)` op cards. Op oude Safari valt het terug naar gewone background. Geen layout shift.
- Pulse animation alleen op `:first-child::before` (1 element).
- Failsafe show animation: 0.7s eenmalig per item, vuurt af na 0.8s als de observer niet getriggerd is. Geen runtime kosten daarna.

---

## Wat je visueel krijgt

- **Tijdlijn**: fade-out rail naar onderen, current dot pulseert, oude rollen zijn solide bolletjes. Hover op kaart schuift 4px rechts, mint glow verschijnt aan de rechterrand. Date pill links boven oogt als een mono badge.
- **Tags op cards**: kleine mono labels, gescheiden door `·` punt. Geen pillow-shape, voelt meer als metadata dan keywords.
- **Skills**: 6 categorieën in een responsive auto-fit grid. Elke categorie krijgt eigen tint (mint, blauw, amber, violet, pink, teal). Icon-box voor de category-titel licht op bij hover. Chips zelf zijn dark glass, mono, kleine padding. Hover schaalt 1.04 met getinte glow.

Geen confetti, geen 3D-tilt, geen drama. Premium en functioneel.
