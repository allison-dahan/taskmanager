// src/components/TaskItem.tsx
import { Task } from '../api/tasks'

type TaskItemProps = {
  task: Task
  onDelete: () => void
}

export function TaskItem({ task, onDelete }: TaskItemProps) {
  return (
    <div className="border p-4 rounded shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 mt-1">{task.description}</p>
          )}
          <div className="mt-2">
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {task.status}
            </span>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </div>
    </div>
  )
}