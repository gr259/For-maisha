/* =========================================
   MOHIBUL & MAISHA
   A BEAUTIFUL FRIENDSHIP HEARTBEAT
   ========================================= */

"use strict";

/* ---------- FRIENDSHIP SETTINGS ---------- */

const WORDS = [
    "Friendship with Maisha",
    "Mohibul & Maisha",
    "Best Friends Forever",
    "Our Beautiful Friendship",
    "Always Friends",
    "Trust & Care",
    "Stay Happy",
    "Keep Smiling",
    "Memories Forever",
    "Friends for Life",
    "Maisha 💗",
    "Mohibul 💗"
];

const steps = [
    {
        threshold: 20,
        text: "Preparing our friendship... 💗"
    },
    {
        threshold: 50,
        text: "Connecting Mohibul & Maisha... ✨"
    },
    {
        threshold: 80,
        text: "Creating beautiful memories... 🌸"
    },
    {
        threshold: 95,
        text: "Adding friendship magic... 💖"
    },
    {
        threshold: 100,
        text: "Our friendship is ready! 💓"
    }
];

const DEFAULT_RECIPIENT = "Maisha";
const DEFAULT_SENDER = "Mohibul";

const DEFAULT_MESSAGE = `FOR MY BEST FRIEND 💗

Dear Maisha,

This little message is a reminder of how special our friendship is to me. ✨

I created this little digital heartbeat to celebrate the beautiful bond we share. Every heartbeat represents the care, trust, laughter, and wonderful memories that make our friendship meaningful.

Thank you for being such a special friend. I hope life brings you endless happiness, success, and countless reasons to smile. 🌸

No matter how busy life gets or where our journeys take us, I hope we always cherish the beautiful memories we create together.

A true friendship is a precious gift, and I am grateful to have you as my friend.

Stay happy, keep smiling, and always be the amazing Maisha you are! 💗

With friendship and best wishes,
Your friend, Mohibul 🫂♾️`;


/* ---------- APP DATA ---------- */

let recipient = DEFAULT_RECIPIENT;
let sender = DEFAULT_SENDER;
let message = DEFAULT_MESSAGE;

let typingTimer = null;
let animationStarted = false;


/* ---------- HELPER FUNCTIONS ---------- */

function getElement(...selectors) {
    for (const selector of selectors) {
        const element = document.querySelector(selector);

        if (element) {
            return element;
        }
    }

    return null;
}

function setText(selectors, value) {
    const element = getElement(...selectors);

    if (element) {
        element.textContent = value;
    }
}

function setValue(selectors, value) {
    const element = getElement(...selectors);

    if (element) {
        element.value = value;
    }
}

function getValue(selectors, fallback = "") {
    const element = getElement(...selectors);

    return element ? element.value.trim() : fallback;
}

function saveToStorage() {
    try {
        localStorage.setItem("friendship_to", recipient);
        localStorage.setItem("friendship_from", sender);
        localStorage.setItem("friendship_msg", message);
    } catch (error) {
        console.warn("Could not save friendship settings.", error);
    }
}

function loadFromStorage() {
    try {
        recipient =
            localStorage.getItem("friendship_to") ||
            DEFAULT_RECIPIENT;

        sender =
            localStorage.getItem("friendship_from") ||
            DEFAULT_SENDER;

        message =
            localStorage.getItem("friendship_msg") ||
            DEFAULT_MESSAGE;
    } catch (error) {
        recipient = DEFAULT_RECIPIENT;
        sender = DEFAULT_SENDER;
        message = DEFAULT_MESSAGE;
    }
}


/* ---------- UPDATE WEBSITE TEXT ---------- */

function updateWebsiteText() {
    document.title = `💗 Mohibul & ${recipient} | Best Friends`;

    setText(
        ["#letterHeaderTitle"],
        `A Letter for ${recipient} 💗`
    );

    setText(
        ["#letterSign"],
        `— with friendship and best wishes, ${sender} 🫂`
    );

    /*
       The HTML's bottom text should say:
       This is our / beautiful friendship 💗

       Do not replace "friendship" with the recipient's name.
    */

    const recipientField = getElement("#recipientInput");
    const senderField = getElement("#senderInput");
    const messageField = getElement("#messageInput");

    if (recipientField) {
        recipientField.value = recipient;
    }

    if (senderField) {
        senderField.value = sender;
    }

    if (messageField) {
        messageField.value = message;
    }
}


/* ---------- LOAD URL SHARED DATA ---------- */

function loadSharedData() {
    const params = new URLSearchParams(window.location.search);

    try {
        const encodedData = params.get("d");

        if (encodedData) {
            const decoded = JSON.parse(
                decodeURIComponent(
                    Array.from(
                        atob(encodedData),
                        character =>
                            "%" +
                            character
                                .charCodeAt(0)
                                .toString(16)
                                .padStart(2, "0")
                    ).join("")
                )
            );

            if (decoded.to) recipient = decoded.to;
            if (decoded.from) sender = decoded.from;
            if (decoded.msg) message = decoded.msg;

            return;
        }
    } catch (error) {
        console.warn("Shared link data could not be read.", error);
    }

    const urlRecipient = params.get("to");
    const urlSender = params.get("from");
    const urlMessage = params.get("msg");

    if (urlRecipient) recipient = urlRecipient;
    if (urlSender) sender = urlSender;
    if (urlMessage) message = urlMessage;
}


