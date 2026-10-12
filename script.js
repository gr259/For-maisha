"use strict";

/* ==========================================
   MOHIBUL & MAISHA — FRIENDSHIP HEARTBEAT
   ========================================== */

const DEFAULT_TO = "Maisha";
const DEFAULT_FROM = "Mohibul";

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

const WORDS = [
    "Mohibul & Maisha",
    "Best Friends Forever",
    "Beautiful Friendship",
    "Trust & Care",
    "Memories Forever",
    "Always Friends",
    "Keep Smiling",
    "Friends for Life",
    "Maisha 💗",
    "Mohibul 💗",
    "Stay Happy ✨",
    "Friendship ♾️"
];

const LOADING_STEPS = [
    { limit: 20, text: "Preparing our friendship... 💗" },
    { limit: 45, text: "Connecting Mohibul & Maisha... ✨" },
    { limit: 70, text: "Creating beautiful memories... 🌸" },
    { limit: 90, text: "Adding friendship magic... 💖" },
    { limit: 100, text: "Our friendship is ready! 💓" }
];

let recipient = DEFAULT_TO;
let sender = DEFAULT_FROM;
let message = DEFAULT_MESSAGE;

let typingTimer = null;
let loadingTimer = null;
let animationFrame = null;
let experienceStarted = false;
let particles = [];
let canvasWidth = 0;
let canvasHeight = 0;


/* ---------- ELEMENTS ---------- */

const $ = (selector) => document.querySelector(selector);


/* ---------- LOAD SAVED DATA ---------- */

function loadSavedData() {
    try {
        recipient =
            localStorage.getItem("friendship_to") || DEFAULT_TO;

        sender =
            localStorage.getItem("friendship_from") || DEFAULT_FROM;

        message =
            localStorage.getItem("friendship_msg") || DEFAULT_MESSAGE;
    } catch (error) {
        recipient = DEFAULT_TO;
        sender = DEFAULT_FROM;
        message = DEFAULT_MESSAGE;
    }
}


/* ---------- READ SHARED LINK ---------- */

function loadSharedLink() {
    const params = new URLSearchParams(location.search);

    try {
        const encoded = params.get("d");

        if (encoded) {
            const binary = atob(encoded);

            const bytes = Uint8Array.from(
                binary,
                char => char.charCodeAt(0)
            );

            const data = JSON.parse(
                new TextDecoder().decode(bytes)
            );

            if (typeof data.to === "string") {
                recipient = data.to;
            }

            if (typeof data.from === "string") {
                sender = data.from;
            }

            if (typeof data.msg === "string") {
                message = data.msg;
            }

            return;
        }
    } catch (error) {
        console.warn("Could not read shared letter.", error);
    }

    if (params.has("to")) recipient = params.get("to");
    if (params.has("from")) sender = params.get("from");
    if (params.has("msg")) message = params.get("msg");
}


/* ---------- UPDATE LETTER ---------- */

function updateLetter() {
    $("#letterHeaderTitle").textContent =
        `For ${recipient} 💗`;

    $("#letterSign").textContent =
        `— Your friend, ${sender} 💗`;

    $("#recipientInput").value = recipient;
    $("#senderInput").value = sender;
    $("#messageInput").value = message;

    document.title =
        `💗 A Heartbeat of Friendship | ${sender} & ${recipient}`;
}


/* ---------- SAVE DATA ---------- */

function saveData() {
    try {
        localStorage.setItem("friendship_to", recipient);
        localStorage.setItem("friendship_from", sender);
        localStorage.setItem("friendship_msg", message);
    } catch (error) {
        console.warn("Could not save letter.", error);
    }
}


/* ---------- NOTIFICATION ---------- */

function showToast(text) {
    const toast = $("#shareToast");

    if (!toast) {
        alert(text);
        return;
    }

    toast.textContent = text;
    toast.classList.add("show");
    toast.style.display = "block";

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
        toast.style.display = "";
    }, 2500);
}


