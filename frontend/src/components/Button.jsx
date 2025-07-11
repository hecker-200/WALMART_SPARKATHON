import React from 'react';
import './Button.css';

const Button = ({ children, onClick, variant = 'primary', size = 'medium', disabled = false, className = '' }) => {
  const buttonClass = `button button--${variant} button--${size} ${className}`.trim();
  
  return (
    <button 
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;