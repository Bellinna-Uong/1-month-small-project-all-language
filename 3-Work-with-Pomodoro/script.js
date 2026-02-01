// Éléments du DOM
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

// Variables d'état
let totalSeconds = 0;
let remainingSeconds = 0;
let timerInterval = null;
let isRunning = false;
let isPaused = false;
let isBreakMode = false; // Nouveau : mode pause ou travail

// Sons (optionnel - utilise l'API Web Audio)
let audioContext = null;

// Initialisation
function init() {
    updateDisplayFromInputs();
    setupEventListeners();
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    workMinutesInput.addEventListener('change', updateDisplayFromInputs);
    workSecondsInput.addEventListener('change', updateDisplayFromInputs);
    breakMinutesInput.addEventListener('change', () => {
        // Validation uniquement
        if (breakMinutesInput.value < 1) breakMinutesInput.value = 1;
        if (breakMinutesInput.value > 60) breakMinutesInput.value = 60;
    });
    breakSecondsInput.addEventListener('change', () => {
        // Validation uniquement
        if (breakSecondsInput.value < 0) breakSecondsInput.value = 0;
        if (breakSecondsInput.value > 59) breakSecondsInput.value = 59;
    });
    
    // Empêcher les valeurs négatives
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

// Mettre à jour l'affichage à partir des inputs
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

// Mettre à jour le style de la carte selon le mode
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

// Mettre à jour l'affichage du temps
function updateDisplay() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

// Mettre à jour la barre de progression
function updateProgressBar() {
    if (totalSeconds > 0) {
        const percentage = (remainingSeconds / totalSeconds) * 100;
        progressFill.style.width = percentage + '%';
    }
}

// Démarrer le minuteur
function startTimer() {
    if (!isRunning || isPaused) {
        // Si c'est un nouveau démarrage, récupérer les valeurs des inputs
        if (!isRunning) {
            updateDisplayFromInputs();
            
            if (totalSeconds === 0) {
                statusText.textContent = '💭 Choisis un temps d\'abord !';
                return;
            }
        }
        
        isRunning = true;
        isPaused = false;
        
        // Désactiver les inputs
        workMinutesInput.disabled = true;
        workSecondsInput.disabled = true;
        breakMinutesInput.disabled = true;
        breakSecondsInput.disabled = true;
        
        // Mettre à jour les boutons
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        
        // Mettre à jour le statut selon le mode
        if (isBreakMode) {
            statusText.textContent = '☕ Pause en cours... Détends-toi !';
        } else {
            statusText.textContent = '🎯 Session en cours...';
        }
        
        // Démarrer le compte à rebours
        timerInterval = setInterval(countdown, 1000);
    }
}

// Mettre en pause le minuteur
function pauseTimer() {
    if (isRunning && !isPaused) {
        isPaused = true;
        clearInterval(timerInterval);
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        
        statusText.textContent = '☕ Petite pause...';
    }
}

// Réinitialiser le minuteur
function resetTimer() {
    // Arrêter le minuteur
    clearInterval(timerInterval);
    isRunning = false;
    isPaused = false;
    isBreakMode = false; // Retour au mode travail
    
    // Réactiver les inputs
    workMinutesInput.disabled = false;
    workSecondsInput.disabled = false;
    breakMinutesInput.disabled = false;
    breakSecondsInput.disabled = false;
    
    // Réinitialiser les boutons
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    
    // Réinitialiser l'affichage
    updateDisplayFromInputs();
    
    statusText.textContent = '✨ Prêt à recommencer';
    
    // Réinitialiser la barre de progression
    progressFill.style.width = '100%';
    
    // Réinitialiser le style de la carte
    updateTimerCardStyle();
}

// Compte à rebours
function countdown() {
    if (remainingSeconds > 0) {
        remainingSeconds--;
        updateDisplay();
        updateProgressBar();
        
        // Changer le message quand il reste peu de temps
        if (isBreakMode) {
            if (remainingSeconds === 60) {
                statusText.textContent = '⏰ Plus qu\'une minute de pause !';
            } else if (remainingSeconds === 10) {
                statusText.textContent = '🔜 La pause se termine bientôt...';
            }
        } else {
            if (remainingSeconds === 60) {
                statusText.textContent = '⏰ Plus qu\'une minute ! Tu y es presque';
            } else if (remainingSeconds === 10) {
                statusText.textContent = '🎉 Dernières secondes ! Tu assures !';
            }
        }
    } else {
        // Le minuteur est terminé
        timerComplete();
    }
}

// Minuteur terminé
function timerComplete() {
    clearInterval(timerInterval);
    
    // Jouer un son
    playCompletionSound();
    
    if (!isBreakMode) {
        // Fin du temps de travail -> Passer en mode pause
        isBreakMode = true;
        
        // Message de fin de session de travail
        statusText.textContent = '🌟 Session terminée ! C\'est l\'heure de la pause ☕';
        animateCompletion();
        
        // Notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🎉 Pomodoro terminé !', {
                body: 'Bravo ! Ta session est terminée. Prends une petite pause bien méritée ! ☕',
                icon: '📖'
            });
        }
        
        // Effet visuel temporaire
        progressFill.style.width = '0%';
        
        // Attendre 2 secondes puis démarrer la pause automatiquement
        setTimeout(() => {
            startBreakTimer();
        }, 2000);
        
    } else {
        // Fin de la pause -> Retour au mode travail
        isBreakMode = false;
        isRunning = false;
        isPaused = false;
        
        // Réactiver les inputs
        workMinutesInput.disabled = false;
        workSecondsInput.disabled = false;
        breakMinutesInput.disabled = false;
        breakSecondsInput.disabled = false;
        
        // Mettre à jour les boutons
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        
        // Message de fin de pause
        statusText.textContent = '💪 Pause terminée ! Prêt à reprendre ?';
        
        // Notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('⏰ Pause terminée !', {
                body: 'C\'est reparti ! Prêt pour une nouvelle session de travail ? 💪',
                icon: '📖'
            });
        }
        
        // Réinitialiser l'affichage avec le temps de travail
        updateDisplayFromInputs();
        animateCompletion();
        updateTimerCardStyle();
    }
}

