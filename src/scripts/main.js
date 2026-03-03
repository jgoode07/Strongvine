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

    // Swap every 5 seconds
    const intervalMs = 3000;

    setInterval(() => {
        i = (i + 1) % words.length;
        wordEl.textContent = words[i];
    }, intervalMs);
})();

/* ---------- SCROLL REVEAL (IF YOU WANT SOMETHING RARE) ---------- */
(() => {
    const target = document.querySelector('.js-rare');
    if (!target) return;

    // Put the line into data-text so the ::after overlay can use it
    target.setAttribute('data-text', target.textContent.trim());

    const fillDistancePx = 280;

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