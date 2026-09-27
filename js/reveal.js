// Project images slide in like a curtain, and horizontal lines draw in, the first time they scroll into view
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const projectCards = document.querySelectorAll('.project-card');

if (!reduceMotion && projectCards.length) {
    // watch the card, not the image: a fully clipped image never counts as "in view"
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelector('img').classList.remove('is-curtained');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    projectCards.forEach((card, index) => {
        const image = card.querySelector('img');
        if (!image) return;

        // each image starts a little after the one before it
        image.style.setProperty('--curtain-delay', `${index * 0.15}s`);
        image.classList.add('is-curtained');
        observer.observe(card);
    });
}

// Horizontal lines draw in from left to right the first time they scroll into view
let waitingLines = Array.from(document.querySelectorAll('[data-line]'));

if (!reduceMotion && waitingLines.length) {
    waitingLines.forEach(line => line.classList.add('line-waiting'));

    function drawVisibleLines() {
        waitingLines = waitingLines.filter(line => {
            const box = line.getBoundingClientRect();
            // where the line actually sits: the element's top or bottom edge
            const lineY = line.dataset.line === 'top' ? box.top : box.bottom;

            if (lineY < window.innerHeight * 0.95) {
                line.classList.remove('line-waiting');
                return false;
            }
            return true;
        });

        if (!waitingLines.length) window.removeEventListener('scroll', onScroll);
    }

    let ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            drawVisibleLines();
            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // wait a frame so the hidden state paints first, otherwise lines already on screen wouldn't animate
    requestAnimationFrame(() => requestAnimationFrame(drawVisibleLines));
}
