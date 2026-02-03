// DOM elements
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const workMinutesInput = document.getElementById('workMinutesInput');
const workSecondsInput = document.getElementById('workSecondsInput');
const breakMinutesInput = document.getElementById('breakMinutesInput');
const breakSecondsInput = document.getElementById('breakSecondsInput');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const statusText = document.getElementById('statusText');
const progressFill = document.getElementById('progressFill');

// State variables
let totalSeconds = 0;
let remainingSeconds = 0;
let timerInterval = null;
let isRunning = false;
let isPaused = false;
let isBreakMode = false; // New: break mode or work mode

// Sounds (optional - uses Web Audio API)
let audioContext = null;

// Initialization
function init() {
    updateDisplayFromInputs();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    workMinutesInput.addEventListener('change', updateDisplayFromInputs);
    workSecondsInput.addEventListener('change', updateDisplayFromInputs);
    breakMinutesInput.addEventListener('change', () => {
        // Validation only
        if (breakMinutesInput.value < 1) breakMinutesInput.value = 1;
        if (breakMinutesInput.value > 60) breakMinutesInput.value = 60;
    });
    breakSecondsInput.addEventListener('change', () => {
        // Validation only
        if (breakSecondsInput.value < 0) breakSecondsInput.value = 0;
        if (breakSecondsInput.value > 59) breakSecondsInput.value = 59;
    });
    
    // Prevent negative values
    workMinutesInput.addEventListener('input', function() {
        if (this.value < 1) this.value = 1;
        if (this.value > 180) this.value = 180;
    });
    
    workSecondsInput.addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
        if (this.value > 59) this.value = 59;
    });
    
    breakMinutesInput.addEventListener('input', function() {
        if (this.value < 1) this.value = 1;
        if (this.value > 60) this.value = 60;
    });
    
    breakSecondsInput.addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
        if (this.value > 59) this.value = 59;
    });
}

// Update the display from input fields
function updateDisplayFromInputs() {
    if (!isRunning) {
        const minutes = parseInt(workMinutesInput.value) || 0;
        const seconds = parseInt(workSecondsInput.value) || 0;

        totalSeconds = minutes * 60 + seconds;
        remainingSeconds = totalSeconds;

        updateDisplay();
        updateProgressBar();
        updateTimerCardStyle();
    }
}

// Update timer card styling based on mode
function updateTimerCardStyle() {
    const timerCard = document.querySelector('.timer-card');
    if (isBreakMode) {
        timerCard.style.background = 'linear-gradient(135deg, rgba(255, 209, 102, 0.15), rgba(255, 230, 153, 0.15))';
        timerCard.style.borderColor = 'rgba(255, 209, 102, 0.3)';
    } else {
        timerCard.style.background = 'rgba(255, 255, 255, 0.95)';
        timerCard.style.borderColor = 'rgba(255, 255, 255, 0.8)';
    }
}

// Update time display
function updateDisplay() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

// Update the progress bar
function updateProgressBar() {
    if (totalSeconds > 0) {
        const percentage = (remainingSeconds / totalSeconds) * 100;
        progressFill.style.width = percentage + '%';
    }
}

// Start the timer
function startTimer() {
    if (!isRunning || isPaused) {
        // If this is a fresh start, read inputs
        if (!isRunning) {
            updateDisplayFromInputs();

            if (totalSeconds === 0) {
                statusText.textContent = '💭 Choose a time first!';
                return;
            }
        }

        isRunning = true;
        isPaused = false;

        // Disable inputs
        workMinutesInput.disabled = true;
        workSecondsInput.disabled = true;
        breakMinutesInput.disabled = true;
        breakSecondsInput.disabled = true;

        // Update buttons
        startBtn.disabled = true;
        pauseBtn.disabled = false;

        // Update status based on mode
        if (isBreakMode) {
            statusText.textContent = '☕ Break in progress... Relax!';
        } else {
            statusText.textContent = '🎯 Session in progress...';
        }

        // Start the countdown
        timerInterval = setInterval(countdown, 1000);
    }
}

// Pause the timer
function pauseTimer() {
    if (isRunning && !isPaused) {
        isPaused = true;
        clearInterval(timerInterval);

        startBtn.disabled = false;
        pauseBtn.disabled = true;

        statusText.textContent = '☕ Paused...';
    }
}

// Reset the timer
function resetTimer() {
    // Stop the timer
    clearInterval(timerInterval);
    isRunning = false;
    isPaused = false;
    isBreakMode = false; // Back to work mode

    // Re-enable inputs
    workMinutesInput.disabled = false;
    workSecondsInput.disabled = false;
    breakMinutesInput.disabled = false;
    breakSecondsInput.disabled = false;

    // Reset buttons
    startBtn.disabled = false;
    pauseBtn.disabled = true;

    // Reset display
    updateDisplayFromInputs();

    statusText.textContent = '✨ Ready to start';

    // Reset progress bar
    progressFill.style.width = '100%';

    // Reset card style
    updateTimerCardStyle();
}

// Countdown logic
function countdown() {
    if (remainingSeconds > 0) {
        remainingSeconds--;
        updateDisplay();
        updateProgressBar();

        // Change message when time is low
        if (isBreakMode) {
            if (remainingSeconds === 60) {
                statusText.textContent = '⏰ One minute left of break!';
            } else if (remainingSeconds === 10) {
                statusText.textContent = '🔜 Break ending soon...';
            }
        } else {
            if (remainingSeconds === 60) {
                statusText.textContent = '⏰ One minute left! Almost there';
            } else if (remainingSeconds === 10) {
                statusText.textContent = '🎉 Final seconds! You got this!';
            }
        }
    } else {
        // Timer finished
        timerComplete();
    }
}

