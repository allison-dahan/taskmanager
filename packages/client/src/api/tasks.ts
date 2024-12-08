// src/api/tasks.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export type Task = {
  id: number
  title: string
  description?: string
  status: string
  dueDate?: Date
  userId: string
}

export type NewTask = Omit<Task, 'id'>


export async function createTask(task: NewTask, token: string): Promise<Task> {
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create task');
  }
  
  return res.json();
}
export async function fetchTasks(token: string): Promise<Task[]> {
  const res = await fetch(`${API_URL}/api/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error('Failed to fetch tasks')
  return res.json()
}

export async function updateTask(id: number, task: Partial<NewTask>, token: string): Promise<Task> {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  })
  if (!res.ok) throw new Error('Failed to update task')
  return res.json()
}

export async function deleteTask(id: number, token: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error('Failed to delete task')
}