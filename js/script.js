function createHearts() {
    const hearts = document.querySelector('.hearts');
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = '❤';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 2 + 's';
    hearts.appendChild(heart);
    setTimeout(() => heart.remove(), 5000);
}
setInterval(createHearts, 50);

// Create roses effect
function createRoses() {
    const hearts = document.querySelector('.hearts');
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = '🌹';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 2 + 's';
    hearts.appendChild(heart);
    setTimeout(() => heart.remove(), 5000);
}
setInterval(createRoses, 100);



// Move "No" button function
function moveButton(button) {
    const x = Math.random() * (window.innerWidth - button.offsetWidth);
    const y = Math.random() * (window.innerHeight - button.offsetHeight);
    button.style.position = 'absolute';
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
}

// Navigation functions
function goToStep2() {
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
}

function goToActualStep3() {
    document.getElementById('step1-5').classList.remove('active');
    document.getElementById('step3').classList.add('active');
    startStep3Typing();
}

let step3TypingTimer = null;

function startStep3Typing() {
    const typingText = document.getElementById('step3TypingText');
    const signature = document.getElementById('step3Signature');
    const step3Buttons = document.getElementById('step3Buttons');
    if (!typingText || !signature || !step3Buttons) {
        return;
    }

    const message = "Every moment with you feels like magic. You bring joy to my ordinary days and make every experience more beautiful. I cherish the laughter we share, the dreams we build together, and the love that grows stronger each day. You are my favorite person, my best friend, my everything.";

    if (step3TypingTimer !== null) {
        clearTimeout(step3TypingTimer);
    }

    typingText.textContent = '';
    typingText.classList.add('typing');
    signature.style.opacity = '0';
    step3Buttons.classList.remove('visible');

    let i = 0;
    const typeNext = function() {
        if (i < message.length) {
            typingText.textContent += message.charAt(i);
            i += 1;
            step3TypingTimer = setTimeout(typeNext, 36);
            return;
        }

        typingText.classList.remove('typing');
        signature.style.opacity = '1';
        step3TypingTimer = setTimeout(function() {
            step3Buttons.classList.add('visible');
        }, 650);
    };

    step3TypingTimer = setTimeout(typeNext, 450);
}

let activeGameCleanup = null;

// Heart catching game between step 2 and step 3
function startGame() {
    if (typeof activeGameCleanup === 'function') {
        activeGameCleanup();
        activeGameCleanup = null;
    }

    const canvas = document.getElementById('gameCanvas');
    const scoreLabel = document.getElementById('score');
    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return;
    }
    canvas.width = 400;
    canvas.height = 500;

    let score = 0;
    const targetScore = 15;
    const hearts = [];
    const basket = {
        x: canvas.width / 2 - 30,
        y: canvas.height - 60,
        width: 60,
        height: 50,
        speed: 8
    };

    let animationId = null;
    let heartSpawnTimer = 0;
    let hasWon = false;
    let pointerX = basket.x;
    const keys = {};

    if (scoreLabel) {
        scoreLabel.textContent = '0';
    }

    function supportsConfetti() {
        return typeof confetti === 'function';
    }

    function triggerGameConfetti(particleCount, spread, y) {
        if (!supportsConfetti()) {
            return;
        }
        confetti({
            particleCount: particleCount,
            spread: spread,
            origin: { y: y }
        });
    }

    function updatePointerX(clientX) {
        const rect = canvas.getBoundingClientRect();
        const ratio = canvas.width / rect.width;
        pointerX = (clientX - rect.left) * ratio - basket.width / 2;
    }

    function onKeyDown(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
        }
        keys[e.key] = true;
    }

    function onKeyUp(e) {
        keys[e.key] = false;
    }

    function onMouseMove(e) {
        updatePointerX(e.clientX);
    }

    function onCanvasClick(e) {
        updatePointerX(e.clientX);
    }

    function onTouchStart(e) {
        if (e.touches && e.touches[0]) {
            updatePointerX(e.touches[0].clientX);
        }
    }

    function onTouchMove(e) {
        e.preventDefault();
        if (e.touches && e.touches[0]) {
            updatePointerX(e.touches[0].clientX);
        }
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onCanvasClick);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });

    function cleanupGame() {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
        }
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('keyup', onKeyUp);
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('click', onCanvasClick);
        canvas.removeEventListener('touchstart', onTouchStart);
        canvas.removeEventListener('touchmove', onTouchMove);
    }

    activeGameCleanup = cleanupGame;

    function createHeart() {
        hearts.push({
            x: Math.random() * (canvas.width - 30),
            y: -30,
            speed: 2 + Math.random() * 2,
            size: 20 + Math.random() * 15
        });
    }

    function drawHeart(x, y, size) {
        ctx.fillStyle = '#ff1493';
        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(x, y + topCurveHeight);

        ctx.bezierCurveTo(
            x,
            y,
            x - size / 2,
            y,
            x - size / 2,
            y + topCurveHeight
        );
        ctx.bezierCurveTo(
            x - size / 2,
            y + (size + topCurveHeight) / 2,
            x,
            y + (size + topCurveHeight) / 1.2,
            x,
            y + size
        );
        ctx.bezierCurveTo(
            x,
            y + (size + topCurveHeight) / 1.2,
            x + size / 2,
            y + (size + topCurveHeight) / 2,
            x + size / 2,
            y + topCurveHeight
        );
        ctx.bezierCurveTo(
            x + size / 2,
            y,
            x,
            y,
            x,
            y + topCurveHeight
        );
        ctx.fill();
    }

    function drawBasket() {
        ctx.fillStyle = '#ffb6c1';
        ctx.beginPath();
        ctx.moveTo(basket.x + 5, basket.y);
        ctx.lineTo(basket.x + basket.width - 5, basket.y);
        ctx.lineTo(basket.x + basket.width, basket.y + basket.height);
        ctx.lineTo(basket.x, basket.y + basket.height);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ff69b4';
        ctx.fillRect(basket.x, basket.y, basket.width, 8);

        ctx.strokeStyle = '#ff69b4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(basket.x + basket.width / 2, basket.y - 5, 15, Math.PI, 0);
        ctx.stroke();
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (keys['ArrowLeft'] || keys.a || keys.A) {
            basket.x -= basket.speed;
        }
        if (keys['ArrowRight'] || keys.d || keys.D) {
            basket.x += basket.speed;
        }

        basket.x += (pointerX - basket.x) * 0.2;

        if (basket.x < 0) {
            basket.x = 0;
        }
        if (basket.x > canvas.width - basket.width) {
            basket.x = canvas.width - basket.width;
        }

        heartSpawnTimer++;
        if (heartSpawnTimer > 40) {
            createHeart();
            heartSpawnTimer = 0;
        }

        for (let i = hearts.length - 1; i >= 0; i--) {
            const heart = hearts[i];
            heart.y += heart.speed;

            if (
                heart.y + heart.size > basket.y &&
                heart.y < basket.y + basket.height &&
                heart.x + heart.size / 2 > basket.x &&
                heart.x - heart.size / 2 < basket.x + basket.width
            ) {
                score++;
                if (scoreLabel) {
                    scoreLabel.textContent = String(score);
                }
                hearts.splice(i, 1);

                triggerGameConfetti(20, 50, 0.8);

                if (score >= targetScore) {
                    hasWon = true;
                    setTimeout(function() {
                        triggerGameConfetti(100, 70, 0.6);
                        setTimeout(function() {
                            cleanupGame();
                            activeGameCleanup = null;
                            goToActualStep3();
                        }, 1500);
                    }, 300);
                }
                continue;
            }

            if (heart.y > canvas.height) {
                hearts.splice(i, 1);
                continue;
            }

            drawHeart(heart.x, heart.y, heart.size);
        }

        drawBasket();

        if (!hasWon) {
            animationId = requestAnimationFrame(gameLoop);
        }
    }

    gameLoop();
}

