const countDownDate = new Date(
    new Date("2025-12-17T23:59:59").toLocaleString("en-US", {
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
        document.querySelector(".hero_desc").innerHTML =
            "Ứng dụng đã được phát hành! Qúy khách vui lòng tải ứng dụng để trải nghiệm";
        document.querySelector(".hero_countdowns").style.display = "none";
        document.querySelector("#register_event").style.display = "none";

        // document.querySelectorAll(".openModalBtn").forEach((el) => {
        //     el.innerText = "Kết thúc đăng ký";
        //     el.style.opacity = "0.5";
        //     el.disabled = true;
        // });
        // document.querySelectorAll(".countdown_item").forEach((el) => {
        //     el.innerHTML = "";
        // });
        return;
    } else {
        document.querySelector(".dowload_app_mb").style.display = "none";
        document.querySelector(".dowload_app").style.display = "none";
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

const openPopupVideo = document.getElementById("openVideoBtn");
const overlayVideo = document.getElementById("videoOverlay");
const closeBtnVideo = document.getElementById("closeVideoBtn");
const video = document.getElementById("popupVideo");

function openVideoModal() {
    overlayVideo.classList.add("is-open");
    // Reset & play video
    video.currentTime = 0;
    video.play().catch(() => {});
}

function closeVideoModal() {
    overlayVideo.classList.remove("is-open");
    // Dừng video và đưa về đầu
    video.pause();
    video.currentTime = 0;
}

openPopupVideo.addEventListener("click", openVideoModal);
closeBtnVideo.addEventListener("click", closeVideoModal);

// Click ra ngoài modal thì đóng
overlayVideo.addEventListener("click", function (e) {
    if (e.target === overlayVideo) {
        closeVideoModal();
    }
});

// ESC để đóng
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlayVideo.classList.contains("is-open")) {
        closeVideoModal();
    }
});

// blog list
const API_URL =
    "https://api.myspa.vn/v1/organizations/demozns/news?filter[status]=true&sort=-created_date";

const PAGE_SIZE = 6;
let NEWS_CACHE = [];
let CURRENT_PAGE = 1;

