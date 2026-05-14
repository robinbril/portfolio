# 07 - SEO head, structured data, sitemap, robots

## Wat is gewijzigd

- `sitemap.xml` - `lastmod` 2026-05-14 toegevoegd op alle URLs (direct geupdatet).
- `robots.txt` - was al correct met `User-agent: *` en `Sitemap:` directive. Geen wijziging nodig.
- `enhancements/07-seo-head.html` - vervangende `<head>` block, klaar om in `index.html` te plakken.

## Wat moet er in index.html gebeuren

Vervang regels **4 t/m 81** van `index.html` (de hele bestaande `<head>...</head>` block) met de inhoud van `enhancements/07-seo-head.html`.

Concreet:
- Regel 4 (`<head>`) tot en met regel 81 (`</head>`) verwijderen.
- Volledige inhoud van `07-seo-head.html` ervoor in de plaats.

Behouden ten opzichte van bestaande head:
- Theme bootstrap inline `<script>` (was regels 29-42).
- Google Fonts stylesheet link.
- `style.css`, `ai-styles.css`, `apple-premium.css`.
- Lucide icons script.
- Bestaande favicon links.

Nieuw of vervangen:
- Title langer en keyword-gericht: "Robin Bril - AI Engineer | Productieklare Agentic Systems".
- Description herschreven (155 chars max), eerlijker en concreter.
- `robots` meta tag toegevoegd met `max-snippet:-1,max-image-preview:large`.
- Theme color dark naar `#02050a` (was `#0b0d11`).
- OG image van favicon.png naar `hero-bg.webp` (1200x630).
- `og:locale`, `og:site_name`, `og:image:width`/`height` toegevoegd.
- Twitter card image gelijkgetrokken met OG.
- Preload toegevoegd voor `hero-bg.webp` (fetchpriority high) en `style.css`.
- JSON-LD Person schema uitgebreid: `description`, `image`, `address`, `worksFor` (Fellowmind), `knowsLanguage`, en `knowsAbout` met Agentic Systems / MCP / Azure expliciet.

## Belangrijk: og-image maken

`hero-bg.webp` wordt nu als OG image gebruikt. Twee aandachtspunten:

1. **Check de afmetingen.** Voor optimale rendering op LinkedIn/Twitter/Slack moet de image 1200x630px zijn (1.91:1 ratio). Als `hero-bg.webp` andere afmetingen heeft, wordt hij gecropt.
2. **WebP wordt soms niet ondersteund** in oudere social previews (vooral oudere LinkedIn crawlers). Tip: maak een dedicated **`og-image.jpg`** van 1200x630px met:
   - Robin's naam + "AI Engineer" + "robinbril.dev"
   - Donkere achtergrond consistent met de site
   - Eventueel een tagline: "Agentic systems voor productie"

   Vervang dan in `07-seo-head.html`:
   - `og:image` -> `https://robinbril.dev/og-image.jpg`
   - `og:image:type` -> `image/jpeg`
   - `twitter:image` -> `https://robinbril.dev/og-image.jpg`

   Tools: Figma export, of een snel script met Pillow / Sharp.

## Lighthouse SEO aanbevelingen

Naast de head:

1. **Alt-text op alle images** - check `<img>` tags in body voor beschrijvende `alt`. Decoratieve images krijgen `alt=""`.
2. **Heading hierarchy** - exact een `<h1>` (hero), daarna `<h2>` per sectie, geen niveaus skippen.
3. **Link text** - "klik hier" / "lees meer" vermijden. Gebruik beschrijvende anchors ("Bekijk de Hive AI case").
4. **Tap targets** - interactieve elementen minstens 48x48px op mobile.
5. **`hreflang`** - als er ooit een EN-versie komt, voeg `<link rel="alternate" hreflang="nl" ...>` en `hreflang="en"` toe.
6. **CSP / security headers** - Lighthouse Best Practices kijkt naar dit. Configureer in hosting (Cloudflare Pages / Vercel / Netlify).
7. **Image lazy-loading** - alle below-the-fold `<img>` krijgt `loading="lazy"` en `decoding="async"`.
8. **`<meta name="format-detection" content="telephone=no">`** - als er telefoonnummers in de tekst staan die je niet als tap-to-call wilt.

## Vindbaarheid / keywords

De huidige meta + JSON-LD dekken:
- "AI Engineer freelance Nederland" (description + nationality NL + jobTitle)
- "Agentic AI Engineer" (knowsAbout + title)
- "MCP engineer" (knowsAbout)
- "Enterprise AI Azure" (knowsAbout)

Voor extra ranking-power: schrijf 2-3 long-form blog posts (case studies van Hive AI / Reforge / Fellowmind projecten) en link ernaar vanaf de homepage. Dat geeft Google echte content om op te indexeren, niet alleen een one-pager.

## Submissie checklist na deploy

- [ ] Google Search Console: property claimen, sitemap submitten.
- [ ] Bing Webmaster Tools: idem.
- [ ] LinkedIn Post Inspector: `https://www.linkedin.com/post-inspector/` om OG preview te debuggen.
- [ ] Twitter Card Validator: `https://cards-dev.twitter.com/validator`.
- [ ] Rich Results Test: `https://search.google.com/test/rich-results` voor de Person schema.
- [ ] PageSpeed Insights: target 95+ op alle scores.
