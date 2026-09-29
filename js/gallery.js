// Gallery lightbox: clicking a photo shows it large in the middle of the screen with the page darkened,
// clicking anywhere outside the photo (or pressing Esc) closes it again
const lightbox = document.querySelector('.lightbox');

if (lightbox) {
    const lightboxImage = lightbox.querySelector('img');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function open(image) {
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        // wide photos get a smaller size (see about.css) so they don't fill the whole screen
        lightbox.classList.toggle('is-landscape', image.naturalWidth > image.naturalHeight);
        lightbox.showModal();

        // the open dialog sits above everything, so the custom cursor moves inside it to stay visible
        const cursor = document.querySelector('.cursor');
        if (cursor) lightbox.append(cursor);
    }

    function close() {
        if (!lightbox.open || lightbox.classList.contains('is-closing')) return;

        const finish = () => {
            lightbox.classList.remove('is-closing');
            lightbox.close();

            const cursor = lightbox.querySelector('.cursor');
            if (cursor) document.body.append(cursor);
        };

        if (reduceMotion) {
            finish();
            return;
        }

        // play the fade out first, then actually close
        lightbox.classList.add('is-closing');
        lightbox.addEventListener('animationend', finish, { once: true });
    }

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => open(item.querySelector('img')));
    });

    // clicks on the photo itself do nothing, anywhere else closes
    lightbox.addEventListener('click', event => {
        if (event.target !== lightboxImage) close();
    });

    // Esc: use the same fade out instead of closing instantly
    lightbox.addEventListener('cancel', event => {
        event.preventDefault();
        close();
    });
}
