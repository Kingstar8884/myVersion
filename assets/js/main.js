const body = document.body;
const image = body.querySelector('#coin');
const h1 = body.querySelector('h1');

let coins = localStorage.getItem('coins');
let total = localStorage.getItem('total');
let power = localStorage.getItem('power');
let count = localStorage.getItem('count')

if(coins == null){
    localStorage.setItem('coins' , '0');
    h1.textContent = '0';
}else{
    h1.textContent = Number(coins).toLocaleString();
}

if(total == null){
    localStorage.setItem('total' , '500')
    body.querySelector('#total').textContent = '/500';
}else {
    body.querySelector('#total').textContent = `/${total}`;
}


if(power == null){
    localStorage.setItem('power' , '500');
    body.querySelector('#power').textContent = '500';
}else{
    body.querySelector('#power').textContent = power;
}


if(count == null){
    localStorage.setItem('count' , '1')
}



/*

image.addEventListener('click' , (e)=> {

    //let x = e.offsetX;
    //let y = e.offsetY;


    if (navigator.vibrate) {
        navigator.vibrate(200);
    }

    coins = localStorage.getItem('coins');
    power = localStorage.getItem('power');
    
    if(Number(power) > 0){
        localStorage.setItem('coins' , `${Number(coins) + 1}`);
        h1.textContent = `${(Number(coins) + 1).toLocaleString()}`;
    
        localStorage.setItem('power' , `${Number(power) - 1}`);
        body.querySelector('#power').textContent = `${Number(power) - 1}`;
    } 
    //
    
        let x = e.offsetX;
    let y = e.offsetY;
    let width = image.offsetWidth;
    let height = image.offsetHeight;

    let translateX = 0;
    let translateY = 0;
    let skewX = 0;
    let skewY = 0;
    let scale = 1.1;

    if (x < width / 2 && y < height / 2) {
        translateX = -0.25;
        translateY = -0.25;
        skewY = -10;
        skewX = 5;
    } else if (x < width / 2 && y > height / 2) {
        translateX = -0.25;
        translateY = 0.25;
        skewY = -10;
        skewX = 5;
    } else if (x > width / 2 && y > height / 2) {
        translateX = 0.25;
        translateY = 0.25;
        skewY = 10;
        skewX = -5;
    } else if (x > width / 2 && y < height / 2) {
        translateX = 0.25;
        translateY = -0.25;
        skewY = 10;
        skewX = -5;
    } else {
        scale = 1.2; // Slightly larger scale for clicks near the center
    }

    image.style.transform = `translate(${translateX}rem, ${translateY}rem) skewY(${skewY}deg) skewX(${skewX}deg) scale(${scale})`;
    
    setTimeout(() => {
        image.style.transform = 'translate(0px, 0px) scale(1)';
    }, 100);
    /*
    if(x < 150 & y < 150){
        image.style.transform = 'translate(-0.25rem, -0.25rem) skewY(-10deg) skewX(5deg)';
    }
    else if (x < 150 & y > 150){
        image.style.transform = 'translate(-0.25rem, 0.25rem) skewY(-10deg) skewX(5deg)';
    }
    else if (x > 150 & y > 150){
        image.style.transform = 'translate(0.25rem, 0.25rem) skewY(10deg) skewX(-5deg)';
    }
    else if (x > 150 & y < 150){
        image.style.transform = 'translate(0.25rem, -0.25rem) skewY(10deg) skewX(-5deg)';
    }


    setTimeout(()=>{
        image.style.transform = 'translate(0px, 0px)';
    }, 100);

    body.querySelector('.progress').style.width = `${(100 * power) / total}%`;
});

setInterval(()=> {
    count = localStorage.getItem('count')
    power = localStorage.getItem('power');
    if(Number(total) > power){
        localStorage.setItem('power' , `${Number(power) + Number(count)}`);
        body.querySelector('#power').textContent = `${Number(power) + Number(count)}`;
        body.querySelector('.progress').style.width = `${(100 * power) / total}%`;
    }
}, 1000);
*/



let activeTouches = 0;

image.addEventListener('touchstart', (e) => {
    e.preventDefault();
    activeTouches = e.touches.length;

    for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const x = touch.pageX - image.getBoundingClientRect().left;
        const y = touch.pageY - image.getBoundingClientRect().top;
        const width = image.offsetWidth;
        const height = image.offsetHeight;

        let translateX = 0;
        let translateY = 0;
        let skewX = 0;
        let skewY = 0;
        let scale = 1.1;

        if (x < width / 2 && y < height / 2) {
            translateX = -0.25;
            translateY = -0.25;
            skewY = -10;
            skewX = 5;
        } else if (x < width / 2 && y > height / 2) {
            translateX = -0.25;
            translateY = 0.25;
            skewY = -10;
            skewX = 5;
        } else if (x > width / 2 && y > height / 2) {
            translateX = 0.25;
            translateY = 0.25;
            skewY = 10;
            skewX = -5;
        } else if (x > width / 2 && y < height / 2) {
            translateX = 0.25;
            translateY = -0.25;
            skewY = 10;
            skewX = -5;
        }

        image.style.transform = `translate(${translateX}rem, ${translateY}rem) skewY(${skewY}deg) skewX(${skewX}deg) scale(${scale})`;
    }

    // Apply vibration if available
    if (navigator.vibrate) {
        navigator.vibrate(5);
    }

    // Update coin count and power
    coins = localStorage.getItem('coins');
    power = localStorage.getItem('power');

    if (Number(power) > 0) {
        localStorage.setItem('coins', `${Number(coins) + activeTouches}`);
        h1.textContent = `${(Number(coins) + activeTouches).toLocaleString()}`;

        localStorage.setItem('power', `${Number(power) - activeTouches}`);
        document.querySelector('#power').textContent = `${Number(power) - activeTouches}`;
    }
});

image.addEventListener('touchend', () => {
    // Reset the image transformation after touch ends
    image.style.transform = 'translate(0px, 0px) scale(1)';
});