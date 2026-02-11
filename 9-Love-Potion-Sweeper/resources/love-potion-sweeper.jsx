// NOTE: This file is executed in the browser via Babel (see index.html).
// So we must NOT use ESM imports/exports here. React is available on `window.React`.
const { useState, useEffect } = React;

const LovePotionSweeper = () => {
  const DIFFICULTY_LEVELS = {
    easy: { rows: 8, cols: 8, potions: 10, label: 'Easy' },
    medium: { rows: 12, cols: 12, potions: 25, label: 'Medium' },
    hard: { rows: 16, cols: 16, potions: 50, label: 'Hard' },
    expert: { rows: 20, cols: 20, potions: 80, label: 'Expert' }
  };

  const [difficulty, setDifficulty] = useState('easy');
  const [board, setBoard] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [flagged, setFlagged] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    initGame();
  }, [difficulty]);

  useEffect(() => {
    let interval;
    if (gameStatus === 'playing' && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStatus, startTime]);

  const initGame = () => {
    const { rows, cols, potions } = DIFFICULTY_LEVELS[difficulty];
    
    const newBoard = Array(rows).fill(null).map(() => Array(cols).fill(0));
    const newRevealed = Array(rows).fill(null).map(() => Array(cols).fill(false));
    const newFlagged = Array(rows).fill(null).map(() => Array(cols).fill(false));

    let potionsPlaced = 0;
    while (potionsPlaced < potions) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      if (newBoard[row][col] !== -1) {
        newBoard[row][col] = -1;
        potionsPlaced++;
      }
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (newBoard[r][c] !== -1) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc] === -1) {
                count++;
              }
            }
          }
          newBoard[r][c] = count;
        }
      }
    }

    setBoard(newBoard);
    setRevealed(newRevealed);
    setFlagged(newFlagged);
    setGameStatus('playing');
    setScore(0);
    setStartTime(null);
    setElapsedTime(0);
  };

  const revealCell = (row, col) => {
    const { rows, cols, potions } = DIFFICULTY_LEVELS[difficulty];
    
    if (gameStatus !== 'playing' || revealed[row][col] || flagged[row][col]) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    const newRevealed = revealed.map(r => [...r]);
    
    if (board[row][col] === -1) {
      newRevealed[row][col] = true;
      setRevealed(newRevealed);
      setGameStatus('lost');
      revealAll();
      return;
    }

    const flood = (r, c) => {
      if (r < 0 || r >= rows || c < 0 || c >= cols || newRevealed[r][c] || board[r][c] === -1) {
        return;
      }
      newRevealed[r][c] = true;
      if (board[r][c] === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            flood(r + dr, c + dc);
          }
        }
      }
    };

    flood(row, col);
    setRevealed(newRevealed);
    setScore(prev => prev + 1);

    let safeCells = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (newRevealed[r][c] && board[r][c] !== -1) safeCells++;
      }
    }

    if (safeCells === rows * cols - potions) {
      setGameStatus('won');
    }
  };

  const toggleFlag = (row, col, e) => {
    e.preventDefault();
    if (gameStatus !== 'playing' || revealed[row][col]) return;

    const newFlagged = flagged.map(r => [...r]);
    newFlagged[row][col] = !newFlagged[row][col];
    setFlagged(newFlagged);
  };

  const revealAll = () => {
    const { rows, cols } = DIFFICULTY_LEVELS[difficulty];
    const newRevealed = Array(rows).fill(null).map(() => Array(cols).fill(true));
    setRevealed(newRevealed);
  };

  const getCellColor = (value) => {
    const colors = {
      1: 'text-pink-400',
      2: 'text-pink-500',
      3: 'text-red-400',
      4: 'text-red-500',
      5: 'text-red-600',
      6: 'text-rose-600',
      7: 'text-rose-700',
      8: 'text-rose-800'
    };
    return colors[value] || 'text-gray-700';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCellSize = () => {
    const { rows } = DIFFICULTY_LEVELS[difficulty];
    if (rows <= 8) return 'w-12 h-12 text-base';
    if (rows <= 12) return 'w-10 h-10 text-sm';
    if (rows <= 16) return 'w-8 h-8 text-xs';
    return 'w-6 h-6 text-xs';
  };

  const { rows, cols, potions } = DIFFICULTY_LEVELS[difficulty];
  const flagsRemaining = potions - flagged.flat().filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">❤️</span>
            <h1 className="text-5xl font-bold text-rose-600">Love Potion Sweeper</h1>
            <span className="text-4xl">❤️</span>
          </div>
          <p className="text-rose-700 text-lg mb-4">
            Find all the safe hearts, but avoid the magical love potions! 💕
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
            <div className="flex gap-2">
              {Object.entries(DIFFICULTY_LEVELS).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => setDifficulty(key)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    difficulty === key
                      ? 'bg-rose-500 text-white shadow-lg'
                      : 'bg-white/60 text-rose-600 hover:bg-white/80'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
            <div className="bg-white/60 px-4 py-2 rounded-full shadow-lg">
              <span className="text-rose-600 font-semibold">Time: {formatTime(elapsedTime)}</span>
            </div>
            <div className="bg-white/60 px-4 py-2 rounded-full shadow-lg">
              <span className="text-rose-600 font-semibold">Flags: {flagsRemaining}</span>
            </div>
            <div className="bg-white/60 px-4 py-2 rounded-full shadow-lg">
              <span className="text-rose-600 font-semibold">Clicks: {score}</span>
            </div>
            <button
              onClick={initGame}
              className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-full shadow-lg flex items-center gap-2 transition-colors"
            >
              <span aria-hidden="true">🔄</span>
              New Game
            </button>
          </div>

          {gameStatus === 'won' && (
            <div className="bg-green-100 border-2 border-green-400 text-green-700 px-6 py-3 rounded-lg shadow-lg inline-flex items-center gap-2">
              <span aria-hidden="true">✨</span>
              <span className="font-bold text-xl">Congratulations! You won in {formatTime(elapsedTime)}! 💖</span>
              <span aria-hidden="true">✨</span>
            </div>
          )}

          {gameStatus === 'lost' && (
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-3 rounded-lg shadow-lg inline-block">
              <span className="font-bold text-xl">Oh no! You fell in love! 💔</span>
            </div>
          )}
        </div>

        <div className="bg-white/80 p-6 rounded-2xl shadow-2xl backdrop-blur-sm flex justify-center">
          <div className="inline-block border-4 border-rose-300 rounded-lg overflow-hidden">
            {board.map((row, r) => (
              <div key={r} className="flex">
                {row.map((cell, c) => (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => revealCell(r, c)}
                    onContextMenu={(e) => toggleFlag(r, c, e)}
                    className={`${getCellSize()} border border-rose-200 font-bold transition-all ${
                      revealed[r][c]
                        ? cell === -1
                          ? 'bg-red-400'
                          : cell === 0
                          ? 'bg-pink-50'
                          : 'bg-white'
                        : 'bg-gradient-to-br from-rose-300 to-pink-300 hover:from-rose-400 hover:to-pink-400 shadow-sm'
                    }`}
                    disabled={gameStatus !== 'playing'}
                  >
                    {revealed[r][c] ? (
                      cell === -1 ? (
                        <span className={rows > 16 ? 'text-lg' : 'text-2xl'}>🧪</span>
                      ) : cell > 0 ? (
                        <span className={getCellColor(cell)}>{cell}</span>
                      ) : (
                        ''
                      )
                    ) : flagged[r][c] ? (
                      <span className="text-red-500">🚩</span>
                    ) : (
                      <span className={`text-white ${rows > 16 ? 'text-sm' : 'text-xl'}`}>❤️</span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-6 text-rose-600">
          <p className="text-sm">
            <strong>How to play:</strong> Left click to reveal • Right click to flag a potion
          </p>
        </div>
      </div>
    </div>
  );
};

// Make the component available to index.html inline script.
window.LovePotionSweeper = LovePotionSweeper;