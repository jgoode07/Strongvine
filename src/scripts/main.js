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


/* ---------- BETTER: TYPEWRITER (starts on scroll) ---------- */

(() => {
    const wordEl = document.querySelector('.better__type');
    if (!wordEl) return;

    const words = [
        'Unique',
        'Better',
        'Sharp',
        'Rare',
        'Clean',
        'Precise'
    ];

    // Word Type Timings
    const typeSpeed = 140;     // Slower typing
    const deleteSpeed = 80;
    const holdTime = 1400;     // Pause at full word
    const betweenTime = 500;   // Pause before typing next word

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let started = false;
    let timerId = null;

    const stop = () => {
        if (timerId) window.clearTimeout(timerId);
        timerId = null;
    };

    const tick = () => {
        const current = words[wordIndex];

        if (!deleting) {
            charIndex++;
            wordEl.textContent = current.slice(0, charIndex);

            if (charIndex >= current.length) {
                deleting = true;
                timerId = window.setTimeout(tick, holdTime);
                return;
            }

            timerId = window.setTimeout(tick, typeSpeed);
            return;
        }

        charIndex--;
        wordEl.textContent = current.slice(0, charIndex);

        if (charIndex <= 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            timerId = window.setTimeout(tick, betweenTime);
            return;
        }

        timerId = window.setTimeout(tick, deleteSpeed);
    };

    const start = () => {
        if (started) return;
        started = true;

        const initial = (wordEl.textContent || '').trim();
        const found = words.indexOf(initial);
        wordIndex = found >= 0 ? found : 0;

        // Start by typing from LEFT (blank → word)
        wordEl.textContent = '';
        charIndex = 0;
        deleting = false;

        timerId = window.setTimeout(tick, 500);
    };

    const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        start();
        observer.disconnect();
    }, { threshold: 0.6 });

    observer.observe(wordEl);

    window.addEventListener('beforeunload', stop);
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