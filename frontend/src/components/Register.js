import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(username, email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-5 bg-cover bg-center" style={{ backgroundImage: `url('https://static.vecteezy.com/system/resources/thumbnails/038/830/156/small_2x/ai-generated-minimalistic-sweet-and-candy-background-concept-with-empty-space-photo.jpg')` }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-pink-100/40 z-0"></div>

      {/* Card */}
      <div className="relative z-10 bg-white border-2 border-pink-200 rounded-xl shadow-lg p-10 max-w-md w-full">
        <h2 className="text-center font-serif text-2xl font-bold mb-8 text-[#7b0331]">Register for Sweet Shop</h2>

        {error && (
          <div className="bg-pink-50 border-l-4 border-pink-600 text-pink-600 p-3 mb-5 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block mb-2 font-medium text-gray-600">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength="3"
              placeholder="Choose a username"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-md text-gray-700 focus:border-pink-700 outline-none"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 font-medium text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-md text-gray-700 focus:border-pink-700 outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 font-medium text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              placeholder="Choose a password"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-md text-gray-700 focus:border-pink-700 outline-none"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-2 font-medium text-gray-600">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-md text-gray-700 focus:border-pink-700 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md text-white font-semibold bg-gradient-to-tr from-pink-600 to-[#7b0331] hover:shadow-lg hover:-translate-y-1 transition-all disabled:opacity-60"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-5 text-gray-600">
          Already have an account? <a href="/login" className="text-pink-600 font-semibold hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
