import { useAuth0 } from '@auth0/auth0-react'

// Auth0 configuration
export const auth0Config = {
  domain: 'dev-c7tn02knwt43gb5c.us.auth0.com',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || '',
  redirectUri: window.location.origin,
  audience: 'https://dev-c7tn02knwt43gb5c.us.auth0.com/api/v2/',
}

const useIsAuthenticated = () => {
  // TODO: call the useAuth0 hook, destructure and return isAuthenticated
  const { isAuthenticated } = useAuth0()
  return isAuthenticated
}
interface Props {
  children: React.ReactNode
}
export function IfAuthenticated(props: Props) {
  const { children } = props
  return useIsAuthenticated() ? <>{children}</> : null
}

export function IfNotAuthenticated(props: Props) {
  const { children } = props
  return !useIsAuthenticated() ? <>{children}</> : null
}