// Timer completed handler
function timerComplete() {
    clearInterval(timerInterval);

    // Play a sound
    playCompletionSound();

    if (!isBreakMode) {
        // End of work session -> switch to break mode
        isBreakMode = true;

        // Work session finished message
        statusText.textContent = '🌟 Session complete! Time for a break ☕';
        animateCompletion();

        // Notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🎉 Pomodoro complete!', {
                body: 'Great job! Your session ended. Take a well-deserved break! ☕',
                icon: '📖'
            });
        }

        // Visual effect
        progressFill.style.width = '0%';

        // Wait 2 seconds then start the break automatically
        setTimeout(() => {
            startBreakTimer();
        }, 2000);

    } else {
        // End of break -> return to work mode
        isBreakMode = false;
        isRunning = false;
        isPaused = false;

        // Re-enable inputs
        workMinutesInput.disabled = false;
        workSecondsInput.disabled = false;
        breakMinutesInput.disabled = false;
        breakSecondsInput.disabled = false;

        // Update buttons
        startBtn.disabled = false;
        pauseBtn.disabled = true;

        // Break finished message
        statusText.textContent = '💪 Break finished! Ready to resume?';

        // Notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('⏰ Break finished!', {
                body: 'Back to it! Ready for another work session? 💪',
                icon: '📖'
            });
        }

        // Reset display to work time
        updateDisplayFromInputs();
        animateCompletion();
        updateTimerCardStyle();
    }
}

// Start the break timer
function startBreakTimer() {
    const breakMinutes = parseInt(breakMinutesInput.value) || 0;
    const breakSeconds = parseInt(breakSecondsInput.value) || 0;

    totalSeconds = breakMinutes * 60 + breakSeconds;
    remainingSeconds = totalSeconds;

    if (totalSeconds === 0) {
        // If no break time defined, return to work mode
        statusText.textContent = '⚠️ No break time set!';
        isBreakMode = false;
        isRunning = false;

        workMinutesInput.disabled = false;
        workSecondsInput.disabled = false;
        breakMinutesInput.disabled = false;
        breakSecondsInput.disabled = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;

        updateDisplayFromInputs();
        updateTimerCardStyle();
        return;
    }

    updateDisplay();
    updateProgressBar();
    updateTimerCardStyle();

    isRunning = true;
    isPaused = false;

    statusText.textContent = '☕ Break in progress... Relax!';

    // Disable inputs during break
    workMinutesInput.disabled = true;
    workSecondsInput.disabled = true;
    breakMinutesInput.disabled = true;
    breakSecondsInput.disabled = true;

    // Enable pause button
    startBtn.disabled = true;
    pauseBtn.disabled = false;

    // Start the countdown
    timerInterval = setInterval(countdown, 1000);
}

// Play a sound when the timer completes
function playCompletionSound() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        // Create a simple melody
        const now = audioContext.currentTime;

        // Three notes to signal completion
        playNote(523.25, now, 0.2); // C
        playNote(659.25, now + 0.25, 0.2); // E
        playNote(783.99, now + 0.5, 0.4); // G

    } catch (error) {
        console.log('Audio not available');
    }
}

// Play a single note
function playNote(frequency, startTime, duration) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
}

// Completion animation
function animateCompletion() {
    let count = 0;
    const originalText = statusText.textContent;

    const flashInterval = setInterval(() => {
        count++;
        if (count % 2 === 0) {
            statusText.style.color = '#d4af37';
            statusText.style.textShadow = '0 0 20px rgba(212, 175, 55, 0.8)';
        } else {
            statusText.style.color = '#c4a570';
            statusText.style.textShadow = 'none';
        }

        if (count >= 6) {
            clearInterval(flashInterval);
            statusText.style.color = '#c4a570';
            statusText.style.textShadow = 'none';
        }
    }, 300);
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Initialize the application
init();

// Page visibility handling (log when user leaves the tab)
document.addEventListener('visibilitychange', function() {
    if (document.hidden && isRunning && !isPaused) {
        // User left the tab but the timer continues
        console.log('Timer continues in the background');
    }
});

// Save state to localStorage (optional)
window.addEventListener('beforeunload', function() {
    if (isRunning) {
        localStorage.setItem('pomodoroState', JSON.stringify({
            remainingSeconds: remainingSeconds,
            totalSeconds: totalSeconds,
            isBreakMode: isBreakMode,
            timestamp: Date.now()
        }));
    }
});

// Restore state on load (optional)
window.addEventListener('load', function() {
    const savedState = localStorage.getItem('pomodoroState');
    if (savedState) {
        const state = JSON.parse(savedState);
        const elapsedTime = Math.floor((Date.now() - state.timestamp) / 1000);

        // Ask user if they want to resume the previous session
        if (confirm('Hey! 👋 Do you want to resume your previous session?')) {
            remainingSeconds = Math.max(0, state.remainingSeconds - elapsedTime);
            totalSeconds = state.totalSeconds;
            isBreakMode = state.isBreakMode || false;

            if (remainingSeconds > 0) {
                updateDisplay();
                updateProgressBar();
                updateTimerCardStyle();
            } else {
                resetTimer();
            }
        }

        localStorage.removeItem('pomodoroState');
    }
});