/* ---------- TYPEWRITER EFFECT ---------- */

function typeLetter(text) {
    const body = $("#letterBody");

    if (!body) return;

    clearInterval(typingTimer);
    body.textContent = "";

    let index = 0;

    typingTimer = setInterval(() => {
        if (index >= text.length) {
            clearInterval(typingTimer);
            typingTimer = null;
            return;
        }

        body.textContent += text[index];
        index++;
    }, 18);
}


/* ---------- OPEN LETTER ---------- */

function openLetter() {
    const overlay = $("#letterOverlay");

    updateLetter();

    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");

    $("#letterViewContainer").style.display = "block";
    $("#letterEditContainer").style.display = "none";

    typeLetter(message);
}


/* ---------- CLOSE LETTER ---------- */

function closeLetter() {
    $("#letterOverlay").classList.remove("active");
    $("#letterOverlay").setAttribute("aria-hidden", "true");

    clearInterval(typingTimer);
    typingTimer = null;
}


/* ---------- EDIT LETTER ---------- */

function openEditor() {
    $("#letterViewContainer").style.display = "none";
    $("#letterEditContainer").style.display = "block";

    $("#recipientInput").value = recipient;
    $("#senderInput").value = sender;
    $("#messageInput").value = message;
}

function closeEditor() {
    $("#letterEditContainer").style.display = "none";
    $("#letterViewContainer").style.display = "block";
}


/* ---------- SAVE LETTER BUTTON ---------- */

function saveLetter() {
    recipient =
        $("#recipientInput").value.trim() || DEFAULT_TO;

    sender =
        $("#senderInput").value.trim() || DEFAULT_FROM;

    message =
        $("#messageInput").value.trim() || DEFAULT_MESSAGE;

    saveData();
    updateLetter();
    closeEditor();
    typeLetter(message);

    showToast("Friendship letter saved! 💗");
}


/* ---------- COPY SHAREABLE LINK ---------- */

function makeShareURL() {
    const data = {
        to: recipient,
        from: sender,
        msg: message
    };

    const bytes = new TextEncoder().encode(JSON.stringify(data));

    let binary = "";

    bytes.forEach(byte => {
        binary += String.fromCharCode(byte);
    });

    const encoded = btoa(binary);

    const url = new URL(location.href);

    url.search = "";
    url.searchParams.set("d", encoded);

    return url.toString();
}

async function shareLetter() {
    const button = $("#shareLetterBtn");
    const originalText = button.textContent;

    try {
        const shareURL = makeShareURL();

        await navigator.clipboard.writeText(shareURL);

        showToast("Friendship link copied! 💗");

    } catch (error) {
        const shareURL = makeShareURL();

        window.prompt(
            "Copy your friendship link:",
            shareURL
        );
    }

    button.textContent = "Link Ready! 💗";

    setTimeout(() => {
        button.textContent = originalText;
    }, 1800);
}


/* ---------- CANVAS SETUP ---------- */