/* ---------- LETTER TYPEWRITER ---------- */

function typeMessage(text) {
    const body = getElement(
        "#letterBody",
        "#letterContent",
        ".letter-body",
        ".letter-content"
    );

    if (!body) {
        return;
    }

    if (typingTimer) {
        clearInterval(typingTimer);
    }

    body.textContent = "";

    let index = 0;

    typingTimer = setInterval(() => {
        if (index >= text.length) {
            clearInterval(typingTimer);
            typingTimer = null;
            return;
        }

        body.textContent += text.charAt(index);
        index++;
    }, 22);
}


/* ---------- OPEN AND CLOSE LETTER ---------- */

function openLetter() {
    const overlay = getElement(
        "#letterOverlay",
        "#letterModal",
        "#letter",
        ".letter-overlay",
        ".letter-modal"
    );

    if (overlay) {
        overlay.classList.add("active", "show", "open");
        overlay.setAttribute("aria-hidden", "false");
    }

    updateWebsiteText();
    typeMessage(message);
}

function closeLetter() {
    const overlay = getElement(
        "#letterOverlay",
        "#letterModal",
        "#letter",
        ".letter-overlay",
        ".letter-modal"
    );

    if (overlay) {
        overlay.classList.remove("active", "show", "open");
        overlay.setAttribute("aria-hidden", "true");
    }

    if (typingTimer) {
        clearInterval(typingTimer);
        typingTimer = null;
    }
}


/* ---------- SAVE LETTER ---------- */

function saveLetter() {
    recipient =
        getValue(["#recipientInput"], DEFAULT_RECIPIENT) ||
        DEFAULT_RECIPIENT;

    sender =
        getValue(["#senderInput"], DEFAULT_SENDER) ||
        DEFAULT_SENDER;

    message =
        getValue(["#messageInput"], DEFAULT_MESSAGE) ||
        DEFAULT_MESSAGE;

    saveToStorage();
    updateWebsiteText();

    const status = getElement(
        "#saveStatus",
        "#statusMessage",
        ".save-status"
    );

    if (status) {
        status.textContent = "Friendship letter saved! 💗";

        setTimeout(() => {
            status.textContent = "";
        }, 2500);
    }

    closeEditor();
}


/* ---------- EDITOR ---------- */

function openEditor() {
    const editor = getElement(
        "#editorOverlay",
        "#letterEditor",
        "#editor",
        ".editor-overlay"
    );

    if (editor) {
        editor.classList.add("active", "show", "open");
    }

    setValue(["#recipientInput"], recipient);
    setValue(["#senderInput"], sender);
    setValue(["#messageInput"], message);
}

function closeEditor() {
    const editor = getElement(
        "#editorOverlay",
        "#letterEditor",
        "#editor",
        ".editor-overlay"
    );

    if (editor) {
        editor.classList.remove("active", "show", "open");
    }
}


/* ---------- SHARE FRIENDSHIP LETTER ---------- */

async function shareLetter() {
    const shareData = {
        to: recipient,
        from: sender,
        msg: message
    };

    const encoded = btoa(
        encodeURIComponent(JSON.stringify(shareData))
            .replace(
                /%([0-9A-F]{2})/g,
                (_, hex) =>
                    String.fromCharCode(parseInt(hex, 16))
            )
    );

    const shareURL = new URL(window.location.href);

    shareURL.search = "";
    shareURL.searchParams.set("d", encoded);

    const shareText =
        `A little friendship message from ${sender} to ${recipient} 💗\n` +
        shareURL.toString();

    try {
        if (navigator.share) {
            await navigator.share({
                title: "Our Beautiful Friendship 💗",
                text: `A friendship letter for ${recipient}`,
                url: shareURL.toString()
            });
        } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(shareText);
            showNotice("Friendship link copied! 💗");
        } else {
            window.prompt("Copy this friendship link:", shareURL.toString());
        }
    } catch (error) {
        if (error.name !== "AbortError") {
            showNotice("Unable to share automatically. Please copy the link.");
        }
    }
}


/* ---------- NOTIFICATION ---------- */

function showNotice(text) {
    const notice = getElement(
        "#notice",
        "#toast",
        "#statusMessage",
        ".toast"
    );

    if (!notice) {
        alert(text);
        return;
    }

    notice.textContent = text;
    notice.classList.add("active", "show");

    setTimeout(() => {
        notice.classList.remove("active", "show");
    }, 2500);
}


/* ---------- HEARTBEAT CANVAS ---------- */

