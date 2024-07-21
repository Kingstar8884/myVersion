const body = document.body;
const image = body.querySelector('#coin');
const h1 = body.querySelector('h1');

let coins = Number(localStorage.getItem('coins')) || 0;
let total = Number(localStorage.getItem('total')) || 500;
let power = Number(localStorage.getItem('power')) || 500;
let count = Number(localStorage.getItem('count')) || 1;
let lastRefillTime = Number(localStorage.getItem('lastRefillTime')) || Date.now();

h1.textContent = coins.toLocaleString();
body.querySelector('#total').textContent = `/${total}`;
body.querySelector('#power').textContent = power.toString();
body.querySelector('.progress').style.width = `${(100 * power) / total}%`;

function refillPower() {
    const now = Date.now();
    const elapsedSeconds = (now - lastRefillTime) / 1000;
    const powerToAdd = Math.floor(elapsedSeconds * count);

    power = Math.min(total, power + powerToAdd);
    lastRefillTime = now;

    localStorage.setItem('power', power.toString());
    localStorage.setItem('lastRefillTime', now.toString());
    body.querySelector('#power').textContent = power.toString();
    body.querySelector('.progress').style.width = `${(100 * power) / total}%`;
}

function showAddedCount(x, y, amount) {
    const indicator = document.createElement('div');
    indicator.textContent = `+${amount}`;
    indicator.style.position = 'absolute';
    indicator.style.left = `${x}px`;
    indicator.style.top = `${y}px`;
    indicator.style.fontSize = '2rem';
    indicator.style.color = 'white';
    indicator.style.fontWeight = 'bold';
    indicator.style.pointerEvents = 'none';
    indicator.style.opacity = '1';
    indicator.style.transition = 'opacity 1s, transform 1s';
    indicator.style.transform = 'translateY(0)';

    body.appendChild(indicator);

    // Animate the element
    setTimeout(() => {
        indicator.style.opacity = '0';
        indicator.style.transform = 'translateY(-100px)';
    }, 0);

    // Remove the element after animation
    setTimeout(() => {
        indicator.remove();
    }, 500);
}

image.addEventListener('touchstart', (e) => {
    e.preventDefault();

    if (power <= 0) return; // Prevent action if power is 0 or less

    if (navigator.vibrate) {
        navigator.vibrate(200);
    }

    const touches = e.touches.length;
    const availablePower = Math.min(touches, power);

    // Update in-memory variables
    coins += availablePower;
    power -= availablePower;

    // Reflect changes on the UI
    h1.textContent = coins.toLocaleString();
    body.querySelector('#power').textContent = power.toString();
    body.querySelector('.progress').style.width = `${(100 * power) / total}%`;

    // Batch localStorage updates
    localStorage.setItem('coins', coins.toString());
    localStorage.setItem('power', power.toString());

    // Show indicators for each touch
    for (let i = 0; i < availablePower; i++) {
        const touch = e.touches[i];
        const x = touch.pageX - image.getBoundingClientRect().left;
        const y = touch.pageY - image.getBoundingClientRect().top;
        const width = image.offsetWidth;
        const height = image.offsetHeight;

        // Delay each touch animation slightly to manage multiple animations smoothly
        setTimeout(() => {
            animateImage(x, y, width, height);
            showAddedCount(touch.pageX, touch.pageY, 1); // Show +1 for each touch
        }, i * 50);
    }
});

function animateImage(x, y, width, height) {
    let translateX = 0;
    let translateY = 0;
    let skewX = 0;
    let skewY = 0;
    let scale = 1.02; // Further reduced scale for more subtle effect

    if (x < width / 2 && y < height / 2) {
        translateX = -0.1; // Further reduced translation
        translateY = -0.1; // Further reduced translation
        skewY = -3; // Reduced skew
        skewX = 1; // Reduced skew
    } else if (x < width / 2 && y > height / 2) {
        translateX = -0.1; // Further reduced translation
        translateY = 0.1; // Further reduced translation
        skewY = -3; // Reduced skew
        skewX = 1; // Reduced skew
    } else if (x > width / 2 && y > height / 2) {
        translateX = 0.1; // Further reduced translation
        translateY = 0.1; // Further reduced translation
        skewY = 3; // Reduced skew
        skewX = -1; // Reduced skew
    } else if (x > width / 2 && y < height / 2) {
        translateX = 0.1; // Further reduced translation
        translateY = -0.1; // Further reduced translation
        skewY = 3; // Reduced skew
        skewX = -1; // Reduced skew
    } else {
        scale = 1.05; // Slightly larger scale for clicks near the center
    }

    image.style.transform = `translate(${translateX}rem, ${translateY}rem) skewY(${skewY}deg) skewX(${skewX}deg) scale(${scale})`;

    setTimeout(() => {
        image.style.transform = 'translate(0px, 0px) scale(1)';
    }, 100);
}

setInterval(refillPower, 1000);

// Refill power when the page becomes visible again
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        refillPower();
    }
});