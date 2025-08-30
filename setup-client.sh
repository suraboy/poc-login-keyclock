#!/bin/bash

echo "🔧 Setting up Keycloak client automatically..."
echo ""

# Wait for Keycloak to be ready
echo "⏳ Waiting for Keycloak to be fully ready..."
while ! curl -s http://localhost:8080/realms/master > /dev/null; do
    sleep 2
    echo "   Still waiting..."
done

echo "✅ Keycloak is ready!"
echo ""

# Get admin access token
echo "🔑 Getting admin access token..."
ADMIN_TOKEN=$(curl -s -X POST \
  http://localhost:8080/realms/master/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password" \
  -d "client_id=admin-cli" \
  -d "username=admin" \
  -d "password=admin" | \
  jq -r '.access_token' 2>/dev/null || echo "")

if [ "$ADMIN_TOKEN" = "" ] || [ "$ADMIN_TOKEN" = "null" ]; then
    echo "❌ Failed to get admin access token"
    echo "Please configure the client manually:"
    echo "   1. Go to http://localhost:8080"
    echo "   2. Login with admin/admin"
    echo "   3. Create 'react-app' client"
    exit 1
fi

echo "✅ Got admin access token"

# Create the react-app client
echo "🚀 Creating 'react-app' client..."

CLIENT_CONFIG='{
  "clientId": "react-app",
  "name": "React App",
  "description": "React application with Keycloak authentication",
  "rootUrl": "http://localhost:5173",
  "adminUrl": "http://localhost:5173",
  "baseUrl": "http://localhost:5173",
  "surrogateAuthRequired": false,
  "enabled": true,
  "alwaysDisplayInConsole": false,
  "clientAuthenticatorType": "client-secret",
  "redirectUris": [
    "http://localhost:5173/*"
  ],
  "webOrigins": [
    "http://localhost:5173"
  ],
  "notBefore": 0,
  "bearerOnly": false,
  "consentRequired": false,
  "standardFlowEnabled": true,
  "implicitFlowEnabled": false,
  "directAccessGrantsEnabled": true,
  "serviceAccountsEnabled": false,
  "publicClient": true,
  "frontchannelLogout": false,
  "protocol": "openid-connect",
  "attributes": {
    "post.logout.redirect.uris": "http://localhost:5173/*",
    "oauth2.device.authorization.grant.enabled": "false",
    "backchannel.logout.revoke.offline.tokens": "false",
    "use.refresh.tokens": "true",
    "oidc.ciba.grant.enabled": "false",
    "backchannel.logout.session.required": "true",
    "client_credentials.use_refresh_token": "false",
    "require.pushed.authorization.requests": "false",
    "tls.client.certificate.bound.access.tokens": "false",
    "display.on.consent.screen": "false",
    "token.response.type.bearer.lower-case": "false"
  },
  "authenticationFlowBindingOverrides": {},
  "fullScopeAllowed": true,
  "nodeReRegistrationTimeout": -1,
  "defaultClientScopes": [
    "web-origins",
    "acr",
    "roles",
    "profile",
    "email"
  ],
  "optionalClientScopes": [
    "address",
    "phone",
    "offline_access",
    "microprofile-jwt"
  ]
}'

# Create the client
RESPONSE=$(curl -s -w "%{http_code}" -X POST \
  http://localhost:8080/admin/realms/master/clients \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$CLIENT_CONFIG")

HTTP_CODE="${RESPONSE: -3}"

if [ "$HTTP_CODE" = "201" ]; then
    echo "✅ Client 'react-app' created successfully!"
    echo ""
    echo "🎉 Setup completed! You can now:"
    echo "   1. Refresh your React app at http://localhost:5173"
    echo "   2. Click 'Sign In' to test authentication"
    echo "   3. Create users in Keycloak admin console if needed"
    echo ""
elif [ "$HTTP_CODE" = "409" ]; then
    echo "✅ Client 'react-app' already exists!"
    echo ""
    echo "🎉 Your app should now work:"
    echo "   1. Refresh your React app at http://localhost:5173"
    echo "   2. Click 'Sign In' to test authentication"
    echo ""
else
    echo "❌ Failed to create client (HTTP $HTTP_CODE)"
    echo "Please create the client manually in Keycloak admin console"
fi