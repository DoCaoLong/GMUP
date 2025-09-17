gsap.registerPlugin(ScrollTrigger);
var swiper = new Swiper(".swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 5,
        slideShadows: false,
    },
    loop: true,
    // Navigation arrows
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    keyboard: {
        enabled: true,
    },
    mousewheel: {
        thresholdDelta: 70,
    },
    breakpoints: {
        560: {
            slidesPerView: 2.5,
        },
        768: {
            slidesPerView: 3,
        },
        1024: {
            slidesPerView: 3,
        },
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
});
// header background opacity on scroll
const header = document.querySelector(".header");

const maxScroll = 200;

window.addEventListener("scroll", () => {
    let progress = window.scrollY / maxScroll;
    if (progress > 1) progress = 1;
    const opacity = progress * 0.8;
    header.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
});

// Ngày kết thúc: 15/11/2025 00:00:00 GMT+7
const countDownDate = new Date(
    new Date("2025-11-25T00:00:00").toLocaleString("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
    })
).getTime();

// Count down timer
const timer = setInterval(() => {
    // Lấy giờ hiện tại tại Việt Nam
    const now = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
    });
    const nowTime = new Date(now).getTime();

    const distance = countDownDate - nowTime;

    if (distance <= 0) {
        clearInterval(timer);
        document.querySelector(".hero_countdowns").innerHTML =
            "<h2>Đã đến ngày!</h2>";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days
        .toString()
        .padStart(2, "0");
    document.getElementById("hours").innerText = hours
        .toString()
        .padStart(2, "0");
    document.getElementById("minutes").innerText = minutes
        .toString()
        .padStart(2, "0");
    document.getElementById("seconds").innerText = seconds
        .toString()
        .padStart(2, "0");
}, 1000);

// Mobile menu toggle functionality using GSAP

const toggleButton = document.getElementById("menuToggle");
const navMenu = document.getElementById("mobileMenu");
const closeButton = document.getElementById("close_menu");
document.querySelectorAll('.header_nav a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
        if (window.innerWidth < 1024) {
            navMenu.style.display = "none"; 
        }
    });
});
if (!toggleButton || !navMenu || !closeButton) {
    console.warn("Missing menu elements");
} else {
    const menuItems = navMenu.querySelectorAll("ul li");
    const mq = window.matchMedia("(min-width:1024px)");
    let tl; // timeline mobile

    function clearDesktopInline() {
        // Bỏ toàn bộ inline do GSAP để desktop tự hiện
        gsap.set(navMenu, { clearProps: "all" });
        menuItems.forEach((el) => gsap.set(el, { clearProps: "all" }));
        // Phòng hờ:
        navMenu.style.removeProperty("display");
        navMenu.style.removeProperty("transform");
        navMenu.style.removeProperty("opacity");
    }

    function initMobileTl() {
        // Tạo timeline chỉ cho mobile
        tl = gsap.timeline({
            paused: true,
            defaults: { ease: "power3.out" },
            onStart: () => (navMenu.style.display = "flex"),
            onReverseComplete: () => {
                navMenu.style.display = "none";
                gsap.set(navMenu, { x: "100%" });
                gsap.set(menuItems, { opacity: 0, y: 20 });
            },
        });

        gsap.set(navMenu, { x: "100%", display: "none" });
        gsap.set(menuItems, { opacity: 0, y: 20 });

        tl.to(navMenu, { duration: 0.35, x: "0%" }).to(
            menuItems,
            { duration: 0.4, opacity: 1, y: 0, stagger: 0.08 },
            "-=0.15"
        );
    }

    function setupByViewport() {
        if (mq.matches) {
            // Desktop
            if (tl) tl.progress(0).kill();
            clearDesktopInline();
            // Ẩn nút mobile (nếu muốn) => CSS sẽ lo
            toggleButton.onclick = null;
            closeButton.onclick = null;
            navMenu.onclick = null;
        } else {
            // Mobile
            clearDesktopInline(); // reset trước khi tạo timeline
            initMobileTl();
            toggleButton.onclick = () =>
                tl.reversed() ? tl.play() : tl.restart();
            closeButton.onclick = () => tl.reverse();
            navMenu.addEventListener("click", (e) => {
                if (e.target === navMenu) tl.reverse();
            });
        }
    }

    // ESC để đóng (chỉ tác dụng ở mobile khi tl tồn tại)
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && tl && !tl.isActive() && tl.progress() > 0)
            tl.reverse();
    });

    // Init + lắng nghe thay đổi viewport
    setupByViewport();
    mq.addEventListener?.("change", setupByViewport);
}

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

