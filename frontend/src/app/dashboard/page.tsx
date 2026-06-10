"use client"

import { AppSidebar } from "./__components/Sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { deleteTask, getTasks } from "@/lib/tasks-api"
import { useEffect, useState } from "react"
import { LoadingSkeleton } from "./__components/LoadingSkelton"
import { TaskCard } from "./__components/TaskCard"
import { CreateModal } from "./__components/CreateModel"
import { ModeToggle } from "./__components/Mode"
import { Plus, Sparkles } from "lucide-react"

interface Task {
  _id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate: string
}
interface User {
  name: string
  email: string
  role: string
}

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  //get tasks
  const fetchTasks = async () => {
    try {
      const tasks = await getTasks()
      setTasks(tasks)
    } catch (error) {
      setError("Failed to fetch tasks")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])
  // delete task
  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId)
      setTasks((prev) => prev.filter((t) => t._id !== taskId))
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }
  // update Task
  const handleUpdate = (updatedTask: Task) => {
    setTasks((prev) => prev.map((task) => (task._id === updatedTask._id ? updatedTask : task)))
  }
  // create task
  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev])
  }

  // Load user from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser))
      }
    } catch (err) {
      console.error("Failed to parse user from localStorage", err)
      localStorage.removeItem("user")
    }
  }, [])

  if (isLoading) return <LoadingSkeleton />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50  transition-all duration-500 overflow-x-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
      </div>

      <SidebarProvider>
        <div className="flex min-w-screen min-h-screen relative">
          <AppSidebar user={user} />

          <div className="flex-1 flex flex-col">
            {/* Enhanced Header */}
            <header className="flex h-20 items-center justify-between border-b border-slate-200/60 px-8 bg-white/80 backdrop-blur-xl dark:bg-zinc-900 dark:border-zinc-700 shadow-sm">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg p-2 transition-colors" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                      Dashboard
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 -mt-1">Manage your tasks efficiently</p>
                  </div>
                </div>
              </div>
              <ModeToggle />
            </header>

            {/* Enhanced Main Content */}
            <main className="p-8 flex-1 dark:bg-zinc-900 relative">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 shadow-sm">
                  <p className="font-medium">{error}</p>
                </div>
              )}

              {tasks.length === 0 && !error ? (
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Plus className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">No tasks yet</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-lg mb-2">
                      Create your first task to get started!
                    </p>
                    <p className="text-slate-500 dark:text-slate-500 text-sm">
                      Click the + button to add a new task and begin organizing your work.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Stats or header info could go here */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Your Tasks</h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {tasks.length} task{tasks.length !== 1 ? "s" : ""} total
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Task Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3  gap-6">
                    {tasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onDelete={() => handleDelete(task._id)}
                        onUpdate={handleUpdate}
                      />
                    ))}
                  </div>
                </div>
              )}
            </main>

            {/* Enhanced Floating Button */}
            <div className="fixed bottom-8 right-8 z-50">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur-lg opacity-30 animate-pulse" />
                <CreateModal onTaskCreated={handleTaskCreated} />
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}
