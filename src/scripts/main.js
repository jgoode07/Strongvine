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