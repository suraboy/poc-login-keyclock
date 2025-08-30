import Keycloak from 'keycloak-js';

// Environment-based configuration
const getKeycloakConfig = () => {
  const config = {
    url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
    realm: import.meta.env.VITE_KEYCLOAK_REALM || 'master',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'react-app',
  };
  
  console.log('Keycloak Configuration:', {
    ...config,
    environment: import.meta.env.VITE_ENVIRONMENT || 'development'
  });
  
  return config;
};

// Keycloak configuration
const keycloakConfig = getKeycloakConfig();

// Initialize Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

// Keycloak initialization options optimized for web deployment
export const initOptions = {
  onLoad: 'check-sso' as const,
  silentCheckSsoRedirectUri: (import.meta.env.VITE_APP_URL || window.location.origin) + '/silent-check-sso.html',
  pkceMethod: 'S256' as const,
  flow: 'standard' as const,
  checkLoginIframe: false,
  // Web optimization settings
  adapter: 'default' as const,
  checkLoginIframeInterval: 5,
  responseMode: 'fragment' as const,
  enableLogging: import.meta.env.VITE_ENVIRONMENT === 'development',
  // Reduce timeout for faster failure detection
  messageReceiveTimeout: 10000,
  silentCheckSsoFallback: false,
  // Web-specific settings
  redirectUri: import.meta.env.VITE_APP_URL || window.location.origin,
};

export default keycloak;