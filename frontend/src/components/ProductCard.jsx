import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-card__image">
        <img 
          src={product.image || '/placeholder.svg'} 
          alt={product.name}
          className="product-card__img"
        />
      </div>
      
      <div className="product-card__content">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__description">{product.description}</p>
        
        <div className="product-card__details">
          <div className="product-card__price">
            <span className="product-card__price-symbol">₹</span>
            <span className="product-card__price-value">{product.price}</span>
          </div>
          
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="product-card__original-price">
              ₹{product.originalPrice}
            </div>
          )}
        </div>
        
        {product.rating && (
          <div className="product-card__rating">
            <div className="product-card__stars">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={`product-card__star ${i < Math.floor(product.rating) ? 'active' : ''}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="product-card__rating-text">({product.rating})</span>
          </div>
        )}
        
        {product.category && (
          <div className="product-card__category">
            {product.category}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;