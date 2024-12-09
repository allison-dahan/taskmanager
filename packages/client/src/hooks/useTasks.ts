// src/hooks/useTasks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '../components/types';
import { useAuth } from '@clerk/clerk-react';

const TASKS_KEY = 'tasks' as const;

const api = {
  fetchTasks: async (): Promise<Task[]> => {
    const response = await fetch('http://localhost:3000/api/tasks', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  fetchTask: async (taskId: number): Promise<Task> => {
    const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) throw new Error('Failed to fetch task');
    return response.json();
  },

  updateTaskStatus: async (taskId: number, status: 'pending' | 'completed'): Promise<Task> => {
    const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
  },

  deleteTask: async (taskId: number): Promise<void> => {
    const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete task');
  },

  createTask: async (task: Partial<Task>): Promise<Task> => {
    const response = await fetch('http://localhost:3000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
  }
};

// Hooks
export function useTasks() {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: [TASKS_KEY],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        // Try to get error message from response
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch tasks');
      }

      const data = await response.json();
      return data as Task[];
    },
    retry: 1,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useTask(taskId: number) {
  return useQuery({
    queryKey: [TASKS_KEY, taskId],
    queryFn: () => api.fetchTask(taskId),
    staleTime: 1000 * 60,
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: number; status: 'pending' | 'completed' }) =>
      api.updateTaskStatus(taskId, status),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
      queryClient.setQueryData([TASKS_KEY, updatedTask.id], updatedTask);
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.deleteTask,
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
      queryClient.removeQueries({ queryKey: [TASKS_KEY, taskId] });
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
  });
}