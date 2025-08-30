#!/bin/bash

echo "🚀 Building Keycloak POC for Web Deployment..."
echo ""

# Set environment for production
export NODE_ENV=production

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build completed successfully!"
    echo ""
    echo "📁 Build output:"
    ls -la dist/
    echo ""
    echo "📊 Build size analysis:"
    du -sh dist/*
    echo ""
    echo "🌐 Ready for deployment!"
    echo ""
    echo "📋 Deployment notes:"
    echo "   1. Upload 'dist' folder contents to your web server"
    echo "   2. Configure your web server to serve index.html for all routes"
    echo "   3. Update environment variables in .env.production"
    echo "   4. Configure Keycloak client with your production URLs"
    echo ""
else
    echo "❌ Build failed!"
    exit 1
fi