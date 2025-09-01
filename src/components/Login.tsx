import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import BackButton from './BackButton';
import './Login.css';

const Login: React.FC = () => {
  const { login, register, resetPassword, loading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = () => {
    login();
  };

  const handleRegister = () => {
    register();
  };

  const handleForgotPassword = () => {
    if (username.trim()) {
      resetPassword(username);
    } else {
      resetPassword();
    }
  };

  if (loading) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Initializing authentication...</p>
            <small>This may take up to 15 seconds on first load</small>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="error-section">
            <div className="error-header">
              <BackButton 
                fallbackRoute="/" 
                className="minimal small"
                text="Home"
              />
              <div className="error-icon">⚠️</div>
            </div>
            <h2>Setup Required</h2>
            <p className="error-message">{error}</p>
            
            <div className="setup-instructions">
              <h3>Quick Setup Steps:</h3>
              <ol>
                <li>Open <a href="http://localhost:8080" target="_blank" rel="noopener noreferrer">Keycloak Admin Console</a></li>
                <li>Login with <code>admin/admin</code></li>
                <li>Go to <strong>Clients</strong> → <strong>Create client</strong></li>
                <li>Set Client ID to: <code>react-app</code></li>
                <li>Set Valid redirect URIs to: <code>http://localhost:5173/*</code></li>
                <li>Set Web origins to: <code>http://localhost:5173</code></li>
                <li>Refresh this page</li>
              </ol>
            </div>
            
            <button 
              onClick={() => window.location.reload()}
              className="login-button primary"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome</h1>
          <p>Sign in to your account</p>
        </div>

        <div className="login-form">
          {showForgotPassword ? (
            <div className="forgot-password-section">
              <h2>Reset Password</h2>
              <p>You can reset your password through Keycloak's secure password reset system.</p>
              
              <div className="forgot-password-options">
                <div className="option-card">
                  <h3>🔑 Direct Reset</h3>
                  <p>Enter your username below to go directly to the password reset page:</p>
                  <input
                    type="text"
                    placeholder="Username or Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="login-input"
                  />
                  <button 
                    onClick={handleForgotPassword}
                    className="login-button primary"
                  >
                    Reset Password
                  </button>
                </div>
                
                <div className="option-divider">OR</div>
                
                <div className="option-card">
                  <h3>🔐 Login Page Reset</h3>
                  <p>Go to the login page where you can click "Forgot Password?"</p>
                  <button 
                    onClick={() => resetPassword()}
                    className="login-button secondary"
                  >
                    Go to Login Page
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => setShowForgotPassword(false)}
                className="login-button outline"
              >
                ← Back to Main Login
              </button>
            </div>
          ) : (
            <div className="login-section">
              <div className="login-options">
                <button 
                  onClick={handleLogin}
                  className="login-button primary"
                >
                  Sign In
                </button>
                
                <button 
                  onClick={handleRegister}
                  className="login-button secondary"
                >
                  Create Account
                </button>
              </div>

              <div className="login-links">
                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="link-button"
                >
                  Forgot your password?
                </button>
              </div>

              <div className="login-info">
                <p>
                  This application uses Keycloak for secure authentication. 
                  Click "Sign In" to be redirected to the login page.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;