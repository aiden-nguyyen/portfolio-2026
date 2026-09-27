// Splits big titles into one span per letter so each letter can bob in on a stagger
// (or fade in with its whole line),
// and bob again when the cursor passes over it
// The hero title plays on load, "Let's Connect" waits until it's scrolled into view

function splitIntoLetters(title) {
    // Screen readers read the full title once instead of letter by letter
    // (textContent keeps the real capitalisation, the CSS uppercase is only visual)
    title.setAttribute('aria-label', title.textContent.replace(/\s+/g, ' ').trim());

    let letterIndex = 0;

    // collect every text node first, including ones inside the styled spans
    const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach(node => {
        const fragment = document.createDocumentFragment();

        node.textContent.split(/(\s+)/).forEach(part => {
            if (part.trim() === '') {
                fragment.append(part);
                return;
            }

            // wrap each word so it never breaks across lines mid-word
            const word = document.createElement('span');
            word.className = 'split-word';
            word.setAttribute('aria-hidden', 'true');

            // lines marked .title-fade fade in as a whole, so every letter in them
            // shares the delay of the line's first letter instead of staggering
            const fadeLine = node.parentElement.closest('.title-fade');
            if (fadeLine && fadeLine.dataset.start === undefined) fadeLine.dataset.start = letterIndex;

            for (const char of part) {
                const letter = document.createElement('span');
                letter.className = 'split-letter';
                letter.textContent = char;
                letter.style.setProperty('--i', fadeLine ? fadeLine.dataset.start : letterIndex);
                letterIndex++;
                word.append(letter);
            }

            fragment.append(word);
        });

        node.replaceWith(fragment);
    });

    title.querySelectorAll('.split-letter').forEach(letter => {
        // hover bob only starts once the letter has finished bobbing in
        letter.addEventListener('animationend', event => {
            if (event.animationName === 'letter-in' || event.animationName === 'letter-fade') {
                letter.classList.add('is-ready');
            }
            if (event.animationName === 'letter-bob') letter.classList.remove('is-bobbing');
        });

        letter.addEventListener('mouseenter', () => {
            if (letter.classList.contains('is-ready')) letter.classList.add('is-bobbing');
        });
    });
}

const heroTitle = document.querySelector('.hero-title');
if (heroTitle) splitIntoLetters(heroTitle);

const footerTitle = document.querySelector('.footer-title');
if (footerTitle) {
    splitIntoLetters(footerTitle);
    footerTitle.classList.add('is-waiting');

    // start the bob-in the first time the title scrolls into view
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            footerTitle.classList.remove('is-waiting');
            observer.disconnect();
        }
    }, { threshold: 0.5 });

    observer.observe(footerTitle);
}
