const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// =====================
// Slideshow (continuous autoplay + dots + subtle parallax)
// =====================
(function () {
    const slideshow = document.querySelector('.slideshow');
    const slides = document.querySelectorAll('.slide');
    const dotsWrap = document.querySelector('.slide-dots');
    if (!slides.length || !dotsWrap) return;

    let current = 0;
    const intervalMs = 5000;
    const captionEyebrow = document.querySelector('.slide-caption .slide-eyebrow');
    const captionTitle = document.querySelector('.slide-caption .slide-title');

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', `Show slide ${i + 1}`);
        if (i === 0) dot.classList.add('is-active');
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll('button');

    function setCaption(slide) {
        if (!captionEyebrow || !captionTitle) return;
        captionEyebrow.textContent = slide.dataset.eyebrow || '';
        captionTitle.textContent = slide.dataset.title || '';
    }

    function goTo(index) {
        slides[current].classList.remove('is-active');
        dots[current].classList.remove('is-active');
        current = index;
        slides[current].classList.add('is-active');
        dots[current].classList.add('is-active');
        setCaption(slides[current]);
    }

    setCaption(slides[current]);

    function next() {
        goTo((current + 1) % slides.length);
    }

    if (!reduceMotion) setInterval(next, intervalMs);

    if (!reduceMotion && slideshow) {
        window.addEventListener('scroll', () => {
            const rect = slideshow.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;
            const offset = rect.top * 0.15;
            slides.forEach((s) => { s.style.transform = `translateY(${offset}px)`; });
        }, { passive: true });
    }
})();

// =====================
// Mobile nav toggle
// =====================
(function () {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    links.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            links.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
})();

// =====================
// Scroll-spy active nav link
// =====================
(function () {
    const sections = document.querySelectorAll('main section[id], main footer[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    if (!sections.length || !navLinks.length) return;

    const map = new Map();
    navLinks.forEach((link) => map.set(link.getAttribute('href').slice(1), link));

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const link = map.get(entry.target.id);
                if (!link) return;
                if (entry.isIntersecting) {
                    navLinks.forEach((l) => l.classList.remove('is-active'));
                    link.classList.add('is-active');
                }
            });
        },
        { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
})();

// =====================
// Scroll reveal (fade + rise), also lights up timeline dots
// =====================
(function () {
    const targets = document.querySelectorAll(
        '.section-title, .entry, .project-tile, .skill-card, .news-item, .pub-list li'
    );
    if (!targets.length) return;

    targets.forEach((el) => el.classList.add('reveal'));

    if (reduceMotion) {
        targets.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
})();

// =====================
// Timeline progress line — fills as you scroll through Experience + Publications
// =====================
(function () {
    const wrap = document.querySelector('.timeline-wrap');
    const progress = document.querySelector('.timeline-progress');
    if (!wrap || !progress) return;

    function update() {
        const rect = wrap.getBoundingClientRect();
        const reference = window.innerHeight * 0.5;
        let filled = reference - rect.top;
        filled = Math.max(0, Math.min(filled, rect.height));
        progress.style.height = `${filled}px`;
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
})();

// =====================
// Progressive project thumbnails — swap placeholder for real photo once added
// =====================
(function () {
    document.querySelectorAll('[data-img]').forEach((el) => {
        const src = el.getAttribute('data-img');
        if (!src) return;
        const probe = new Image();
        probe.onload = () => {
            el.style.backgroundImage = `url('${src}')`;
            el.classList.add('has-image');
        };
        probe.src = src;
    });
})();

// =====================
// Project modal
// =====================
(function () {
    const modal = document.getElementById('projectModal');
    if (!modal) return;

    const titleEl = document.getElementById('modalTitle');
    const descEl = document.getElementById('modalDesc');
    const tagsEl = document.getElementById('modalTags');
    const thumbEl = document.getElementById('modalThumb');
    const closeBtn = modal.querySelector('.modal-close');
    let lastFocused = null;

    function openModal(tile) {
        lastFocused = document.activeElement;
        titleEl.textContent = tile.dataset.title || '';
        descEl.textContent = tile.dataset.desc || '';
        tagsEl.textContent = tile.dataset.tags || '';

        const tileThumb = tile.querySelector('.project-thumb');
        thumbEl.className = 'modal-thumb';
        thumbEl.style.backgroundImage = '';
        if (tileThumb && tileThumb.classList.contains('has-image')) {
            thumbEl.classList.add('has-image');
            thumbEl.style.backgroundImage = tileThumb.style.backgroundImage;
        }

        modal.hidden = false;
        requestAnimationFrame(() => modal.classList.add('is-open'));
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    }

    function closeModal() {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
        setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 250);
        if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll('.project-tile').forEach((tile) => {
        tile.addEventListener('click', () => openModal(tile));
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.hidden) closeModal();
    });
})();
