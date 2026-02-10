        "use strict";

        const CONFIG = {
            yesBtnGrowthFactor: 1.15,
            noBtnShrinkFactor: 0.85,
            minNoBtnScale: 0.3,
            maxYesBtnScale: 3,
            confettiCount: 100,
            gifs: {
                normal: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHB5dGQ2aGJ3Zm9oaGI5anN1OXg1N3R1cGp5eGhvZWJ1dHZxNWl5aSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MDJ9IbxxvDUQM/giphy.gif",
                sad: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzB4bzhtNGg2dGNsNWt1aGV5eGI0OGhzOGZhYmphaGJwdHFneWoyeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L95W4wv8nnb9K/giphy.gif"
            }
        };

        const gameState = {
            attempts: 0,
            yesBtnScale: 1,
            noBtnScale: 1
        };

        // ============================================
        // DOM Elements
        // ============================================
        const elements = {
            yesBtn: document.getElementById('yesBtn'),
            noBtn: document.getElementById('noBtn'),
            gameContent: document.getElementById('gameContent'),
            celebration: document.getElementById('celebration'),
            attemptCounter: document.getElementById('attemptCounter'),
            characterGif: document.getElementById('characterGif'),
            container: document.querySelector('.container')
        };

        /**
         * Create confetti effect
         */
        function createConfetti() {
            const colors = ['#C69F9F', '#A67C7C', '#D8C5C5', '#B68E8E', '#8B5A5A'];
            
            for (let i = 0; i < CONFIG.confettiCount; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * window.innerWidth + 'px';
                    confetti.style.top = '-10px';
                    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
                    confetti.style.animationDelay = Math.random() * 0.5 + 's';
                    
                    document.body.appendChild(confetti);
                    
                    setTimeout(() => confetti.remove(), 3000);
                }, i * 30);
            }
        }

        /**
         * Update attempt counter display
         */
        function updateAttemptCounter() {
            if (gameState.attempts > 0) {
                const messages = [
                    "Please? ♥",
                    "I would be so happy...",
                    "Think about it... ♡",
                    "Are you sure?",
                    "Just one more thought...",
                    "My heart hopes you'll reconsider",
                    "Perhaps you need a moment?",
                    "I believe in us...",
                    "Don't give up on this ♥",
                    "You know it feels right..."
                ];
                
                const messageIndex = Math.min(gameState.attempts - 1, messages.length - 1);
                elements.attemptCounter.textContent = messages[messageIndex];
            }
        }

        /**
         * Update character gif based on game state
         */
        function updateCharacterGif() {
            if (gameState.attempts >= 3) {
                elements.characterGif.src = CONFIG.gifs.sad;
            }
        }

        // ============================================
        // Event Handlers
        // ============================================

        /**
         * Handle Yes button click
         */
        function handleYesClick() {
            elements.gameContent.style.display = 'none';
            elements.celebration.style.display = 'block';
            createConfetti();
        }

        /**
         * Handle No button click - shrinks No and grows Yes
         */
        function handleNoClick(event) {
            event.preventDefault();
            
            gameState.attempts++;
            updateAttemptCounter();
            updateCharacterGif();
            
            // Grow Yes button
            gameState.yesBtnScale = Math.min(
                gameState.yesBtnScale * CONFIG.yesBtnGrowthFactor,
                CONFIG.maxYesBtnScale
            );
            elements.yesBtn.style.transform = `scale(${gameState.yesBtnScale})`;
            
            // Shrink No button
            gameState.noBtnScale = Math.max(
                gameState.noBtnScale * CONFIG.noBtnShrinkFactor,
                CONFIG.minNoBtnScale
            );
            elements.noBtn.style.transform = `scale(${gameState.noBtnScale})`;
            
            // Disable No button when too small
            if (gameState.noBtnScale <= CONFIG.minNoBtnScale) {
                elements.noBtn.style.opacity = '0.5';
                elements.noBtn.style.cursor = 'not-allowed';
                elements.noBtn.disabled = true;
            }
        }
        elements.yesBtn.addEventListener('click', handleYesClick);
        elements.noBtn.addEventListener('click', handleNoClick);