function setupCanvas() {
    const canvas = $("#c");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    function resizeCanvas() {
        const ratio = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;

        canvas.width = canvasWidth * ratio;
        canvas.height = canvasHeight * ratio;

        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

        createParticles();
    }

    function createParticles() {
        const count = Math.min(
            Math.floor((canvasWidth * canvasHeight) / 5500),
            180
        );

        particles = [];

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvasWidth,
                y: Math.random() * canvasHeight,
                size: Math.random() * 2.2 + 0.5,
                speed: Math.random() * 0.55 + 0.12,
                alpha: Math.random() * 0.6 + 0.2,
                word: WORDS[
                    Math.floor(Math.random() * WORDS.length)
                ],
                wordParticle: Math.random() > 0.86
            });
        }
    }

    function drawHeart(x, y, size, scale) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);

        ctx.beginPath();
        ctx.moveTo(0, size * 0.32);

        ctx.bezierCurveTo(
            -size * 1.1, -size * 0.28,
            -size * 0.75, -size * 1.05,
            0, -size * 0.48
        );

        ctx.bezierCurveTo(
            size * 0.75, -size * 1.05,
            size * 1.1, -size * 0.28,
            0, size * 0.32
        );

        ctx.closePath();

        const gradient = ctx.createLinearGradient(
            -size, -size, size, size
        );

        gradient.addColorStop(0, "#ff4f91");
        gradient.addColorStop(0.55, "#ff83b2");
        gradient.addColorStop(1, "#ffb5d0");

        ctx.fillStyle = gradient;
        ctx.shadowColor = "rgba(255, 70, 145, 0.75)";
        ctx.shadowBlur = 25;
        ctx.fill();

        ctx.restore();
    }

    function draw(time) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        particles.forEach(particle => {
            particle.y -= particle.speed;

            if (particle.y < -20) {
                particle.y = canvasHeight + 20;
                particle.x = Math.random() * canvasWidth;
            }

            if (particle.wordParticle) {
                ctx.globalAlpha = particle.alpha * 0.75;
                ctx.fillStyle = "#ff9dc1";
                ctx.font = "12px sans-serif";
                ctx.fillText(
                    particle.word,
                    particle.x,
                    particle.y
                );
            } else {
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
        });

        ctx.globalAlpha = 1;

        const beat = 1 + Math.pow(
            Math.max(0, Math.sin(time * 0.003)),
            18
        ) * 0.10;

        const size = Math.min(canvasWidth, canvasHeight) * 0.19;

        drawHeart(
            canvasWidth / 2,
            canvasHeight / 2,
            size,
            beat
        );

        animationFrame = requestAnimationFrame(draw);
    }

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }

    animationFrame = requestAnimationFrame(draw);
}


/* ---------- START EXPERIENCE ---------- */

function startExperience() {
    if (experienceStarted) {
        openLetter();
        return;
    }

    experienceStarted = true;

    const button = $("#startBtn");
    const loadingBar = $("#loadingBar");
    const status = $("#statusText");
    const overlay = $("#startOverlay");
    const buttonText = button.querySelector(".btn-text");

    button.disabled = true;

    let progress = 0;

    loadingTimer = setInterval(() => {
        progress = Math.min(
            progress + Math.random() * 7 + 3,
            100
        );

        loadingBar.style.width = `${progress}%`;

        const step = LOADING_STEPS.find(
            item => progress <= item.limit
        ) || LOADING_STEPS[LOADING_STEPS.length - 1];

        status.textContent = step.text;

        if (progress >= 100) {
            clearInterval(loadingTimer);

            button.disabled = false;

            if (buttonText) {
                buttonText.textContent = "Open Our Friendship 💗";
            }

            overlay.classList.add("finished");

            setTimeout(() => {
                overlay.style.display = "none";
                openLetter();
            }, 700);
        }
    }, 160);
}


/* ---------- CONNECT ALL BUTTONS ---------- */

function connectButtons() {
    $("#startBtn").addEventListener(
        "click",
        startExperience
    );

    $("#letterClose").addEventListener(
        "click",
        closeLetter
    );

    $("#letterEditBtn").addEventListener(
        "click",
        openEditor
    );

    $("#saveLetterBtn").addEventListener(
        "click",
        saveLetter
    );

    $("#shareLetterBtn").addEventListener(
        "click",
        shareLetter
    );

    $("#letterOverlay").addEventListener(
        "click",
        event => {
            if (event.target === $("#letterOverlay")) {
                closeLetter();
            }
        }
    );

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeLetter();
        }
    });
}


/* ---------- INITIALIZE ---------- */

document.addEventListener("DOMContentLoaded", () => {
    loadSavedData();
    loadSharedLink();
    updateLetter();

    setupCanvas();
    connectButtons();

    /*
       Enable the start button after the initial
       friendship screen appears.
    */
    setTimeout(() => {
        $("#startBtn").disabled = false;
    }, 800);
});
