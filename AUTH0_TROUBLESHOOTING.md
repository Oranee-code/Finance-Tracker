# Auth0 Login Troubleshooting Guide

## Common Issues and Fixes

### Issue 1: "Invalid Callback URL" Error

**Problem**: Auth0 rejects the redirect after login.

**Solution**: 
1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** → Your Application (Client ID: `DHZuC9DLBgj3Ab6vJvfcFZ8pl5PzHq13`)
3. Go to **Settings** tab
4. Add these URLs to the appropriate fields:
   - **Allowed Callback URLs**: 
     - `http://localhost:5173`
     - `http://localhost:5174`
     - `http://localhost:5175`
     - (Add your production URL when deploying)
   - **Allowed Logout URLs**: Same as above
   - **Allowed Web Origins**: Same as above
5. Click **Save Changes**

### Issue 2: "Invalid Audience" Error

**Problem**: The audience is set to the Management API which requires special permissions.

**Solution**: 
- ✅ **FIXED**: The audience is now optional. If you don't have a custom API, it won't be sent.
- If you want to use a custom API:
  1. Go to Auth0 Dashboard → **Applications** → **APIs**
  2. Click **Create API**
  3. Set Identifier (e.g., `https://finance-tracker-api`)
  4. Update `VITE_AUTH0_AUDIENCE` in your `.env` file

### Issue 3: Server-Side Domain Format

**Problem**: Server-side JWT verification fails.

**Solution**: 
- ✅ **FIXED**: Server-side domain now includes `https://` prefix
- The domain in `server/auth0.ts` should be: `https://dev-c7tn02knwt43gb5c.us.auth0.com`

### Issue 4: CORS Errors

**Problem**: Browser blocks Auth0 requests due to CORS.

**Solution**:
1. Make sure **Allowed Web Origins** includes your localhost URL
2. Check browser console for specific CORS error messages
3. Verify the domain in `client/config/auth0.ts` matches your Auth0 dashboard

### Issue 5: Login Button Does Nothing

**Problem**: Clicking login doesn't redirect.

**Solution**:
1. Check browser console for errors
2. Verify the client ID is correct: `DHZuC9DLBgj3Ab6vJvfcFZ8pl5PzHq13`
3. Verify the domain is correct: `dev-c7tn02knwt43gb5c.us.auth0.com`
4. Make sure you're not blocking popups/redirects in your browser

## Quick Checklist

- [ ] Callback URLs configured in Auth0 Dashboard
- [ ] Logout URLs configured in Auth0 Dashboard  
- [ ] Web Origins configured in Auth0 Dashboard
- [ ] Domain is correct: `dev-c7tn02knwt43gb5c.us.auth0.com`
- [ ] Client ID is correct: `DHZuC9DLBgj3Ab6vJvfcFZ8pl5PzHq13`
- [ ] Server domain has `https://` prefix
- [ ] No browser console errors
- [ ] Application type in Auth0 is "Single Page Application"

## Testing Steps

1. Open browser console (F12)
2. Navigate to your app
3. Click "Sign In with Auth0"
4. Check console for any errors
5. If redirected to Auth0, complete login
6. Check if you're redirected back successfully

## Current Configuration

- **Domain**: `dev-c7tn02knwt43gb5c.us.auth0.com`
- **Client ID**: `DHZuC9DLBgj3Ab6vJvfcFZ8pl5PzHq13`
- **Audience**: Optional (removed Management API)
- **Redirect URI**: `window.location.origin` (auto-detected)

## Still Having Issues?

1. Check the browser console for specific error messages
2. Check the Network tab to see if Auth0 requests are being made
3. Verify your Auth0 application settings match the configuration
4. Try clearing browser cache and cookies
5. Test in an incognito/private window

