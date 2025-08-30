# POC Login Keycloak

A modern React application demonstrating Keycloak authentication integration with forgot password functionality.

## Features

- ✅ **Keycloak Authentication**: Complete integration with Keycloak for secure authentication
- ✅ **Forgot Password**: Built-in password reset functionality through Keycloak
- ✅ **Protected Routes**: Route protection based on authentication status
- ✅ **User Management**: Access to user profile and account management
- ✅ **Responsive Design**: Mobile-friendly interface with modern styling
- ✅ **Token Management**: Automatic token refresh and handling
- ✅ **TypeScript**: Full TypeScript support for better development experience
- ✅ **PWA Support**: Progressive Web App with offline capabilities
- ✅ **Web Optimized**: Production-ready with performance optimizations
- ✅ **Multi-Environment**: Support for development, staging, and production
- ✅ **Docker Ready**: Containerized deployment support
- ✅ **Auto Deployment**: CI/CD pipelines for major hosting platforms

## Prerequisites

Before running this application, you need:

1. **Node.js** (version 18 or higher)
2. **npm** or **yarn** package manager
3. **Keycloak Server** running (version 15+)

## Keycloak Setup

### Option 1: Docker (Recommended for Development)

```bash
# Run Keycloak using Docker
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
```

### Option 2: Local Installation

1. Download Keycloak from [https://www.keycloak.org/downloads](https://www.keycloak.org/downloads)
2. Extract and run:
   ```bash
   ./bin/kc.sh start-dev
   ```

### Keycloak Configuration

1. **Access Keycloak Admin Console**:
   - URL: `http://localhost:8080`
   - Username: `admin`
   - Password: `admin`

2. **Create or use the Master Realm**:
   - The application is configured to use the `master` realm by default
   - You can create a new realm if preferred

3. **Create a Client**:
   - Go to `Clients` → `Create client`
   - Client ID: `react-app`
   - Client Type: `OpenID Connect`
   - Valid redirect URIs: `http://localhost:5173/*`
   - Web origins: `http://localhost:5173`
   - Access Type: `public`

4. **Enable Account Management**:
   - Go to `Realm Settings` → `Login`
   - Enable `Forgot password`
   - Enable `Remember me`
   - Enable `Login with email`

5. **Create Test Users** (optional):
   - Go to `Users` → `Add user`
   - Set username, email, first name, last name
   - Go to `Credentials` tab → Set password

## Application Setup

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd poc-login-keycloak

# Install dependencies
npm install
```

### 2. Configure Keycloak Settings

Update the Keycloak configuration in `src/keycloak.ts`:

```typescript
const keycloakConfig = {
  url: 'http://localhost:8080', // Your Keycloak server URL
  realm: 'master', // Your realm name
  clientId: 'react-app', // Your client ID
};
```

### 3. Run the Application

```bash
# Start the development server
npm run dev

# OR for automated setup (recommended)
npm run setup-client
```

**Note**: If you see "Initializing application..." for more than 15 seconds, the app will automatically show setup instructions.

The application will be available at `http://localhost:5173`

## 🌐 Web Deployment

This application is optimized for web deployment on various platforms:

### Quick Deploy

```bash
# Build for production
npm run build:prod

# Preview production build
npm run preview

# Deploy using automated script
npm run deploy
```

### Supported Platforms

- **Netlify**: Automatic deployment with `netlify.toml`
- **Vercel**: One-click deployment with `vercel.json`
- **GitHub Pages**: Automated CI/CD with GitHub Actions
- **Docker**: Containerized deployment with `Dockerfile`
- **VPS/Server**: Traditional hosting with Nginx configuration

### Environment Setup

Copy `.env.production` and update with your values:
```env
VITE_KEYCLOAK_URL=https://your-keycloak-domain.com
VITE_APP_URL=https://your-domain.com
```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Usage

### Login Flow

1. **Access the Application**: Navigate to `http://localhost:5173`
2. **Login Page**: You'll see the login interface with options to:
   - Sign In (redirects to Keycloak login)
   - Create Account (redirects to Keycloak registration)
   - Forgot Password (redirects to Keycloak password reset)

### Forgot Password Feature

1. **From Login Page**: Click "Forgot your password?"
2. **Enter Username** (optional): You can enter a username to pre-fill the reset form
3. **Reset Process**: You'll be redirected to Keycloak's password reset page
4. **Follow Instructions**: Complete the password reset process through Keycloak

### Dashboard Features

After successful authentication, you'll access the dashboard with:

- **User Information**: Display of your profile data
- **Authentication Details**: Token and session information
- **Account Management**: Direct access to Keycloak account console
- **Logout**: Secure logout functionality

## Project Structure

```
src/
├── components/
│   ├── Login.tsx          # Login component with forgot password
│   ├── Login.css          # Login component styles
│   ├── Dashboard.tsx      # Protected dashboard component
│   └── Dashboard.css      # Dashboard component styles
├── AuthContext.tsx        # Authentication context provider
├── keycloak.ts           # Keycloak configuration
├── App.tsx               # Main application with routing
├── App.css               # Global application styles
├── main.tsx              # Application entry point
└── index.css             # Base CSS styles
```

## Key Components

### AuthContext
Provides authentication state and methods throughout the application:
- `isAuthenticated`: Current authentication status
- `user`: User profile information
- `login()`: Initiate login flow
- `logout()`: Logout user
- `register()`: Initiate registration
- `resetPassword()`: Initiate password reset

### Login Component
Handles the login interface with:
- Keycloak integration for authentication
- Forgot password functionality
- Registration option
- Responsive design

### Dashboard Component
Protected area showing:
- User profile information
- Authentication details
- Account management options
- Token information

## Security Features

- **PKCE (Proof Key for Code Exchange)**: Enhanced security for OAuth flows
- **Silent SSO Check**: Automatic session validation
- **Token Refresh**: Automatic token renewal
- **Protected Routes**: Route-level authentication protection
- **Secure Logout**: Proper session termination

## Customization

### Styling
The application uses CSS modules and can be customized by modifying:
- `src/components/Login.css` - Login page styles
- `src/components/Dashboard.css` - Dashboard styles
- `src/App.css` - Global styles

### Keycloak Configuration
Update `src/keycloak.ts` to match your Keycloak setup:
- Server URL
- Realm name
- Client ID
- Authentication flow options

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure Keycloak client has correct redirect URIs and web origins
   - Check that Keycloak server is accessible

2. **Authentication Loops**:
   - Verify client configuration in Keycloak
   - Check browser console for errors

3. **Token Issues**:
   - Ensure client is set to "public" in Keycloak
   - Verify realm and client ID match configuration

### Debug Mode
Enable Keycloak debug logging by updating the initialization:

```typescript
const initOptions = {
  onLoad: 'check-sso',
  enableLogging: true, // Add this for debug logs
  // ... other options
};
```

## Technologies Used

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Keycloak JS** - Authentication client
- **CSS3** - Styling with modern features

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues and questions:
1. Check the [Keycloak Documentation](https://www.keycloak.org/documentation)
2. Review browser console for errors
3. Verify Keycloak server configuration
4. Check network tab for failed requests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Note**: This is a proof-of-concept application for demonstrating Keycloak integration. For production use, additional security considerations and error handling should be implemented.