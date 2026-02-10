        // ============================================
        // CONFIGURATION - Edit your message here!
        // ============================================
        const config = {
            "message": "You light up my days like no one else. I love you more than words can say! 💕",
            "scratchText": "❤️ SCRATCH HERE ❤️"
        };

        // Canvas setup
        const canvas = document.getElementById('scratchCanvas');
        const ctx = canvas.getContext('2d');
        const container = document.querySelector('.scratch-container');
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;

        document.getElementById('secretMessage').textContent = config.message;

        // Create the scratch-off layer
        function initScratchLayer() {
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#FFD1DC');
            gradient.addColorStop(0.5, '#FFC0CB');
            gradient.addColorStop(1, '#FFB3D9');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add scratch instruction text
            ctx.fillStyle = '#FF69B4';
            ctx.font = 'bold 26px Comic Sans MS';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(config.scratchText, canvas.width / 2, canvas.height / 2);

            // Add decorative hearts pattern
            ctx.fillStyle = '#FFB6C1';
            ctx.font = '22px Arial';
            const hearts = ['💖', '💕', '💗', '💓', '💝'];
            for (let i = 0; i < 12; i++) {
                const randomHeart = hearts[Math.floor(Math.random() * hearts.length)];
                ctx.fillText(
                    randomHeart, 
                    Math.random() * canvas.width, 
                    Math.random() * canvas.height
                );
            }
        }

        // Initialize the scratch layer
        initScratchLayer();

        let isScratching = false;

        // Scratch effect function
        function scratch(x, y) {
            // Use 'destination-out' to erase the scratch layer
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, Math.PI * 2);
            ctx.fill();
        }

        // Mouse events for scratching
        canvas.addEventListener('mousedown', () => isScratching = true);
        canvas.addEventListener('mouseup', () => isScratching = false);
        canvas.addEventListener('mouseleave', () => isScratching = false);

        canvas.addEventListener('mousemove', (e) => {
            if (isScratching) {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                scratch(x, y);
            }
        });

        // Touch events for mobile devices
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isScratching = true;
        });

        canvas.addEventListener('touchend', () => isScratching = false);

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (isScratching) {
                const rect = canvas.getBoundingClientRect();
                const touch = e.touches[0];
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                scratch(x, y);
            }
        });

        // Reveal all button - clears the entire scratch layer
        function revealAll() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }