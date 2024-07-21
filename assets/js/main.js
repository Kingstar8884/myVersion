const body = document.body;
const image = body.querySelector('#coin');
const h1 = body.querySelector('h1');

let coins = localStorage.getItem('coins');
let total = localStorage.getItem('total');
let power = localStorage.getItem('power');
let count = localStorage.getItem('count');
let lastRefillTime = localStorage.getItem('lastRefillTime');

if (coins == null) {
    localStorage.setItem('coins', '0');
    h1.textContent = '0';
} else {
    h1.textContent = Number(coins).toLocaleString();
}

if (total == null) {
    localStorage.setItem('total', '500');
    body.querySelector('#total').textContent = '/500';
} else {
    body.querySelector('#total').textContent = `/${total}`;
}

if (power == null) {
    localStorage.setItem('power', '500');
    body.querySelector('#power').textContent = '500';
} else {
    body.querySelector('#power').textContent = power;
}

if (count == null) {
    localStorage.setItem('count', '1');
}

if (lastRefillTime == null) {
    localStorage.setItem('lastRefillTime', Date.now().toString());
}

function refillPower() {
    const now = Date.now();
    const lastRefill = Number(localStorage.getItem('lastRefillTime'));
    const elapsedSeconds = (now - lastRefill) / 1000;
    const powerToAdd = Math.floor(elapsedSeconds * Number(count));

    power = Number(localStorage.getItem('power')) + powerToAdd;
    if (power > total) {
        power = total;
    }

    localStorage.setItem('power', power.toString());
    localStorage.setItem('lastRefillTime', now.toString());
    body.querySelector('#power').textContent = power.toString();
    body.querySelector('.progress').style.width = `${(100 * power) / total}%`;
}

image.addEventListener('touchstart', (e) => {
    e.preventDefault();

    coins = Number(localStorage.getItem('coins'));
    power = Number(localStorage.getItem('power'));

    if (power <= 0) return; // Prevent action if power is 0 or less

    if (navigator.vibrate) {
        navigator.vibrate(200);
    }

    const touches = e.touches.length;
    const availablePower = Math.min(touches, power);

    // Update coins and power based on the number of touches and available power
    localStorage.setItem('coins', `${coins + availablePower}`);
    h1.textContent = `${(coins + availablePower).toLocaleString()}`;

    localStorage.setItem('power', `${power - availablePower}`);
    body.querySelector('#power').textContent = `${power - availablePower}`;

    for (let i = 0; i < availablePower; i++) {
        const touch = e.touches[i];
        const x = touch.pageX - image.getBoundingClientRect().left;
        const y = touch.pageY - image.getBoundingClientRect().top;
        const width = image.offsetWidth;
        const height = image.offsetHeight;

        // Delay each touch animation slightly to manage multiple animations smoothly
        setTimeout(() => {
            animateImage(x, y, width, height);
        }, i * 50);
    }

    body.querySelector('.progress').style.width = `${(100 * power) / total}%`;
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