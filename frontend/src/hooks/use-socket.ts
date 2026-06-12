"use client"

import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { toast } from "sonner"
import { useAuth } from "@clerk/nextjs"

// We assume the backend runs on port 3000 locally
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { userId } = useAuth()

  useEffect(() => {
    if (!userId) return;

    // Connect to the NestJS WebSocket gateway
    const socketInstance = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
      query: { userId },
    })

    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket gateway:", socketInstance.id)
      setIsConnected(true)
    })

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from WebSocket gateway")
      setIsConnected(false)
    })

    // Listen for general notifications from the backend
    socketInstance.on("notification", (data: { type: string; message: string }) => {
      console.log("Received notification via WebSocket:", data)
      if (data.type === "success") {
        toast.success(data.message)
      } else if (data.type === "error") {
        toast.error(data.message)
      } else {
        toast.info(data.message)
      }
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [userId])

  return { socket, isConnected }
}
