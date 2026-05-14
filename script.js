// ==========================================
// PRELOADER ANIMATION
// ==========================================
function startPreloader() {
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');

    if (!preloader) return;

    // If already faded out, don't restart
    if (preloader.classList.contains('fade-out')) return;

    let progress = 0;
    const duration = 1360; // 1.36 seconds (15% faster)
    const intervalTime = 20;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const removePreloader = () => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.remove();
        }, 600);
    };

    const interval = setInterval(() => {
        progress += increment;

        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);

            if (progressBar) progressBar.style.width = '100%';
            if (progressPercentage) progressPercentage.textContent = '100%';

            setTimeout(removePreloader, 200);
        } else {
            if (progressBar) progressBar.style.width = `${progress}%`;
            if (progressPercentage) progressPercentage.textContent = `${Math.floor(progress)}%`;
        }
    }, intervalTime);

    // Safety fallback
    setTimeout(() => {
        if (document.body.contains(preloader)) {
            clearInterval(interval);
            removePreloader();
        }
    }, duration + 5000);
}

// Start immediately if DOM is ready, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startPreloader);
} else {
    startPreloader();
}

// ==========================================
// CURSOR GLOW EFFECT
// ==========================================
const cursorGlow = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {
    if (!cursorGlow) return;

    const x = e.clientX;
    const y = e.clientY;

    cursorGlow.style.left = x + 'px';
    cursorGlow.style.top = y + 'px';
});

// ==========================================
// BUTTON HOVER SOUNDS
// ==========================================
let audioContext;

function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    return audioContext;
}

function playHoverSound() {
    const context = getAudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.value = 500;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.08, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.1);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.1);
}

const interactiveElements = document.querySelectorAll(`
    .btn-primary,
    .btn-secondary,
    .project-card,
    .nav-links a:not(.btn-primary),
    .theme-toggle-btn,
    .stat-pill,
    .glow-card
`);

interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        playHoverSound();
    });
});

// ==========================================
// EMAIL REVEAL TOGGLE
// ==========================================
const contactFormTrigger = document.querySelector('.contact-form-trigger');
const emailReveal = document.getElementById('email-reveal');

if (contactFormTrigger && emailReveal) {
    contactFormTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        emailReveal.classList.toggle('hidden');
        playHoverSound();
    });
}

// ==========================================
// THEME TOGGLE
// ==========================================
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference or default to dark.
const savedTheme = localStorage.getItem('theme') || 'dark-theme';
body.classList.remove('light-theme', 'dark-theme');
body.classList.add(savedTheme);

themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        localStorage.setItem('theme', 'light-theme');
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark-theme');
    }
    // Re-create icons after theme change
    lucide.createIcons();
});

// ==========================================
// MOBILE MENU TOGGLE
// ==========================================
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('is-open');
        mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when any link is tapped
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('is-open');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

// ==========================================
// SCROLL SPY FOR ACTIVE NAV LINK
// ==========================================
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

const observerOptions = {
    root: null,
    rootMargin: '-80px 0px -80% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navItems.forEach(item => {
                if (item.classList.contains('btn-primary')) return;
                item.style.color = '';
                item.classList.remove('is-active');
                if (item.getAttribute('href') === `#${id}`) {
                    item.classList.add('is-active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Scroll fade-in animation disabled — caused text to appear to jump on scroll/filter.

// ==========================================
// SMOOTH SCROLL WITH OFFSET FOR NAV
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navHeight = 80;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (window.innerWidth <= 768 && navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });
});

// ==========================================
// AI PORTFOLIO FILTER FUNCTIONALITY
// ==========================================
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.ai-project-card');

if (filterButtons.length > 0 && projectCards.length > 0) {
    const projectsGrid = document.querySelector('.ai-projects-grid');
    const showMoreBtn = document.getElementById('showMoreProjects');
    const VISIBLE_LIMIT = 6;
    let currentFilter = 'agents';
    let isExpanded = false;

    const applyFilter = () => {
        const matches = [];
        projectCards.forEach((card) => {
            const categories = (card.getAttribute('data-category') || '').split(' ');
            if (categories.includes(currentFilter)) {
                matches.push(card);
                card.style.display = '';
                card.classList.remove('hidden');
            } else {
                card.style.display = 'none';
                card.classList.add('hidden');
            }
        });

        if (!isExpanded) {
            matches.forEach((card, i) => {
                if (i >= VISIBLE_LIMIT) {
                    card.style.display = 'none';
                    card.classList.add('hidden');
                }
            });
        }

        if (showMoreBtn) {
            if (matches.length > VISIBLE_LIMIT) {
                showMoreBtn.style.display = 'flex';
                const btnText = showMoreBtn.querySelector('span');
                if (btnText) {
                    btnText.textContent = isExpanded
                        ? 'Toon minder'
                        : `Toon alle ${matches.length}`;
                }
                showMoreBtn.classList.toggle('expanded', isExpanded);
            } else {
                showMoreBtn.style.display = 'none';
            }
        }
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = filter;
            isExpanded = false;
            applyFilter();
            playHoverSound();
        });
    });

    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            applyFilter();
        });
    }

    applyFilter();
}

