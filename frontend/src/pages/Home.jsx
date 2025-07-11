import React, { useState } from 'react';
import GoalInput from '../components/GoalInput.jsx';
import Suggestions from '../components/Suggestions.jsx';
import CartSummary from '../components/CartSummary.jsx';
import Button from '../components/Button.jsx';
import { getProductSuggestions } from '../api/mlService.js';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentGoal, setCurrentGoal] = useState('');
  const [gptKeywords, setGptKeywords] = useState([]);

  const handleGoalSubmit = async (goal) => {
    setIsLoading(true);
    setError(null);
    setCurrentGoal(goal);

    try {
      const response = await getProductSuggestions(goal);
      setProducts(response.products);
      setGptKeywords(response.keywords || []);
    } catch (err) {
      setError(err.message);
      setProducts([]);
      setGptKeywords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeywordClick = async (keyword) => {
    handleGoalSubmit(keyword);
  };

  const handleClearAll = () => {
    setProducts([]);
    setError(null);
    setCurrentGoal('');
    setGptKeywords([]);
  };

  return (
    <div className="min-h-screen">
      <div className="container fade-in">
        {/* Header */}
        <header className="text-center" style={{ padding: '3rem 0 2rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '700', 
            color: 'var(--walmart-yellow)',
            marginBottom: '1rem',
            fontFamily: 'var(--font-heading)'
          }}>
            SmartCart Companion
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Your AI-powered shopping assistant. Tell us what you need, and we'll find the best products for you.
          </p>
        </header>

        {/* Goal Input */}
        <GoalInput onGoalSubmit={handleGoalSubmit} isLoading={isLoading} />

        {/* Current Goal Display */}
        {currentGoal && !isLoading && (
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '1rem',
            padding: '1rem',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }}>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              Searching for: <span style={{ color: 'var(--walmart-blue)', fontWeight: '600' }}>&quot;{currentGoal}&quot;</span>
            </p>
          </div>
        )}

        {/* GPT Keyword Chips */}
        {gptKeywords.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {gptKeywords.map((kw, index) => (
              <button
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200"
                onClick={() => handleKeywordClick(kw)}
              >
                {kw}
              </button>
            ))}
          </div>
        )}

        {/* Product Suggestions */}
        <Suggestions 
          products={products} 
          isLoading={isLoading} 
          error={error} 
        />

        {/* Cart Summary */}
        <CartSummary products={products} />

        {/* Clear All Button */}
        {(products.length > 0 || error) && (
          <div className="text-center" style={{ margin: '2rem 0 4rem' }}>
            <Button 
              onClick={handleClearAll}
              variant="secondary"
              size="large"
            >
              Clear All & Start Over
            </Button>
          </div>
        )}

        {/* Footer */}
        <footer style={{ 
          textAlign: 'center', 
          padding: '2rem 0',
          borderTop: '1px solid var(--border-color)',
          marginTop: '4rem'
        }}>
          <p style={{ 
            color: 'var(--text-muted)', 
            fontSize: '0.9rem',
            margin: 0
          }}>
            Powered by AI • Smart shopping made simple
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
