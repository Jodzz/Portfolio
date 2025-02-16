let modeBtn = document.getElementById("switchMode");
modeBtn.addEventListener('click', () => {
    document.body.classList.toggle("light");
});

let saveCursorPosition = function (x, y, width, height) {
    let xPercent = ((x / width) * 100).toFixed(2);
    let yPercent = ((y / height) * 100).toFixed(2);
    document.documentElement.style.setProperty('--x', xPercent + '%');
    document.documentElement.style.setProperty('--y', yPercent + '%');
};

let cards = document.querySelectorAll(".custom-card");

cards.forEach((card, index) => {
    card.style.animation = "glow 2s " + (0.5 * index) + "s ease-in-out";

    card.addEventListener("animationend", () => {
        card.style.animation = "none";
        void card.offsetWidth;
        if(index == cards.length - 1){
            cards.forEach((card, index) => {
                card.style.animation = "glow 2s " + (0.5 * index) + "s ease-in-out";
            });
        }
    });
    
    let lastX = 0, lastY = 0;

    card.addEventListener('mousemove', e => {
        let rect = card.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        if (Math.abs(x - lastX) > 1 || Math.abs(y - lastY) > 1) {
            lastX = x;
            lastY = y;
            requestAnimationFrame(() => saveCursorPosition(x, y, rect.width, rect.height));
        }
    });
});

function currentYPosition() {
    return window.scrollY || document.documentElement.scrollTop || 0;
}

function elmYPosition(eID) {
    var elm = document.getElementById(eID);
    var y = elm.offsetTop;
    var node = elm;
    while (node.offsetParent && node.offsetParent != document.body) {
        node = node.offsetParent;
        y += node.offsetTop;
    } 
    return y - 40; //Adjusts for header size
}

function smoothScroll(eID) {
    var startY = currentYPosition();
    var stopY = elmYPosition(eID);
    var distance = stopY > startY ? stopY - startY : startY - stopY;
    if (distance < 100) {
        scrollTo(0, stopY); 
        return;
    }
    var speed = Math.round(distance / 100);
    if (speed >= 20) speed = 20;
    var step = Math.round(distance / 25);
    var leapY = stopY > startY ? startY + step : startY - step;
    var timer = 0;
    if (stopY > startY) {
        for (var i = startY; i < stopY; i += step ) {
            setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
            leapY += step; 
            if (leapY > stopY) leapY = stopY; 
            timer++;
        } 
        return;
    }
    for ( var i=startY; i>stopY; i-=step ) {
        setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
        leapY -= step; 
        if (leapY < stopY) leapY = stopY; 
        timer++;
    }
}

let menuItems = document.querySelectorAll(".menu__btn");

menuItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        smoothScroll(item.dataset.target);
        menuItems.forEach((item, indexSec) => {
            if(index != indexSec) item.classList.remove('active');
            else item.classList.add('active');
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("#bio, #work");
    const menuButtons = document.querySelectorAll(".menu__btn");

    function updateActiveMenu() {
        let viewportMid = currentYPosition() + window.innerHeight / 2; // Midpoint of the viewport
        let activeSection = "bio"; // Default section

        sections.forEach(section => {
            let sectionTop = section.offsetTop;

            if (sectionTop <= viewportMid) {
                activeSection = section.id;
            }
        });

        menuButtons.forEach(btn => {
            btn.classList.toggle("active", btn.dataset.target === activeSection);
        });
    }

    // Run on load & scroll
    updateActiveMenu();
    document.addEventListener("scroll", updateActiveMenu);
});