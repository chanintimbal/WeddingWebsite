const track = document.getElementById("image-track");
const images = Array.from(track.getElementsByClassName("image"));

let currentTranslate = -20;
let startTranslate = -20;
track.dataset.mouseDownAt = "0";

const gapWidth = 1;

let totalTrackWidth = 0;
const imagePositions = images.map((image) => {
    const width = parseFloat(image.dataset.width || 30);
    image.style.width = `${width}vw`; // Inject the custom width inline
    
    const currentBasePos = totalTrackWidth;
    totalTrackWidth += width + gapWidth;
    return {
        basePosition: currentBasePos,
        width: width
    };
});

track.style.transform = `translateX(${currentTranslate}vw)`;

const handleOnDown = e => {
    track.dataset.mouseDownAt = e.clientX;
    startTranslate = currentTranslate;
};

const handleOnUp = () => {
    track.dataset.mouseDownAt = "0";
};

const handleOnMove = e => {
    if (e.buttons === 0 && e.type === "mousemove") {
        track.dataset.mouseDownAt = "0";
    }

    if (track.dataset.mouseDownAt === "0" || !track.dataset.mouseDownAt) return;

    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX;
    const maxDelta = window.innerWidth / 2;
    const deltaVW = (mouseDelta / maxDelta) * -50; 
    
    currentTranslate = startTranslate + deltaVW;

    images.forEach((image, index) => {
        const { basePosition, width } = imagePositions[index];
        const rawPosition = basePosition + currentTranslate;
        const itemTotalWidth = width + gapWidth;
        
        // Dynamic Variable Loop Wrapping
        let infiniteX = ((rawPosition + itemTotalWidth) % totalTrackWidth);
        if (infiniteX < 0) {
            infiniteX += totalTrackWidth;
        }
        infiniteX -= itemTotalWidth;

        const offset = infiniteX - basePosition;
        image.style.transform = `translateX(${offset}vw)`;
        
        // Optional: Keep parallax effect rolling smoothly on variable widths
        let multiplier = image.classList.contains("image-bjj") ? 1.8 : 1;
        image.style.objectPosition = `${50 + (infiniteX * 0.15 * multiplier)}% 20%`;
    });
};

window.onmousedown = e => handleOnDown(e);
window.onmouseup = e => handleOnUp(e);
window.onmousemove = e => handleOnMove(e);

window.ontouchstart = e => handleOnDown(e.touches);
window.ontouchend = e => handleOnUp(e.changedTouches);
window.ontouchmove = e => handleOnMove(e.touches);
