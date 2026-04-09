/* ===================================================
   IULIA LINGA — Interactive Scripts
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initCarousel();
    initTestimonials();
    initScrollAnimations();
    initParticles();
});


/* ----- Navigation ----- */
function initNav() {
    const nav = document.getElementById('nav');
    const burger = document.getElementById('navBurger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!nav || !burger || !mobileMenu) return;
    const mobileLinks = mobileMenu.querySelectorAll('a');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        nav.classList.toggle('scrolled', scrollY > 60);
        lastScroll = scrollY;
    }, { passive: true });

    // Mobile menu toggle
    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('open');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}


/* ----- Carousel ----- */
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;
    const slides = track.querySelectorAll('.carousel__slide');
    const dots = document.querySelectorAll('.carousel__dot');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    if (!prevBtn || !nextBtn) return;

    let current = 0;
    const total = slides.length;
    let autoplayInterval;
    let touchStartX = 0;
    let touchEndX = 0;

    function goTo(index) {
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;
        current = index;

        track.style.transform = `translateX(-${current * 100}%)`;

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === current);
        });
    }

    // Button controls
    prevBtn.addEventListener('click', () => {
        goTo(current - 1);
        resetAutoplay();
    });

    nextBtn.addEventListener('click', () => {
        goTo(current + 1);
        resetAutoplay();
    });

    // Dot controls
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goTo(parseInt(dot.dataset.index));
            resetAutoplay();
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const servicesSection = document.getElementById('services');
        const rect = servicesSection.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;

        if (!inView) return;

        if (e.key === 'ArrowLeft') {
            goTo(current - 1);
            resetAutoplay();
        } else if (e.key === 'ArrowRight') {
            goTo(current + 1);
            resetAutoplay();
        }
    });

    // Touch / swipe support
    const trackContainer = track.parentElement;

    trackContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    trackContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goTo(current + 1);
            } else {
                goTo(current - 1);
            }
            resetAutoplay();
        }
    }, { passive: true });

    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            goTo(current + 1);
        }, 6000);
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    startAutoplay();
}


/* ----- Scroll Animations ----- */
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => observer.observe(el));
}


/* ----- Floating Particles ----- */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const count = 20;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${60 + Math.random() * 40}%`;
        particle.style.animationDelay = `${Math.random() * 12}s`;
        particle.style.animationDuration = `${10 + Math.random() * 8}s`;
        particle.style.width = `${2 + Math.random() * 3}px`;
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}


/* ───── Testimonials Slider ───── */

function initTestimonials() {
    const track = document.getElementById('testimonialsTrack');
    if (!track) return;

    const slides = track.querySelectorAll('.testimonials__slide');
    const dots = document.querySelectorAll('.testimonials__dot');
    const prevBtn = document.getElementById('testimonialsPrev');
    const nextBtn = document.getElementById('testimonialsNext');
    if (!prevBtn || !nextBtn || slides.length === 0) return;

    let currentIndex = 0;
    let autoTimer = null;

    // Show first slide
    slides[0].classList.add('active');

    function goToSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        slides[currentIndex].classList.remove('active');
        currentIndex = index;
        slides[currentIndex].classList.add('active');

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function startAutoAdvance() {
        stopAutoAdvance();
        autoTimer = setInterval(() => goToSlide(currentIndex + 1), 6000);
    }

    function stopAutoAdvance() {
        if (autoTimer) clearInterval(autoTimer);
    }

    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        startAutoAdvance();
    });

    nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        startAutoAdvance();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.index));
            startAutoAdvance();
        });
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoAdvance();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goToSlide(currentIndex + 1);
            else goToSlide(currentIndex - 1);
        }
        startAutoAdvance();
    }, { passive: true });

    startAutoAdvance();
}
