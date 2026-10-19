const track = document.querySelector("#image-track");

if (track) {
    const originalImages = Array.from(track.querySelectorAll(".image"));

    const imageHeight = 350;
    const gap = 10;
    const autoScrollSpeed = 24;

    let currentTranslate = 0;
    let dragStartX = 0;
    let dragStartTranslate = 0;
    let isDragging = false;
    let lastFrameTime = 0;
    let setWidth = 0;
    let animationStarted = false;

    originalImages.forEach(image => {
        image.style.height = `${imageHeight}px`;
        image.style.width = "auto";
        image.style.flexShrink = "0";
        image.draggable = false;
    });

    const firstSet = originalImages.map(image => image.cloneNode(true));

    firstSet.forEach(image => track.appendChild(image));
    firstSet.forEach(image => track.appendChild(image.cloneNode(true)));

    const images = Array.from(track.querySelectorAll(".image"));

    const calculateSetWidth = () => {
        setWidth = firstSet.reduce(
            (total, image) => total + image.getBoundingClientRect().width + gap,
            0
        );
    };

    const normalizePosition = () => {
        if (setWidth <= 0) return;

        while (currentTranslate > 0) currentTranslate -= setWidth;
        while (currentTranslate <= -setWidth) currentTranslate += setWidth;
    };

    const updateTrack = () => {
        normalizePosition();

        track.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;

        images.forEach(image => {
            const rect = image.getBoundingClientRect();
            const center = rect.left + rect.width / 2;
            const parallax = (center - window.innerWidth / 2) * 0.03;

            image.style.objectPosition = `${50 + parallax}% 20%`;
        });
    };

    const startDrag = x => {
        isDragging = true;
        dragStartX = x;
        dragStartTranslate = currentTranslate;
        track.style.cursor = "grabbing";
    };

    const moveDrag = x => {
        if (!isDragging) return;

        currentTranslate = dragStartTranslate + x - dragStartX;
        updateTrack();

        dragStartTranslate = currentTranslate;
        dragStartX = x;
    };

    const stopDrag = () => {
        if (!isDragging) return;

        isDragging = false;
        track.style.cursor = "grab";
    };

    track.addEventListener("mousedown", e => {
        e.preventDefault();
        startDrag(e.clientX);
    });

    window.addEventListener("mousemove", e => {
        moveDrag(e.clientX);
    });

    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("blur", stopDrag);

    track.addEventListener("touchstart", e => {
        startDrag(e.touches[0].clientX);
    }, { passive: true });

    track.addEventListener("touchmove", e => {
        moveDrag(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener("touchend", stopDrag);
    window.addEventListener("touchcancel", stopDrag);

    const animate = timestamp => {
        if (!lastFrameTime) lastFrameTime = timestamp;

        const deltaTime = Math.min((timestamp - lastFrameTime) / 1000, 0.05);
        lastFrameTime = timestamp;

        if (!isDragging) {
            currentTranslate -= autoScrollSpeed * deltaTime;
            updateTrack();
        }

        requestAnimationFrame(animate);
    };

    const initializeGallery = () => {
        calculateSetWidth();

        if (setWidth <= 0) return;

        updateTrack();

        if (!animationStarted) {
            animationStarted = true;
            requestAnimationFrame(animate);
        }
    };

    window.addEventListener("resize", () => {
        calculateSetWidth();
        updateTrack();
    });

    Promise.all(originalImages.map(image => {
        if (image.complete) return Promise.resolve();

        return new Promise(resolve => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
        });
    })).then(initializeGallery);
}
