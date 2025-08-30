#!/bin/bash

echo "🔍 Checking Keycloak and React App Status..."
echo ""

# Check Keycloak
echo "1. Checking Keycloak server..."
if curl -s http://localhost:8080 > /dev/null; then
    echo "   ✅ Keycloak is running on http://localhost:8080"
else
    echo "   ❌ Keycloak is not responding"
fi

# Check React app
echo "2. Checking React application..."
if curl -s http://localhost:5173 > /dev/null; then
    echo "   ✅ React app is running on http://localhost:5173"
else
    echo "   ❌ React app is not responding"
fi

echo ""
echo "📋 Next steps:"
echo "   1. Open Keycloak Admin: http://localhost:8080"
echo "   2. Login with admin/admin"
echo "   3. Create 'react-app' client as described above"
echo "   4. Test login at: http://localhost:5173"
echo ""