// ==========================================
// AI CONTACT MODAL
// ==========================================
function initContactModal() {
    const modal = document.getElementById('contact-modal');
    const closeBtn = modal?.querySelector('.modal-close');
    const form = document.getElementById('ai-contact-form');
    const formContainer = modal?.querySelector('.ai-form');
    const successMessage = modal?.querySelector('.form-success');
    const whatsappWidget = document.querySelector('.whatsapp-widget');

    if (!modal) return;

    // Open modal function
    window.openContactModal = function () {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Reinitialize lucide icons for modal
        setTimeout(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }, 100);
    };

    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';

        // Reset form after closing
        setTimeout(() => {
            if (formContainer) formContainer.classList.remove('hidden');
            if (successMessage) successMessage.classList.add('hidden');
            if (form) form.reset();
        }, 300);
    }

    // Close on button click
    closeBtn?.addEventListener('click', closeModal);

    // Close on overlay click
    modal.querySelector('.modal-overlay')?.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // WhatsApp button now goes directly to WhatsApp (no modal override)

    // Form submission
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('.submit-btn');
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                message: formData.get('message') || 'Geen bericht opgegeven'
            };

            // Add loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Simulate API call (replace with actual endpoint)
            try {
                // Mock delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Log to console (in production, send to server)
                console.log('Form submitted:', data);

                // Show success message
                if (formContainer) {
                    formContainer.style.display = 'none';
                }
                if (successMessage) {
                    successMessage.classList.remove('hidden');
                }

                // Reinitialize icons
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }

                // Auto close after 3 seconds
                setTimeout(() => {
                    closeModal();
                }, 3000);

            } catch (error) {
                console.error('Submission error:', error);
                alert('Er ging iets mis. Probeer het opnieuw of app Robin direct.');
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }
}

// ==========================================
// NEURAL NETWORK BACKGROUND ANIMATION
// ==========================================
function initNeuralNetwork() {
    const canvas = document.getElementById('neural-network');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrame;

    // Set canvas size
    function resizeCanvas() {
        const hero = document.querySelector('.hero');
        if (hero) {
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }
    }

    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            const isDarkTheme = !document.body.classList.contains('light-theme');
            const particleColor = isDarkTheme
                ? 'rgba(0, 255, 157, 0.6)'
                : 'rgba(220, 38, 38, 0.4)';

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.fill();
        }
    }

    // Initialize particles
    function initParticles() {
        particles = [];
        const particleCount = Math.min(Math.floor(canvas.width / 15), 100);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Draw connections
    function drawConnections() {
        const isDarkTheme = !document.body.classList.contains('light-theme');
        const maxDistance = 150;

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    const lineColor = isDarkTheme
                        ? `rgba(0, 255, 157, ${opacity})`
                        : `rgba(220, 38, 38, ${opacity})`;

                    ctx.beginPath();
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        drawConnections();

        animationFrame = requestAnimationFrame(animate);
    }

    // Start animation
    initParticles();
    animate();

    // Stop animation on page unload
    window.addEventListener('beforeunload', () => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initContactModal();
    initShowMoreToggle();
});

// Show-more toggle is now handled inside the filter block above.

