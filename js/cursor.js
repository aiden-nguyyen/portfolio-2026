// Replaces the mouse pointer with a circle that inverts the colours under it (see main.css),
// springs after the mouse, stays visible over links and grows on click (inspired by the iPad pointer)
// Only runs with a real mouse, touch screens keep their normal behaviour
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = '<span class="cursor-dot"></span>';
    document.body.append(cursor);
    document.documentElement.classList.add('has-custom-cursor');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // spring settings: higher stiffness = snappier, lower friction = more wobble
    const stiffness = 0.25;
    const friction = 0.6;

    const target = { x: 0, y: 0 };
    const position = { x: 0, y: 0 };
    const velocity = { x: 0, y: 0 };
    let hasMoved = false;
    let animating = false;
    let lastTime = 0;

    function draw() {
        cursor.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }

    function step(time) {
        // scale by frame time so the spring feels the same on 60Hz and 120Hz screens
        const t = Math.min((time - lastTime) / 16.67, 2) || 1;
        lastTime = time;

        for (const axis of ['x', 'y']) {
            velocity[axis] += (target[axis] - position[axis]) * stiffness * t;
            velocity[axis] *= Math.pow(friction, t);
            position[axis] += velocity[axis] * t;
        }
        draw();

        const settled = Math.abs(target.x - position.x) < 0.1 && Math.abs(target.y - position.y) < 0.1
            && Math.abs(velocity.x) < 0.1 && Math.abs(velocity.y) < 0.1;

        if (settled) {
            animating = false;
        } else {
            requestAnimationFrame(step);
        }
    }

    // follow the mouse
    document.addEventListener('mousemove', event => {
        target.x = event.clientX;
        target.y = event.clientY;

        // jump straight to the mouse the first time so it doesn't fly in from the corner
        if (!hasMoved || reduceMotion) {
            position.x = target.x;
            position.y = target.y;
            hasMoved = true;
            draw();
        } else if (!animating) {
            animating = true;
            lastTime = performance.now();
            requestAnimationFrame(step);
        }

        cursor.classList.add('is-visible');
    });

    // hide when the mouse leaves the window
    document.documentElement.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-visible');
    });

    // grow while the mouse button is held down
    document.addEventListener('mousedown', () => cursor.classList.add('is-down'));
    document.addEventListener('mouseup', () => cursor.classList.remove('is-down'));
}
