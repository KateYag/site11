function initMarquee(selector, speed = 0.8) {
    const marquee = document.querySelector(selector);
    if (!marquee) return;

    const text = marquee.innerHTML;
    marquee.innerHTML += text + text; // Дублируем контент

    let pos = 0;
    function move() {
        pos -= speed;
        if (pos < -marquee.offsetWidth / 2) {
            pos = 0; // Сброс позиции
        }
        marquee.style.transform = `translateX(${pos}px)`;
        requestAnimationFrame(move);
    }
    move();
}

// Запускаем для нужных элементов
initMarquee('.wedding-day-content');
initMarquee('.save-day-content');
initMarquee('.wedding-loc-content');
initMarquee('.wedding-wish-content');


const calendarDays = document.getElementById('calendar-days');
const daysInMonth = 31;
const startDay = new Date(2025, 7, 1).getDay(); // Получаем день недели (0 = Вс, 1 = Пн)

const adjustedStartDay = startDay === 0 ? 6 : startDay - 1; // Делаем так, чтобы 1 = Пн, 6 = Сб, 0 = Вс

// Добавляем пустые клетки перед 1-м числом месяца
for (let i = 0; i < adjustedStartDay; i++) {
    let emptyCell = document.createElement('div');
    emptyCell.classList.add('day', 'empty');
    calendarDays.appendChild(emptyCell);
}

