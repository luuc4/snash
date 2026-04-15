/* ============================================================
   SNASH BURGER BAR — GLOBAL SCRIPTS
   ============================================================ */

(function () {
    'use strict';

    /* ========== CUSTOM CURSOR ========== */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (cursorDot && cursorRing && hasFinePointer) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });

        function animate() {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animate);
        }
        animate();

        const hoverSelector = 'a, button, .hoverable, .feature-card, .location-card, .review, .menu-item, .menu-tab';
        document.querySelectorAll(hoverSelector).forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
        });
    }

    /* ========== NAV SCROLL + PROGRESS BAR ========== */
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scrollProgress');

    function onScroll() {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
        if (scrollProgress) {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
            scrollProgress.style.width = pct + '%';
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ========== MOBILE MENU ========== */
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const open = menuToggle.classList.toggle('active');
            navLinks.classList.toggle('open', open);
            document.body.classList.toggle('no-scroll', open);
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('open');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    /* ========== REVEAL ON SCROLL ========== */
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
        revealEls.forEach(el => observer.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('visible'));
    }

    /* ========== HERO SPOTLIGHT ========== */
    const hero = document.querySelector('.hero');
    if (hero && hasFinePointer) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            hero.style.setProperty('--mx', x + '%');
            hero.style.setProperty('--my', y + '%');
        });
    }

    /* ========== COUNTER ANIMATION ========== */
    const counters = document.querySelectorAll('.counter');
    if (counters.length && 'IntersectionObserver' in window) {
        const counterObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseFloat(el.dataset.target || '0');
                const suffix = el.dataset.suffix || '';
                const duration = 1600;
                const start = performance.now();

                function tick(now) {
                    const p = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    const value = target * eased;
                    const display = Number.isInteger(target) ? Math.floor(value) : value.toFixed(1);
                    el.textContent = display + suffix;
                    if (p < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
                counterObs.unobserve(el);
            });
        }, { threshold: 0.4 });
        counters.forEach(c => counterObs.observe(c));
    }

    /* ========== MENU TABS ========== */
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuPanels = document.querySelectorAll('.menu-panel');

    if (menuTabs.length && menuPanels.length) {
        menuTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.location;
                menuTabs.forEach(t => t.classList.toggle('active', t === tab));
                menuPanels.forEach(p => {
                    const active = p.dataset.location === target;
                    p.classList.toggle('active', active);
                });
            });
        });
    }

    /* ========== TILT CARDS ========== */
    if (hasFinePointer) {
        document.querySelectorAll('.tilt').forEach(card => {
            let raf = null;
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const rx = ((y - cy) / cy) * -5;
                const ry = ((x - cx) / cx) * 5;
                if (raf) cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
                });
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* ========== ROTATING TEXT ========== */
    const rotator = document.querySelector('[data-rotate]');
    if (rotator) {
        const words = rotator.dataset.rotate.split('|');
        let i = 0;
        rotator.textContent = words[0];
        setInterval(() => {
            rotator.style.transform = 'translateY(-100%)';
            rotator.style.opacity = '0';
            setTimeout(() => {
                i = (i + 1) % words.length;
                rotator.textContent = words[i];
                rotator.style.transform = 'translateY(0)';
                rotator.style.opacity = '1';
            }, 320);
        }, 2400);
    }

    /* ========== YEAR ========== */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
