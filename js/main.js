// popup
const body = document.body;
const overlay = document.getElementById("overlay");
const popup = document.getElementById("popup");
const openBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementById("closeModalBtn");
const iframe = document.querySelector("#popup iframe");

const ENABLE_IFRAME_RESET = true;

function openModal() {
    if (!overlay || !popup) return;
    overlay.classList.add("is-open");
    body.classList.add("modal-open");

    if (iframe && !iframe.dataset.loaded) {
        iframe.dataset.loaded = "true";
        iframe.src = iframe.dataset.src || iframe.src;
    }

    setTimeout(() => popup?.focus(), 10);
}

function closeModal() {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    body.classList.remove("modal-open");

    if (ENABLE_IFRAME_RESET && iframe) {
        iframe.src = "";
        iframe.dataset.loaded = "";
    }
}

if (openBtn) openBtn.addEventListener("click", openModal);
if (closeBtn) closeBtn.addEventListener("click", closeModal);

if (overlay) {
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
    });
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay?.classList.contains("is-open")) {
        closeModal();
    }
});


// close popup