import React from 'react';
import { useAuth } from '../AuthContext';
import BackButton from './BackButton';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout, token, keycloakInstance } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const formatUserInfo = () => {
    if (!user) return {};
    
    return {
      username: user.username || 'N/A',
      email: user.email || 'N/A',
      firstName: user.firstName || 'N/A',
      lastName: user.lastName || 'N/A',
      id: user.id || 'N/A',
    };
  };

  const userInfo = formatUserInfo();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <BackButton 
              fallbackRoute="/login" 
              className="minimal"
              text="Back"
            />
            <h1>Dashboard</h1>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome, {userInfo.firstName} {userInfo.lastName}!</h2>
          <p>You have successfully authenticated with Keycloak.</p>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <h3>User Information</h3>
            <div className="info-item">
              <label>Username:</label>
              <span>{userInfo.username}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{userInfo.email}</span>
            </div>
            <div className="info-item">
              <label>First Name:</label>
              <span>{userInfo.firstName}</span>
            </div>
            <div className="info-item">
              <label>Last Name:</label>
              <span>{userInfo.lastName}</span>
            </div>
            <div className="info-item">
              <label>User ID:</label>
              <span className="user-id">{userInfo.id}</span>
            </div>
          </div>

          <div className="info-card">
            <h3>Authentication Details</h3>
            <div className="info-item">
              <label>Authentication Server:</label>
              <span>{keycloakInstance.authServerUrl}</span>
            </div>
            <div className="info-item">
              <label>Realm:</label>
              <span>{keycloakInstance.realm}</span>
            </div>
            <div className="info-item">
              <label>Client ID:</label>
              <span>{keycloakInstance.clientId}</span>
            </div>
            <div className="info-item">
              <label>Token Available:</label>
              <span className={token ? 'status-active' : 'status-inactive'}>
                {token ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        <div className="actions-section">
          <h3>Available Actions</h3>
          <div className="action-buttons">
            <button 
              onClick={() => keycloakInstance.accountManagement()}
              className="action-button primary"
            >
              Manage Account
            </button>
            <button 
              onClick={() => window.open(`${keycloakInstance.authServerUrl}/realms/${keycloakInstance.realm}/account`, '_blank')}
              className="action-button secondary"
            >
              Account Console
            </button>
            <button 
              onClick={handleLogout}
              className="action-button danger"
            >
              Logout
            </button>
          </div>
        </div>

        {token && (
          <div className="token-section">
            <h3>Access Token</h3>
            <div className="token-container">
              <textarea 
                readOnly 
                value={token} 
                className="token-display"
                rows={6}
              />
              <button 
                onClick={() => navigator.clipboard.writeText(token)}
                className="copy-button"
              >
                Copy Token
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;