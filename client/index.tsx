import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import routes from './routes.tsx'
import { AuthProvider } from './components/AuthContext.tsx'
import { GuestAuthProvider } from './components/GuestAuthContext.tsx'

const router = createBrowserRouter(routes)
const queryClient = new QueryClient()

  createRoot(document.getElementById('app') as HTMLElement).render(
    <AuthProvider>
      <GuestAuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </GuestAuthProvider>
    </AuthProvider>,
  )
