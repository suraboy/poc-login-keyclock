#!/bin/bash

echo "🚀 Starting Keycloak Development Server..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start Keycloak using Docker Compose
docker-compose up -d

echo ""
echo "⏳ Waiting for Keycloak to start (this may take a few minutes)..."

# Wait for Keycloak to be ready
while ! curl -s http://localhost:8080 > /dev/null; do
    sleep 5
    echo "   Still waiting..."
done

echo ""
echo "✅ Keycloak is now running!"
echo ""
echo "📝 Next steps:"
echo "   1. Open Keycloak Admin Console: http://localhost:8080"
echo "   2. Login with:"
echo "      Username: admin"
echo "      Password: admin"
echo "   3. Create a client named 'react-app' in the master realm"
echo "   4. Configure the client with:"
echo "      - Valid redirect URIs: http://localhost:5173/*"
echo "      - Web origins: http://localhost:5173"
echo "      - Access Type: public"
echo ""
echo "🚀 Then start the React app with: npm run dev"
echo ""