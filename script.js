const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// =====================
// Slideshow (continuous autoplay + dots + subtle parallax)
// =====================
(function () {
    const slideshow = document.querySelector('.slideshow');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slide-arrow-prev');
    const nextBtn = document.querySelector('.slide-arrow-next');
    if (!slides.length || !slideshow) return;

    let current = 0;
    const intervalMs = 5000;
    const captionEyebrow = document.querySelector('.slide-caption .slide-eyebrow');
    let timer = null;

    function setCaption(slide) {
        if (!captionEyebrow) return;
        captionEyebrow.textContent = slide.dataset.eyebrow || '';
    }

    function goTo(index) {
        slides[current].classList.remove('is-active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('is-active');
        setCaption(slides[current]);
    }

    setCaption(slides[current]);

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAutoplay() {
        if (reduceMotion) return;
        stopAutoplay();
        timer = setInterval(next, intervalMs);
    }

    function stopAutoplay() {
        if (timer) clearInterval(timer);
        timer = null;
    }

    startAutoplay();

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });

    slideshow.addEventListener('mouseenter', stopAutoplay);
    slideshow.addEventListener('mouseleave', startAutoplay);

    slideshow.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { next(); startAutoplay(); }
        if (e.key === 'ArrowLeft') { prev(); startAutoplay(); }
    });

    if (!reduceMotion) {
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
// Project thumbnails — 3D tilt-in entrance, then scroll-linked depth parallax
// (cards shrink/dim as they drift away from the vertical center of the
// viewport, so a row of cards moves together since they share a position)
// =====================
(function () {
    const tiles = document.querySelectorAll('.project-tile');
    if (!tiles.length || reduceMotion) return;

    const active = new Set();

    function applyDepth(tile) {
        const viewportCenter = window.innerHeight / 2;
        const rect = tile.getBoundingClientRect();
        const tileCenter = rect.top + rect.height / 2;
        const maxDist = viewportCenter + rect.height / 2;
        const dist = Math.min(Math.abs(tileCenter - viewportCenter) / maxDist, 1);

        const scale = 1 - dist * 0.12;
        const opacity = 1 - dist * 0.55;

        tile.style.transform = `translateY(0) rotateX(0deg) scale(${scale.toFixed(3)})`;
        tile.style.opacity = opacity.toFixed(3);
    }

    tiles.forEach((tile) => {
        tile.addEventListener('transitionend', (event) => {
            if (event.target !== tile || event.propertyName !== 'transform') return;
            if (!tile.classList.contains('is-visible')) return;
            tile.classList.add('parallax-active');
            active.add(tile);
            applyDepth(tile);
        });
    });

    let ticking = false;

    function update() {
        ticking = false;
        active.forEach(applyDepth);
    }

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
})();

// =====================
// Timeline progress line — fills as you scroll through Experience + Publications
// =====================
(function () {
    const wraps = document.querySelectorAll('.timeline-wrap');
    if (!wraps.length) return;

    function update() {
        wraps.forEach((wrap) => {
            const progress = wrap.querySelector('.timeline-progress');
            if (!progress) return;
            const rect = wrap.getBoundingClientRect();
            const reference = window.innerHeight * 0.5;
            let filled = reference - rect.top;
            filled = Math.max(0, Math.min(filled, rect.height));
            progress.style.height = `${filled}px`;
        });
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
})();

// =====================
// Timeline veins — bridges the glowing line from Teaching Experience through
// the Projects grid (splitting into one branch per column) and back into a
// single line before Publications. Geometry is measured live so it adapts
// to the current column count (3 / 2 / 1 on narrower screens).
// =====================
(function () {
    const host = document.querySelector('.vein-host');
    const svg = host && host.querySelector('.vein-overlay');
    const grid = host && host.querySelector('.project-grid');
    const wraps = document.querySelectorAll('.timeline-wrap');
    if (!host || !svg || !grid || wraps.length < 2) return;

    const NS = 'http://www.w3.org/2000/svg';
    let glowPaths = [];
    let litTargets = [];

    function addPath(d) {
        const bg = document.createElementNS(NS, 'path');
        bg.setAttribute('d', d);
        bg.setAttribute('class', 'vein-bg');
        svg.appendChild(bg);

        const glow = document.createElementNS(NS, 'path');
        glow.setAttribute('d', d);
        glow.setAttribute('class', 'vein-glow');
        glow.setAttribute('stroke', 'url(#veinGradient)');
        svg.appendChild(glow);
        glowPaths.push(glow);
    }

    function build() {
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        glowPaths = [];
        litTargets.forEach(({ el }) => el.classList.remove('vein-lit'));
        litTargets = [];

        const hostRect = host.getBoundingClientRect();
        if (!hostRect.width || !hostRect.height) return;
        svg.setAttribute('width', hostRect.width);
        svg.setAttribute('height', hostRect.height);
        svg.setAttribute('viewBox', `0 0 ${hostRect.width} ${hostRect.height}`);

        const defs = document.createElementNS(NS, 'defs');
        const gradient = document.createElementNS(NS, 'linearGradient');
        gradient.setAttribute('id', 'veinGradient');
        gradient.setAttribute('x1', '0');
        gradient.setAttribute('y1', '0');
        gradient.setAttribute('x2', '0');
        gradient.setAttribute('y2', '1');
        const rootStyles = getComputedStyle(document.documentElement);
        const accentColor = rootStyles.getPropertyValue('--accent').trim() || '#d7a463';
        const accent2Color = rootStyles.getPropertyValue('--accent-2').trim() || '#4d9c86';

        const stop1 = document.createElementNS(NS, 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', accent2Color);
        const stop2 = document.createElementNS(NS, 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', accentColor);
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.appendChild(defs);

        const stemRef = wraps[0].querySelector('.timeline-progress');
        if (!stemRef) return;
        const stemRect = stemRef.getBoundingClientRect();
        const stemX = stemRect.left - hostRect.left + stemRect.width / 2;

        const tiles = Array.from(grid.children);
        if (!tiles.length) return;
        // Column count comes from the grid's own track list, not from
        // comparing tile positions — tiles in the same row can be mid
        // entrance-transition at slightly different times (columns 2/3 have
        // a staggered --stagger delay), which throws off any detection
        // based on getBoundingClientRect().top.
        const numCols = getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length;
        const firstRow = tiles.slice(0, numCols);
        const colX = firstRow.map((t) => {
            const r = t.getBoundingClientRect();
            return r.left - hostRect.left + r.width / 2;
        });
        // Tiles are auto-placed row-major, so index % numCols recovers which
        // column each tile (in every row) belongs to.
        const columns = Array.from({ length: numCols }, () => []);
        tiles.forEach((t, i) => columns[i % numCols].push(t));

        const gridRect = grid.getBoundingClientRect();
        const gridTop = gridRect.top - hostRect.top;
        const gridBottom = gridRect.bottom - hostRect.top;
        const forkY = Math.max(gridTop - 40, 6);
        const mergeY = Math.min(gridBottom + 40, hostRect.height - 6);

        addPath(`M ${stemX} 0 L ${stemX} ${forkY}`);
        addPath(`M ${stemX} ${mergeY} L ${stemX} ${hostRect.height}`);

        // Control-point offsets are a fraction of the actual available span
        // (not a fixed px value) so the curve's Y coordinate always keeps
        // increasing monotonically along the path, however tight the span —
        // the binary search in lengthAtY() depends on that being true.
        const topOffset = (gridTop - forkY) * 0.4;
        const bottomOffset = (mergeY - gridBottom) * 0.4;

        // The line ducks out wherever it would run behind a card — it stops
        // just short of the card and picks back up just past it, so the
        // card's own border glow (toggled in updateProgress) reads as the
        // line continuing through the card rather than being hidden behind it.
        const cardGap = 6;

        colX.forEach((x, colIndex) => {
            let d = `M ${stemX} ${forkY} `
                + `C ${stemX} ${forkY + topOffset}, ${x} ${gridTop - topOffset}, ${x} ${gridTop} `;
            let cursorY = gridTop;

            columns[colIndex].forEach((tile) => {
                const r = tile.getBoundingClientRect();
                const tTop = r.top - hostRect.top;
                const tBottom = r.bottom - hostRect.top;

                const gapStart = Math.max(cursorY, tTop - cardGap);
                if (gapStart > cursorY) d += `L ${x} ${gapStart} `;
                cursorY = Math.max(cursorY, tBottom + cardGap);
                d += `M ${x} ${cursorY} `;

                const card = tile.querySelector('.project-card');
                if (card) litTargets.push({ el: card, top: tTop, bottom: tBottom });
            });

            if (cursorY < gridBottom) d += `L ${x} ${gridBottom} `;
            d += `C ${x} ${gridBottom + bottomOffset}, ${stemX} ${mergeY - bottomOffset}, ${stemX} ${mergeY}`;
            addPath(d);
        });

        glowPaths.forEach((p) => {
            const len = p.getTotalLength();
            p.dataset.veinLength = String(len);
            if (reduceMotion) {
                p.style.strokeDashoffset = '0';
            } else {
                p.style.strokeDasharray = `${len}`;
                p.style.strokeDashoffset = `${len}`;
            }
        });

        if (reduceMotion) {
            litTargets.forEach(({ el }) => el.classList.add('vein-lit'));
        } else {
            updateProgress();
        }
    }

    // These paths only ever move downward (no upward loops), so Y is
    // monotonic along their length — binary search finds exactly how much
    // of the path sits above a given Y, in host-local pixels.
    function lengthAtY(path, totalLen, targetY) {
        let lo = 0;
        let hi = totalLen;
        for (let i = 0; i < 18; i++) {
            const mid = (lo + hi) / 2;
            if (path.getPointAtLength(mid).y < targetY) lo = mid; else hi = mid;
        }
        return lo;
    }

    function updateProgress() {
        const rect = host.getBoundingClientRect();
        const reference = window.innerHeight * 0.5;
        // Same host-local scanline Y (in raw px) the plain timeline lines
        // use for their own fill — keeps the glow's speed identical across
        // the stem, the branches, and the timeline segments before/after.
        let scanY = reference - rect.top;
        scanY = Math.max(0, Math.min(scanY, rect.height));

        glowPaths.forEach((p) => {
            const len = parseFloat(p.dataset.veinLength);
            if (!len) return;
            const revealed = lengthAtY(p, len, scanY);
            p.style.strokeDashoffset = `${len - revealed}`;
        });

        litTargets.forEach(({ el, top }) => {
            if (scanY >= top) el.classList.add('vein-lit');
        });
    }

    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(build, 150);
    });

    if (!reduceMotion) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                ticking = false;
                updateProgress();
            });
        }, { passive: true });
    }

    // The grid sits below the fold, so at load time its tiles are still in
    // their pre-reveal offset (translateY(40px)) — rebuild once the first
    // tile actually settles into its final position (whenever that happens,
    // be it immediately or after the user scrolls down to it).
    const firstTile = grid.children[0];
    if (firstTile) {
        const onFirstTileSettled = (event) => {
            if (event.target !== firstTile || event.propertyName !== 'transform') return;
            firstTile.removeEventListener('transitionend', onFirstTileSettled);
            build();
        };
        firstTile.addEventListener('transitionend', onFirstTileSettled);
    }

    build();
    window.addEventListener('load', build);

    // Google Fonts loads with font-display: swap, so real text metrics can
    // land well after 'load' (slow connection, cold cache) — a late swap
    // reflows card heights, which would otherwise leave the cached vein
    // geometry (and the top/bottom the lit-border check compares against)
    // stale until the next resize.
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(build);
    }
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
    const linkEl = document.getElementById('modalLink');
    const defaultLink = linkEl ? linkEl.href : '';
    const closeBtn = modal.querySelector('.modal-close');
    let lastFocused = null;

    function openModal(tile) {
        lastFocused = document.activeElement;
        titleEl.textContent = tile.dataset.title || '';
        descEl.textContent = tile.dataset.desc || '';
        tagsEl.textContent = tile.dataset.tags || '';
        if (linkEl) linkEl.href = tile.dataset.link || defaultLink;

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
