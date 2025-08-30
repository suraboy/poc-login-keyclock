import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import keycloak, { initOptions } from './keycloak';
import type { KeycloakProfile } from 'keycloak-js';

interface AuthContextType {
  isAuthenticated: boolean;
  user: KeycloakProfile | null;
  token: string | null;
  login: () => void;
  logout: () => void;
  register: () => void;
  resetPassword: (username?: string) => void;
  loading: boolean;
  error: string | null;
  keycloakInstance: typeof keycloak;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<KeycloakProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initKeycloak = async () => {
      // Set a timeout for initialization
      const timeoutId = setTimeout(() => {
        if (loading) {
          setError('Keycloak initialization is taking longer than expected. Please check if Keycloak server is running and the client is configured.');
          setLoading(false);
        }
      }, 15000); // 15 second timeout

      try {
        console.log('Initializing Keycloak...');
        const authenticated = await keycloak.init(initOptions);
        clearTimeout(timeoutId);
        
        setIsAuthenticated(authenticated);
        setError(null);
        
        if (authenticated && keycloak.token) {
          setToken(keycloak.token);
          
          // Load user profile
          try {
            const userProfile = await keycloak.loadUserProfile();
            setUser(userProfile);
          } catch (error) {
            console.error('Failed to load user profile:', error);
          }
        }
        
        // Set up token refresh
        keycloak.onTokenExpired = () => {
          keycloak.updateToken(30).then((refreshed) => {
            if (refreshed && keycloak.token) {
              setToken(keycloak.token);
            }
          }).catch(() => {
            console.log('Failed to refresh token');
          });
        };
        
        // Handle authentication events
        keycloak.onAuthSuccess = () => {
          setIsAuthenticated(true);
          if (keycloak.token) {
            setToken(keycloak.token);
          }
        };
        
        keycloak.onAuthLogout = () => {
          setIsAuthenticated(false);
          setUser(null);
          setToken(null);
        };
        
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('Keycloak initialization failed:', error);
        
        // Set a more user-friendly error message
        if (error instanceof Error) {
          if (error.message.includes('client_not_found')) {
            setError('Client "react-app" not found in Keycloak. Please configure the client in Keycloak admin console.');
          } else if (error.message.includes('ECONNREFUSED')) {
            setError('Cannot connect to Keycloak server. Please make sure Keycloak is running on http://localhost:8080');
          } else {
            setError(`Keycloak initialization failed: ${error.message}`);
          }
        } else {
          setError('Unknown error occurred during Keycloak initialization');
        }
      } finally {
        setLoading(false);
      }
    };

    initKeycloak();
  }, []);

  const login = () => {
    keycloak.login({
      redirectUri: import.meta.env.VITE_APP_URL || window.location.origin,
    });
  };

  const logout = () => {
    keycloak.logout({
      redirectUri: import.meta.env.VITE_APP_URL || window.location.origin,
    });
  };

  const register = () => {
    keycloak.register({
      redirectUri: import.meta.env.VITE_APP_URL || window.location.origin,
    });
  };

  const resetPassword = (username?: string) => {
    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    
    if (username) {
      // If username is provided, use the direct reset password flow
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: keycloak.clientId!,
        redirect_uri: baseUrl,
        scope: 'openid',
        kc_action: 'UPDATE_PASSWORD',
        login_hint: username
      });
      
      window.location.href = `${keycloak.authServerUrl}/realms/${keycloak.realm}/protocol/openid-connect/auth?${params.toString()}`;
    } else {
      // If no username, go to login page where user can click "Forgot Password?"
      keycloak.login({
        redirectUri: baseUrl,
      });
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    register,
    resetPassword,
    loading,
    error,
    keycloakInstance: keycloak,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};