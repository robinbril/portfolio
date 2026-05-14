# 01 - Warp HUD polish — handoff

## How to load

Add ONE line in `index.html`, AFTER the existing `style.css` link in `<head>`. Search for the line that loads `style.css` (around the top of `<head>`) and add directly below it:

```html
<link rel="stylesheet" href="enhancements/01-warp-hud.css">
```

The override only works if it loads after `style.css`. Cascade order is what makes the new selectors win without needing `!important`.

## What the new file replaces

These selectors in `style.css` (lines 5979-6232) are now fully overridden by `enhancements/01-warp-hud.css`. The old rules still run first but every property is re-declared in the new file, so you can delete them when you're ready:

- `.warp-stage` (5999-6016)
- `.warp-eyebrow` (6018-6027)
- `.warp-big` (6029-6041)
- `.warp-hint` (6043-6050)
- `.warp-bottom` (6053-6073)
- `.warp-route` (6076-6087)
- `.warp-route::before` (6089-6100)
- `.warp-stop` (6102-6110)
- `.warp-stop-dot` (6112-6125)
- `.warp-stop-label` (6127-6136)
- `.warp-stop.is-active .warp-stop-dot` (6138-6149)
- `.warp-stop.is-active .warp-stop-label` (6151-6155)
- `.warp-stop.is-past .warp-stop-dot` (6157-6160)
- `.warp-stop.is-past .warp-stop-label` (6162-6164)
- `@keyframes warp-stop-pulse` (6166-6179)
- `.warp-velocity` (6182-6193)
- `.warp-velocity-label` (6195-6200)
- `.warp-velocity-value` (6202-6208)
- `.warp-velocity-status` (6210-6216)
- The `@media (max-width: 768px)` block for warp selectors (6218-6228)
- The empty `@media (prefers-reduced-motion: reduce) { }` stub (6230-6231)

Keep:
- `.warp-hud` (5981-5992) — overlay container, layout primitive. Not redeclared.
- `body.xray .warp-hud` (5994-5996) — visibility toggle. Not redeclared.
- The comment header at 5978-5980 — if you delete the rest, drop this too.

## HTML and JS changes

**HTML:** none required for the new styling to work. The new CSS hooks onto the existing markup in `index.html:151-201`. The `<li class="warp-stop">` order, the `is-active` / `is-past` class names, and the `#hud-big-destination` / `#hud-velocity` / `#hud-status` IDs all match the script. The only HTML edit is the single `<link>` tag mentioned at the top of this file.

**JS:** none required. `script.js:740-744` already toggles `is-active` and `is-past` on the right elements, which is exactly what the progress bar (`:has()` selectors) and the dot states depend on.

## Browser support note

The progress bar uses `:has()`. Supported in Safari 15.4+, Chrome 105+, Firefox 121+. If you need older support, the rail still renders fine (the `::after` width falls back to `0`), so the worst case is a missing progress fill, not a broken layout.

## Quick visual checklist for testing

Hold space:
1. Top panel sits 48px from top, centered, with a soft mint edge gradient
2. "NEXT STOP" eyebrow has a short mint dash on each side
3. Destination text is huge (up to 84px on desktop) and crisp on the dark glass
4. Bottom bar shows 5 stops with a mint progress line filling left to right as the cycler advances
5. Active dot has a pulsing triple-shadow halo and sits slightly raised from the rail
6. Velocity readout is tabular, mint, with a blinking status dot
7. On mobile, bar stacks (route on top, velocity below) and the contact stop is hidden
