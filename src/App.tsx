import { useEffect, useRef, useState } from 'react';
import { LogIn, LogOut, Trophy, BarChart3, Volume2, VolumeX } from 'lucide-react';
import { Game } from './game/Game';
import { audioManager } from './game/audio';
import { AuthModal } from './components/AuthModal';
import { Leaderboard } from './components/Leaderboard';
import { StatsPanel } from './components/StatsPanel';
import { signIn, signUp, signOut, getCurrentUser, AuthUser } from './lib/auth';
import { submitScore, updatePlayerStats } from './lib/gameData';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const game = new Game(canvasRef.current);
    gameRef.current = game;

    game.onWaveComplete = async (score, wave, aliensDefeated) => {
      if (user) {
        try {
          await updatePlayerStats(user.id, score, aliensDefeated, wave);
        } catch (error) {
          console.error('Failed to update stats:', error);
        }
      }
    };

    game.onGameOver = async (score, wave, aliensDefeated) => {
      setGameStarted(false);

      if (user) {
        try {
          await submitScore(user.id, user.username, score, wave, aliensDefeated);
          await updatePlayerStats(user.id, score, aliensDefeated, wave - 1);
        } catch (error) {
          console.error('Failed to save game data:', error);
        }
      }
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' && game.state === 'menu') {
        if (!user) {
          setShowAuthModal(true);
        } else {
          game.startGame();
          setGameStarted(true);
        }
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
  }, [user]);

  const checkUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const handleSignIn = async (email: string, password: string) => {
    const result = await signIn(email, password);
    setUser({ id: result.user.id, username: result.username });
  };

  const handleSignUp = async (username: string, email: string, password: string) => {
    const result = await signUp(username, email, password);
    setUser({ id: result.user.id, username });
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    if (gameRef.current) {
      gameRef.current.state = 'menu';
      setGameStarted(false);
    }
  };

  const toggleSound = () => {
    const enabled = audioManager.toggle();
    setSoundEnabled(enabled);
  };

  const startGame = () => {
    if (!user) {
      setShowAuthModal(true);
    } else if (gameRef.current) {
      gameRef.current.startGame();
      setGameStarted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center p-4">
      <div className="mb-6 flex items-center justify-between w-full max-w-[800px]">
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="text-green-500 font-mono text-lg">
                PLAYER: {user.username}
              </div>
              <button
                onClick={() => setShowStats(true)}
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-4 font-mono flex items-center gap-2"
              >
                <BarChart3 size={20} />
                STATS
              </button>
              <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 font-mono flex items-center gap-2"
              >
                <LogOut size={20} />
                LOGOUT
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 font-mono flex items-center gap-2"
            >
              <LogIn size={20} />
              LOGIN
            </button>
          )}
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

        {!gameStarted && user && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600 text-black font-bold py-4 px-8 font-mono text-2xl pointer-events-auto animate-pulse"
            >
              PRESS SPACE TO START
            </button>
          </div>
        )}

        {!user && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-green-500 hover:bg-green-600 text-black font-bold py-4 px-8 font-mono text-2xl pointer-events-auto mb-4 animate-pulse"
              >
                LOGIN TO PLAY
              </button>
            </div>
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

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
        />
      )}

      {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}

      {showStats && user && (
        <StatsPanel userId={user.id} onClose={() => setShowStats(false)} />
      )}
    </div>
  );
}

export default App;
