"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, useRef } from "react"
import { useSocket } from "@/hooks/use-socket"
import { useAuth } from "@clerk/nextjs"
import api from "@/lib/axios"

export function Providers({ children }: { children: React.ReactNode }) {
  useSocket()
  const { getToken } = useAuth()
  
  const interceptorId = useRef<number | null>(null)

  if (interceptorId.current === null) {
    interceptorId.current = api.interceptors.request.use(
      async (config) => {
        try {
          const token = await getToken()
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        } catch {
          // Ignore
        }
        return config
      },
      (error) => Promise.reject(error)
    )
  }

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
