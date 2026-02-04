const { useState, useEffect, useRef } = React;

const StrawberryTimer = () => {
  const [selectedTime, setSelectedTime] = useState(5); // Default 5 minutes
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [stage, setStage] = useState(0); // 0: seed, 1: sprout, 2: flower, 3: fruit
  const intervalRef = useRef(null);
  const audioContextRef = useRef(null);

  // Timer presets in minutes
  const timePresets = [1, 5, 10, 15, 20, 25, 30, 45, 60];

  // Calculate current stage based on time progress
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const totalTime = selectedTime * 60;
      const elapsed = totalTime - timeLeft;
      const progress = elapsed / totalTime;

      if (progress >= 0.75) {
        setStage(3); // Ripe strawberry
      } else if (progress >= 0.5) {
        setStage(2); // Flowering
      } else if (progress >= 0.25) {
        setStage(1); // Sprout
      } else {
        setStage(0); // Seed
      }
    }
  }, [timeLeft, isRunning, selectedTime]);

  // Timer countdown
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            playCompletionSound();
            setIsRunning(false);
            setStage(3); // Show final strawberry
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // Play completion sound
  const playCompletionSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Pleasant notification sound
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const startTimer = () => {
    setTimeLeft(selectedTime * 60);
    setIsRunning(true);
    setStage(0);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setStage(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Strawberry stage images (assets)
  const StrawberryStage = ({ stage }) => {
    const stageImages = [
      'assets/1.png',
      'assets/2.png',
      'assets/3.png',
      'assets/4.png'
    ];

    const src = stageImages[stage] || stageImages[stageImages.length - 1];

    return (
      <img
        src={src}
        alt={`stage-${stage}`}
        style={{ width: '200px', height: '200px', objectFit: 'contain' }}
      />
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '20px',
      background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
    }}>
      <h1 style={{
        color: '#2e7d32',
        marginBottom: '20px',
        fontSize: '32px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
      }}>
        🍓 Strawberry Timer 🍓
      </h1>

      {/* Strawberry stage visualization */}
      <div style={{
        marginBottom: '30px',
        padding: '20px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        minHeight: '220px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <StrawberryStage stage={stage} />
      </div>

      {/* Time display */}
      {timeLeft > 0 && (
        <div style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#1b5e20',
          marginBottom: '20px',
          fontFamily: 'monospace',
          background: 'white',
          padding: '15px 40px',
          borderRadius: '15px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          {formatTime(timeLeft)}
        </div>
      )}

      {/* Time selection */}
      {!isRunning && timeLeft === 0 && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            color: '#2e7d32',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            Select Timer Duration:
          </label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(Number(e.target.value))}
            style={{
              padding: '12px 20px',
              fontSize: '16px',
              borderRadius: '10px',
              border: '2px solid #4caf50',
              background: 'white',
              color: '#2e7d32',
              cursor: 'pointer',
              width: '200px',
              fontWeight: 'bold'
            }}
          >
            {timePresets.map(time => (
              <option key={time} value={time}>
                {time} {time === 1 ? 'minute' : 'minutes'}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Control buttons */}
      <div style={{ display: 'flex', gap: '15px' }}>
        {!isRunning && timeLeft === 0 && (
          <button
            onClick={startTimer}
            style={{
              padding: '15px 35px',
              fontSize: '18px',
              borderRadius: '25px',
              border: 'none',
              background: 'linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            🌱 Start Growing
          </button>
        )}

        {isRunning && (
          <button
            onClick={pauseTimer}
            style={{
              padding: '15px 35px',
              fontSize: '18px',
              borderRadius: '25px',
              border: 'none',
              background: 'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(255, 152, 0, 0.4)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            ⏸️ Pause
          </button>
        )}

        {!isRunning && timeLeft > 0 && (
          <button
            onClick={() => setIsRunning(true)}
            style={{
              padding: '15px 35px',
              fontSize: '18px',
              borderRadius: '25px',
              border: 'none',
              background: 'linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            ▶️ Resume
          </button>
        )}

        {timeLeft > 0 && (
          <button
            onClick={resetTimer}
            style={{
              padding: '15px 35px',
              fontSize: '18px',
              borderRadius: '25px',
              border: 'none',
              background: 'linear-gradient(135deg, #ef5350 0%, #e53935 100%)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(229, 57, 53, 0.4)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            🔄 Reset
          </button>
        )}
      </div>

      {/* Completion message */}
      {timeLeft === 0 && stage === 3 && !isRunning && selectedTime > 0 && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
          borderRadius: '15px',
          color: '#c62828',
          fontSize: '24px',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          animation: 'pulse 2s infinite'
        }}>
          🎉 Your strawberry is ready! 🍓
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

// Render the app
ReactDOM.render(<StrawberryTimer />, document.getElementById('root'));
