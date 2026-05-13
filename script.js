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

mobileMenuBtn.addEventListener('click', () => {
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);

    if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '80px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'var(--nav-bg)';
        navLinks.style.padding = '2rem';
        navLinks.style.borderBottom = '1px solid var(--border-color)';
        navLinks.style.backdropFilter = 'blur(20px)';
    }
});

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
                // Reset all nav items
                if (!item.classList.contains('btn-primary')) {
                    item.style.color = 'var(--text-secondary)';
                }
                // Highlight active section
                if (item.getAttribute('href') === `#${id}` && !item.classList.contains('btn-primary')) {
                    item.style.color = 'var(--text-primary)';
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// ==========================================
// FADE-IN ANIMATION ON SCROLL
// ==========================================
const fadeElements = document.querySelectorAll('.glow-card, .project-card, .timeline-item, .stat-item, .cert-item');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(el);
});

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
// X-RAY MODE — hold SPACE to reveal layout
// ==========================================
(() => {
    let xrayActive = false;

    const isTypingTarget = (el) => {
        if (!el) return false;
        const tag = el.tagName;
        return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
    };

    document.addEventListener('keydown', (e) => {
        if (e.code !== 'Space') return;
        if (isTypingTarget(e.target)) return;
        if (e.repeat || xrayActive) return;
        xrayActive = true;
        document.body.classList.add('xray');
        e.preventDefault();
    });

    document.addEventListener('keyup', (e) => {
        if (e.code !== 'Space') return;
        if (!xrayActive) return;
        xrayActive = false;
        document.body.classList.remove('xray');
    });

    window.addEventListener('blur', () => {
        if (xrayActive) {
            xrayActive = false;
            document.body.classList.remove('xray');
        }
    });
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
            print('muted', '  call      →  plan een call (WhatsApp)');
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
            print('system', 'Best route: stuur een WhatsApp, dan plannen we direct.');
            const url = 'https://wa.me/31640446732?text=Hi%20Robin%2C%20ik%20wil%20een%20call%20plannen';
            print('link', '→ Plan call via WhatsApp', url);
            window.open(url, '_blank', 'noopener,noreferrer');
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

            const totalMs = 500;
            const stepMs = Math.max(20, Math.floor(totalMs / cmd.length));
            let i = 0;
            const typer = setInterval(() => {
                line.textContent = cmd.slice(0, ++i);
                body.scrollTop = body.scrollHeight;
                if (i >= cmd.length) {
                    clearInterval(typer);
                    line.classList.remove('terminal-line--typing');
                    // Execute after a tiny beat
                    setTimeout(() => {
                        const fn = commands[cmd];
                        if (fn) fn();
                        else print('error', `command not found: ${cmd}`);
                        chipBusy = false;
                    }, 120);
                }
            }, stepMs);
        });
    });
})();
