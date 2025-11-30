export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  audience: undefined, // leave undefined for basic login
  redirectUri: window.location.origin, // must match Auth0 Allowed Callback URL
}

