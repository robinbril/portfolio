(function () {
    'use strict';

    function init() {
        var navbar = document.querySelector('.navbar');
        if (!navbar) return;

        var sectionIds = ['about', 'projects', 'experience', 'skills', 'contact'];
        var sections = sectionIds
            .map(function (id) { return document.getElementById(id); })
            .filter(Boolean);

        var linkMap = {};
        sectionIds.forEach(function (id) {
            var link = navbar.querySelector('a[href="#' + id + '"]');
            if (link) linkMap[id] = link;
        });

        var headerOffset = 80;

        function setCurrent(id) {
            Object.keys(linkMap).forEach(function (key) {
                linkMap[key].classList.toggle('is-current', key === id);
            });
        }

        if (sections.length && 'IntersectionObserver' in window) {
            var visible = new Map();
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        visible.set(entry.target.id, entry.intersectionRatio);
                    } else {
                        visible.delete(entry.target.id);
                    }
                });

                var best = null;
                var bestRatio = 0;
                visible.forEach(function (ratio, id) {
                    if (ratio > bestRatio) {
                        bestRatio = ratio;
                        best = id;
                    }
                });
                if (best) setCurrent(best);
            }, {
                rootMargin: '-' + headerOffset + 'px 0px -55% 0px',
                threshold: [0, 0.25, 0.5, 0.75, 1]
            });

            sections.forEach(function (s) { io.observe(s); });
        }

        var ticking = false;
        function onScroll() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                navbar.classList.toggle('scrolled', window.scrollY > 40);
                ticking = false;
            });
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        navbar.addEventListener('click', function (e) {
            var link = e.target.closest('a[href^="#"]');
            if (!link || !navbar.contains(link)) return;
            var href = link.getAttribute('href');
            if (!href || href.length < 2) return;

            var target = document.getElementById(href.slice(1));
            if (!target) return;

            e.preventDefault();
            var rect = target.getBoundingClientRect();
            var y = window.scrollY + rect.top - headerOffset + 1;
            window.scrollTo({ top: y, behavior: 'smooth' });
        });

        var menuBtn = navbar.querySelector('.mobile-menu-btn');
        var navLinks = navbar.querySelector('.nav-links');
        if (menuBtn && navLinks) {
            menuBtn.addEventListener('click', function () {
                var open = navLinks.classList.toggle('is-open');
                menuBtn.classList.toggle('is-open', open);
                menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
