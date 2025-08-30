#!/bin/bash

echo "👤 Creating test user for Keycloak..."
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
    exit 1
fi

echo "✅ Got admin access token"

# Create test user
echo "🚀 Creating test user..."

USER_DATA='{
  "username": "testuser",
  "email": "test@example.com",
  "firstName": "Test",
  "lastName": "User",
  "enabled": true,
  "emailVerified": true,
  "credentials": [{
    "type": "password",
    "value": "password123",
    "temporary": false
  }]
}'

# Create the user
RESPONSE=$(curl -s -w "%{http_code}" -X POST \
  http://localhost:8080/admin/realms/master/users \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$USER_DATA")

HTTP_CODE="${RESPONSE: -3}"

if [ "$HTTP_CODE" = "201" ]; then
    echo "✅ Test user created successfully!"
    echo ""
    echo "🎉 Test User Details:"
    echo "   Username: testuser"
    echo "   Email: test@example.com"
    echo "   Password: password123"
    echo "   Name: Test User"
    echo ""
    echo "🧪 You can now test:"
    echo "   1. Login with testuser/password123"
    echo "   2. Test forgot password functionality"
    echo "   3. Reset password for testuser"
    echo ""
elif [ "$HTTP_CODE" = "409" ]; then
    echo "✅ Test user already exists!"
    echo ""
    echo "🎉 You can test with:"
    echo "   Username: testuser"
    echo "   Email: test@example.com"
    echo "   Password: password123"
    echo ""
else
    echo "❌ Failed to create test user (HTTP $HTTP_CODE)"
    echo "You can create a user manually in Keycloak admin console"
fi