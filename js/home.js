// Ngày kết thúc: 18/11/2025 00:00:00 GMT+7
const countDownDate = new Date(
    new Date("2025-12-18T00:00:00").toLocaleString("en-US", {
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
            "Ứng dụng đã được phát hành! Vui lòng tải xuống từ cửa hàng ứng dụng.";
        document.querySelectorAll(".countdown_item").forEach((el) => {
            el.innerHTML = "";
        });
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

const openPopupVideo = document.getElementById("openVideoBtn");
const overlayVideo = document.getElementById("videoOverlay");
const closeBtnVideo = document.getElementById("closeVideoBtn");
const video = document.getElementById("popupVideo");

function openVideoModal() {
    console.log("ok")
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
