const timerDisplay = document.getElementById('timer');
const modeDisplay = document.getElementById('mode');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

let timer;
let timeRemaining = WORK_TIME;
let isRunning = false;
let isWorkMode = true;

function updateDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timer = setInterval(() => {
        timeRemaining--;
        updateDisplay();
        if (timeRemaining <= 0) {
            clearInterval(timer);
            isRunning = false;
            isWorkMode = !isWorkMode;
            timeRemaining = isWorkMode ? WORK_TIME : BREAK_TIME;
            modeDisplay.textContent = isWorkMode ? 'Work' : 'Break';
            updateDisplay();
            // Optional: Auto-start the next session
            // startTimer();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    stopTimer();
    isWorkMode = true;
    timeRemaining = WORK_TIME;
    modeDisplay.textContent = 'Work';
    updateDisplay();
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

// Initial display
updateDisplay();
