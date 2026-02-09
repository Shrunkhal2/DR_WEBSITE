import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { authService } from '../services/auth.service';
import { useAppContext } from '../context/AppContext';
import useDarkMode from '../hooks/useDarkMode';

const Login = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAppContext();
  const [isDark, setIsDark] = useDarkMode();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login(username, password);

      // Persist auth data
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${
        isDark
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100'
      }`}
    >
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl p-8 ${
          isDark ? 'bg-gray-800 text-white' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <Eye className="h-12 w-12 text-blue-600 mx-auto mb-3" />
          <h1 className="text-3xl font-bold tracking-tight">
            EyeCare Portal
          </h1>
          <p className="mt-1 text-sm opacity-70">
            Secure doctor access
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-2.5 rounded-lg font-medium transition"
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 flex justify-between items-center text-sm opacity-70">
          <button onClick={() => setIsDark(!isDark)}>
            {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
          <span>Demo: doctor / password123</span>
        </div>
      </div>
    </div>
  );
};

export default Login;