import { createFileRoute } from '@tanstack/react-router'
import TaskManager from '../components/TaskManager'

export const Route = createFileRoute('/tasks')({
  component: TaskManager,
})