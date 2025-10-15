import React, { useState } from 'react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be a call to an auth API.
    // For now, we use a hardcoded password.
    if (password === 'admin123') {
      onLoginSuccess();
    } else {
      setError('Invalid password. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-white">
      <div className="w-full max-w-sm p-8 space-y-6 bg-black rounded-lg shadow-lg">
        <div className="text-center">
            <div className="flex items-center justify-center gap-3 text-2xl font-bold">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#1DB954" strokeWidth="2"/>
                    <path d="M9 15.5V8.5L15 12L9 15.5Z" fill="#1DB954"/>
                </svg>
                <span>Musikipri</span>
            </div>
            <h1 className="mt-4 text-xl font-semibold text-neutral-300">Admin Access</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-400">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="block w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md shadow-sm placeholder-neutral-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-green-500 transition-colors"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
