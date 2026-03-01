/* =========================================
   EMBER — Shared JavaScript
   ========================================= */

(function() {
    'use strict';

    // --- Mobile Navigation ---
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('open');
            hamburger.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
        });

        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }


    // --- Sticky Header ---
    const header = document.getElementById('header');
    let lastScroll = 0;

    if (header) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            header.classList.toggle('scrolled', currentScroll > 60);
            lastScroll = currentScroll;
        }, { passive: true });
    }


    // --- Scroll Reveal ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal, .stagger-children').forEach(el => {
        revealObserver.observe(el);
    });


    // --- Parallax Images ---
    const parallaxElements = document.querySelectorAll('.parallax-img');
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            parallaxElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const speed = parseFloat(el.dataset.speed) || 0.15;
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const offset = (rect.top - window.innerHeight / 2) * speed;
                    el.style.transform = `translateY(${offset}px)`;
                }
            });
        }, { passive: true });
    }


    // --- Counter Animation ---
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(el => counterObserver.observe(el));
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.count, 10);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * ease);
            el.textContent = prefix + current + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }


    // --- Menu Tabs ---
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuPanels = document.querySelectorAll('.menu-panel');

    if (menuTabs.length > 0) {
        menuTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;

                menuTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                menuPanels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.dataset.panel === target) {
                        panel.classList.add('active');
                    }
                });
            });
        });
    }


    // --- Reservation Form Handling ---
    const reserveForm = document.getElementById('reserve-form');
    if (reserveForm) {
        reserveForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = reserveForm.querySelector('.btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Confirming...';
            submitBtn.style.opacity = '0.7';
            submitBtn.style.pointerEvents = 'none';

            setTimeout(() => {
                submitBtn.textContent = 'Reservation Confirmed';
                submitBtn.style.background = '#2d6a4f';
                submitBtn.style.borderColor = '#2d6a4f';
                submitBtn.style.opacity = '1';

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.borderColor = '';
                    submitBtn.style.pointerEvents = '';
                    reserveForm.reset();
                }, 3000);
            }, 1500);
        });
    }


    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = Math.min(Math.max(Math.abs(distance) * 0.8, 600), 1400);
                let startTime = null;

                function easeOutQuart(t) {
                    return 1 - Math.pow(1 - t, 4);
                }

                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = easeOutQuart(progress);
                    window.scrollTo(0, startPosition + distance * eased);
                    if (progress < 1) requestAnimationFrame(animation);
                }

                requestAnimationFrame(animation);
            }
        });
    });


    // --- Gallery Lightbox ---
    const galleryItems = document.querySelectorAll('.gallery-item[data-lightbox]');
    if (galleryItems.length > 0) {
        // Create lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-backdrop"></div>
            <div class="lightbox-content">
                <img src="" alt="">
                <button class="lightbox-close" aria-label="Close">&times;</button>
                <button class="lightbox-prev" aria-label="Previous">&#8249;</button>
                <button class="lightbox-next" aria-label="Next">&#8250;</button>
            </div>
        `;
        document.body.appendChild(lightbox);

        // Add lightbox styles
        const style = document.createElement('style');
        style.textContent = `
            .lightbox { position:fixed; inset:0; z-index:10000; display:none; align-items:center; justify-content:center; }
            .lightbox.active { display:flex; animation: fadeIn 0.3s ease; }
            .lightbox-backdrop { position:absolute; inset:0; background:rgba(0,0,0,0.92); }
            .lightbox-content { position:relative; max-width:90vw; max-height:90vh; }
            .lightbox-content img { max-width:90vw; max-height:85vh; object-fit:contain; display:block; }
            .lightbox-close { position:absolute; top:-40px; right:0; background:none; border:none; color:#fff; font-size:2rem; cursor:pointer; padding:8px; }
            .lightbox-prev, .lightbox-next { position:absolute; top:50%; transform:translateY(-50%); background:none; border:none; color:#fff; font-size:2.5rem; cursor:pointer; padding:16px; }
            .lightbox-prev { left:-60px; }
            .lightbox-next { right:-60px; }
            .lightbox-prev:hover, .lightbox-next:hover { color:var(--amber); }
        `;
        document.head.appendChild(style);

        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;

        const galleryImages = Array.from(galleryItems);

        galleryItems.forEach((item, i) => {
            item.addEventListener('click', () => {
                currentIndex = i;
                lightboxImg.src = item.dataset.lightbox;
                lightboxImg.alt = item.querySelector('img')?.alt || '';
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            lightboxImg.src = galleryImages[currentIndex].dataset.lightbox;
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            lightboxImg.src = galleryImages[currentIndex].dataset.lightbox;
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        });
    }


    // --- Mobile Sticky Bar Visibility ---
    const mobileSticky = document.querySelector('.mobile-sticky');
    if (mobileSticky) {
        let lastScrollY = 0;
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    if (currentScrollY > lastScrollY && currentScrollY > 300) {
                        mobileSticky.style.transform = 'translateY(100%)';
                    } else {
                        mobileSticky.style.transform = 'translateY(0)';
                    }
                    mobileSticky.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
                    lastScrollY = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

})();
