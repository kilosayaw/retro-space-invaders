import { useState } from 'react';
import { X } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (username: string, email: string, password: string) => Promise<void>;
}

export function AuthModal({ onClose, onSignIn, onSignUp }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!username.trim()) {
          throw new Error('Username is required');
        }
        await onSignUp(username, email, password);
      } else {
        await onSignIn(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-4 border-green-500 p-8 rounded-lg max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-green-500 hover:text-green-400"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-green-500 mb-6 text-center font-mono">
          {isSignUp ? 'SIGN UP' : 'SIGN IN'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-green-500 font-mono text-sm mb-2">
                USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-800 border-2 border-green-500 text-green-500 px-4 py-2 font-mono focus:outline-none focus:border-green-400"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-green-500 font-mono text-sm mb-2">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border-2 border-green-500 text-green-500 px-4 py-2 font-mono focus:outline-none focus:border-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-green-500 font-mono text-sm mb-2">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border-2 border-green-500 text-green-500 px-4 py-2 font-mono focus:outline-none focus:border-green-400"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-900 border-2 border-red-500 text-red-200 px-4 py-2 font-mono text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-4 font-mono text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'LOADING...' : isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-green-500 hover:text-green-400 font-mono text-sm underline"
          >
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
