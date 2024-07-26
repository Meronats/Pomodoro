// script.js

let timer;
let workMinutes = 25;
let breakMinutes = 5;
let seconds = 0;
let isRunning = false;
let onBreak = false;

const timerDisplay = document.getElementById('time-display');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const startBreakButton = document.getElementById('start-break');
const workDurationInput = document.getElementById('work-duration');
const breakDurationInput = document.getElementById('break-duration');
const saveSettingsButton = document.getElementById('save-settings');
const startSound = document.getElementById('start-sound');
const endSound = document.getElementById('end-sound');
const canvas = document.getElementById('timer-canvas');
const ctx = canvas.getContext('2d');
const radius = canvas.height / 2;

function updateTimerDisplay(minutes, seconds) {
    timerDisplay.innerHTML = `<span id="minutes">${String(minutes).padStart(2, '0')}</span>:<span id="seconds">${String(seconds).padStart(2, '0')}</span>`;
    drawTimer(minutes, seconds);
}

function drawTimer(minutes, seconds) {
    const totalSeconds = (onBreak ? breakMinutes : workMinutes) * 60;
    const remainingSeconds = minutes * 60 + seconds;
    const elapsedRatio = (totalSeconds - remainingSeconds) / totalSeconds;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(radius, radius, radius - 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#f4f4f4';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(radius, radius, radius - 10, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * elapsedRatio);
    ctx.lineTo(radius, radius);
    ctx.fillStyle = '#ff69b4';
    ctx.fill();
}

function startTimer(isBreak = false) {
    if (!isRunning) {
        isRunning = true;
        startSound.play();
        timer = setInterval(() => {
            if (seconds === 0) {
                if ((isBreak && breakMinutes === 0) || (!isBreak && workMinutes === 0)) {
                    clearInterval(timer);
                    isRunning = false;
                    endSound.play();
                    if (!isBreak) {
                        onBreak = true;
                        workMinutes = parseInt(workDurationInput.value);
                        seconds = 0;
                        startTimer(true); // Automatically start the break timer
                    } else {
                        onBreak = false;
                        breakMinutes = parseInt(breakDurationInput.value);
                        seconds = 0;
                    }
                } else {
                    if (isBreak) {
                        if (breakMinutes > 0) {
                            breakMinutes--;
                        }
                    } else {
                        if (workMinutes > 0) {
                            workMinutes--;
                        }
                    }
                    seconds = 59;
                }
            } else {
                seconds--;
            }
            updateTimerDisplay(isBreak ? breakMinutes : workMinutes, seconds);
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    workMinutes = parseInt(workDurationInput.value);
    breakMinutes = parseInt(breakDurationInput.value);
    seconds = 0;
    onBreak = false;
    updateTimerDisplay(workMinutes, seconds);
}

startButton.addEventListener('click', () => startTimer(false));
startBreakButton.addEventListener('click', () => startTimer(true));
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
saveSettingsButton.addEventListener('click', resetTimer);

updateTimerDisplay(workMinutes, seconds);
