#!/bin/bash

echo "🔧 Enabling Forgot Password functionality in Keycloak..."
echo ""

# Wait for Keycloak to be ready
echo "⏳ Checking if Keycloak is accessible..."
if ! curl -s http://localhost:8080/realms/master > /dev/null; then
    echo "❌ Keycloak is not accessible. Please start Keycloak first."
    echo "Run: docker-compose up -d"
    exit 1
fi

echo "✅ Keycloak is accessible!"
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
    echo "Please configure forgot password manually:"
    echo "   1. Go to http://localhost:8080"
    echo "   2. Login with admin/admin"
    echo "   3. Go to Realm Settings → Login"
    echo "   4. Enable 'Forgot password'"
    exit 1
fi

echo "✅ Got admin access token"

# Get current realm settings
echo "📄 Getting current realm settings..."
REALM_SETTINGS=$(curl -s -X GET \
  http://localhost:8080/admin/realms/master \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json")

if [ "$REALM_SETTINGS" = "" ]; then
    echo "❌ Failed to get realm settings"
    exit 1
fi

echo "✅ Got realm settings"

# Update realm settings to enable forgot password
echo "🚀 Enabling forgot password functionality..."

UPDATED_SETTINGS=$(echo "$REALM_SETTINGS" | jq '
  .resetPasswordAllowed = true |
  .rememberMe = true |
  .loginWithEmailAllowed = true |
  .registrationAllowed = true |
  .registrationEmailAsUsername = true |
  .verifyEmail = false |
  .smtpServer = {}
')

# Update the realm
RESPONSE=$(curl -s -w "%{http_code}" -X PUT \
  http://localhost:8080/admin/realms/master \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$UPDATED_SETTINGS")

HTTP_CODE="${RESPONSE: -3}"

if [ "$HTTP_CODE" = "204" ]; then
    echo "✅ Forgot password functionality enabled successfully!"
    echo ""
    echo "🎉 Features enabled:"
    echo "   ✅ Reset password allowed"
    echo "   ✅ Remember me"
    echo "   ✅ Login with email"
    echo "   ✅ User registration"
    echo ""
    echo "📱 Now you can:"
    echo "   1. Click 'Forgot your password?' in the login page"
    echo "   2. Reset passwords through Keycloak"
    echo "   3. Register new users"
    echo ""
    echo "⚠️  Note: For email delivery, configure SMTP in Keycloak admin console"
    echo "   Go to Realm Settings → Email for production use"
    echo ""
else
    echo "❌ Failed to update realm settings (HTTP $HTTP_CODE)"
    echo "Please enable forgot password manually:"
    echo "   1. Go to http://localhost:8080/admin"
    echo "   2. Go to Realm Settings → Login"
    echo "   3. Enable 'Forgot password'"
    echo "   4. Enable 'Remember me'"
    echo "   5. Enable 'Login with email'"
fi