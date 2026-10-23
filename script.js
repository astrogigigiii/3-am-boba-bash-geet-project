let boba = 100;
let code = 20;
let awake = 100;
let totalMinutes = 180; 
let isGameOver = false;
let gameLoopInterval;
let gameStarted = false; 

const bobaBar = document.getElementById('boba-bar');
const codeBar = document.getElementById('code-bar');
const awakeBar = document.getElementById('awake-border');
const statusBubble = document.getElementById('status-bubble');
const timeScore = document.getElementById('time-score');
const gameOverScreen = document.getElementById('game-over-screen');
const tamagotchiPic = document.getElementById('tamagotchi-pic');
const thoughtsContainer = document.getElementById('thoughts-container');
const bootScreen = document.getElementById('boot-screen');

const bobaQuotes = ["OOF THANK U!", "I LOVE BOBA!", "TAPIOCA POWER!", "MORE BOBA PLEASE!", "SWEET REFRESHMENT"];
const codeQuotes = ["COMPILING...", "NO BUGS ALLOWED", "LET'S SHIP IT!", "WE ARE COOKING!", "HACKING IN PROGRESS"];
const coffeeQuotes = ["ENERGY OVERLOAD!", "I CAN SEE TIME!", "HEART RATE: FAST", "BYE BYE SLEEP!", "ZOOMING!!!"];
const passiveQuotes = ["3AM HACKING TIME", "FEELING A BIT SLEEPY", "IS THAT A BUG?", "KEEP GOING TEAM!"];

const intrusiveThoughts = [
    "How much work is left?", "Did I close my tags?", "My back hurts...", 
    "I need more boba", "Should I just drop out?", "Why is my CSS broken?", 
    "Sun rises in 2 hours", "Coffee isn't working", "Syntax Error on line 42", 
    "Is it too late to sleep?", "Everyone else finished", "Too tired to think", 
    "What am I doing with my life?", "Sleep is for the weak", "My brain can't think now", 
    "Just one more feature", "Forgot to test on mobile", "I want Maggi"
];

function init() {
    boba = 100;
    code = 20;
    awake = 100;
    totalMinutes = 180;
    isGameOver = false;
    
    if (gameOverScreen) gameOverScreen.classList.add('hidden');
    if (statusBubble) statusBubble.innerText = "LET'S CODE!";
    if (tamagotchiPic) tamagotchiPic.classList.remove('shake-active');
    if (thoughtsContainer) thoughtsContainer.innerHTML = ""; 
    updateDisplay();
    
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    if (gameStarted) {
        gameLoopInterval = setInterval(gameTick, 1000);
    }
}

function gameTick() {
    if (isGameOver || !gameStarted) return;

    boba -= 3;
    awake -= 4;
    totalMinutes += 2; 

    if (boba < 0) boba = 0;
    if (awake < 0) awake = 0;

    if (awake <= 0 || boba <= 0) {
        triggerGameOver();
        return;
    }

    updateDisplay();

    let spawnChance = awake < 40 ? 0.85 : 0.40;
    if (Math.random() < spawnChance) {
        spawnThought();
    }

    if (Math.random() < 0.25 && statusBubble) {
        if (awake < 30) {
            statusBubble.innerText = "SO TIRED... HELP";
        } else {
            statusBubble.innerText = getRandomElement(passiveQuotes);
        }
    }
}

function spawnThought() {
    if (isGameOver || !thoughtsContainer || !gameStarted) return;

    const thoughtText = getRandomElement(intrusiveThoughts);
    const textNode = document.createElement('div');
    textNode.classList.add('thought-block');
    textNode.innerText = thoughtText;

    const posX = Math.floor(Math.random() * 80); 
    const posY = Math.floor(Math.random() * 90);
    textNode.style.left = posX + "vw";
    textNode.style.top = posY + "vh";

    if (awake < 35) {
        textNode.classList.add('urgent');
    }

    thoughtsContainer.appendChild(textNode);
}

function updateDisplay() {
    if (bobaBar) bobaBar.style.width = boba + "%";
    if (codeBar) codeBar.style.width = code + "%";
    if (awakeBar) awakeBar.style.width = awake + "%";

    let hours = Math.floor(totalMinutes / 60);
    let mins = totalMinutes % 60;
    let stringHours = hours < 10 ? "0" + hours : hours;
    let stringMins = mins < 10 ? "0" + mins : mins;
    if (timeScore) timeScore.innerText = `${stringHours}:${stringMins}`;
}

function triggerGameOver() {
    isGameOver = true;
    clearInterval(gameLoopInterval);
    if (gameOverScreen) gameOverScreen.classList.remove('hidden');
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function triggerShake() {
    if (!tamagotchiPic) return;
    tamagotchiPic.classList.remove('shake-active');
    void tamagotchiPic.offsetWidth; 
    tamagotchiPic.classList.add('shake-active');
}

if (document.getElementById('start-game-btn')) {
    document.getElementById('start-game-btn').addEventListener('click', () => {
        bootScreen.classList.add('system-glitch');
        
        setTimeout(() => {
            bootScreen.classList.remove('system-glitch');
            bootScreen.classList.add('slide-out');
            gameStarted = true;
            init();
        }, 500);
    });
}

if (document.getElementById('btn-boba')) {
    document.getElementById('btn-boba').addEventListener('click', () => {
        if (isGameOver || !gameStarted) return;
        triggerShake();
        boba += 20;
        if (boba > 100) boba = 100;
        if (statusBubble) statusBubble.innerText = getRandomElement(bobaQuotes);
        updateDisplay();
    });
}

if (document.getElementById('btn-code')) {
    document.getElementById('btn-code').addEventListener('click', () => {
        if (isGameOver || !gameStarted) return;
        triggerShake();
        code += 12;
        awake -= 6;
        if (code > 100) code = 100;
        if (awake < 0) awake = 0;
        
        if (statusBubble) statusBubble.innerText = getRandomElement(codeQuotes);
        spawnThought();
        
        if (awake <= 0) triggerGameOver();
        else updateDisplay();
    });
}

if (document.getElementById('btn-coffee')) {
    document.getElementById('btn-coffee').addEventListener('click', () => {
        if (isGameOver || !gameStarted) return;
        triggerShake();
        awake += 25;
        boba -= 8; 
        if (awake > 100) awake = 100;
        if (boba < 0) boba = 0;

        if (statusBubble) statusBubble.innerText = getRandomElement(coffeeQuotes);
        
        if (boba <= 0) triggerGameOver();
        else updateDisplay();
    });
}

if (document.getElementById('restart-btn')) {
    document.getElementById('restart-btn').addEventListener('click', init);
}

updateDisplay();
