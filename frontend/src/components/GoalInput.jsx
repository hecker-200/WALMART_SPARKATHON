import React, { useState, useEffect } from 'react';
import Button from './Button.jsx';
import './GoalInput.css';
import axios from 'axios';

const GoalInput = ({ onGoalSubmit, isLoading }) => {
  const [goal, setGoal] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (goal.length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await axios.post('http://localhost:5050/gpt-suggest', {
          input: goal
        });
        setSuggestions(response.data.keywords || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Autocomplete Error:', err.message);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(debounceTimer);
  }, [goal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (goal.trim()) {
      onGoalSubmit(goal.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setGoal(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="goal-input">
      <h2 className="goal-input__title">What are you looking for today?</h2>
      <p className="goal-input__subtitle">Tell us your shopping goal and budget</p>

      <form onSubmit={handleSubmit} className="goal-input__form">
        <div className="goal-input__field">
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., I want snacks under ₹300"
            className="goal-input__input"
            disabled={isLoading}
            autoComplete="off"
          />
          <Button 
            type="submit" 
            disabled={!goal.trim() || isLoading}
            className="goal-input__button"
          >
            {isLoading ? 'Finding Products...' : 'Find Products'}
          </Button>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestion-dropdown">
          {suggestions.map((sug, idx) => (
            <li 
              key={idx} 
              onClick={() => handleSuggestionClick(sug)} 
              className="suggestion-item"
            >
              {sug}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GoalInput;
