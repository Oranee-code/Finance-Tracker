import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import routes from './routes.tsx'
import { Auth0Provider } from '@auth0/auth0-react'
import { auth0Config } from './config/auth0.ts'
import { GuestAuthProvider } from './contexts/GuestAuthContext.tsx'

const router = createBrowserRouter(routes)
const queryClient = new QueryClient()

document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById('app') as HTMLElement).render(
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.redirectUri,
        ...(auth0Config.audience && { audience: auth0Config.audience }),
      }}
    >
      <GuestAuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </QueryClientProvider>
      </GuestAuthProvider>
    </Auth0Provider>,
  )
})