async function loadNews() {
    try {
        const res = await fetch(API_URL, {
            headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Network error");

        const json = await res.json();
        const data = json.context?.data || [];

        // 1) Filter bài hợp lệ
        const activeNews = data.filter(
            (item) =>
                Number(item.deleted) === 0 &&
                item.status === true &&
                Number(item.id) !== 3
        );

        // 2) Sort ưu tiên: news_order DESC, rồi created_date DESC
        activeNews.sort((a, b) => {
            const ao = Number(a.news_order || 0);
            const bo = Number(b.news_order || 0);
            if (bo !== ao) return bo - ao;

            const at =
                new Date(String(a.created_date).replace(" ", "T")).getTime() ||
                0;
            const bt =
                new Date(String(b.created_date).replace(" ", "T")).getTime() ||
                0;
            return bt - at;
        });

        NEWS_CACHE = activeNews;
        CURRENT_PAGE = 1;
        renderPage(CURRENT_PAGE);
        renderPagination();
    } catch (err) {
        console.error(err);
        const container = document.getElementById("event_list");
        if (container) {
            container.innerHTML =
                '<p class="text-center">Không thể tải tin tức, vui lòng thử lại sau.</p>';
        }
    }
}

function renderPage(page) {
    const totalPages = Math.max(1, Math.ceil(NEWS_CACHE.length / PAGE_SIZE));
    CURRENT_PAGE = Math.min(Math.max(1, page), totalPages);

    const start = (CURRENT_PAGE - 1) * PAGE_SIZE;
    const pageItems = NEWS_CACHE.slice(start, start + PAGE_SIZE);

    renderNewsUI(pageItems);
}

function getPaginationModel(totalPages, currentPage, maxNumbers = 6) {
    // Trả về mảng gồm: số trang hoặc "..."
    if (totalPages <= maxNumbers) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const half = Math.floor(maxNumbers / 2);

    // window start/end (chỉ cho phần giữa, chưa tính first/last)
    let start = currentPage - half;
    let end = currentPage + half;

    if (start < 2) {
        start = 2;
        end = start + (maxNumbers - 3); // trừ 1 và last + ellipsis
    }
    if (end > totalPages - 1) {
        end = totalPages - 1;
        start = end - (maxNumbers - 3);
    }

    pages.push(1);

    if (start > 2) pages.push("...");

    for (let p = start; p <= end; p++) pages.push(p);

    if (end < totalPages - 1) pages.push("...");

    pages.push(totalPages);

    return pages;
}

function renderPagination() {
    const pag = document.getElementById("event_pagination");
    if (!pag) return;

    const totalPages = Math.max(1, Math.ceil(NEWS_CACHE.length / PAGE_SIZE));
    if (totalPages <= 1) {
        pag.innerHTML = "";
        return;
    }

    const prevDisabled = CURRENT_PAGE === 1 ? "disabled" : "";
    const nextDisabled = CURRENT_PAGE === totalPages ? "disabled" : "";

    const model = getPaginationModel(totalPages, CURRENT_PAGE, 6);

    const pagesHtml = model
        .map((it) => {
            if (it === "...") {
                return `<button class="page_btn is-dots" disabled>...</button>`;
            }
            const active = it === CURRENT_PAGE ? "is-active" : "";
            return `<button class="page_btn ${active}" data-page="${it}">${it}</button>`;
        })
        .join("");

    pag.innerHTML = `
                    <div class="pagination">
                    <button class="page_btn" data-page="${
                        CURRENT_PAGE - 1
                    }" ${prevDisabled}><img src="./imgs/home/arr_left_black.svg" alt="clock" /></button>
                    ${pagesHtml}
                    <button class="page_btn" data-page="${
                        CURRENT_PAGE + 1
                    }" ${nextDisabled}><img src="./imgs/home/arr_right_black.svg" alt="clock" /></button>
                    </div>
                `;

    pag.onclick = (e) => {
        const btn = e.target.closest("[data-page]");
        if (!btn || btn.hasAttribute("disabled")) return;

        const page = Number(btn.getAttribute("data-page"));
        renderPage(page);
        renderPagination();
    };
}

// ---- helpers & UI render ----
function escapeHTML(str) {
    return String(str ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr.replace(" ", "T"));
    if (Number.isNaN(d.getTime())) return "";
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
}

function extractSummary(html, maxLength = 180) {
    if (!html) return "";
    const temp = document.createElement("div");
    temp.innerHTML = html;
    let text = (temp.textContent || temp.innerText || "").trim();
    if (text.length > maxLength) text = text.slice(0, maxLength).trim() + "...";
    return text;
}

function renderNewsUI(list) {
    const container = document.getElementById("event_list");
    if (!container) return;

    if (!list.length) {
        container.innerHTML =
            '<p class="text-center">Hiện chưa có tin tức nào.</p>';
        return;
    }

    const fallbackImg = "./imgs/home/update_project.png";

    container.innerHTML = list
        .map((item) => {
            const date = formatDate(item.created_date);
            const desc = escapeHTML(extractSummary(item.content, 220));
            const title = escapeHTML(item.title);
            const image = item.image_url || fallbackImg;
            const detailUrl = `/blog-news.html?id=${encodeURIComponent(
                item.id
            )}`;

            return `
                        <a target="_blank" href="${detailUrl}" class="update_item" rel="noopener">
                            <div class="update_img blog_img">
                            <img
                                src="${image}"
                                alt="${title}"
                                loading="lazy"
                                onerror="this.onerror=null;this.src='${fallbackImg}'"
                                />
                                </div>
                                <div class="update_content">
                                <div class="update_top">
                                    <div class="update_top_icon">
                                    <img src="./imgs/home/clock_black.svg" alt="clock" />
                                    <span>${escapeHTML(date)}</span>
                                    </div>
                                    <div class="update_top_icon">
                                    <img src="./imgs/home/map-pin-black.svg" alt="map-pin" />
                                    <span>HCM</span>
                                    </div>
                                </div>
                                <h3 class="update_title text-truncate-1">${title}</h3>
                                <p class="update_desc text-truncate-3">${desc}</p>
                                <div class="update_category_item mouse_hover">Đọc thêm</div>
                                </div>
                            </a>
                            `;
        })
        .join("");
}

// close blog list

// blog single
const BLOG_LIST_API =
    "https://api.myspa.vn/v1/organizations/demozns/news?filter[status]=true";

function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr.replace(" ", "T"));
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
}

