# Fix "Unauthorized" Error - Quick Guide

## The Problem
The "Unauthorized" error happens because your `.env` file is trying to use the Management API (`/api/v2/`) which requires special permissions. For basic user login, you don't need an audience at all.

## The Solution

**Update your `.env` file** to remove the Management API audience:

```env
# Client-side (Vite) - Domain without https://
VITE_AUTH0_DOMAIN=dev-c7tn02knwt43gb5c.us.auth0.com

# Client-side (Vite) - API Identifier (LEAVE EMPTY for basic auth)
VITE_AUTH0_AUDIENCE=

# Server-side - Domain with https://
AUTH0_DOMAIN=https://dev-c7tn02knwt43gb5c.us.auth0.com

# Server-side - API Identifier (LEAVE EMPTY for basic auth)
AUTH0_AUDIENCE=
```

## Steps to Fix

1. **Open your `.env` file**
2. **Change these lines:**
   - `VITE_AUTH0_AUDIENCE=https://dev-c7tn02knwt43gb5c.us.auth0.com/api/v2/`
   - `AUTH0_AUDIENCE=https://dev-c7tn02knwt43gb5c.us.auth0.com/api/v2/`
   
   **To:**
   - `VITE_AUTH0_AUDIENCE=`
   - `AUTH0_AUDIENCE=`

3. **Save the file**
4. **Restart your dev server:**
   - Stop it (Ctrl+C)
   - Run `npm run dev` again

## What Changed in the Code

✅ The code now automatically skips the Management API (`/api/v2/`) even if it's in your `.env`
✅ The code works without an audience for basic authentication
✅ Server-side JWT verification is now optional for audience

## After Fixing

Once you update your `.env` and restart:
- ✅ Login should work without "Unauthorized" errors
- ✅ Users can sign in with Auth0
- ✅ Protected routes will work
- ✅ You'll get ID tokens for user authentication

## Why This Works

For basic user authentication (what the Finance Tracker app needs), Auth0 only needs:
- Domain ✅
- Client ID ✅
- No audience needed ✅

The audience is only required if you want to call a specific API. Since you're just logging users in, you don't need it!

