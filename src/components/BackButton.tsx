import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './BackButton.css';

interface BackButtonProps {
  fallbackRoute?: string;
  className?: string;
  showIcon?: boolean;
  text?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  fallbackRoute,
  className = '',
  showIcon = true,
  text = 'Back'
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const handleBack = () => {
    // Check if there's browser history to go back to
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback logic based on current route and authentication status
      let fallback = fallbackRoute;
      
      if (!fallback) {
        if (location.pathname === '/dashboard' && isAuthenticated) {
          // If on dashboard, no good fallback except logout or staying
          return;
        } else if (location.pathname === '/login') {
          // If on login and no history, perhaps go to home or stay
          fallback = '/';
        } else {
          // Default fallback based on authentication
          fallback = isAuthenticated ? '/dashboard' : '/login';
        }
      }
      
      navigate(fallback);
    }
  };

  return (
    <button 
      onClick={handleBack}
      className={`back-button ${className}`}
      aria-label={text}
    >
      {showIcon && <span className="back-icon">←</span>}
      <span className="back-text">{text}</span>
    </button>
  );
};

export default BackButton;