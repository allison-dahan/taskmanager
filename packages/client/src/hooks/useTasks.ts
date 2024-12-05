// src/hooks/useTasks.ts
import { useQuery } from '@tanstack/react-query'
import { useApi } from '../api/client'

export function useTasks() {
  const { fetchWithAuth } = useApi()

  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await fetchWithAuth('/api/tasks')
      if (!response.ok) throw new Error('Network response was not ok')
      return response.json()
    },
  })
}