(() => {
    const text = document.getElementById("animated-text");
    const words = text.textContent.trim().split(/\s+/);
    text.textContent = "";

    const frag = document.createDocumentFragment();
    let totalLetters = 0;

    words.forEach((word, wi) => {
        const wordSpan = document.createElement("span");
        wordSpan.style.display = "inline-block";
        wordSpan.style.marginRight = "20px";

        for (let i = 0; i < word.length; i++) {
            const span = document.createElement("span");
            span.textContent = word[i];
            span.className = "letter";
            const orderIndex = wi * word.length + i;
            span.dataset.delay = (orderIndex * 0.1).toString();
            wordSpan.appendChild(span);
            totalLetters++;
        }
        frag.appendChild(wordSpan);
    });
    text.appendChild(frag);

    const letters = Array.from(text.querySelectorAll(".letter"));
    let colorShift = 0;

    function tick() {
        const len = letters.length || 1;
        for (let i = 0; i < len; i++) {
            const hue = ((i * 360) / len + colorShift) % 360;
            letters[i].style.color = `hsl(${hue}, 70%, 60%)`;
        }
        colorShift = (colorShift + 1) % 360;
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
})();

(() => {
    const btn = document.getElementById("circle-animation");
    const overlay = document.getElementById("fwOverlay");
    const sound = document.getElementById("fireworksSound");

    function restartDotLottie(el) {
        const parent = el.parentNode;
        const clone = el.cloneNode(true);
        parent.replaceChild(clone, el);
        return clone;
    }

    async function startFireworks() {
        overlay.style.display = "flex";
        const lottieEl = document.getElementById("fwAnim");
        const fresh = restartDotLottie(lottieEl);

        try {
            sound.currentTime = 0;
            sound.volume = 0.9;
            await sound.play();
        } catch {}

        let hidden = false;
        const hide = () => {
            if (!hidden) {
                overlay.style.display = "none";
                hidden = true;
            }
        };
        fresh.addEventListener?.("complete", hide);

        document
            .querySelectorAll("#animated-text .letter")
            .forEach((letter) => {
                const d = parseFloat(letter.dataset.delay || "0");
                letter.style.animation = `bounce 1s ease-in-out infinite ${d}s, glow 2s ease-in-out infinite ${
                    d * 2
                }s`;
            });
    }

    btn.addEventListener("click", (e) => {
        e.preventDefault();
        btn.style.display = "none";
        document.getElementById("helloText").style.display = "block";
        startFireworks();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            startFireworks();
            document.getElementById("helloText").style.display = "block";
            btn.style.display = "none";
        }
    });
})();

(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;
    // <div class="ring"><div class="stroke"></div></div>
    const cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    cursor.innerHTML = `<div class="dot"></div>`;
    document.body.appendChild(cursor);

    let mouseX = innerWidth / 2,
        mouseY = innerHeight / 2,
        rafId = 0;

    function update() {
        cursor.style.left = mouseX + "px";
        cursor.style.top = mouseY + "px";
        rafId = 0;
    }
    window.addEventListener(
        "mousemove",
        (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!rafId) rafId = requestAnimationFrame(update);
            cursor.classList.remove("fade");
        },
        {
            passive: true,
        }
    );

    window.addEventListener("mouseleave", () => cursor.classList.add("fade"));

    document.addEventListener("mouseover", (e) => {
        if (e.target && e.target.closest(".glow_fire_btn"))
            cursor.classList.add("cursor-hover");
    });
    document.addEventListener("mouseout", (e) => {
        const fromBtn = e.target && e.target.closest(".glow_fire_btn");
        const toBtn =
            e.relatedTarget &&
            e.relatedTarget.closest &&
            e.relatedTarget.closest(".glow_fire_btn");
        if (fromBtn && !toBtn) cursor.classList.remove("cursor-hover");
    });
})();

// loading
(() => {
    const prefersReduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const loader = document.getElementById("loader");
    const countEl = document.getElementById("count");
    const container = document.querySelector(".glow_wrap");

    const revealItems = [
        ".glow_logo",
        "#animated-text",
        "#circle-animation",
        "#helloText",
    ]
        .map((sel) => document.querySelector(sel))
        .filter(Boolean);

    function startReveal() {
        gsap.to(loader, {
            autoAlpha: 0,
            duration: 0.5,
            onComplete: () => loader.remove(),
        });

        gsap.set(revealItems, {
            autoAlpha: 0,
            y: 20,
        });

        gsap.to(revealItems, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.25,
        });
    }

    if (prefersReduce) {
        loader.style.display = "none";
        revealItems.forEach((el) => {
            el.style.opacity = 1;
            el.style.transform = "none";
            el.style.display = "";
        });
        return;
    }

    let remaining = 3;
    countEl.textContent = remaining;

    const timer = setInterval(() => {
        remaining -= 1;
        countEl.textContent = remaining;
        if (remaining <= 0) {
            clearInterval(timer);
            startReveal();
        }
    }, 1000);

    setTimeout(() => {
        if (remaining > 0) {
            remaining = 0;
            countEl.textContent = remaining;
            clearInterval(timer);
            startReveal();
        }
    }, 10_500);
})();