function goToStep3() {
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step1-5').classList.add('active');
    startGame();
}

function goToStep4() {
    document.getElementById('step3').classList.remove('active');
    document.getElementById('step4').classList.add('active');
    // Reset and initialize book
    initializeBook();
    document.getElementById('closeBookButton').style.display = 'none';
}

function initializeBook() {
    var pages = document.getElementsByClassName('page');
    var hasOpened = false;

    if (!pages.length) {
        return;
    }

    // Original stacking behavior from your shared code
    for (var i = 0; i < pages.length; i++) {
        var page = pages[i];
        page.classList.remove('flipped');
        if (i % 2 === 0) {
            page.style.zIndex = (pages.length - i);
        } else {
            page.style.zIndex = '';
        }
    }

    for (var j = 0; j < pages.length; j++) {
        pages[j].pageNum = j + 1;
        pages[j].onclick = null;
    }

    // Open only once from the cover, then disable extra page turns.
    pages[0].onclick = function() {
        if (hasOpened) {
            return;
        }
        this.classList.add('flipped');
        if (this.nextElementSibling) {
            this.nextElementSibling.classList.add('flipped');
        }
        hasOpened = true;
        updateStep4Buttons();
    }
}

function updateStep4Buttons() {
    var cover = document.querySelector('#book .page');
    var closeBtn = document.getElementById('closeBookButton');

    if (cover && cover.classList.contains('flipped')) {
        closeBtn.style.display = 'flex';
    } else {
        closeBtn.style.display = 'none';
    }
}

function closeBook() {
    finalStep();
}

function finalStep() {
    document.getElementById('step4').classList.remove('active');
    document.querySelector('.final-message').style.display = 'block';
    
    // CONFETTI ONLY ON FINAL STEP
    triggerConfetti();
    setTimeout(() => triggerConfetti(), 500);
    setTimeout(() => triggerConfetti(), 1000);
    setTimeout(() => triggerConfetti(), 1500);
    setTimeout(() => triggerConfetti(), 2000);
}

function triggerConfetti() {
    if (typeof confetti !== 'function') {
        return;
    }
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

// Initialize book when page loads
document.addEventListener('DOMContentLoaded', function(){
    // Only initialize if we're on step 4
    if (document.getElementById('step4').classList.contains('active')) {
        initializeBook();
    }
});