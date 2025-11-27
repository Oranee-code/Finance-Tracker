// Auth0 Configuration for Finance Tracker
// For basic user authentication, we don't need an audience
// Audience is only needed if you want to call a specific API

export const auth0Config = {
  domain:
    import.meta.env.VITE_AUTH0_DOMAIN || 'dev-c7tn02knwt43gb5c.us.auth0.com',
  clientId: 'DHZuC9DLBgj3Ab6vJvfcFZ8pl5PzHq13',
  // Only include audience if it's set and not empty
  // For basic login, leave VITE_AUTH0_AUDIENCE empty in .env
  audience:
    import.meta.env.VITE_AUTH0_AUDIENCE &&
    import.meta.env.VITE_AUTH0_AUDIENCE.trim() !== '' &&
    !import.meta.env.VITE_AUTH0_AUDIENCE.includes('/api/v2/')
      ? import.meta.env.VITE_AUTH0_AUDIENCE
      : undefined,
  redirectUri: window.location.origin,
}

