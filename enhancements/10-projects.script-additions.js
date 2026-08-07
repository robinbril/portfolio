/* =========================================================================
   10-projects.script-additions.js
   Filter UX enhancement - smooth collapse via class, no display:none flash.
   Load AFTER script.js. Self-contained IIFE. Bewerkt geen bestaande code.
   ========================================================================= */
(function () {
    'use strict';

    function init() {
        var buttons = document.querySelectorAll('.project-filters .filter-btn');
        var cards = document.querySelectorAll('.ai-project-card[data-category]');

        if (!buttons.length || !cards.length) return;

        // Strip any inline display:none left by the legacy filter handler in
        // script.js so the CSS .is-filtered-out transition can take over.
        function clearInlineDisplay() {
            for (var i = 0; i < cards.length; i++) {
                if (cards[i].style.display === 'none') {
                    cards[i].style.display = '';
                }
                cards[i].classList.remove('hidden');
            }
        }

        function applyFilter(filter) {
            if (!filter) return;

            for (var i = 0; i < cards.length; i++) {
                var card = cards[i];
                var categories = (card.getAttribute('data-category') || '').split(/\s+/);
                var matches = filter === 'all' || categories.indexOf(filter) !== -1;

                if (matches) {
                    card.classList.remove('is-filtered-out');
                    card.removeAttribute('aria-hidden');
                } else {
                    card.classList.add('is-filtered-out');
                    card.setAttribute('aria-hidden', 'true');
                }
            }
        }

        function setActive(target) {
            for (var i = 0; i < buttons.length; i++) {
                var btn = buttons[i];
                var isActive = btn === target;
                btn.classList.toggle('is-active', isActive);
                btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            }
        }

        // Initialise aria-pressed + locate the initially active button.
        var initialActive = null;
        for (var i = 0; i < buttons.length; i++) {
            var btn = buttons[i];
            if (btn.classList.contains('active') || btn.classList.contains('is-active')) {
                initialActive = btn;
            }
        }
        if (!initialActive) initialActive = buttons[0];
        setActive(initialActive);

        // Click handler - runs AFTER the legacy handler in script.js (event
        // listeners fire in registration order). Defer one frame so the
        // legacy handler's inline styles land first, then override them with
        // class-based transitions.
        for (var j = 0; j < buttons.length; j++) {
            buttons[j].addEventListener('click', function (e) {
                var btn = e.currentTarget;
                var filter = btn.getAttribute('data-filter');

                requestAnimationFrame(function () {
                    clearInlineDisplay();
                    applyFilter(filter);
                    setActive(btn);
                });
            });
        }

        // First paint - apply initial filter so card states match the active
        // button without waiting for a click.
        requestAnimationFrame(function () {
            clearInlineDisplay();
            applyFilter(initialActive.getAttribute('data-filter'));
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
