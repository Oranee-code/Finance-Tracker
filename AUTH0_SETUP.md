# Auth0 Setup Guide

## Configuration Steps

### 1. Get Your Auth0 Credentials

1. Log in to your [Auth0 Dashboard](https://manage.auth0.com/)
2. Go to **Applications** → Your Application
3. Note your:
   - **Domain** (e.g., `dev-xxxxx.us.auth0.com`)
   - **Client ID**: `DHZuC9DLBgj3Ab6vJvfcFZ8pl5PzHq13` (already configured)

### 2. Create an API (for Audience)

1. In Auth0 Dashboard, go to **Applications** → **APIs**
2. Click **Create API**
3. Set an **Identifier** (e.g., `https://finance-tracker-api`)
4. Note this identifier - you'll use it as the `audience`

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Client-side (Vite) - Domain without https://
VITE_AUTH0_DOMAIN=dev-xxxxx.us.auth0.com

# Client-side (Vite) - API Identifier
VITE_AUTH0_AUDIENCE=https://your-api-identifier

# Server-side - Domain with https://
AUTH0_DOMAIN=https://dev-xxxxx.us.auth0.com

# Server-side - API Identifier
AUTH0_AUDIENCE=https://your-api-identifier
```

### 4. Update Application Settings in Auth0 Dashboard

1. Go to **Applications** → Your Application → **Settings**
2. Add to **Allowed Callback URLs**: `http://localhost:5173` (or your production URL)
3. Add to **Allowed Logout URLs**: `http://localhost:5173` (or your production URL)
4. Add to **Allowed Web Origins**: `http://localhost:5173` (or your production URL)
5. Save changes

### 5. Files Created/Modified

- ✅ `client/config/auth0.ts` - Auth0 configuration
- ✅ `client/components/Login.tsx` - Login screen component
- ✅ `client/components/ProtectedRoute.tsx` - Route protection wrapper
- ✅ `client/components/LogoutButton.tsx` - Logout functionality
- ✅ `client/index.tsx` - Auth0Provider setup
- ✅ `client/routes.tsx` - Routes with authentication
- ✅ `client/components/Layout.tsx` - Updated with logout button
- ✅ `client/components/App.tsx` - Updated for Finance Tracker
- ✅ `server/auth0.ts` - Server-side JWT verification

### 6. Test the Setup

1. Run `npm run dev`
2. Navigate to `http://localhost:5173`
3. You should see the login screen
4. Click "Sign In with Auth0" to test authentication

## Current Status

- ✅ Client ID configured: `DHZuC9DLBgj3Ab6vJvfcFZ8pl5PzHq13`
- ⚠️ Domain needs to be configured (update in `.env` or `client/config/auth0.ts`)
- ⚠️ Audience/API Identifier needs to be configured (update in `.env` or `client/config/auth0.ts`)

## Next Steps

After configuring the domain and audience:
1. The login screen will appear for unauthenticated users
2. Protected routes will require authentication
3. Users can log out using the logout button in the header

