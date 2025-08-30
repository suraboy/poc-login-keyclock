# Web Deployment Guide

This guide covers deploying the Keycloak POC application to various web hosting platforms.

## 🚀 Quick Deploy

```bash
# Build for production
npm run build:prod

# Deploy using script
npm run deploy
```

## 🌐 Deployment Options

### 1. Static Hosting (Netlify, Vercel, GitHub Pages)

**Netlify:**
1. Connect your GitHub repository
2. Set build command: `npm run build:prod`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Configure redirects (see `_redirects` file below)

**Vercel:**
1. Import project from GitHub
2. Framework preset: Vite
3. Build command: `npm run build:prod`
4. Output directory: `dist`
5. Add environment variables

**GitHub Pages:**
1. Enable GitHub Actions
2. Use the included workflow (`.github/workflows/deploy.yml`)
3. Set repository secrets for environment variables

### 2. VPS/Server Deployment

**Prerequisites:**
- Node.js 18+
- Nginx or Apache
- SSL certificate (recommended)

**Steps:**
1. Clone repository on server
2. Install dependencies: `npm ci`
3. Build application: `npm run build:prod`
4. Configure web server (see `nginx.conf`)
5. Upload `dist` folder contents

### 3. Docker Deployment

```bash
# Build Docker image
npm run build-docker

# Run container
docker run -p 80:80 keycloak-poc
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  keycloak-poc:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_KEYCLOAK_URL=https://your-keycloak.com
      - VITE_APP_URL=https://your-domain.com
```

## ⚙️ Environment Configuration

### Required Environment Variables

Create `.env.production` with:

```env
VITE_APP_NAME=Keycloak Login POC
VITE_APP_VERSION=1.0.0
VITE_KEYCLOAK_URL=https://your-keycloak-domain.com
VITE_KEYCLOAK_REALM=your-realm
VITE_KEYCLOAK_CLIENT_ID=your-client-id
VITE_APP_URL=https://your-domain.com
VITE_ENVIRONMENT=production
```

### Platform-Specific Setup

**Netlify (`netlify.toml`):**
```toml
[build]
  command = "npm run build:prod"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_KEYCLOAK_URL = "https://your-keycloak.com"
  VITE_APP_URL = "https://your-app.netlify.app"
```

**Vercel (`vercel.json`):**
```json
{
  "buildCommand": "npm run build:prod",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🔐 Keycloak Configuration

### Production Keycloak Setup

1. **Create Production Client:**
   - Client ID: `your-production-client`
   - Valid redirect URIs: `https://your-domain.com/*`
   - Web origins: `https://your-domain.com`

2. **Security Settings:**
   - Enable HTTPS only
   - Configure CORS properly
   - Set up proper realm settings

3. **Email Configuration:**
   - Configure SMTP for password reset
   - Set up email templates
   - Test email delivery

## 📊 Performance Optimization

### Build Optimizations

The application includes:
- Code splitting
- Tree shaking
- Asset optimization
- Gzip compression
- Caching headers

### Monitoring

Add monitoring tools:
- Google Analytics
- Error tracking (Sentry)
- Performance monitoring
- Uptime monitoring

## 🔒 Security Considerations

### Headers
Configure security headers:
- CSP (Content Security Policy)
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options
- X-Content-Type-Options

### SSL/TLS
- Use HTTPS only
- Configure proper SSL certificates
- Enable HTTP/2

## 🧪 Testing Production Build

```bash
# Build and preview locally
npm run build:prod
npm run preview

# Test with production environment
cp .env.production .env.local
npm run dev
```

## 📱 PWA Features

The application includes:
- Service Worker for offline functionality
- Web App Manifest
- Install prompt
- Offline fallback pages

## 🚨 Troubleshooting

### Common Issues

1. **Routing Issues:**
   - Ensure server redirects all routes to index.html
   - Check base URL configuration

2. **Environment Variables:**
   - Prefix with `VITE_` for client-side access
   - Verify variables are set correctly

3. **Keycloak Connection:**
   - Check CORS configuration
   - Verify client settings
   - Test network connectivity

4. **Build Failures:**
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify all dependencies

### Logs and Debugging

- Browser Developer Tools
- Server access logs
- Keycloak logs
- Network tab for API calls

## 📋 Deployment Checklist

- [ ] Environment variables configured
- [ ] Keycloak client setup
- [ ] SSL certificate installed
- [ ] DNS records configured
- [ ] Security headers enabled
- [ ] Monitoring setup
- [ ] Backup strategy in place
- [ ] Performance testing completed
- [ ] User acceptance testing done

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review Keycloak documentation
3. Test locally first
4. Check browser console for errors