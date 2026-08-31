/* =========================================================================
   19-typing-heading.js — smooth one-shot typewriter for the "Mijn Projecten"
   heading. Types the current text char-by-char when it scrolls into view,
   holds the caret solid while typing, then resumes the soft blink.
   ========================================================================= */
(() => {
    const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const heading = document.querySelector('.typing-heading');
    if (!heading || reduce) return;
    const textEl = heading.querySelector('.typing-text');
    if (!textEl) return;

    let done = false;
    const type = () => {
        if (done) return;
        const full = (textEl.textContent || '').trim();
        if (!full) return;
        done = true;
        heading.classList.add('is-typing');
        textEl.textContent = '';
        let i = 0;
        const step = () => {
            i++;
            textEl.textContent = full.slice(0, i);
            if (i < full.length) {
                setTimeout(step, 42 + Math.random() * 34); // gentle human cadence
            } else {
                heading.classList.remove('is-typing');
            }
        };
        setTimeout(step, 140);
    };

    const io = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) { type(); io.disconnect(); }
    }, { threshold: 0.6 });
    io.observe(heading);
})();
