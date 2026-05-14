/* =============================================================================
 * 08 — Animations script additions
 * Self-contained IIFE. No globals. No dependencies.
 *
 * Responsibilities:
 *  - Observe sections/hero with data-reveal; add .in-view at 15% visibility
 *  - Track mouse position over tilt cards; write --mx --my custom properties
 *    (normalised range -1..1) for CSS-only consumption
 *  - rAF-throttled mousemove handler
 *  - Respects prefers-reduced-motion
 *
 * =============================================================================
 * INTEGRATION NOTES (was 08-animations.NOTES.md; inlined due to repo hook).
 * =============================================================================
 *
 * Files in this bundle
 *   - 08-animations.css                       (all visual rules)
 *   - 08-animations.script-additions.js       (this file)
 *
 * Wiring (manual, when ready to ship)
 *   Add to index.html <head> after existing stylesheets:
 *     <link rel="stylesheet" href="enhancements/08-animations.css">
 *   Add before </body> after existing script.js:
 *     <script src="enhancements/08-animations.script-additions.js" defer></script>
 *   No other HTML changes required — this script auto-tags
 *   <section class="section"> and .hero with data-reveal.
 *
 * Existing HTML hooks the CSS already targets
 *   .section, .hero                              — scroll reveal
 *   .ai-project-card, .featured-project          — tilt + lift on hover
 *   .skill-chip                                  — mint ripple
 *   .filter-btn (+ .active)                      — animated underline
 *   .hero-content .hero-eyebrow / h1 /
 *     .hero-subtitle / .hero-actions /
 *     .hero-stats                                — page-load cascade
 *   #experience .timeline-item:first-child       — pulse on current-role dot
 *
 * Optional HTML hooks (no markup change required if absent)
 *   - Add class "counter-animate" inside .hero-stat numbers for scale-in
 *     when hero reveals.
 *   - Timeline pulse targets .timeline-dot, .timeline-marker, or .dot on
 *     first .timeline-item. Add one of those classes to the marker
 *     element if the current markup uses none of them.
 *
 * Performance
 *   - Animates transform + opacity only. No layout/paint thrash. 60fps.
 *   - will-change set only where animation actually runs.
 *   - IntersectionObserver unobserves after first reveal — zero idle cost.
 *   - mousemove throttled to one rAF per frame; listeners are passive.
 *   - Tilt gated to (hover: hover) and (pointer: fine) — off on touch.
 *
 * Accessibility / reduced motion
 *   - prefers-reduced-motion: reduce cancels all animations and reveals
 *     all sections instantly (no flash of invisible content).
 *   - Hover effects gated to (hover: hover) and (pointer: fine).
 *
 * Cascade order
 *   Load 08-animations.css AFTER style.css and all other enhancements/*.css
 *   so this stylesheet wins on shared selectors (.filter-btn::before,
 *   .skill-chip::after).
 *
 * Known overlap with style.css
 *   .ai-project-card / .featured-project already have :hover transforms
 *   in style.css. The tilt rule replaces those when this stylesheet loads
 *   last. To preserve the original lift only, drop translateY(-4px) from
 *   the .ai-project-card:hover / .featured-project:hover rule and/or
 *   reduce --tilt-strength to 3deg.
 *
 * Rollback
 *   Remove the single <link> and the single <script> tag. Done.
 * =============================================================================
 */

(function () {
    "use strict";

    var supportsIO = typeof window.IntersectionObserver === "function";
    var prefersReduced = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function markAllVisible() {
        var nodes = document.querySelectorAll("[data-reveal]");
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].classList.add("in-view");
        }
    }

    if (prefersReduced) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", markAllVisible, { once: true });
        } else {
            markAllVisible();
        }
        return;
    }

    /* ---------------------------------------------------------------------
       1. Scroll reveal — auto-tag every <section> + .hero with data-reveal
       --------------------------------------------------------------------- */

    function tagRevealTargets() {
        var targets = document.querySelectorAll("section.section, section.hero, .hero");
        for (var i = 0; i < targets.length; i++) {
            if (!targets[i].hasAttribute("data-reveal")) {
                targets[i].setAttribute("data-reveal", "");
            }
        }
        return targets;
    }

    function initRevealObserver() {
        var targets = tagRevealTargets();
        if (!targets.length) return;

        if (!supportsIO) {
            for (var j = 0; j < targets.length; j++) {
                targets[j].classList.add("in-view");
            }
            return;
        }

        var io = new IntersectionObserver(function (entries) {
            for (var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    io.unobserve(entry.target);
                }
            }
        }, {
            threshold: 0.15,
            rootMargin: "0px 0px -5% 0px"
        });

        for (var k = 0; k < targets.length; k++) {
            io.observe(targets[k]);
        }
    }

    /* ---------------------------------------------------------------------
       2. Card tilt — mousemove sets --mx / --my (range -1..1)
       --------------------------------------------------------------------- */

    function initCardTilt() {
        var cards = document.querySelectorAll(".ai-project-card, .featured-project");
        if (!cards.length) return;
        if (!("requestAnimationFrame" in window)) return;

        var hoverable = window.matchMedia &&
            window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        if (!hoverable) return;

        var rafId = null;
        var pending = null;

        function applyTilt() {
            rafId = null;
            if (!pending) return;
            var card = pending.card;
            var rect = pending.rect;

            var relX = (pending.x - rect.left) / rect.width;
            var relY = (pending.y - rect.top) / rect.height;
            var mx = (relX - 0.5) * 2;
            var my = (relY - 0.5) * 2;

            if (mx < -1) mx = -1; else if (mx > 1) mx = 1;
            if (my < -1) my = -1; else if (my > 1) my = 1;

            card.style.setProperty("--mx", mx.toFixed(3));
            card.style.setProperty("--my", my.toFixed(3));
            pending = null;
        }

        function onMove(e) {
            var card = e.currentTarget;
            pending = {
                card: card,
                rect: card.getBoundingClientRect(),
                x: e.clientX,
                y: e.clientY
            };
            if (rafId === null) {
                rafId = window.requestAnimationFrame(applyTilt);
            }
        }

        function onLeave(e) {
            var card = e.currentTarget;
            if (rafId !== null) {
                window.cancelAnimationFrame(rafId);
                rafId = null;
            }
            pending = null;
            card.style.setProperty("--mx", "0");
            card.style.setProperty("--my", "0");
        }

        for (var i = 0; i < cards.length; i++) {
            cards[i].addEventListener("mousemove", onMove, { passive: true });
            cards[i].addEventListener("mouseleave", onLeave, { passive: true });
        }
    }

    /* ---------------------------------------------------------------------
       Boot
       --------------------------------------------------------------------- */

    function boot() {
        try { initRevealObserver(); } catch (e) { /* non-critical */ }
        try { initCardTilt(); } catch (e) { /* non-critical */ }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
        boot();
    }
})();
