import React from 'react';
import ProductCard from './ProductCard.jsx';
import './Suggestions.css';

const Suggestions = ({ products, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="suggestions">
        <h2 className="suggestions__title">Finding the best products for you...</h2>
        <div className="suggestions__loading">
          <div className="suggestions__spinner"></div>
          <p>Searching through thousands of products</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="suggestions">
        <h2 className="suggestions__title">Oops! Something went wrong</h2>
        <div className="suggestions__error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="suggestions">
      <h2 className="suggestions__title">Perfect matches for you</h2>
      <p className="suggestions__subtitle">
        We found {products.length} great products that match your needs
      </p>
      
      <div className="suggestions__grid">
        {products.map((product, index) => (
          <ProductCard key={product.id || index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Suggestions;