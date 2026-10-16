// Swipeable carousel: native scroll-snap handles touch swiping, mouse drag and the dots are added here
document.querySelectorAll('.sol-carousel').forEach(carousel => {
    const track = carousel.querySelector('.sol-carousel-track');
    const slides = Array.from(track.children);
    const dotsBox = carousel.querySelector('.sol-carousel-dots');

    const dots = slides.map((_, index) => {
        const dot = document.createElement('span');
        dot.addEventListener('click', () => goTo(index));
        dotsBox.append(dot);
        return dot;
    });

    function current() {
        return Math.round(track.scrollLeft / track.clientWidth);
    }

    function goTo(index) {
        track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' });
    }

    function updateDots() {
        dots.forEach((dot, index) => dot.classList.toggle('is-active', index === current()));
    }

    track.addEventListener('scroll', updateDots, { passive: true });
    updateDots();

    // mouse drag (touch already swipes natively)
    let startX = 0;
    let startScroll = 0;
    let dragging = false;

    track.addEventListener('pointerdown', event => {
        if (event.pointerType !== 'mouse') return;
        dragging = true;
        startX = event.clientX;
        startScroll = track.scrollLeft;
        track.classList.add('is-dragging');
        track.setPointerCapture(event.pointerId);
    });

    track.addEventListener('pointermove', event => {
        if (dragging) track.scrollLeft = startScroll - (event.clientX - startX);
    });

    function endDrag() {
        if (!dragging) return;
        dragging = false;
        track.classList.remove('is-dragging');
        goTo(current());
    }

    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);

    // arrow keys when the carousel is focused
    track.tabIndex = 0;
    track.addEventListener('keydown', event => {
        if (event.key === 'ArrowRight') goTo(Math.min(current() + 1, slides.length - 1));
        if (event.key === 'ArrowLeft') goTo(Math.max(current() - 1, 0));
    });
});
