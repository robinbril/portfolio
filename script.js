// ==========================================
// PRELOADER ANIMATION
// ==========================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.querySelector('.progress-percentage');

    let progress = 0;
    const duration = 1000; // 1 second total (was 3 seconds)
    const incrementTime = 20; // Update every 20ms for smoother animation
    const totalIncrements = duration / incrementTime;
    const incrementValue = 100 / totalIncrements;

    // Animate progress bar from 0 to 100%
    const progressInterval = setInterval(() => {
        progress += incrementValue;

        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);

            // Wait a bit at 100%, then fade out
            setTimeout(() => {
                preloader.classList.add('fade-out');

                // Remove from DOM after fade  
                setTimeout(() => {
                    preloader.remove();
                }, 500);
            }, 200); // Reduced from 400ms to 200ms
        }

        // Update progress bar and percentage
        progressBar.style.width = progress + '%';
        progressPercentage.textContent = Math.floor(progress) + '%';
    }, incrementTime);
});

// ==========================================
// CURSOR GLOW EFFECT
// ==========================================
const cursorGlow = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    cursorGlow.style.left = x + 'px';
    cursorGlow.style.top = y + 'px';
});

// ==========================================
// BUTTON HOVER SOUNDS (Professional & Subtle)
// ==========================================
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playHoverSound() {
    // Create subtle, professional "click" sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Soft tone frequency (not harsh)
    oscillator.frequency.value = 500;
    oscillator.type = 'sine';

    // Very subtle volume with quick fade
    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Add hover sound to all interactive elements
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
        playHoverSound(); // reuse existing sound
    });
}

// ==========================================
// THEME TOGGLE
// ==========================================
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark-theme';
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
        });
});

// ==========================================
// AI PORTFOLIO FILTER FUNCTIONALITY
// ==========================================
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.ai-project-card');

if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter cards with animation
            projectCards.forEach((card, index) => {
                const categories = card.getAttribute('data-category').split(' ');

                if (filter === 'all' || categories.includes(filter)) {
                    // Show card with stagger animation
                    setTimeout(() => {
                        card.classList.remove('hidden');
                        card.style.animation = 'fadeInUp 0.4s ease-out';
                    }, index * 30);
                } else {
                    // Hide card
                    card.classList.add('hidden');
                }
            });

            // Play subtle feedback sound
            playHoverSound();
        });
    });
}