function runIntro() {
    if (reduceMotion) return;

    // Trạng thái ban đầu
    gsap.set(".header_logo, .header_nav ul li, .menu_toggle", {
        opacity: 0,
    });
    gsap.set([".hero_text", ".hero_logo", ".hero_title", ".hero_desc"], {
        opacity: 0,
        y: 30,
    });
    gsap.set(".hero_countdowns .countdown_item", { opacity: 0, y: 20 });
    gsap.set(".hero_buttons a", { opacity: 0, y: 20 });
    gsap.set(".hero_mouse", { opacity: 0, y: 10 });

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.to(".header_logo, .header_nav ul li, .menu_toggle", {
        opacity: 1,
        duration: 0.3,
        stagger: 0.1,
    });

    tl.to(".hero_text", { opacity: 1, y: 0, duration: 0.4 }, "-=0.2")
        .to(".hero_logo", { opacity: 1, y: 0, duration: 0.4 }, "-=0.3")
        .to(".hero_title", { opacity: 1, y: 0, duration: 0.4 }, "-=0.25")
        .to(".hero_desc", { opacity: 1, y: 0, duration: 0.4 }, "-=0.35")
        .to(
            ".hero_countdowns .countdown_item",
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.08,
            },
            "-=0.2"
        )
        .fromTo(
            ".hero_countdowns .countdown_number",
            { scale: 0.9 },
            { scale: 1, duration: 0.35, stagger: 0.06, ease: "back.out(2)" },
            "<"
        )
        .to(
            ".hero_buttons a",
            { opacity: 1, y: 0, duration: 0.2, stagger: 0.08 },
            "-=0.1"
        )
        .to(".hero_mouse", { opacity: 1, y: 0, duration: 0.2 }, "-=0.3");
}

// Chạy khi load
window.addEventListener("load", runIntro);

window.addEventListener("pageshow", (e) => {
    if (e.persisted) runIntro();
});

function popOnce(el) {
    if (reduceMotion) return;
    gsap.fromTo(
        el,
        { scale: 0.95 },
        { scale: 1, duration: 0.2, ease: "power1.out" }
    );
}

popOnce(document.getElementById("seconds"));

// Animate các section khi scroll vào view
let sections = document.querySelectorAll(".section");
sections.forEach((sec) => {
    gsap.set(sec, { opacity: 0, y: 60 });

    gsap.to(sec, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
            trigger: sec,
            start: "top 80%",
            toggleActions: "play none none none",
        },
    });
});

const cursor = document.querySelector(".cursor");

// Di chuyển chuột
document.addEventListener("mousemove", (e) => {
    cursor.style.top = `${e.clientY}px`;
    cursor.style.left = `${e.clientX}px`;
});

// Thêm / gỡ class khi hover
const hoverTargets = document.querySelectorAll("a, button, .mouse_hover");

hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("active"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("active"));
});

// Back to top button
const backBtn = document.querySelector(".back-to-home");

window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
        backBtn.style.display = "flex";
    } else {
        backBtn.style.display = "none";
    }
});

backBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Bắt tất cả link có href bắt đầu bằng "#"
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            targetEl.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    });
});
