// src/components/TaskList.tsx
import { useAuth, SignIn } from '@clerk/clerk-react'
import { CreateTaskForm } from './CreateTaskForm'

export default function TaskList() {
  const { isSignedIn, isLoaded } = useAuth()

  // Show loading while Clerk initializes
  if (!isLoaded) {
    return <div>Loading...</div>
  }

  // Show sign-in if not authenticated
  if (!isSignedIn) {
    return <SignIn />
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      <CreateTaskForm />
    </div>
  )
}