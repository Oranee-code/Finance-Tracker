import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import routes from './routes.tsx'
import { Auth0Provider } from '@auth0/auth0-react'
import { auth0Config } from './components/auth0.tsx'
import { GuestAuthProvider } from './components/GuestAuthContext.tsx'

const router = createBrowserRouter(routes)
const queryClient = new QueryClient()

  createRoot(document.getElementById('app') as HTMLElement).render(
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={
        auth0Config.audience
          ? {
              redirect_uri: auth0Config.redirectUri,
              audience: auth0Config.audience,
            }
          : {
              redirect_uri: auth0Config.redirectUri,
            }
      }
    >
      <GuestAuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </QueryClientProvider>
      </GuestAuthProvider>
    </Auth0Provider>,
  )
