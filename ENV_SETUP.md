# .env File Configuration

Update your `.env` file with these values:

```env
# Client-side (Vite) - Domain without https://
VITE_AUTH0_DOMAIN=dev-c7tn02knwt43gb5c.us.auth0.com

# Client-side (Vite) - API Identifier
# WARNING: Using Management API may cause "Unauthorized" errors
# Consider creating a custom API instead (see Option 1 above)
VITE_AUTH0_AUDIENCE=https://dev-c7tn02knwt43gb5c.us.auth0.com/api/v2/

# Server-side - Domain with https://
AUTH0_DOMAIN=https://dev-c7tn02knwt43gb5c.us.auth0.com

# Server-side - API Identifier
AUTH0_AUDIENCE=https://dev-c7tn02knwt43gb5c.us.auth0.com/api/v2/
```

## Important Notes:

1. **Management API Issue**: The `/api/v2/` endpoint is the Management API, which requires special permissions. If you get "Unauthorized" errors, you need to:
   - Authorize your application to use the Management API
   - Grant the necessary scopes/permissions
   - OR create a custom API instead (recommended)

2. **For Basic Authentication**: If you just need user login (ID tokens), you can remove the audience entirely:
   ```env
   VITE_AUTH0_AUDIENCE=
   AUTH0_AUDIENCE=
   ```

3. **After updating .env**: Restart your dev server for changes to take effect.

