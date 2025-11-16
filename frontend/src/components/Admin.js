import React, { useState, useEffect } from 'react';
import { sweetsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AddSweetModal from './AddSweetModal';
import EditSweetModal from './EditSweetModal';
import { FaEdit, FaBox, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

import './Admin.css';

const Admin = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [restockId, setRestockId] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState('');
  
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const response = await sweetsAPI.getAll();
      setSweets(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch sweets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sweetId) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      try {
        await sweetsAPI.delete(sweetId);
        fetchSweets();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleRestock = async (sweetId) => {
    const quantity = parseInt(restockQuantity);
    if (!quantity || quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }
    
    try {
      await sweetsAPI.restock(sweetId, quantity);
      setRestockId(null);
      setRestockQuantity('');
      fetchSweets();
    } catch (err) {
      alert(err.response?.data?.message || 'Restock failed');
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return 'out-of-stock';
    if (quantity < 20) return 'low-stock';
    return 'in-stock';
  };

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div className="header-content">
          <h1>🍬 Admin Panel - Sweet Shop Management</h1>
          <div className="user-info">
            <span>Welcome, {user?.username}!</span>
            <span className="admin-badge">Admin</span>
            <button onClick={logout} className="btn btn-secondary">Logout</button>
          </div>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-actions">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            + Add New Sweet
          </button>
          <div className="stats">
            <div className="stat-card">
              <h3>Total Products</h3>
              <p>{sweets.length}</p>
            </div>
            <div className="stat-card">
              <h3>Low Stock Items</h3>
              <p>{sweets.filter(s => s.quantity < 20 && s.quantity > 0).length}</p>
            </div>
            <div className="stat-card">
              <h3>Out of Stock</h3>
              <p>{sweets.filter(s => s.quantity === 0).length}</p>
            </div>
          </div>
        </div>

        {loading && <div className="loading">Loading inventory...</div>}
        {error && <div className="error">{error}</div>}

        <div className="inventory-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sweets.map(sweet => (
                <tr key={sweet._id} className={getStockStatus(sweet.quantity)}>
                  <td className="sweet-name">{sweet.name}</td>
                  <td>
                    <span className="category-badge">{sweet.category}</span>
                  </td>
                  <td className="price">${sweet.price.toFixed(2)}</td>
                  <td className="quantity">{sweet.quantity}</td>
                  <td>
                    <span className={`status-badge ${getStockStatus(sweet.quantity)}`}>
                      {sweet.quantity === 0 ? 'Out of Stock' : 
                       sweet.quantity < 20 ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="description">{sweet.description}</td>
                <td className="actions">
  {restockId === sweet._id ? (
    <div className="restock-inline">
      <input
        type="number"
        min="1"
        value={restockQuantity}
        onChange={(e) => setRestockQuantity(e.target.value)}
        placeholder="Qty"
        className="restock-input"
      />

      <button
        onClick={() => handleRestock(sweet._id)}
        className="btn-icon btn-success"
        title="Confirm"
      >
        <FaCheck />
      </button>

      <button
        onClick={() => {
          setRestockId(null);
          setRestockQuantity('');
        }}
        className="btn-icon btn-secondary"
        title="Cancel"
      >
        <FaTimes />
      </button>
    </div>
  ) : (
    <>
      <button
        onClick={() => setEditingSweet(sweet)}
        className="btn-icon btn-edit"
        title="Edit"
      >
        <FaEdit />
      </button>

      <button
        onClick={() => {
          setRestockId(sweet._id);
          setRestockQuantity('');
        }}
        className="btn-icon btn-restock"
        title="Restock"
      >
        <FaBox />
      </button>

      <button
        onClick={() => handleDelete(sweet._id)}
        className="btn-icon btn-delete"
        title="Delete"
      >
        <FaTrash />
      </button>
    </>
  )}
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <AddSweetModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchSweets();
          }}
        />
      )}

      {editingSweet && (
        <EditSweetModal
          sweet={editingSweet}
          onClose={() => setEditingSweet(null)}
          onSuccess={() => {
            setEditingSweet(null);
            fetchSweets();
          }}
        />
      )}
    </div>
  );
};

export default Admin;
