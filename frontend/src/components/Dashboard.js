import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sweetsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SweetCard from './SweetCard';
import './Dashboard.css';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterSweets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, categoryFilter, priceRange, sweets]);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const response = await sweetsAPI.getAll();
      setSweets(response.data);
      setFilteredSweets(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch sweets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterSweets = () => {
    let filtered = [...sweets];

    if (searchTerm) {
      filtered = filtered.filter(sweet =>
        sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sweet.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(sweet =>
        sweet.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    if (priceRange.min) {
      filtered = filtered.filter(sweet => sweet.price >= parseFloat(priceRange.min));
    }

    if (priceRange.max) {
      filtered = filtered.filter(sweet => sweet.price <= parseFloat(priceRange.max));
    }

    setFilteredSweets(filtered);
  };

  const handlePurchase = async (sweetId, quantity) => {
    try {
      await sweetsAPI.purchase(sweetId, quantity);
      fetchSweets();
    } catch (err) {
      alert(err.response?.data?.message || 'Purchase failed');
    }
  };



  const categories = [...new Set(sweets.map(sweet => sweet.category))];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
       <img
            src="https://tse1.mm.bing.net/th/id/OIP.BbHcLHRHQicFv98-agHHUQHaHa?pid=Api&P=0&h=180"
            alt="SweetShop Logo"  
            className="logo"
          />
          <div className="user-info">
            <span>Welcome, {user?.username}!</span>
            {isAdmin() && (
              <>
                <span className="admin-badge">Admin</span>
                <button onClick={() => navigate('/admin')} className="btn btn-admin">Admin Panel</button>
              </>
            )}
            <button onClick={logout} className="btn btn-secondary">Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="filters-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search sweets by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Min Price"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              className="price-input"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              className="price-input"
            />

            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
                setPriceRange({ min: '', max: '' });
              }}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {loading && <div className="loading">Loading sweets...</div>}
        {error && <div className="error">{error}</div>}

        <div className="sweets-grid">
          {filteredSweets.length === 0 && !loading && (
            <div className="no-results">No sweets found</div>
          )}
          
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
      </div>
    </div>
  );
};

export default Dashboard;
