/* 05 - Terminal interface upgrade: discoverability + tab-complete + auto-typer
 *
 * Self-contained IIFE. Idempotent and defensive.
 * Reads optional data-commands attribute on #terminal-embed (comma-separated).
 * Falls back to a built-in command list otherwise.
 *
 * Public surface (window.__terminalEnhance) is exposed only for debugging.
 */
(function () {
    'use strict';

    if (window.__terminalEnhanceLoaded) return;
    window.__terminalEnhanceLoaded = true;

    var run = function () {
        try {
            var input = document.getElementById('terminal-input');
            var form = document.getElementById('terminal-form');
            var embed = document.getElementById('terminal-embed');
            var body = document.getElementById('terminal-body');
            if (!input || !form || !embed) return;

            var prefersReduced = false;
            try {
                prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            } catch (_) {}

            /* ---------- Command list ---------- */
            var fallbackCommands = ['help', 'linkedin', 'whatsapp', 'email', 'call', 'about', 'stack', 'github', 'available', 'clear'];
            var dataAttr = embed.getAttribute('data-commands');
            var commands = dataAttr
                ? dataAttr.split(',').map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean)
                : fallbackCommands.slice();

            var cyclePlaceholders = ['help', 'linkedin', 'email', 'github', 'available'];

            /* ---------- DOM scaffolding ---------- */
            var inputRow = form;
            inputRow.classList.add('has-enhance');

            // Wrap input so we can layer a ghost behind it
            var originalParent = input.parentNode;
            var wrap = document.createElement('span');
            wrap.className = 'terminal-input-wrap';
            originalParent.insertBefore(wrap, input);
            wrap.appendChild(input);

            var ghost = document.createElement('span');
            ghost.className = 'terminal-ghost';
            ghost.setAttribute('aria-hidden', 'true');
            ghost.innerHTML = '<span class="term-ghost-typed"></span><span class="term-ghost-suffix"></span><span class="term-ghost-tab">TAB</span>';
            wrap.appendChild(ghost);
            var ghostTyped = ghost.querySelector('.term-ghost-typed');
            var ghostSuffix = ghost.querySelector('.term-ghost-suffix');
            var ghostTab = ghost.querySelector('.term-ghost-tab');
            ghost.style.display = 'none';

            // Blinking caret after the prompt $ when input is empty + unfocused
            var caret = document.createElement('span');
            caret.className = 'terminal-caret';
            caret.setAttribute('aria-hidden', 'true');
            var promptEl = form.querySelector('.terminal-input-prompt');
            if (promptEl && promptEl.parentNode) {
                promptEl.parentNode.insertBefore(caret, promptEl.nextSibling);
            }

            // Pulsing prompt hint underneath the input row
            var hint = document.createElement('div');
            hint.className = 'terminal-prompt-hint';
            hint.innerHTML = 'type <kbd>help</kbd> <kbd>&#x21B5;</kbd> for all commands &middot; <kbd>TAB</kbd> to autocomplete';
            if (form.parentNode) form.parentNode.appendChild(hint);

            /* ---------- Placeholder cycler ---------- */
            var cycleIdx = 0;
            var cycleTimer = null;
            var stoppedCycle = false;
            var DEFAULT_PLACEHOLDER = 'Enter command...';

            var setPlaceholder = function (text) {
                try { input.placeholder = text; } catch (_) {}
            };

            var stopCycle = function () {
                if (stoppedCycle) return;
                stoppedCycle = true;
                if (cycleTimer) { clearTimeout(cycleTimer); cycleTimer = null; }
            };

            var tickCycle = function () {
                if (stoppedCycle || prefersReduced) return;
                var word = cyclePlaceholders[cycleIdx % cyclePlaceholders.length];
                setPlaceholder('try: ' + word);
                cycleIdx++;
                cycleTimer = setTimeout(tickCycle, 2500);
            };

            /* ---------- Tab-complete ghost ---------- */
            var findCompletion = function (value) {
                var v = (value || '').toLowerCase();
                if (!v) return null;
                for (var i = 0; i < commands.length; i++) {
                    if (commands[i] !== v && commands[i].indexOf(v) === 0) return commands[i];
                }
                return null;
            };

            var updateGhost = function () {
                try {
                    var raw = input.value;
                    var completion = findCompletion(raw);
                    if (!completion) {
                        ghost.style.display = 'none';
                        return;
                    }
                    ghostTyped.textContent = raw;
                    ghostSuffix.textContent = completion.slice(raw.length);
                    ghostTab.style.display = '';
                    ghost.style.display = '';
                } catch (_) {
                    ghost.style.display = 'none';
                }
            };

            /* ---------- Help echo fallback ---------- */
            // If the existing handler already prints "Available commands:",
            // we detect it and skip. Otherwise we print our own list.
            var printLine = function (type, text) {
                if (!body) return;
                try {
                    var line = document.createElement('div');
                    line.className = 'terminal-line terminal-line--' + type;
                    line.textContent = text;
                    body.appendChild(line);
                    body.scrollTop = body.scrollHeight;
                } catch (_) {}
            };

            /* ---------- Input state tracking ---------- */
            var syncRowState = function () {
                if (input.value && input.value.length > 0) {
                    inputRow.classList.add('has-value');
                } else {
                    inputRow.classList.remove('has-value');
                }
            };

            input.addEventListener('focus', function () {
                inputRow.classList.add('is-focused');
                stopCycle();
                setPlaceholder("type 'help' for options");
                if (hint && hint.classList) hint.classList.add('is-hidden');
            });

            input.addEventListener('blur', function () {
                inputRow.classList.remove('is-focused');
            });

            input.addEventListener('input', function () {
                stopCycle();
                syncRowState();
                updateGhost();
            });

            input.addEventListener('keydown', function (e) {
                if (e.key === 'Tab' && !e.shiftKey) {
                    var completion = findCompletion(input.value);
                    if (completion) {
                        e.preventDefault();
                        input.value = completion;
                        syncRowState();
                        updateGhost();
                    }
                    return;
                }
                if (e.key === 'Escape') {
                    ghost.style.display = 'none';
                }
            });

            form.addEventListener('submit', function () {
                var raw = (input.value || '').trim().toLowerCase();
                if (raw !== 'help') return;
                setTimeout(function () {
                    try {
                        if (!body) return;
                        var lastLines = body.querySelectorAll('.terminal-line');
                        var recent = lastLines[lastLines.length - 1];
                        var alreadyHandled = recent && /available commands/i.test(recent.textContent || '');
                        if (alreadyHandled) return;
                        printLine('system', 'Available commands:');
                        commands.forEach(function (c) {
                            printLine('muted', '  ' + c);
                        });
                    } catch (_) {}
                }, 30);
            });

            /* ---------- Auto-typer on first viewport entry ---------- */
            var typedAlready = false;
            var runAutoTyper = function () {
                if (typedAlready) return;
                typedAlready = true;
                if (prefersReduced) {
                    setPlaceholder("try: help");
                    return;
                }
                stopCycle();
                embed.classList.add('is-typing');
                var sample = 'help';
                var idx = 0;
                var typeStep = function () {
                    if (idx > sample.length) {
                        setTimeout(function () {
                            setPlaceholder(DEFAULT_PLACEHOLDER);
                            embed.classList.remove('is-typing');
                            embed.classList.add('is-typed');
                            stoppedCycle = false;
                            cycleIdx = 0;
                            cycleTimer = setTimeout(tickCycle, 1200);
                        }, 900);
                        return;
                    }
                    setPlaceholder('try: ' + sample.slice(0, idx));
                    idx++;
                    setTimeout(typeStep, 110 + Math.random() * 50);
                };
                typeStep();
            };

            if ('IntersectionObserver' in window) {
                try {
                    var io = new IntersectionObserver(function (entries) {
                        for (var i = 0; i < entries.length; i++) {
                            if (entries[i].isIntersecting) {
                                runAutoTyper();
                                io.disconnect();
                                break;
                            }
                        }
                    }, { threshold: 0.4 });
                    io.observe(embed);
                } catch (_) {
                    runAutoTyper();
                }
            } else {
                runAutoTyper();
            }

            syncRowState();

            window.__terminalEnhance = {
                commands: commands,
                stopCycle: stopCycle,
                cycle: tickCycle
            };
        } catch (err) {
            // Swallow: enhancement is non-critical
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run, { once: true });
    } else {
        run();
    }
})();
