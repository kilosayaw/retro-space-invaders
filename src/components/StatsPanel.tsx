import { useEffect, useState } from 'react';
import { BarChart3, X } from 'lucide-react';
import { getPlayerStats, PlayerStats } from '../lib/gameData';

interface StatsPanelProps {
  userId: string;
  onClose: () => void;
}

export function StatsPanel({ userId, onClose }: StatsPanelProps) {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = async () => {
    try {
      const playerStats = await getPlayerStats(userId);
      setStats(playerStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-4 border-cyan-500 p-8 rounded-lg max-w-2xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cyan-500 hover:text-cyan-400"
        >
          <X size={24} />
        </button>

        <div className="flex items-center justify-center gap-3 mb-6">
          <BarChart3 size={32} className="text-cyan-500" />
          <h2 className="text-3xl font-bold text-cyan-500 font-mono">
            YOUR STATS
          </h2>
        </div>

        {loading ? (
          <div className="text-center text-cyan-500 font-mono py-8">
            LOADING...
          </div>
        ) : !stats ? (
          <div className="text-center text-cyan-500 font-mono py-8">
            NO STATS AVAILABLE
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 border-2 border-cyan-500 p-4">
                <div className="text-cyan-500 font-mono text-sm mb-1">
                  GAMES PLAYED
                </div>
                <div className="text-white font-mono text-3xl font-bold">
                  {stats.games_played}
                </div>
              </div>

              <div className="bg-gray-800 border-2 border-cyan-500 p-4">
                <div className="text-cyan-500 font-mono text-sm mb-1">
                  BEST SCORE
                </div>
                <div className="text-white font-mono text-3xl font-bold">
                  {stats.best_score.toLocaleString()}
                </div>
              </div>

              <div className="bg-gray-800 border-2 border-cyan-500 p-4">
                <div className="text-cyan-500 font-mono text-sm mb-1">
                  TOTAL ALIENS DEFEATED
                </div>
                <div className="text-white font-mono text-3xl font-bold">
                  {stats.total_aliens_defeated.toLocaleString()}
                </div>
              </div>

              <div className="bg-gray-800 border-2 border-cyan-500 p-4">
                <div className="text-cyan-500 font-mono text-sm mb-1">
                  WAVES COMPLETED
                </div>
                <div className="text-white font-mono text-3xl font-bold">
                  {stats.total_waves_completed}
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border-2 border-cyan-500 p-4">
              <div className="text-cyan-500 font-mono text-sm mb-1">
                LAST PLAYED
              </div>
              <div className="text-white font-mono text-lg">
                {formatDate(stats.last_played)}
              </div>
            </div>

            {stats.games_played > 0 && (
              <div className="bg-gray-800 border-2 border-cyan-500 p-4">
                <div className="text-cyan-500 font-mono text-sm mb-1">
                  AVERAGE ALIENS PER GAME
                </div>
                <div className="text-white font-mono text-lg">
                  {(stats.total_aliens_defeated / stats.games_played).toFixed(1)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
