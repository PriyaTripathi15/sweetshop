import React, { useState } from 'react';
import './SweetCard.css';
import EditSweetModal from './EditSweetModal';

const SweetCard = ({ sweet, isAdmin, onPurchase, onDelete, onRestock, onUpdated, showPurchase = true }) => {
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [restockQuantity, setRestockQuantity] = useState(10);
  const [showRestockInput, setShowRestockInput] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handlePurchase = () => {
    if (purchaseQuantity > 0 && purchaseQuantity <= sweet.quantity) {
      onPurchase(sweet._id, purchaseQuantity);
      setPurchaseQuantity(1);
    }
  };

  const handleRestock = () => {
    if (restockQuantity > 0) {
      onRestock(sweet._id, restockQuantity);
      setRestockQuantity(10);
      setShowRestockInput(false);
    }
  };

  return (
    <div className="sweet-card">
      <div className="sweet-image">
        {sweet.imageUrl ? (
          <img src={sweet.imageUrl} alt={sweet.name} />
        ) : (
          <div className="placeholder-image">🍬</div>
        )}
      </div>

      <div className="sweet-details">
        <h3 className="sweet-name">{sweet.name}</h3>
        <p className="sweet-category">{sweet.category}</p>
        {sweet.description && (
          <p className="sweet-description">{sweet.description}</p>
        )}
        
        <div className="sweet-info">
          <span className="sweet-price">${sweet.price.toFixed(2)}</span>
          <span className={`sweet-stock ${sweet.quantity === 0 ? 'out-of-stock' : ''}`}>
            {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of stock'}
          </span>
        </div>

        <div className="sweet-actions">
          {showPurchase && sweet.quantity > 0 && (
            <div className="purchase-section">
              <input
                type="number"
                min="1"
                max={sweet.quantity}
                value={purchaseQuantity}
                onChange={(e) => setPurchaseQuantity(parseInt(e.target.value) || 1)}
                className="quantity-input"
              />
              <button
                onClick={handlePurchase}
                className="btn btn-primary"
                disabled={sweet.quantity === 0}
              >
                Purchase
              </button>
            </div>
          )}

          {isAdmin && (
            <div className="admin-actions">
              <button
                onClick={() => setShowEditModal(true)}
                className="btn btn-secondary"
              >
                Edit
              </button>
              {!showRestockInput ? (
                <button
                  onClick={() => setShowRestockInput(true)}
                  className="btn btn-success"
                >
                  Restock
                </button>
              ) : (
                <div className="restock-section">
                  <input
                    type="number"
                    min="1"
                    value={restockQuantity}
                    onChange={(e) => setRestockQuantity(parseInt(e.target.value) || 10)}
                    className="quantity-input"
                  />
                  <button onClick={handleRestock} className="btn btn-success">
                    ✓
                  </button>
                  <button onClick={() => setShowRestockInput(false)} className="btn btn-secondary">
                    ✕
                  </button>
                </div>
              )}
              <button
                onClick={() => onDelete(sweet._id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {showEditModal && (
        <EditSweetModal
          sweet={sweet}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            if (typeof onUpdated === 'function') {
              onUpdated();
            }
          }}
        />
      )}
    </div>
  );
};

export default SweetCard;
