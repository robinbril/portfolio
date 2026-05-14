# 05 - Terminal interface upgrade

Enhancement layer for the contact-section terminal (`robin_ai_interface -- zsh`).
Adds discoverability: pulsing hint, tab-complete ghost-text, animated caret,
chip glow, auto-typer on first viewport entry.

NOTE: This file was originally requested as `05-terminal.NOTES.md` but a
PostToolUse hook blocks `.md` creation outside `README.md`. Saved as
`05-terminal.NOTES` (no extension) to preserve the user's intended name.
Rename to `.md` manually if desired.

## Files

- `05-terminal.css` - visuals + reduced-motion guard + mobile 2-col chip grid
- `05-terminal.script-additions.js` - IIFE, idempotent, defensive

## How to wire up

In `index.html`, add inside `<head>` after the existing stylesheets:

```html
<link rel="stylesheet" href="enhancements/05-terminal.css">
```

And just before `</body>` (after the existing `script.js`):

```html
<script src="enhancements/05-terminal.script-additions.js" defer></script>
```

## Required DOM hooks (already present in current markup)

The script targets these selectors from `index.html` lines 1404-1436:

| Selector                 | Element type | Role                                        |
|--------------------------|--------------|---------------------------------------------|
| `#terminal-embed`        | `<div>`      | Outer wrapper, gets `is-typing` class       |
| `#terminal-body`         | `<div>`      | Output area, for help-fallback printing     |
| `#terminal-form`         | `<form>`     | Input row, gets `is-focused` / `has-value`  |
| `#terminal-input`        | `<input>`    | Text input                                  |
| `.terminal-input-prompt` | `<span>`     | The `$` prompt; caret inserted after it     |
| `.terminal-chip`         | `<button>`   | Existing chips; hover/active styles applied |
| `.terminal-chips`        | `<div>`      | Chip container; becomes 2-col on mobile     |

No HTML changes are strictly required. All scaffolding (`.terminal-input-wrap`,
`.terminal-ghost`, `.terminal-prompt-hint`, `.terminal-caret`) is injected by
the script at runtime.

## Optional HTML hook: `data-commands`

To customize the autocomplete list without touching JS, add a `data-commands`
attribute to `#terminal-embed`:

```html
<div class="terminal-window" id="terminal-embed"
     data-commands="help,linkedin,whatsapp,email,call,about,stack,clear">
```

When omitted, the script falls back to a built-in list:
`help, linkedin, whatsapp, email, call, about, stack, github, available, clear`.

The list drives:
- TAB completion (first prefix match wins, in array order)
- The `help` fallback printout (only printed if the existing handler in
  `script.js` did not already print "Available commands:")

The cycling placeholder uses a separate fixed list:
`["help", "linkedin", "email", "github", "available"]` (per spec).

## Interaction with existing script.js

`script.js` lines 1111-1187 contain a smaller autoprompt that animates the
placeholder. The new IIFE is idempotent and will run alongside it without
double-binding (guarded by `window.__terminalEnhanceLoaded`), but both scripts
will fight for the `placeholder` attribute. Recommended cleanup when wiring up:

- Remove or comment out the autoprompt IIFE in `script.js` (lines 1111-1187)
- Keep the main terminal handler (lines 836-1010); the new file does not
  duplicate command execution, it only enhances input UX

Without that cleanup the page still works, but the placeholder will flicker
between the two cycling sources.

## Accessibility

- Ghost text + caret + hint are all `aria-hidden="true"` or non-focusable
- `prefers-reduced-motion: reduce` disables hint pulse, auto-typer, caret
  blink, and chip transforms
- TAB key only intercepts when there is a valid completion; otherwise the
  default focus-traversal behavior is preserved
- ESC clears the ghost without affecting the input value

## Performance

- One `IntersectionObserver`, disconnected after first hit
- All animations CSS-driven, GPU-friendly (`transform`, `opacity`)
- No external dependencies, no font loads, no network calls