// Добавляем дни месяца
for (let day = 1; day <= daysInMonth; day++) {
    let dayCell = document.createElement('div');
    dayCell.classList.add('day');
    dayCell.textContent = day;

    if (day === 6) {
        dayCell.classList.add('special');
        let heart = document.createElement('span');
        heart.classList.add('heart');
        heart.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 1189" width="16" height="16">
            <g transform="translate(0,1189) scale(0.1,-0.1)" fill="#7a0f21">
                <path d="M3250 11884 c-25 -2 -106 -11 -180 -20 -1485 -172 -2704 -1295 -3001 -2764 
                -133 -660 -67 -1507 171 -2223 252 -753 675 -1411 1397 -2172 342 -360 634 -630 
                1588 -1470 231 -203 488 -430 570 -505 1024 -920 1735 -1692 2346 -2547 l130 -183 
                132 0 132 1 130 192 c557 822 1212 1560 2185 2461 191 178 408 373 1027 923 956 
                852 1445 1343 1841 1850 643 825 968 1603 1064 2553 19 196 17 665 -5 835 -105 805 
                -441 1497 -998 2054 -557 557 -1250 894 -2054 998 -193 24 -613 24 -810 0 -733 -93 
                -1379 -387 -1920 -874 -191 -172 -406 -417 -535 -610 -30 -45 -57 -82 -60 -82 -3 0 
                -30 37 -60 82 -129 193 -344 438 -535 610 -531 478 -1170 773 -1878 867 -146 20 
                -562 34 -677 24z"/>
            </g>
        </svg>
    `;
        dayCell.appendChild(heart);
    }

    calendarDays.appendChild(dayCell);
}








window.onload = function() {
    const preloader = document.querySelector('.preloader');

    // Запускаем анимацию букв через 1 секунду
    setTimeout(() => {
        preloader.classList.add('show-main');
    }, 1000);

    // Убираем прелоадер через 3 секунды
    setTimeout(() => {
        preloader.classList.add('hidden-main');
        setTimeout(() => {
            preloader.remove(); // Полностью удаляем прелоадер
        }, 1000);
    }, 3000);
};





// Функция для проверки, попал ли элемент в область видимости
function isElementInView(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Функция для добавления класса active при попадании в область видимости
function handleScroll() {
    const blocks = document.querySelectorAll('.dresscode-info-block');
    blocks.forEach(block => {
        if (isElementInView(block)) {
            block.classList.add('active');
        }
    });
}

// Слушаем событие scroll
window.addEventListener('scroll', handleScroll);

// Инициализация при загрузке страницы, чтобы анимация сработала сразу, если элементы уже видимы
handleScroll();











document.querySelector(".wedding-form").addEventListener("submit", async function (e) {
    e.preventDefault(); // Останавливаем стандартную отправку формы

    // 🔹 ЗАМЕНИТЬ НА СВОИ ДАННЫЕ!
    const TOKEN = "7644603205:AAHP68FDVDVowQhLnkeCxdqOR0565Pggtns";
    const CHAT_ID = "390335723";
    const API_URL = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

    const fieldNames = {
        attendance: "Присутствие",
        fullname: "Имя и фамилия",
        drink: "Предпочтение по напиткам",
        wishes: "Пожелания",
    };
    // Собираем данные из формы
    const formData = new FormData(this);
    let message = "<b>Новая заявка на свадьбу 🎉</b>\n\n";
    let drinks = [];

    for (let [key, value] of formData.entries()) {
        if (key === "drink") {
            drinks.push(value); // Добавляем в массив, не отправляем сразу
        } else {
            let fieldName = fieldNames[key] || key;
            message += `<b>${fieldName}:</b> ${value}\n`;
        }
    }
    if (drinks.length > 0) {
        message += `<b>Предпочтение по напиткам:</b> ${drinks.join(", ")}\n`;
    }
    // Отправляем запрос в Telegram
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            parse_mode: "HTML",
        }),
    });

    if (response.ok) {
        alert("Форма успешно отправлена!");
        this.reset(); // Очистка формы
    } else {
        alert("Ошибка при отправке. Попробуйте еще раз.");
    }
});

function startCountdown(targetDate) {
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = targetDate - now;

        if (timeLeft <= 0) {
            document.getElementById("countdown").innerHTML = "Событие началось!";
            clearInterval(interval);
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = days;
        document.getElementById("hours").textContent = hours;
        document.getElementById("minutes").textContent = minutes;
        document.getElementById("seconds").textContent = seconds;
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
}

// Устанавливаем дату окончания
const targetDate = new Date("August 6, 2025 12:00:00").getTime();
startCountdown(targetDate);



document.addEventListener("DOMContentLoaded", () => {
    const hiddenElements = document.querySelectorAll(".hidden");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    hiddenElements.forEach(element => observer.observe(element));
});

document.addEventListener("DOMContentLoaded", () => {
    const hiddenElements = document.querySelectorAll(".hid");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    hiddenElements.forEach(element => observer.observe(element));
});


document.addEventListener("DOMContentLoaded", function () {
    const parallax = document.querySelector(".parallax-bg");

    window.addEventListener("scroll", function () {
        let scrollPosition = window.scrollY;
        parallax.style.transform = `scale(1.1) translateY(${scrollPosition * 0.2}px)`;
    });
});


// document.addEventListener("DOMContentLoaded", function () {
//     const parallax = document.querySelector(".parallax-window");
//     const imageSrc = parallax.getAttribute("data-image-src");
//
//     // Добавляем фон через ::before
//     parallax.style.position = "relative";
//     parallax.style.overflow = "hidden";
//     parallax.style.background = "none";
//
//     const bg = document.createElement("div");
//     bg.style.position = "absolute";
//     bg.style.top = "0";
//     bg.style.left = "0";
//     bg.style.width = "100%";
//     bg.style.height = "130%"; // Чуть больше, чтобы плавно двигалось
//     bg.style.backgroundImage = ``;
//     bg.style.backgroundSize = "cover";
//     bg.style.backgroundPosition = "center";
//     bg.style.willChange = "transform";
//     parallax.appendChild(bg);
//
//     function updateParallax() {
//         let scrollTop = window.scrollY;
//         let parallaxSpeed = 0.3; // Чем меньше, тем медленнее
//
//         bg.style.transform = `translateY(${scrollTop * parallaxSpeed}px)`;
//     }
//
//     window.addEventListener("scroll", updateParallax);
// });

$(document).ready(function() {
    function initSlick() {
        if ($(window).width() <= 500) {
            if (!$('.invite-photos').hasClass('slick-initialized')) {
                $('.invite-photos').slick({
                    dots: true,
                    infinite: true,
                    speed: 500,
                    fade: true,
                    cssEase: 'linear'
                });
            }
        } else {
            if ($('.invite-photos').hasClass('slick-initialized')) {
                $('.invite-photos').slick('unslick'); // Отключаем слайдер
            }
        }
    }

    initSlick(); // Запуск при загрузке страницы

    $(window).on('resize', function() {
        initSlick(); // Запуск при изменении размера экрана
    });
});
