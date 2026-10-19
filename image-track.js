const track = document.querySelector("#image-track");

let images = Array.from(track.querySelectorAll(".image"));

const imageHeight = 350;
const gap = 10;

let currentTranslate = 0;
let previousTranslate = 0;
let mouseDownAt = 0;

images.forEach(image => {
    const ratio = parseFloat(image.dataset.ratio || 1);
    image.style.width = `${imageHeight * ratio}px`;
});

const originalImages = images.map(image => image.cloneNode(true));

originalImages.forEach(image => {
    track.appendChild(image);
});

originalImages.forEach(image => {
    track.appendChild(image.cloneNode(true));
});

images = Array.from(track.querySelectorAll(".image"));

const getSetWidth = () => {
    let width = 0;

    originalImages.forEach(image => {
        width += image.getBoundingClientRect().width;
        width += gap;
    });

    return width;
};

const updateTrack = () => {
    const setWidth = getSetWidth();

    while (currentTranslate > 0) {
        currentTranslate -= setWidth;
        previousTranslate -= setWidth;
    }

    while (currentTranslate < -setWidth) {
        currentTranslate += setWidth;
        previousTranslate += setWidth;
    }

    track.style.transform = `translateX(${currentTranslate}px)`;

    images.forEach(image => {
        const rect = image.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const viewportCenter = window.innerWidth / 2;

        const distance = center - viewportCenter;
        const parallax = distance * 0.03;

        image.style.objectPosition = `${50 + parallax}% 20%`;
    });
};

const handleDown = (e) => {
    mouseDownAt = e.clientX;
    previousTranslate = currentTranslate;
};

const handleMove = (e) => {
    if (mouseDownAt === 0) return;

    const delta = e.clientX - mouseDownAt;

    currentTranslate = previousTranslate + delta;

    updateTrack();
};

const handleUp = () => {
    mouseDownAt = 0;
};

window.addEventListener("mousedown", handleDown);
window.addEventListener("mousemove", handleMove);
window.addEventListener("mouseup", handleUp);

window.addEventListener("touchstart", e => {
    mouseDownAt = e.touches[0].clientX;
    previousTranslate = currentTranslate;
});

window.addEventListener("touchmove", e => {
    if (mouseDownAt === 0) return;

    const delta = e.touches[0].clientX - mouseDownAt;

    currentTranslate = previousTranslate + delta;

    updateTrack();
});

window.addEventListener("touchend", handleUp);

updateTrack();