function startHeartbeatCanvas() {
    const canvas = getElement(
        "#heartCanvas",
        "#heartbeatCanvas",
        "#heart-canvas",
        "canvas"
    );

    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return;
    }

    let width = 0;
    let height = 0;
    let particles = [];
    let animationFrame = null;

    function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        width = canvas.clientWidth || window.innerWidth;
        height = canvas.clientHeight || window.innerHeight;

        canvas.width = width * dpr;
        canvas.height = height * dpr;

        /*
           Reset the transform so resizing does not
           repeatedly multiply the canvas scale.
        */
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        createParticles();
    }

    function createParticles() {
        const count = Math.min(
            Math.floor((width * height) / 7000),
            160
        );

        particles = [];

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2.5 + 0.5,
                speed: Math.random() * 0.6 + 0.15,
                alpha: Math.random() * 0.7 + 0.2,
                word: WORDS[
                    Math.floor(Math.random() * WORDS.length)
                ]
            });
        }
    }

    function drawHeart(x, y, size, scale) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.beginPath();

        ctx.moveTo(0, size * 0.3);

        ctx.bezierCurveTo(
            -size,
            -size * 0.3,
            -size * 0.8,
            -size,
            0,
            -size * 0.45
        );

        ctx.bezierCurveTo(
            size * 0.8,
            -size,
            size,
            -size * 0.3,
            0,
            size * 0.3
        );

        ctx.closePath();
        ctx.fillStyle = "rgba(255, 90, 150, 0.9)";
        ctx.shadowColor = "#ff4f91";
        ctx.shadowBlur = 22;
        ctx.fill();
        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        const time = performance.now() / 1000;
        const pulse = 1 + Math.pow(Math.max(0, Math.sin(time * 3)), 8) * 0.12;

        for (const particle of particles) {
            particle.y -= particle.speed;

            if (particle.y < -15) {
                particle.y = height + 15;
                particle.x = Math.random() * width;
            }

            ctx.globalAlpha = particle.alpha;
            ctx.fillStyle = "#ff8ab5";
            ctx.beginPath();
            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        ctx.globalAlpha = 1;

        drawHeart(
            width / 2,
            height / 2,
            Math.min(width, height) * 0.20,
            pulse
        );

        animationFrame = requestAnimationFrame(animate);
    }

    resizeCanvas();

    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }

    animate();

    window.addEventListener("resize", resizeCanvas);
}


/* ---------- START BUTTON ---------- */

function startExperience() {
    if (animationStarted) {
        openLetter();
        return;
    }

    animationStarted = true;

    const button = getElement(
        "#startBtn",
        "#startButton",
        ".start-btn"
    );

    const status = getElement(
        "#loadingText",
        "#statusText",
        "#loaderText",
        ".loading-text"
    );

    const progress = getElement(
        "#progressBar",
        "#loaderProgress",
        ".progress-bar"
    );

    if (button) {
        button.disabled = true;
        button.textContent = "Creating friendship magic... 💗";
    }

    let percentage = 0;

    const loader = setInterval(() => {
        percentage = Math.min(percentage + Math.random() * 7 + 2, 100);

        const currentStep = [...steps]
            .reverse()
            .find(step => percentage >= step.threshold);

        if (status && currentStep) {
            status.textContent = currentStep.text;
        }

        if (progress) {
            progress.style.width = `${percentage}%`;
        }

        if (percentage >= 100) {
            clearInterval(loader);

            if (button) {
                button.disabled = false;
                button.textContent = "Open Our Friendship Letter 💌";
            }

            showNotice("Our friendship experience is ready! 💗");

            setTimeout(() => {
                openLetter();
            }, 500);
        }
    }, 180);
}


/* ---------- CONNECT BUTTONS ---------- */

function connectButtons() {
    const startButton = getElement(
        "#startBtn",
        "#startButton",
        ".start-btn"
    );

    if (startButton) {
        startButton.addEventListener("click", startExperience);
    }

    const saveButton = getElement("#saveLetterBtn");

    if (saveButton) {
        saveButton.addEventListener("click", saveLetter);
    }

    const shareButton = getElement("#shareLetterBtn");

    if (shareButton) {
        shareButton.addEventListener("click", shareLetter);
    }

    const editButton = getElement(
        "#editLetterBtn",
        "#editBtn",
        ".edit-btn"
    );

    if (editButton) {
        editButton.addEventListener("click", openEditor);
    }

    const closeLetterButton = getElement(
        "#closeLetterBtn",
        "#closeLetter",
        ".close-letter"
    );

    if (closeLetterButton) {
        closeLetterButton.addEventListener("click", closeLetter);
    }

    const closeEditorButton = getElement(
        "#closeEditorBtn",
        "#closeEditor",
        ".close-editor"
    );

    if (closeEditorButton) {
        closeEditorButton.addEventListener("click", closeEditor);
    }

    const openLetterButton = getElement(
        "#openLetterBtn",
        ".open-letter-btn"
    );

    if (openLetterButton) {
        openLetterButton.addEventListener("click", openLetter);
    }
}


/* ---------- INITIALIZE WEBSITE ---------- */

function initLoveData() {
    loadFromStorage();
    loadSharedData();
    updateWebsiteText();
}

document.addEventListener("DOMContentLoaded", () => {
    initLoveData();
    connectButtons();
    startHeartbeatCanvas();
});
