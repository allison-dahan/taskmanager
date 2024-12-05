// src/App.tsx
import { ClerkProvider } from '@clerk/clerk-react'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function App() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <RouterProvider router={router} />
    </ClerkProvider>
  )
}

export default App