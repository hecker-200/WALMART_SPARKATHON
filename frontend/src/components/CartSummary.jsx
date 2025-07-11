import React from 'react';
import './CartSummary.css';

const CartSummary = ({ products }) => {
  if (!products || products.length === 0) {
    return null;
  }

  const totalCost = products.reduce((sum, product) => sum + (product.price || 0), 0);
  const itemCount = products.length;
  const avgPrice = totalCost / itemCount;

  return (
    <div className="cart-summary">
      <h3 className="cart-summary__title">Shopping Summary</h3>
      
      <div className="cart-summary__stats">
        <div className="cart-summary__stat">
          <span className="cart-summary__stat-label">Items Found</span>
          <span className="cart-summary__stat-value">{itemCount}</span>
        </div>
        
        <div className="cart-summary__stat">
          <span className="cart-summary__stat-label">Total Value</span>
          <span className="cart-summary__stat-value">₹{totalCost.toFixed(2)}</span>
        </div>
        
        <div className="cart-summary__stat">
          <span className="cart-summary__stat-label">Avg. Price</span>
          <span className="cart-summary__stat-value">₹{avgPrice.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="cart-summary__reminder">
        <h4 className="cart-summary__reminder-title">💡 Don't forget!</h4>
        <ul className="cart-summary__reminder-list">
          <li>Check product reviews before purchasing</li>
          <li>Compare prices with other sellers</li>
          <li>Look for ongoing deals and discounts</li>
          <li>Consider buying in bulk for better savings</li>
        </ul>
      </div>
    </div>
  );
};

export default CartSummary;