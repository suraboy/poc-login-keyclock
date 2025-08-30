import Keycloak from 'keycloak-js';

// Keycloak configuration
const keycloakConfig = {
  url: 'http://localhost:8080', // Your Keycloak server URL
  realm: 'master', // Your realm name
  clientId: 'react-app', // Your client ID
};

// Initialize Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

// Keycloak initialization options
export const initOptions = {
  onLoad: 'check-sso' as const,
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  pkceMethod: 'S256' as const,
  flow: 'standard' as const,
  checkLoginIframe: false,
  // Optimize for faster initialization
  adapter: 'default' as const,
  checkLoginIframeInterval: 5,
  responseMode: 'fragment' as const,
  enableLogging: true,
  // Reduce timeout for faster failure detection
  messageReceiveTimeout: 10000,
  silentCheckSsoFallback: false,
};

export default keycloak;