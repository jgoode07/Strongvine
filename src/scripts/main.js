/* ---------- LOGO STICKY ON SCROLL/FADE ---------- */

(() => {
    const logo = document.querySelector('.header__brand-logo');
    if (!logo) return;

    const moveUntil = Math.round(window.innerHeight * 0.18); // How long it "travels"
    const hideAt = Math.round(window.innerHeight * 0.25);    // When it disappears

    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    const onScroll = () => {
        const y = window.scrollY;

        if (y < 10) {
            logo.style.setProperty('--logoY', '0px');
            logo.classList.remove('is-fading', 'is-hidden');
            return;
        }

        // Move with scroll, capped so it doesn't keep drifting forever
        const travel = clamp(y, 0, moveUntil);
        logo.style.setProperty('--logoY', `${travel}px`);

        // Start fading once it’s moving
        logo.classList.add('is-fading');

        // Hide before it overlaps content
        if (y >= hideAt) logo.classList.add('is-hidden');
        else logo.classList.remove('is-hidden');
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
})();

/* ---------- WORD ROTATION ---------- */

// 'Better' word rotation
(() => {
    const wordEl = document.querySelector('.better__word');
    if (!wordEl) return;

    const words = [
        'Better',
        'Sharp',
        'Rare',
        'Clean',
        'Precise',
        'Compulsive'
    ];

    // Always start with HTML word (Better)
    let i = words.indexOf(wordEl.textContent.trim());
    if (i < 0) i = 0;

    // Pre-measure widest word and lock width to prevent shifting
    const measurer = document.createElement('span');
    measurer.style.visibility = 'hidden';
    measurer.style.position = 'absolute';
    measurer.style.whiteSpace = 'nowrap';
    measurer.style.font = getComputedStyle(wordEl).font;
    document.body.appendChild(measurer);

    let maxWidth = 0;
    words.forEach(w => {
        measurer.textContent = w;
        maxWidth = Math.max(maxWidth, measurer.getBoundingClientRect().width);
    });

    document.body.removeChild(measurer);
    wordEl.style.width = `${Math.ceil(maxWidth)}px`;

    // Swap every 3 seconds
    const intervalMs = 3000;

    // Start ONLY when visible
    let intervalId = null;

    const startRotation = () => {
        if (intervalId) return;
        intervalId = setInterval(() => {
            i = (i + 1) % words.length;
            wordEl.textContent = words[i];
        }, intervalMs);
    };

    const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        startRotation();
        observer.disconnect(); // run once
    }, {
        threshold: 0.6
    });

    observer.observe(wordEl);
})();


/* ---------- SCROLL REVEAL (IF YOU WANT SOMETHING RARE) ---------- */
(() => {
    const target = document.querySelector('.js-rare');
    if (!target) return;

    // Put the line into data-text so the ::after overlay can use it
    target.setAttribute('data-text', target.textContent.trim());

    const fillDistancePx = 200;

    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    const update = () => {
        const rect = target.getBoundingClientRect();

        // Start filling when the line hits around mid-screen
        const startY = window.innerHeight * 0.55;

        // Progress 0..1 based on how far past startY it has moved
        const progress = clamp((startY - rect.top) / fillDistancePx, 0, 1);

        target.style.setProperty('--reveal', (progress * 100).toFixed(2));
    };

    update();

    // rAF throttle for smoothness without lag
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            update();
            ticking = false;
        });
    }, { passive: true });

    window.addEventListener('resize', update);
})();


/* ---------- TOGGLE SWITCH (RESULTS) ---------- */

// Results toggle button -> subtle title colour change 
(() => {
    const checkbox = document.getElementById('c3d');
    const resultsSection = document.querySelector('.results');

    if (!checkbox || !resultsSection) return;

    const sync = () => {
        resultsSection.classList.toggle('is-lit', checkbox.checked);
    };

    sync();
    checkbox.addEventListener('change', sync);
})();


/* ---------- FOOTER TITLE REVEAL ON SCROLL ---------- */
(() => {
    const title = document.querySelector('.footer__title');
    if (!title) return;

    const observer = new IntersectionObserver(
        ([entry]) => {
            if (!entry.isIntersecting) return;
            title.classList.add('is-inview');
            observer.disconnect(); // run once
        },
        {
            root: null,
            threshold: 0.25,          // triggers when ~25% visible
            rootMargin: "0px 0px -10% 0px" // triggers a touch before fully in view
        }
    );

    observer.observe(title);
})();