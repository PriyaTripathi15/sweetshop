import React, { useState, useEffect } from 'react';
import { sweetsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import AddSweetModal from './AddSweetModal';
import EditSweetModal from './EditSweetModal';
import { FaEdit, FaBox, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

const Admin = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [restockId, setRestockId] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState('');

  // FIXED: Added isAdmin and navigate
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // PROTECT ADMIN ROUTE
    if (!isAdmin()) {
      navigate("/");
    }
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

  return (
    <div className="min-h-screen bg-pink-50">
      
      {/* HEADER */}
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

            <button
              onClick={logout}
              className="bg-white text-pink-900 px-4 py-2 rounded-md font-semibold"
            >
              Logout
            </button>
          </div>

        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        
        <h1 className="text-3xl font-bold text-orange-700 mb-6 font-serif">
          Admin Panel
        </h1>

        {/* ADMIN ACTIONS */}
        <div className="bg-white border-2 border-pink-200 rounded-xl p-6 shadow-md flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-pink-600 text-white px-5 py-2 rounded hover:bg-pink-700 font-semibold transition"
          >
            + Add New Sweet
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-pink-200 text-pink-700 p-4 rounded-lg text-center border border-pink-100">
              <h3 className="text-sm opacity-80">Total Products</h3>
              <p className="text-2xl font-bold">{sweets.length}</p>
            </div>

            <div className="bg-pink-100 text-pink-700 p-4 rounded-lg text-center border border-pink-200">
              <h3 className="text-sm opacity-80">Low Stock Items</h3>
              <p className="text-2xl font-bold">{sweets.filter(s => s.quantity < 20 && s.quantity > 0).length}</p>
            </div>

            <div className="bg-pink-50 text-pink-600 p-4 rounded-lg text-center border border-pink-200">
              <h3 className="text-sm opacity-80">Out of Stock</h3>
              <p className="text-2xl font-bold">{sweets.filter(s => s.quantity === 0).length}</p>
            </div>
          </div>
        </div>

        {/* LOADING / ERROR */}
        {loading && (
          <div className="text-center text-pink-600 p-6 bg-white rounded-xl shadow-md">
            Loading inventory...
          </div>
        )}

        {error && (
          <div className="text-center text-pink-600 p-6 bg-white rounded-xl shadow-md">
            {error}
          </div>
        )}

        {/* INVENTORY TABLE */}
        <div className="bg-white border-2 border-pink-200 rounded-xl p-6 shadow-md overflow-x-auto">
          
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-pink-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Name</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Category</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Price</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Quantity</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Description</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {sweets.map(sweet => (
                <tr
                  key={sweet._id}
                  className={`border-b hover:bg-pink-50 transition ${
                    sweet.quantity === 0
                      ? 'bg-pink-100'
                      : sweet.quantity < 20
                      ? 'bg-pink-50'
                      : ''
                  }`}
                >
                  <td className="px-4 py-2 font-semibold text-pink-800">{sweet.name}</td>

                  <td className="px-4 py-2">
                    <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-full text-xs font-medium">
                      {sweet.category}
                    </span>
                  </td>

                  <td className="px-4 py-2 font-bold text-pink-600">${sweet.price.toFixed(2)}</td>

                  <td className="px-4 py-2 font-medium text-gray-700">{sweet.quantity}</td>

                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sweet.quantity === 0
                          ? 'bg-pink-100 text-pink-600'
                          : sweet.quantity < 20
                          ? 'bg-pink-50 text-pink-500'
                          : 'bg-green-100 text-green-600'
                      }`}
                    >
                      {sweet.quantity === 0
                        ? 'Out of Stock'
                        : sweet.quantity < 20
                        ? 'Low Stock'
                        : 'In Stock'}
                    </span>
                  </td>

                  <td className="px-4 py-2 max-w-xs truncate">
                    {sweet.description}
                  </td>

                  <td className="px-4 py-2 flex gap-2 items-center">

                    {/* Restock Mode */}
                    {restockId === sweet._id ? (
                      <>
                        <input
                          type="number"
                          min="1"
                          value={restockQuantity}
                          onChange={(e) => setRestockQuantity(e.target.value)}
                          className="w-16 px-2 py-1 border-2 border-gray-300 rounded"
                        />

                        <button
                          onClick={() => handleRestock(sweet._id)}
                          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                        >
                          <FaCheck />
                        </button>

                        <button
                          onClick={() => { setRestockId(null); setRestockQuantity(''); }}
                          className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
                        >
                          <FaTimes />
                        </button>
                      </>
                    
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingSweet(sweet)}
                          className="bg-pink-100 text-pink-700 p-2 rounded hover:bg-pink-200"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() => { setRestockId(sweet._id); setRestockQuantity(''); }}
                          className="bg-pink-50 text-pink-600 p-2 rounded hover:bg-pink-100"
                        >
                          <FaBox />
                        </button>

                        <button
                          onClick={() => handleDelete(sweet._id)}
                          className="bg-red-200 text-red-700 p-2 rounded hover:bg-red-300"
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
      </main>

      {/* MODALS */}
      {showAddModal && (
        <AddSweetModal onClose={() => setShowAddModal(false)} onSuccess={fetchSweets} />
      )}

      {editingSweet && (
        <EditSweetModal
          sweet={editingSweet}
          onClose={() => setEditingSweet(null)}
          onSuccess={fetchSweets}
        />
      )}

    </div>
  );
};

export default Admin;
