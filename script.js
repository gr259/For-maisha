Writing
(() => {
    'use strict';

    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');

    let W = window.innerWidth;
    let H = window.innerHeight;
    let CX = W / 2;
    let CY = H / 2;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let scale = Math.min(W, H) * 0.22;

    function resize() {
        W = window.innerWidth;
        H = window.innerHeight;
        CX = W / 2;
        CY = H / 2;
        scale = Math.min(W, H) * 0.22;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resize);
    resize();

    const NUM_POINTS = 180;
    const ROTATION_SPEED_Y = 0.012;

    const WORDS = [
        'friendship', 'Friendship', '❤', 'friends', 'best friends',
        'forever', 'always', 'Maisha', 'Mohibul', 'bestie',
        'true friends', 'smile'
    ];

    let startTimestamp = null;
    let isIntroFinished = false;

    function playClickSound() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const audioCtx = new AudioCtx();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        } catch (e) { }
    }

    function startCardLoader() {
        const loadingBar = document.getElementById('loadingBar');
        const statusText = document.getElementById('statusText');
        const startBtn = document.getElementById('startBtn');

        const duration = 2400;
        const steps = [
            { threshold: 20, text: 'Preparing our friendship... 💗' },
            { threshold: 50, text: 'Loading Mohibul\'s friendship... 🔒' },
            { threshold: 80, text: 'Celebrating Maisha\'s friendship... 🌸' },
            { threshold: 95, text: 'Adding 999 tons of friendship... 💖' },
            { threshold: 100, text: 'Friendship magic is ready! ✨' }
        ];

        let loaderStart = null;

        function animateLoader(timestamp) {
            if (!loaderStart) loaderStart = timestamp;
            const progress = Math.min((timestamp - loaderStart) / duration, 1);
            const percent = Math.floor(progress * 100);

            loadingBar.style.width = `${percent}%`;
            const activeStep = steps.find(s => percent <= s.threshold) || steps[steps.length - 1];
            statusText.textContent = activeStep.text;

            if (progress < 1) {
                requestAnimationFrame(animateLoader);
            } else {
                startBtn.removeAttribute('disabled');
            }
        }

        requestAnimationFrame(animateLoader);
    }

    setTimeout(startCardLoader, 400);

    document.getElementById('startBtn').addEventListener('click', () => {
        playClickSound();
        document.getElementById('startOverlay').classList.add('fade-out');
        setTimeout(() => {
            startTimestamp = performance.now();
            isIntroFinished = true;
        }, 800);
    });

    let isLetterOpen = false;
    let isLetterTyping = false;

    let recipient = 'Maisha';
    let sender = 'Mohibul';
    let message = "Dear Maisha,\n\nYou are a truly special friend, and I am grateful to have you in my life. 💗\n\nThank you for the smiles, the memories, and all the little moments that make our friendship beautiful. No matter how busy life gets or how far apart we may be, I hope our friendship always stays strong. 🌸\n\nA true friendship is a precious gift, and I am glad that we share this beautiful bond. May your life always be filled with happiness, success, and countless reasons to smile. ✨\n\nStay happy, keep shining, and never forget how wonderful you are as a friend.\n\nYour friend,\nMohibul 💖";

    function initLoveData() {
        const params = new URLSearchParams(window.location.search);
        let loadedData = null;

        const dParam = params.get('d');
        if (dParam) {
            try {
                const decoded = decodeURIComponent(escape(atob(dParam)));
                loadedData = JSON.parse(decoded);
            } catch (e) {
                console.error("Failed to decode 'd' parameter", e);
            }
        }

        const toParam = params.get('to');
        const fromParam = params.get('from');
        const msgParam = params.get('msg');

        if (toParam || fromParam || msgParam) {
            loadedData = {
                to: toParam || recipient,
                from: fromParam || sender,
                msg: msgParam || message
            };
        }

        if (!loadedData) {
            const localTo = localStorage.getItem('love_to');
            const localFrom = localStorage.getItem('love_from');
            const localMsg = localStorage.getItem('love_msg');

            if (localTo || localFrom || localMsg) {
                loadedData = {
                    to: localTo || recipient,
                    from: localFrom || sender,
                    msg: localMsg || message
                };
            }
        }

        if (loadedData) {
            recipient = loadedData.to || recipient;
            sender = loadedData.from || sender;
            message = loadedData.msg || message;
        }

        document.getElementById('recipientInput').value = recipient;
        document.getElementById('senderInput').value = sender;
        document.getElementById('messageInput').value = message;

        document.getElementById('letterHeaderTitle').textContent = `For ${recipient}`;
        document.getElementById('letterSign').textContent = `— coded with friendship by ${sender}`;

        const m2Span = document.querySelector('.m2 span');
        if (m2Span) {
            m2Span.textContent = recipient;
        }
    }

    initLoveData();

    function openLetter() {
        if (isLetterOpen) return;
        isLetterOpen = true;
        playClickSound();

        document.getElementById('letterCard').classList.remove('editing');

        const overlay = document.getElementById('letterOverlay');
        overlay.classList.add('active');

        const body = document.getElementById('letterBody');
        body.innerHTML = '';

        if (isLetterTyping) return;
        isLetterTyping = true;

        let charIdx = 0;

        function typeChar() {
            if (!isLetterOpen || document.getElementById('letterCard').classList.contains('editing')) {
                isLetterTyping = false;
                return;
            }

            if (charIdx < message.length) {
                const char = message[charIdx];
