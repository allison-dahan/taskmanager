// src/components/ProtectedRoute.tsx
import { useAuth } from '@clerk/clerk-react'
import { Navigate } from '@tanstack/react-router'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />
  }

  return <>{children}</>
}
export default ProtectedRoute;