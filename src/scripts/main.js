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