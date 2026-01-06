import { useState } from 'react';
import { X } from 'lucide-react';

interface NameEntryModalProps {
  score: number;
  wave: number;
  aliensDefeated: number;
  onSubmit: (playerName: string) => void;
  onClose: () => void;
}

export function NameEntryModal({ score, wave, aliensDefeated, onSubmit, onClose }: NameEntryModalProps) {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = playerName.trim().toUpperCase();
    
    if (!trimmedName) {
      setError('Please enter your name');
      return;
    }
    
    if (trimmedName.length > 15) {
      setError('Name must be 15 characters or less');
      return;
    }

    onSubmit(trimmedName);
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-4 border-green-500 p-8 rounded-lg max-w-md w-full mx-4 relative">
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-green-500 hover:text-green-400"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-green-500 mb-2 text-center font-mono">
          GAME OVER
        </h2>
        
        <div className="text-center mb-6 space-y-2">
          <div className="text-yellow-500 font-mono text-xl">
            SCORE: {score}
          </div>
          <div className="text-cyan-500 font-mono text-sm">
            WAVE: {wave} | ALIENS: {aliensDefeated}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-green-500 font-mono text-sm mb-2 text-center">
              ENTER YOUR NAME FOR THE LEADERBOARD
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                setError('');
              }}
              className="w-full bg-gray-800 border-2 border-green-500 text-green-500 px-4 py-3 font-mono text-xl text-center uppercase focus:outline-none focus:border-green-400"
              placeholder="ACE"
              maxLength={15}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-900 border-2 border-red-500 text-red-200 px-4 py-2 font-mono text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-4 font-mono text-lg"
            >
              SUBMIT
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 font-mono text-lg"
            >
              SKIP
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-gray-400 font-mono text-xs">
          Press ESC to skip
        </div>
      </div>
    </div>
  );
}
