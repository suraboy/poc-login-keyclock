#!/bin/bash

echo "🔧 Updating client redirect URIs for both ports..."

# Get admin access token
ADMIN_TOKEN=$(curl -s -X POST "http://localhost:8080/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin" \
  -d "password=admin" \
  -d "grant_type=password" \
  -d "client_id=admin-cli" | jq -r '.access_token')

if [ "$ADMIN_TOKEN" = "null" ] || [ -z "$ADMIN_TOKEN" ]; then
  echo "❌ Failed to get admin token"
  exit 1
fi

echo "✅ Got admin access token"

# Get client ID
CLIENT_UUID=$(curl -s -X GET "http://localhost:8080/admin/realms/master/clients" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" | jq -r '.[] | select(.clientId=="react-app") | .id')

if [ "$CLIENT_UUID" = "null" ] || [ -z "$CLIENT_UUID" ]; then
  echo "❌ Client 'react-app' not found"
  exit 1
fi

echo "✅ Found client UUID: $CLIENT_UUID"

# Update client with both redirect URIs
curl -s -X PUT "http://localhost:8080/admin/realms/master/clients/$CLIENT_UUID" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "react-app",
    "enabled": true,
    "publicClient": true,
    "redirectUris": [
      "http://localhost:5173/*",
      "http://localhost:5174/*"
    ],
    "webOrigins": [
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    "standardFlowEnabled": true,
    "implicitFlowEnabled": false,
    "directAccessGrantsEnabled": true
  }'

echo "✅ Updated client redirect URIs for both ports 5173 and 5174"
echo ""
echo "🎉 Now you should see the 'custom' theme option!"
echo "1. Go to: http://localhost:8080"
echo "2. Login with admin/admin"
echo "3. Go to Realm Settings → Themes"
echo "4. Set Login Theme to 'custom'"
echo "5. Save and test!"