// ==========================================
// WARP MODE — hold SPACE to engage hyperspace
// ==========================================
(() => {
    const canvas = document.getElementById('warp-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let warpActive = false;
    let raf = null;
    let scanTimer = null;
    let stars = [];
    let speed = 8;
    let dpr = Math.max(1, window.devicePixelRatio || 1);
    const hudVel = document.getElementById('hud-velocity');
    const hudStatus = document.getElementById('hud-status');

    const STAR_COUNT = 1100;
    const Z_FAR = 2000;
    const FOCAL = 340;

    let mouseX = 0;
    let mouseY = 0;
    let pulsePhase = 0;

    const resize = () => {
        dpr = Math.max(1, window.devicePixelRatio || 1);
        canvas.width = Math.floor(window.innerWidth * dpr);
        canvas.height = Math.floor(window.innerHeight * dpr);
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
    };
    resize();
    window.addEventListener('resize', resize);

    const seedStars = () => {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: (Math.random() - 0.5) * 2600,
                y: (Math.random() - 0.5) * 2600,
                z: Math.random() * Z_FAR,
                pz: 0,
                tint: Math.random(),
                size: 0.5 + Math.random() * 1.6,
                layer: Math.random(),
            });
        }
    };

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    const tick = (ts) => {
        if (!warpActive) return;
        const w = canvas.width;
        const h = canvas.height;
        const focal = FOCAL * dpr;

        const parallaxX = mouseX * 18 * dpr;
        const parallaxY = mouseY * 14 * dpr;
        const cx = w / 2 + parallaxX;
        const cy = h * 0.46 + parallaxY;

        ctx.fillStyle = 'rgba(7, 17, 31, 0.14)';
        ctx.fillRect(0, 0, w, h);

        const intensity = Math.min(1, (speed - 8) / 34);
        pulsePhase += 0.018;
        const pulse = 0.5 + 0.5 * Math.sin(pulsePhase * 2.1);
        const coreStr = intensity * (0.85 + pulse * 0.15);

        // Cover viewport diagonal + boost mid-stops so no dark "rectangle"
        // emerges in the mid-band between bright center and edge star-streaks.
        const coreR = Math.hypot(w, h) * 0.72;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
        grad.addColorStop(0, `rgba(255, 255, 255, ${0.18 + coreStr * 0.32})`);
        grad.addColorStop(0.08, `rgba(232, 255, 246, ${0.16 + coreStr * 0.26})`);
        grad.addColorStop(0.25, `rgba(180, 220, 230, ${0.14 + coreStr * 0.2})`);
        grad.addColorStop(0.5, `rgba(140, 180, 210, ${0.1 + coreStr * 0.14})`);
        grad.addColorStop(0.8, `rgba(120, 160, 200, ${0.06 + coreStr * 0.08})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Continuous bright center burst (intensifies with speed)
        const burstStr = Math.min(1, (speed - 8) / 32);
        const burstR = (50 + burstStr * 120) * dpr * (0.9 + pulse * 0.15);
        const burst = ctx.createRadialGradient(cx, cy, 0, cx, cy, burstR);
        burst.addColorStop(0, `rgba(255, 255, 255, ${0.3 + burstStr * 0.5})`);
        burst.addColorStop(0.25, `rgba(232, 255, 246, ${0.12 + burstStr * 0.3})`);
        burst.addColorStop(0.6, `rgba(46, 242, 160, ${burstStr * 0.18})`);
        burst.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = burst;
        ctx.fillRect(0, 0, w, h);

        ctx.lineCap = 'round';

        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];
            s.pz = s.z;
            s.z -= speed;

            if (s.z < 1) {
                s.x = (Math.random() - 0.5) * 2600;
                s.y = (Math.random() - 0.5) * 2600;
                s.z = Z_FAR;
                s.pz = Z_FAR;
                continue;
            }

            const sx = (s.x / s.z) * focal + cx;
            const sy = (s.y / s.z) * focal + cy;
            const psx = (s.x / s.pz) * focal + cx;
            const psy = (s.y / s.pz) * focal + cy;

            const t = 1 - s.z / Z_FAR;
            const farFade = s.layer < 0.3 ? 0.55 : 1;
            const alpha = Math.min(1, (t * 1.8 + 0.1) * farFade);
            const lw = (t * 2.6 + 0.3) * s.size * dpr * farFade;

            // Distribution: mostly white-ish with subtle accent stars
            if (s.tint < 0.84) {
                ctx.strokeStyle = `rgba(232, 240, 250, ${alpha})`;
            } else if (s.tint < 0.92) {
                ctx.strokeStyle = `rgba(180, 210, 235, ${alpha * 0.95})`;
            } else if (s.tint < 0.97) {
                ctx.strokeStyle = `rgba(120, 200, 180, ${alpha * 0.85})`;
            } else {
                ctx.strokeStyle = `rgba(138, 124, 255, ${alpha * 0.85})`;
            }
            ctx.lineWidth = lw;

            ctx.beginPath();
            ctx.moveTo(psx, psy);
            ctx.lineTo(sx, sy);
            ctx.stroke();

            if (t > 0.6) {
                ctx.fillStyle = ctx.strokeStyle;
                ctx.beginPath();
                ctx.arc(sx, sy, lw * 0.65, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        speed = Math.min(42, speed + 0.85);

        if (hudVel) {
            const c = ((speed - 8) / 34) * 0.92 + 0.02;
            hudVel.textContent = c.toFixed(2) + ' c';
        }
        if (hudStatus) {
            if (speed < 14) hudStatus.textContent = 'SPOOLING DRIVE...';
            else if (speed < 24) hudStatus.textContent = 'ACCELERATION NOMINAL';
            else if (speed < 36) hudStatus.textContent = 'BREAKING ATMOSPHERE';
            else hudStatus.textContent = 'WARP STABLE — TRAJECTORY LOCKED';
        }

        raf = requestAnimationFrame(tick);
    };

    const isTypingTarget = (el) => {
        if (!el) return false;
        const tag = el.tagName;
        return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
    };

    const isSpace = (e) => e.code === 'Space' || e.key === ' ' || e.keyCode === 32;

    const NAV_HEIGHT = 80;
    const DESTINATIONS = [
        { id: 'about',      label: 'OVER MIJ' },
        { id: 'projects',   label: 'PROJECTEN' },
        { id: 'experience', label: 'ERVARING' },
        { id: 'skills',     label: 'SKILLS' },
        { id: 'contact',    label: 'CONTACT' }
    ];
    let cycleTimer = null;
    let destIdx = 0;
    const bigEl = () => document.getElementById('hud-big-destination');

    const paintDest = (label) => {
        const b = bigEl();
        if (!b) return;
        b.textContent = label;
        b.style.opacity = '0.95';
    };

    const scrollToSection = (id) => {
        const target = document.getElementById(id);
        if (!target) return;
        const y = target.getBoundingClientRect().top + window.pageYOffset - NAV_HEIGHT - 16;
        window.scrollTo({ top: y, behavior: 'smooth' });
    };

    const activate = () => {
        if (warpActive) return;
        warpActive = true;
        document.body.classList.add('xray');

        speed = 8;
        seedStars();
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);

        destIdx = 0;
        paintDest(DESTINATIONS[0].label);
        clearInterval(cycleTimer);
        cycleTimer = setInterval(() => {
            destIdx = (destIdx + 1) % DESTINATIONS.length;
            const b = bigEl();
            if (b) {
                b.style.opacity = '0';
                setTimeout(() => paintDest(DESTINATIONS[destIdx].label), 160);
            }
        }, 900);
    };

    const deactivate = () => {
        if (!warpActive) return;
        warpActive = false;
        clearInterval(cycleTimer);
        cycleTimer = null;

        const dest = DESTINATIONS[destIdx];
        const b = bigEl();
        if (b) b.style.opacity = '0';

        document.body.classList.remove('xray');
        cancelAnimationFrame(raf);

        if (hudStatus) hudStatus.textContent = 'ARRIVAL: ' + dest.label;
        scrollToSection(dest.id);

        // Quick black fade so the canvas exits cleanly
        let n = 0;
        const decay = () => {
            n++;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            if (n < 6) requestAnimationFrame(decay);
            else ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
        decay();
    };

    document.addEventListener('keydown', (e) => {
        if (!isSpace(e)) return;
        if (isTypingTarget(e.target)) return;
        e.preventDefault();
        if (e.repeat) return;
        activate();
    });

    document.addEventListener('keyup', (e) => {
        if (!isSpace(e)) return;
        deactivate();
    });

    window.addEventListener('blur', deactivate);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) deactivate();
    });
    document.addEventListener('mouseleave', deactivate);
})();

// ==========================================
// TERMINAL AI INTERFACE (embedded in contact)
// ==========================================
(() => {
    const embed = document.getElementById('terminal-embed');
    const body = document.getElementById('terminal-body');
    const form = document.getElementById('terminal-form');
    const input = document.getElementById('terminal-input');
    const chips = document.querySelectorAll('.terminal-chip');

    if (!embed || !body || !form || !input) return;

    const escape = (s) => s.replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    const print = (type, text, href) => {
        const line = document.createElement('div');
        line.className = `terminal-line terminal-line--${type}`;
        if (type === 'link' && href) {
            line.innerHTML = `<a href="${escape(href)}" target="_blank" rel="noopener noreferrer">${escape(text)}</a>`;
        } else {
            line.textContent = text;
        }
        body.appendChild(line);
        body.scrollTop = body.scrollHeight;
    };

    let typingTimer = null;
    const typePrint = (type, text, done) => {
        const line = document.createElement('div');
        line.className = `terminal-line terminal-line--${type}`;
        body.appendChild(line);
        let i = 0;
        clearInterval(typingTimer);
        typingTimer = setInterval(() => {
            line.textContent = text.slice(0, ++i);
            body.scrollTop = body.scrollHeight;
            if (i >= text.length) {
                clearInterval(typingTimer);
                if (done) done();
            }
        }, 12);
    };

    const commands = {
        help: () => {
            print('system', 'Available commands:');
            print('muted', '  linkedin  →  open LinkedIn profiel');
            print('muted', '  whatsapp  →  open WhatsApp chat');
            print('muted', '  email     →  toon email-adres');
            print('muted', '  call      →  plan een call (email)');
            print('muted', '  about     →  korte bio');
            print('muted', '  stack     →  tech stack');
            print('muted', '  clear     →  wis terminal');
        },
        linkedin: () => {
            print('system', 'Opening LinkedIn...');
            const url = 'https://www.linkedin.com/in/robin-bril/';
            print('link', '→ ' + url, url);
            window.open(url, '_blank', 'noopener,noreferrer');
        },
        whatsapp: () => {
            print('system', 'Opening WhatsApp chat...');
            const url = 'https://wa.me/31640446732';
            print('link', '→ ' + url, url);
            window.open(url, '_blank', 'noopener,noreferrer');
        },
        call: () => {
            print('system', 'Stuur een mail dan plannen we een call in.');
            const url = 'mailto:robin.bril@gmail.com?subject=Call%20plannen&body=Hi%20Robin%2C%0A%0AIk%20wil%20graag%20een%20call%20plannen.%0A%0AGroet%2C';
            print('link', '→ Plan call via robin.bril@gmail.com', url);
            window.location.href = url;
        },
        email: () => {
            print('system', 'Email: robin.bril@gmail.com');
            print('link', '→ mailto:robin.bril@gmail.com', 'mailto:robin.bril@gmail.com');
        },
        about: () => {
            print('system', 'Robin Bril — AI Engineer, Amsterdam.');
            print('system', 'Bouwt AI-systemen die zelfstandig taken uitvoeren binnen bedrijven.');
            print('system', '7+ productie-agents, 14+ MCP-servers, open-source claude-harness.');
        },
        stack: () => {
            print('system', 'Stack: Python, C#/.NET, TypeScript, Rust, SvelteKit,');
            print('system', '       Kubernetes (AKS), Azure, MCP, Claude/OpenAI, RAG, RBAC.');
        },
        clear: () => {
            body.innerHTML = '';
            boot();
        }
    };

    const run = (raw) => {
        const cmd = raw.trim().toLowerCase();
        if (!cmd) return;
        print('user', raw);
        const fn = commands[cmd];
        if (fn) {
            fn();
        } else {
            print('error', `command not found: ${cmd}`);
            print('muted', 'type "help" voor beschikbare commando\'s');
        }
    };

    let booted = false;
    const boot = () => {
        if (booted) return;
        booted = true;
        typePrint('system', 'Robin Bril AI Protocol initialized...', () => {
            typePrint('system', 'Ready for inquiries. Available: AI engineering, agentic systems, enterprise AI.', () => {
                typePrint('system', 'Klik een chip hieronder of typ "help" voor alle commando\'s.');
            });
        });
    };

    // Boot when terminal scrolls into view
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    boot();
                    io.disconnect();
                }
            });
        }, { threshold: 0.2 });
        io.observe(embed);
    } else {
        boot();
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const v = input.value;
        input.value = '';
        run(v);
    });

    // Chip click: pulse the chip, autotype command into chat (~500ms), then execute
    let chipBusy = false;
    chips.forEach((chip) => {
        chip.addEventListener('click', () => {
            if (chipBusy) return;
            const cmd = chip.getAttribute('data-cmd');
            if (!cmd) return;
            chipBusy = true;

            // Pulse the chip
            chip.classList.remove('terminal-chip--press');
            void chip.offsetWidth;
            chip.classList.add('terminal-chip--press');

            // Animate typing into a user line inside the chat
            const line = document.createElement('div');
            line.className = 'terminal-line terminal-line--user terminal-line--typing';
            body.appendChild(line);
            body.scrollTop = body.scrollHeight;

            const totalMs = 1000;
            const stepMs = Math.max(40, Math.floor(totalMs / cmd.length));
            let i = 0;
            const typer = setInterval(() => {
                line.textContent = cmd.slice(0, ++i);
                body.scrollTop = body.scrollHeight;
                if (i >= cmd.length) {
                    clearInterval(typer);
                    line.classList.remove('terminal-line--typing');
                    // Hold a beat so the typed word is readable, then execute
                    setTimeout(() => {
                        const fn = commands[cmd];
                        if (fn) fn();
                        else print('error', `command not found: ${cmd}`);
                        chipBusy = false;
                    }, 250);
                }
            }, stepMs);
        });
    });
})();

// ==========================================
// SCROLL REVEAL — premium fade-in on scroll
// Respects prefers-reduced-motion
// ==========================================
(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const targets = [
        '.section-header',
        '.about-content > *',
        '.featured-project',
        '.ai-project-card',
        '.timeline-item',
        '.cert-item',
        '.stat-item',
        '.skill-category',
        '.testimonial-compact',
        '.contact-card',
        '.contact-terminal-wrap'
    ];

    const elements = document.querySelectorAll(targets.join(', '));
    if (!elements.length) return;

    // Tag each element with reveal class + stagger index within its parent grid
    const gridMap = new Map();
    elements.forEach((el) => {
        el.classList.add('reveal');
        const grid = el.parentElement;
        if (!grid) return;
        const key = grid;
        if (!gridMap.has(key)) gridMap.set(key, 0);
        const idx = gridMap.get(key);
        el.style.setProperty('--reveal-index', String(idx));
        gridMap.set(key, idx + 1);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    });

    elements.forEach((el) => observer.observe(el));
})();

// ==========================================
// STAT COUNTER ANIMATION — count up on first view
// ==========================================
(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stats = document.querySelectorAll('.stat-number[data-count]');
    if (!stats.length) return;

    const animate = (el) => {
        const target = parseInt(el.dataset.count, 10) || 0;
        const suffix = el.dataset.suffix || '';
        if (prefersReduced) {
            el.textContent = target + suffix;
            return;
        }
        const duration = 1400;
        const start = performance.now();
        const ease = (t) => 1 - Math.pow(1 - t, 3);

        const step = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const value = Math.round(target * ease(t));
            el.textContent = value + (t === 1 ? suffix : '');
            if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animate(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    stats.forEach((el) => observer.observe(el));
})();


// ==========================================
// TERMINAL AUTOPROMPT — types example commands in the placeholder
// to teach discoverability. Stops once user interacts.
// ==========================================
(() => {
    const input = document.getElementById('terminal-input');
    if (!input) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const examples = ['help', 'linkedin', 'whatsapp', 'book call', 'email'];
    let exampleIdx = 0;
    let charIdx = 0;
    let phase = 'typing'; // typing | hold | erasing
    let stopped = false;
    let timer = null;

    const stop = () => {
        stopped = true;
        clearTimeout(timer);
        input.placeholder = 'Enter command...';
    };

    input.addEventListener('focus', stop, { once: true });
    input.addEventListener('input', stop, { once: true });

    let observerStarted = false;
    const startTyping = () => {
        if (observerStarted || stopped) return;
        observerStarted = true;

        const step = () => {
            if (stopped) return;
            const word = examples[exampleIdx];
            if (phase === 'typing') {
                charIdx++;
                input.placeholder = 'try: ' + word.slice(0, charIdx);
                if (charIdx >= word.length) {
                    phase = 'hold';
                    timer = setTimeout(step, 1400);
                    return;
                }
                timer = setTimeout(step, 90 + Math.random() * 40);
            } else if (phase === 'hold') {
                phase = 'erasing';
                timer = setTimeout(step, 60);
            } else {
                charIdx--;
                input.placeholder = 'try: ' + word.slice(0, Math.max(0, charIdx));
                if (charIdx <= 0) {
                    exampleIdx = (exampleIdx + 1) % examples.length;
                    phase = 'typing';
                    timer = setTimeout(step, 500);
                    return;
                }
                timer = setTimeout(step, 35);
            }
        };
        timer = setTimeout(step, 800);
    };

    // Start when the terminal section enters viewport
    const wrap = input.closest('.contact-terminal-wrap') || input.closest('.terminal-window');
    if (wrap && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    startTyping();
                    io.disconnect();
                }
            });
        }, { threshold: 0.4 });
        io.observe(wrap);
    } else {
        startTyping();
    }
})();
