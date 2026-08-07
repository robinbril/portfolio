/* =============================================================
   15 - Footer / CTA script additions
   - Scroll-to-top toggle + smooth scroll
   - Optional GitHub repos rendering when [data-github-repos] exists
   IIFE, idempotent, no-throw.
   ============================================================= */

(function () {
    'use strict';

    if (window.__rb_footerCtaInit) return;
    window.__rb_footerCtaInit = true;

    function safe(fn) {
        try { fn(); } catch (e) { /* swallow */ }
    }

    /* ---------- Scroll-to-top ---------- */

    function initScrollToTop() {
        var btn = document.querySelector('.scroll-to-top');
        if (!btn) return;

        var threshold = 600;
        var ticking = false;

        function update() {
            var y = window.scrollY || window.pageYOffset || 0;
            btn.classList.toggle('is-visible', y > threshold);
            ticking = false;
        }

        function onScroll() {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(update);
        }

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        });

        window.addEventListener('scroll', onScroll, { passive: true });
        update();
    }

    /* ---------- GitHub repos ---------- */

    function escapeHtml(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function renderRepos(container, repos) {
        if (!repos || !repos.length) {
            container.innerHTML = '<div class="gh-repos__empty">Geen publieke repos beschikbaar.</div>';
            return;
        }

        var html = repos.map(function (repo) {
            var name = escapeHtml(repo.name || '');
            var url = escapeHtml(repo.html_url || '#');
            var desc = escapeHtml(repo.description || 'Geen omschrijving.');
            var stars = typeof repo.stargazers_count === 'number' ? repo.stargazers_count : 0;
            return '' +
                '<a class="gh-repo" href="' + url + '" target="_blank" rel="noopener noreferrer">' +
                '  <div class="gh-repo__head">' +
                '    <span class="gh-repo__name">' + name + '</span>' +
                '    <span class="gh-repo__stars"><i data-lucide="star"></i>' + stars + '</span>' +
                '  </div>' +
                '  <p class="gh-repo__desc">' + desc + '</p>' +
                '</a>';
        }).join('');

        container.innerHTML = html;

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            safe(function () { window.lucide.createIcons(); });
        }
    }

    function hideContainer(container) {
        if (!container) return;
        container.style.display = 'none';
    }

    function initGithubRepos() {
        var container = document.querySelector('[data-github-repos]');
        if (!container) return;

        var user = container.getAttribute('data-github-repos') || 'robinbril';
        var url = 'https://api.github.com/users/' +
            encodeURIComponent(user) +
            '/repos?sort=updated&per_page=3';

        if (typeof fetch !== 'function') {
            hideContainer(container);
            return;
        }

        fetch(url, { headers: { 'Accept': 'application/vnd.github+json' } })
            .then(function (res) {
                if (!res || !res.ok) throw new Error('gh-api-' + (res && res.status));
                return res.json();
            })
            .then(function (data) {
                if (!Array.isArray(data)) { hideContainer(container); return; }
                var repos = data.filter(function (r) { return r && !r.fork; }).slice(0, 3);
                renderRepos(container, repos);
            })
            .catch(function () {
                hideContainer(container);
            });
    }

    function init() {
        safe(initScrollToTop);
        safe(initGithubRepos);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
