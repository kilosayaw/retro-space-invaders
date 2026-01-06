import { useEffect, useState } from 'react';
import { Trophy, X } from 'lucide-react';
import { getTopScores, HighScore } from '../lib/gameData';

interface LeaderboardProps {
  onClose: () => void;
}

export function Leaderboard({ onClose }: LeaderboardProps) {
  const [scores, setScores] = useState<HighScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    try {
      const topScores = await getTopScores(10);
      setScores(topScores);
    } catch (error) {
      console.error('Failed to load scores:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-4 border-yellow-500 p-8 rounded-lg max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-yellow-500 hover:text-yellow-400"
        >
          <X size={24} />
        </button>

        <div className="flex items-center justify-center gap-3 mb-6">
          <Trophy size={32} className="text-yellow-500" />
          <h2 className="text-3xl font-bold text-yellow-500 font-mono">
            LEADERBOARD
          </h2>
        </div>

        {loading ? (
          <div className="text-center text-yellow-500 font-mono py-8">
            LOADING...
          </div>
        ) : scores.length === 0 ? (
          <div className="text-center text-yellow-500 font-mono py-8">
            NO SCORES YET. BE THE FIRST!
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2 text-yellow-500 font-mono text-sm font-bold border-b-2 border-yellow-500 pb-2">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-3">PLAYER</div>
              <div className="col-span-2 text-right">SCORE</div>
              <div className="col-span-2 text-center">WAVE</div>
              <div className="col-span-2 text-center">ALIENS</div>
              <div className="col-span-2 text-right">DATE</div>
            </div>

            {scores.map((score, index) => (
              <div
                key={score.id}
                className={`grid grid-cols-12 gap-2 font-mono text-sm py-2 border-b border-gray-700 ${
                  index < 3 ? 'text-yellow-400' : 'text-green-500'
                }`}
              >
                <div className="col-span-1 text-center font-bold">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && index + 1}
                </div>
                <div className="col-span-3 truncate">{score.username}</div>
                <div className="col-span-2 text-right font-bold">
                  {score.score.toLocaleString()}
                </div>
                <div className="col-span-2 text-center">{score.wave_reached}</div>
                <div className="col-span-2 text-center">{score.aliens_defeated}</div>
                <div className="col-span-2 text-right text-xs">
                  {formatDate(score.achieved_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
