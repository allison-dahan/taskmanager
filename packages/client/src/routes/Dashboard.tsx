// src/pages/Dashboard.tsx
import { CreateTaskForm } from '../components/CreateTaskForm'
import { useUser } from '@clerk/clerk-react'
// import { TaskList } from '../components/TaskList'

export function Dashboard() {
  const { user } = useUser()
  return (
    <div>
      <h1>{user?.firstName}'s Dashboard</h1>
      <h1>{user?.id}</h1>
      <CreateTaskForm />
      {/* <TaskList /> */}
    </div>
  )
}