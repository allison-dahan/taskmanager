import { createFileRoute } from '@tanstack/react-router'
import  CreateTaskForm  from '../components/CreateTaskForm'

export const Route = createFileRoute('/create-task')({
  component: CreateTaskForm,
})