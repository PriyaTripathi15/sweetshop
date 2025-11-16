import React, { useState } from 'react';
import EditSweetModal from './EditSweetModal';

const SweetCard = ({
  sweet,
  isAdmin,
  onPurchase,
  onDelete,
  onRestock,
  onUpdated,
  showPurchase = true
}) => {
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
    <div className="w-full bg-white border-2 border-pink-200 rounded-xl shadow-md 
        hover:shadow-lg transform hover:-translate-y-1 transition-all overflow-hidden">

      {/* Image */}
      <div className="w-full h-64 bg-gradient-to-tr from-pink-200 to-pink-100 flex items-center justify-center">
        {sweet.imageUrl ? (
          <img src={sweet.imageUrl} alt={sweet.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-7xl text-gray-400">🍬</div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 space-y-3">
        <h3 className="text-pink-600 text-2xl font-bold">{sweet.name}</h3>
        <p className="text-pink-700 text-sm font-semibold">{sweet.category}</p>

        {sweet.description && (
          <p className="text-gray-600 text-sm">{sweet.description}</p>
        )}

        <div className="flex justify-between items-center">
          <span className="text-pink-600 font-bold text-xl">${sweet.price.toFixed(2)}</span>
          <span className={`text-sm font-medium ${sweet.quantity === 0 ? 'text-red-400' : 'text-green-500'}`}>
            {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of stock'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">

          {/* Purchase */}
          {showPurchase && sweet.quantity > 0 && (
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="1"
                max={sweet.quantity}
                value={purchaseQuantity}
                onChange={(e) => setPurchaseQuantity(parseInt(e.target.value) || 1)}
                className="w-16 border-2 border-gray-300 rounded text-center"
              />
              <button
                onClick={handlePurchase}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded font-semibold"
              >
                Purchase
              </button>
            </div>
          )}

          {/* Admin Controls */}
          {isAdmin && (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded font-semibold"
              >
                Edit
              </button>

              {!showRestockInput ? (
                <button
                  onClick={() => setShowRestockInput(true)}
                  className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded font-semibold"
                >
                  Restock
                </button>
              ) : (
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min="1"
                    value={restockQuantity}
                    onChange={(e) =>
                      setRestockQuantity(parseInt(e.target.value) || 10)
                    }
                    className="w-16 border-2 border-gray-300 rounded text-center"
                  />
                  <button
                    onClick={handleRestock}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setShowRestockInput(false)}
                    className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              )}

              <button
                onClick={() => onDelete(sweet._id)}
                className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded font-semibold"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditSweetModal
          sweet={sweet}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            onUpdated?.();
          }}
        />
      )}
    </div>
  );
};

export default SweetCard;
