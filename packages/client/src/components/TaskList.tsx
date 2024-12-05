// client/src/components/TaskList.tsx
import { useUser } from '@clerk/clerk-react'

const TaskList = () => {
  const { user } = useUser()

  return (
    <div>
      <h1>Tasks for {user?.firstName}</h1>
      {/* Add your task list implementation */}
    </div>
  )
}

export default TaskList