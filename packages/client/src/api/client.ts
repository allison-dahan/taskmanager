// src/api/client.ts
import { useAuth } from '@clerk/clerk-react'

export const useApi = () => {
  const { getToken } = useAuth()

  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const token = await getToken()
    
    return fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
  }

  return { fetchWithAuth }
}