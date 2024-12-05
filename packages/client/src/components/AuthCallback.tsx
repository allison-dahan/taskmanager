// client/src/components/AuthCallback.tsx
import { useAuth } from '@clerk/clerk-react'
import { useNavigate } from '@tanstack/react-router'

const AuthCallback = () => {
  const { isLoaded, isSignedIn } = useAuth()
  const navigate = useNavigate()

  if (isLoaded && isSignedIn) {
    navigate({ to: '/' })
  }

  return <div>Loading...</div>
}

export default AuthCallback;