import { createRoutesFromElements, Route } from 'react-router-dom'
import Home from './components/Home.tsx'
import TrackerDashboard from './components/TrackerDashboard.tsx'
import Login from './components/Login.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import Layout from './components/Layout.tsx'

export default createRoutesFromElements(
  <>
    <Route path="/login" element={<Login />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Home />} />
      <Route path="tracker/:id" element={<TrackerDashboard />} />
    </Route>
  </>,
)