// Lấy text ngắn từ content HTML
function extractSummary(html, maxLength = 220) {
    if (!html) return "";
    const temp = document.createElement("div");
    temp.innerHTML = html;
    let text = temp.textContent || temp.innerText || "";
    text = text.trim();
    if (text.length > maxLength) {
        text = text.slice(0, maxLength).trim() + "...";
    }
    return text;
}

async function loadFeaturedBlog() {
    const wrapper = document.querySelector(".update_list");
    if (!wrapper) return;

    const linkEl = wrapper.querySelector(".update_item");
    const imgBox = wrapper.querySelector(".update_img");
    const dateSpan = wrapper.querySelector(".update_top_icon span"); // span đầu tiên là ngày
    const titleEl = wrapper.querySelector(".update_title");
    const descEl = wrapper.querySelector(".update_desc");

    try {
        const res = await fetch(BLOG_LIST_API);
        if (!res.ok) throw new Error("Network error");

        const json = await res.json();
        const list = (json.context && json.context.data) || [];

        // Lọc bài hợp lệ
        const active = list.filter(
            (item) =>
                item.deleted === 0 && item.status === true && item.id === 3
        );

        const first = active[0];

        if (!active.length) return;

        // URL detail: dùng page blog-news.html?id=ID (theo file detail trước đó)
        const detailUrl = `/blog-news.html?id=${first.id}`;

        if (linkEl) {
            linkEl.href = detailUrl;
        }

        if (imgBox) {
            const bg = first.image_url || "./imgs/home/blog1/banner.jpg";
            imgBox.style.backgroundImage = `url(${bg})`;
        }

        if (dateSpan) {
            dateSpan.textContent = formatDate(first.created_date);
        }

        if (titleEl) {
            titleEl.textContent = first.title || "";
        }

        if (descEl) {
            descEl.textContent = extractSummary(first.content);
        }
    } catch (err) {
        console.error("Error loadFeaturedBlog:", err);
        // Có thể giữ nội dung hardcode làm fallback
    }
}

async function loadGallery() {
    const images = [
        "slider_1.png",
        "slider_2.png",
        "slider_3.png",
        "slider_4.png",
        "slider_5.png",
        "slider_6.png",
        "slider_7.png",
        "slider_8.png",
        "slider_9.png",
        "slider_10.png",
        "slider_11.png",
        "slider_12.jpg",
        "slider_13.jpg",
        "slider_14.jpg",
        "slider_15.jpg",
        "slider_16.jpg",
        "slider_17.jpg",
    ];

    const wrapper = document.querySelector("#gallery_slider .swiper-wrapper");

    wrapper.innerHTML = images
        .map(
            (fileName) => `
            <div class="swiper-slide swiper-slide--one">
                <div class="slide-content">
                    <img src="./imgs/home/slider_gallery/${fileName}" alt="">
                </div>
            </div>`
        )
        .join("");

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
}

document.addEventListener("DOMContentLoaded", loadFeaturedBlog);
document.addEventListener("DOMContentLoaded", loadGallery);
document.addEventListener("DOMContentLoaded", loadNews);
