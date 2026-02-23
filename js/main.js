/* ============================================
   MAIN.JS — Portfolio Interactions & Animations
   Uses GSAP + ScrollTrigger
   ============================================ */

(function () {
    'use strict';

    // ---- Wait for DOM ----
    document.addEventListener('DOMContentLoaded', () => {
        initLoader();
        initMagnetic();
        initMarquee();
        initHamburgerMenu();
        initWorkTiles();          // Must run BEFORE scroll animations
        initScrollAnimations();   // Needs DOM elements from initWorkTiles
        initWorkHover();
        initLocalTime();
        initHamburgerVisibility();
        initSmoothScroll();
    });

    /* ============================================
       PAGE LOADER
       ============================================ */
    function initLoader() {
        function dismissLoader() {
            const loader = document.getElementById('pageLoader');
            if (!loader || loader.classList.contains('loaded')) return;
            setTimeout(() => {
                loader.classList.add('loaded');
                // Trigger initial animations after loader
                setTimeout(() => {
                    animateHeroEntry();
                }, 400);
            }, 800);
        }

        // If the page has already fully loaded, dismiss immediately
        if (document.readyState === 'complete') {
            dismissLoader();
        } else {
            window.addEventListener('load', dismissLoader);
        }
    }

    /* ============================================
       HERO ENTRY ANIMATION
       ============================================ */
    function animateHeroEntry() {
        const tl = gsap.timeline();

        tl.from('.hero-image-wrapper', {
            y: 60,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out'
        })
            .from('.hero-info', {
                x: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.6')
            .from('.hero-marquee', {
                y: 60,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.4')
            .from('.header', {
                y: -20,
                opacity: 0,
                duration: 0.6,
                ease: 'power3.out'
            }, '-=0.4');
    }

    /* ============================================
       MARQUEE ANIMATION
       Continuous horizontal scroll of name (right to left)
       ============================================ */
    function initMarquee() {
        const marquee = document.getElementById('marquee');
        if (!marquee) return;

        // Clone content several times for seamless loop
        const originalContent = marquee.innerHTML;
        marquee.innerHTML = originalContent + originalContent + originalContent;

        // Calculate single set width
        const spans = marquee.querySelectorAll('span');
        let singleSetWidth = 0;
        const totalSets = 3;
        const spansPerSet = spans.length / totalSets;

        for (let i = 0; i < spansPerSet; i++) {
            singleSetWidth += spans[i].offsetWidth;
        }

        // Scroll right-to-left: start offset right, animate leftward
        gsap.set(marquee, { x: 0 });
        gsap.to(marquee, {
            x: -singleSetWidth,
            duration: 20,
            ease: 'linear',
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize(x => {
                    const mod = parseFloat(x) % singleSetWidth;
                    return mod > 0 ? mod - singleSetWidth : mod;
                })
            }
        });

        // Speed up on scroll
        let scrollSpeed = 1;
        window.addEventListener('scroll', () => {
            scrollSpeed = 2;
            setTimeout(() => { scrollSpeed = 1; }, 300);
        });
    }

    /* ============================================
       HAMBURGER MENU
       ============================================ */
    function initHamburgerMenu() {
        const btn = document.getElementById('btnHamburger');
        const nav = document.getElementById('fixedNav');
        const overlay = document.getElementById('fixedNavOverlay');

        if (!btn || !nav || !overlay) return;

        function toggleMenu() {
            const isActive = nav.classList.contains('active');
            nav.classList.toggle('active');
            overlay.classList.toggle('active');

            if (!isActive) {
                // Animate nav links in
                gsap.from('.fixed-nav-links a', {
                    y: 80,
                    opacity: 0,
                    stagger: 0.08,
                    duration: 0.7,
                    ease: 'power3.out',
                    delay: 0.2
                });
                gsap.from('.fixed-nav-socials a', {
                    y: 20,
                    opacity: 0,
                    stagger: 0.05,
                    duration: 0.5,
                    ease: 'power3.out',
                    delay: 0.5
                });
            }
        }

        btn.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);

        // Close on nav link click
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                overlay.classList.remove('active');
            });
        });
    }

    /* ============================================
       HAMBURGER VISIBILITY ON SCROLL
       ============================================ */
    function initHamburgerVisibility() {
        const btn = document.getElementById('btnHamburger');
        if (!btn) return;

        // Show hamburger after scrolling past hero
        ScrollTrigger.create({
            trigger: '.intro',
            start: 'top 80%',
            onEnter: () => btn.classList.add('visible'),
            onLeaveBack: () => btn.classList.remove('visible')
        });
    }

    /* ============================================
       SCROLL ANIMATIONS (GSAP ScrollTrigger)
       ============================================ */
    function initScrollAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // --- Reveal text animations ---
        document.querySelectorAll('.reveal-text').forEach(el => {
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                onEnter: () => el.classList.add('revealed'),
                once: true
            });
        });

        // --- Fade in animations ---
        document.querySelectorAll('.fade-in').forEach(el => {
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                onEnter: () => el.classList.add('revealed'),
                once: true
            });
        });

        // --- Hero parallax (image moves up slightly on scroll) ---
        gsap.to('.hero-image-wrapper', {
            y: -80,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // --- Work rows — use class toggle (more reliable than gsap.from) ---
        document.querySelectorAll('.work-row').forEach((el, i) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = (i * 0.1) + 's';
            ScrollTrigger.create({
                trigger: el,
                start: 'top 90%',
                onEnter: () => el.classList.add('revealed'),
                once: true
            });
        });

        // --- Work tiles — use class toggle ---
        document.querySelectorAll('.work-tile').forEach((el, i) => {
            // fade-in class is already added in initWorkTiles
            el.style.transitionDelay = (i * 0.08) + 's';
            ScrollTrigger.create({
                trigger: el,
                start: 'top 92%',
                onEnter: () => el.classList.add('revealed'),
                once: true
            });
        });

        // --- Footer heading reveal ---
        ScrollTrigger.create({
            trigger: '.footer-cta',
            start: 'top 85%',
            onEnter: () => {
                document.querySelectorAll('.footer-cta .reveal-text').forEach(el => {
                    el.classList.add('revealed');
                });
            },
            once: true
        });

        // --- Footer elements ---
        ['.footer-cta-row', '.footer-contact', '.footer-bottom'].forEach(selector => {
            const el = document.querySelector(selector);
            if (el) {
                el.classList.add('fade-in');
                ScrollTrigger.create({
                    trigger: el,
                    start: 'top 92%',
                    onEnter: () => el.classList.add('revealed'),
                    once: true
                });
            }
        });

        document.querySelectorAll('.footer-contact-btn').forEach((el, i) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = (i * 0.1) + 's';
            ScrollTrigger.create({
                trigger: el,
                start: 'top 95%',
                onEnter: () => el.classList.add('revealed'),
                once: true
            });
        });
    }

    /* ============================================
       WORK ROW HOVER — IMAGE FOLLOWER
       ============================================ */
    function initWorkHover() {
        const hoverContainer = document.getElementById('workHoverImage');
        const hoverImg = document.getElementById('workHoverImg');
        const rows = document.querySelectorAll('.work-row');

        if (!hoverContainer || !hoverImg || rows.length === 0) return;

        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;
        let animating = false;

        function animate() {
            if (!animating) return;
            // Smooth follow
            currentX += (mouseX - currentX) * 0.1;
            currentY += (mouseY - currentY) * 0.1;

            hoverContainer.style.left = currentX + 'px';
            hoverContainer.style.top = currentY + 'px';

            requestAnimationFrame(animate);
        }

        rows.forEach(row => {
            row.addEventListener('mouseenter', () => {
                const imgSrc = row.getAttribute('data-img');
                if (imgSrc) {
                    hoverImg.src = imgSrc;
                    hoverContainer.classList.add('active');
                    animating = true;
                    animate();
                }
            });

            row.addEventListener('mousemove', (e) => {
                mouseX = e.clientX - 175; // offset by half width
                mouseY = e.clientY - 200; // offset by half height
            });

            row.addEventListener('mouseleave', () => {
                hoverContainer.classList.remove('active');
                animating = false;
            });
        });
    }

    /* ============================================
       WORK TILES — Generate placeholder tiles
       using unsplash images
       ============================================ */
    function initWorkTiles() {
        const grid = document.getElementById('workTilesGrid');
        if (!grid) return;

        const projects = [
            { img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=75', label: 'Dashboard' },
            { img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=75', label: 'Analytics' },
            { img: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=500&q=75', label: 'Brand Identity' },
            { img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=75', label: 'Web App' },
            { img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=500&q=75', label: 'Mobile Design' },
            { img: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=500&q=75', label: 'E-Commerce' },
            { img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=75', label: 'Photography' },
            { img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=75', label: 'Development' }
        ];

        projects.forEach(project => {
            const tile = document.createElement('div');
            tile.classList.add('work-tile', 'fade-in');
            tile.innerHTML = `
        <img src="${project.img}" alt="${project.label}" loading="lazy">
        <span class="work-tile-label">${project.label}</span>
      `;
            grid.appendChild(tile);
        });

        // Recalculate all scroll positions after injecting dynamic content
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }

    /* ============================================
       LOCAL TIME DISPLAY
       ============================================ */
    function initLocalTime() {
        const el = document.getElementById('localTime');
        if (!el) return;

        function updateTime() {
            const now = new Date();
            const options = {
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short',
                hour12: true
            };
            el.textContent = now.toLocaleTimeString('en-US', options);
        }

        updateTime();
        setInterval(updateTime, 1000);
    }

    /* ============================================
       SMOOTH SCROLL (anchor links)
       ============================================ */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    gsap.to(window, {
                        scrollTo: { y: target, offsetY: 0 },
                        duration: 1,
                        ease: 'power3.inOut'
                    });
                }
            });
        });
    }

})();
