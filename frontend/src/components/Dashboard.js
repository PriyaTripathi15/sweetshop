import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sweetsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SweetCard from './SweetCard';

const Dashboard = () => {
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSweets();
  }, []);

  useEffect(() => {
    filterSweets();
  }, [searchTerm, categoryFilter, priceRange, sweets]);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const res = await sweetsAPI.getAll();
      setSweets(res.data);
      setFilteredSweets(res.data);
    } catch {
      setError('Failed to fetch sweets');
    } finally {
      setLoading(false);
    }
  };

  const filterSweets = () => {
    let result = [...sweets];

    if (searchTerm) {
      result = result.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      result = result.filter(s => s.category === categoryFilter);
    }

    if (priceRange.min) {
      result = result.filter(s => s.price >= parseFloat(priceRange.min));
    }

    if (priceRange.max) {
      result = result.filter(s => s.price <= parseFloat(priceRange.max));
    }

    setFilteredSweets(result);
  };

  const handlePurchase = async (sweetId, qty) => {
    try {
      await sweetsAPI.purchase(sweetId, qty);
      fetchSweets();
    } catch {
      alert('Purchase failed.');
    }
  };

  const categories = [...new Set(sweets.map(s => s.category))];

  return (
    <div className="min-h-screen bg-pink-50 w-full">

      {/* Header */}
      <header className="bg-gradient-to-r from-pink-700 to-pink-900 text-white shadow-md p-6">
        <div className="w-full mx-auto flex items-center justify-between">

          <div className="flex items-center gap-4">
          <img
            src="https://tse1.mm.bing.net/th/id/OIP.BbHcLHRHQicFv98-agHHUQHaHa?pid=Api&P=0&h=180"
            alt="SweetShop Logo"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
          />
          </div>

          <div className="flex items-center gap-4">
            <div>Welcome, <b>{user?.username}</b></div>

            {isAdmin() && (
              <>
                <span className="bg-pink-200 text-pink-900 px-3 py-1 rounded-full">
                  Admin
                </span>
                <button
                  onClick={() => navigate('/admin')}
                  className="bg-white text-pink-900 px-4 py-2 rounded-md font-semibold"
                >
                  Admin Panel
                </button>
              </>
            )}

            <button onClick={logout} className="bg-white text-pink-900 px-4 py-2 rounded-md font-semibold">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="w-full p-6">

        {/* Filters */}
        <section className="bg-white p-6 rounded-xl border border-pink-200 shadow-md max-w-6xl mx-auto">
          <input
            type="text"
            placeholder="Search sweets..."
            className="w-full p-3 border-2 border-pink-200 rounded-lg mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="flex gap-4 flex-wrap">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-2 border-2 border-pink-200 rounded-lg"
            >
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat}>{cat}</option>)}
            </select>

            <input
              type="number"
              placeholder="Min Price"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              className="p-2 border-2 border-pink-200 rounded-lg w-28"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              className="p-2 border-2 border-pink-200 rounded-lg w-28"
            />

            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
                setPriceRange({ min: '', max: '' });
              }}
              className="bg-gray-200 px-4 py-2 rounded-md font-semibold"
            >
              Clear
            </button>
          </div>
        </section>

        {/* Sweets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full mt-8">

          {filteredSweets.map(sweet => (
            <SweetCard
              key={sweet._id}
              sweet={sweet}
              isAdmin={false}
              onPurchase={handlePurchase}
              onUpdated={fetchSweets}
            />
          ))}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;


