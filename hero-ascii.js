/* =========================================================
   HERO ASCII — ambient hexdump-spiral background
   Vanilla, no deps. Monochrome hex glyphs revealing a warped
   ring/spiral field. Mouse-reactive swirl, shimmer, reduced-
   motion aware, paused off-screen and during warp mode.
   ========================================================= */
(() => {
    const canvas = document.getElementById('hero-ascii');
    const hero = document.getElementById('home');
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

    // --- tuning: calm, legible backdrop (ambient, not the artifact's punch)
    const CELL = 10;                 // css px per glyph cell
    const CHARS = '0123456789abcdef';
    const RING_FREQ = 12;
    const SPIRAL = 2.2;
    const WARP = 0.55;
    const CONTRAST = 1.5;
    const SHIMMER = 0.36;
    const SWIRL_STRENGTH = 0.9;
    const SWIRL_RADIUS = 0.42;
    const SPEED = 0.62;              // slow drift

    let W = 0, H = 0, cols = 0, rows = 0, q = 1;
    let atlas = null, glyphW = 0;
    const mouse = { x: -1e5, y: -1e5, active: false };

    function buildAtlas() {
        const s = Math.round(CELL * q);
        atlas = document.createElement('canvas');
        atlas.width = s * CHARS.length;
        atlas.height = s;
        const a = atlas.getContext('2d');
        a.clearRect(0, 0, atlas.width, atlas.height);
        a.fillStyle = '#ffffff';
        a.textAlign = 'center';
        a.textBaseline = 'middle';
        a.font = `600 ${Math.round(CELL * q * 0.88)}px "JetBrains Mono",ui-monospace,monospace`;
        for (let i = 0; i < CHARS.length; i++) {
            a.fillText(CHARS[i], s * i + s / 2, s / 2 + q * 0.5);
        }
        glyphW = s;
    }

    function resize() {
        const r = hero.getBoundingClientRect();
        q = Math.min(1.25, window.devicePixelRatio || 1);
        W = Math.max(1, Math.floor(r.width * q));
        H = Math.max(1, Math.floor(r.height * q));
        canvas.width = W;
        canvas.height = H;
        canvas.style.width = r.width + 'px';
        canvas.style.height = r.height + 'px';
        cols = Math.ceil(W / (CELL * q));
        rows = Math.ceil(H / (CELL * q));
        buildAtlas();
        if (reduce) draw(0);
    }

    // warped ring/spiral field, value in 0..1
    function field(nx, ny, t) {
        let x = nx, y = ny;
        if (mouse.active) {
            const mx = (mouse.x / (W / q) * 2 - 1) * ((W / q) / (H / q));
            const my = (mouse.y / (H / q) * 2 - 1);
            const dx = x - mx, dy = y - my;
            const f = Math.exp(-(dx * dx + dy * dy) / (2 * SWIRL_RADIUS * SWIRL_RADIUS));
            const ang = f * SWIRL_STRENGTH * 3.0;
            const s = Math.sin(ang), c = Math.cos(ang);
            x = mx + dx * c - dy * s;
            y = my + dx * s + dy * c;
        }
        const wx = x + WARP * Math.sin(y * 2.2 + t * 0.6);
        const wy = y + WARP * Math.cos(x * 2.2 - t * 0.5);
        const r = Math.hypot(wx, wy);
        const a = Math.atan2(wy, wx);
        let v = Math.sin(r * RING_FREQ - t * SPEED + SPIRAL * a
            + WARP * 1.1 * Math.sin(a * 3 + t * 0.7));
        v += 0.28 * Math.sin(r * RING_FREQ * 1.9 - t * SPEED * 0.5 - SPIRAL * a);
        return 0.5 + 0.5 * v / 1.28;
    }

    function draw(now) {
        const t = now * 0.001;
        ctx.clearRect(0, 0, W, H);
        const aspect = W / H;
        const cellPx = CELL * q;
        const cx = 0.5, cy = 0.46;                     // vignette centre (slightly high)

        for (let gy = 0; gy < rows; gy++) {
            const uy = (gy + 0.5) / rows;
            const ny = uy * 2 - 1;
            for (let gx = 0; gx < cols; gx++) {
                const ux = (gx + 0.5) / cols;
                const nx = (ux * 2 - 1) * aspect;

                let lum = field(nx, ny, t) * 0.92;
                // shimmer wave across the grid
                lum *= 1 + SHIMMER * Math.sin((gx * 0.15 + gy * 0.05) - t * 1.5);
                // contrast
                lum = (lum - 0.5) * CONTRAST + 0.5;
                // radial vignette so edges melt into the hero ground
                const dv = Math.hypot(ux - cx, uy - cy);
                const vig = Math.max(0, 1 - dv * 1.12);
                lum *= vig;
                if (lum <= 0.06) continue;
                if (lum > 1) lum = 1;

                const ci = Math.min(CHARS.length - 1, (lum * CHARS.length) | 0);
                // cool near-white ink; more present now, text kept legible by the scrim
                ctx.globalAlpha = Math.min(0.78, 0.08 + lum * 0.74);
                ctx.drawImage(atlas, glyphW * ci, 0, glyphW, atlas.height,
                    gx * cellPx, gy * cellPx, cellPx, cellPx);
            }
        }
        ctx.globalAlpha = 1;

        // very faint mint wash tying it to the site accent
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = 'rgba(46,242,160,0.035)';
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'source-over';
    }

    // --- lifecycle: run only while hero is visible and not in warp -------
    let raf = null, running = false;
    function loop(ts) { if (!running) return; draw(ts); raf = requestAnimationFrame(loop); }
    function start() {
        if (running || reduce) return;
        if (document.body.classList.contains('xray')) return;
        running = true;
        raf = requestAnimationFrame(loop);
    }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

    let onScreen = true;
    const io = new IntersectionObserver((es) => {
        onScreen = es[0].isIntersecting;
        onScreen ? start() : stop();
    }, { threshold: 0.02 });
    io.observe(hero);

    // pause during warp (SPACE) — body.xray toggles it
    const bodyObs = new MutationObserver(() => {
        if (document.body.classList.contains('xray')) stop();
        else if (onScreen) start();
    });
    bodyObs.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    window.addEventListener('resize', () => { resize(); }, { passive: true });
    hero.addEventListener('pointermove', (e) => {
        const r = hero.getBoundingClientRect();
        mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { mouse.active = false; });

    resize();
    hero.classList.add('ascii-on');
    if (!reduce) start();
})();
