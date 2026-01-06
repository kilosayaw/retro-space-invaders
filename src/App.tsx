import { useEffect, useRef, useState } from 'react';
import { Trophy, Volume2, VolumeX } from 'lucide-react';
import { Game } from './game/Game';
import { audioManager } from './game/audio';
import { NameEntryModal } from './components/NameEntryModal';
import { Leaderboard } from './components/Leaderboard';
import { submitScoreAnonymous } from './lib/gameData';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [showNameEntry, setShowNameEntry] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOverData, setGameOverData] = useState<{
    score: number;
    wave: number;
    aliensDefeated: number;
  } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const game = new Game(canvasRef.current);
    gameRef.current = game;

    game.onGameOver = async (score, wave, aliensDefeated) => {
      setGameStarted(false);
      setGameOverData({ score, wave, aliensDefeated });
      setShowNameEntry(true);
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' && game.state === 'menu') {
        game.startGame();
        setGameStarted(true);
      }
      
      // ESC to skip name entry
      if (e.key === 'Escape' && showNameEntry) {
        setShowNameEntry(false);
        setGameOverData(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    const gameLoop = () => {
      game.update();
      game.draw();
      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [showNameEntry]);

  const handleSubmitScore = async (playerName: string) => {
    if (gameOverData) {
      try {
        await submitScoreAnonymous(
          playerName,
          gameOverData.score,
          gameOverData.wave,
          gameOverData.aliensDefeated
        );
        setShowNameEntry(false);
        setShowLeaderboard(true);
        setGameOverData(null);
      } catch (error) {
        console.error('Failed to save score:', error);
        alert('Failed to save score. Please try again.');
      }
    }
  };

  const handleSkipNameEntry = () => {
    setShowNameEntry(false);
    setGameOverData(null);
  };

  const toggleSound = () => {
    const enabled = audioManager.toggle();
    setSoundEnabled(enabled);
  };

  const startGame = () => {
    if (gameRef.current) {
      gameRef.current.startGame();
      setGameStarted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center p-4">
      <div className="mb-6 flex items-center justify-between w-full max-w-[800px]">
        <div className="flex items-center gap-4">
          <div className="text-green-500 font-mono text-2xl font-bold tracking-wider">
            SPACE INVADERS
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleSound}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 font-mono"
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button
            onClick={() => setShowLeaderboard(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 font-mono flex items-center gap-2"
          >
            <Trophy size={20} />
            LEADERBOARD
          </button>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border-4 border-green-500 shadow-2xl shadow-green-500/50"
          style={{
            imageRendering: 'pixelated',
          }}
        />

        {!gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600 text-black font-bold py-4 px-8 font-mono text-2xl pointer-events-auto animate-pulse"
            >
              PRESS SPACE TO START
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 text-center text-gray-400 font-mono text-sm max-w-[800px]">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-800 border border-gray-700 p-3">
            <div className="text-green-500 font-bold mb-1">MOVEMENT</div>
            <div>Arrow Keys or A/D</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 p-3">
            <div className="text-green-500 font-bold mb-1">SHOOT</div>
            <div>Spacebar</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 p-3">
            <div className="text-green-500 font-bold mb-1">PAUSE</div>
            <div>P Key</div>
          </div>
        </div>
        <div className="text-xs">
          Collect power-ups for special abilities: Multi-Shot, Rapid Fire, and Shield
        </div>
      </div>

      {showNameEntry && gameOverData && (
        <NameEntryModal
          score={gameOverData.score}
          wave={gameOverData.wave}
          aliensDefeated={gameOverData.aliensDefeated}
          onSubmit={handleSubmitScore}
          onClose={handleSkipNameEntry}
        />
      )}

      {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
    </div>
  );
}

export default App;