// Démarrer le timer de pause
function startBreakTimer() {
    const breakMinutes = parseInt(breakMinutesInput.value) || 0;
    const breakSeconds = parseInt(breakSecondsInput.value) || 0;
    
    totalSeconds = breakMinutes * 60 + breakSeconds;
    remainingSeconds = totalSeconds;
    
    if (totalSeconds === 0) {
        // Si pas de temps de pause défini, retour au mode travail
        statusText.textContent = '⚠️ Aucun temps de pause défini !';
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
    
    statusText.textContent = '☕ Pause en cours... Détends-toi !';
    
    // Désactiver les inputs pendant la pause
    workMinutesInput.disabled = true;
    workSecondsInput.disabled = true;
    breakMinutesInput.disabled = true;
    breakSecondsInput.disabled = true;
    
    // Activer le bouton pause
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    
    // Démarrer le compte à rebours
    timerInterval = setInterval(countdown, 1000);
}

// Jouer un son à la fin
function playCompletionSound() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Créer une mélodie simple
        const now = audioContext.currentTime;
        
        // Trois notes pour signaler la fin
        playNote(523.25, now, 0.2); // Do
        playNote(659.25, now + 0.25, 0.2); // Mi
        playNote(783.99, now + 0.5, 0.4); // Sol
        
    } catch (error) {
        console.log('Audio non disponible');
    }
}

// Jouer une note
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

// Animation de fin
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

// Demander la permission pour les notifications
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Initialiser l'application
init();

// Gestion du focus de la page (mettre en pause si l'utilisateur quitte l'onglet)
document.addEventListener('visibilitychange', function() {
    if (document.hidden && isRunning && !isPaused) {
        // L'utilisateur a quitté l'onglet mais le timer continue
        console.log('Timer continue en arrière-plan');
    }
});

// Sauvegarder l'état dans le localStorage (optionnel)
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

// Restaurer l'état au chargement (optionnel)
window.addEventListener('load', function() {
    const savedState = localStorage.getItem('pomodoroState');
    if (savedState) {
        const state = JSON.parse(savedState);
        const elapsedTime = Math.floor((Date.now() - state.timestamp) / 1000);
        
        // Demander à l'utilisateur s'il veut reprendre
        if (confirm('Hey ! 👋 Tu veux reprendre ta session précédente ?')) {
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