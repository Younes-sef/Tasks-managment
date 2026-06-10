"use client"

import { useEffect, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import { getTasks } from "@/lib/tasks-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "../dashboard/__components/Sidebar"
import { ModeToggle } from "../dashboard/__components/Mode"
import { Calendar, Sparkles, Clock, CheckCircle2, AlertCircle, Circle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Task {
  _id: string
  title: string
  dueDate: string
  status: string
}

export default function TaskCalendar() {
  const [events, setEvents] = useState<any[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        const fetchedTasks: Task[] = await getTasks()
        setTasks(fetchedTasks)

        const calendarEvents = fetchedTasks.map((task) => ({
          id: task._id,
          title: task.title,
          date: task.dueDate,
          backgroundColor: getEventColor(task.status),
          borderColor: getEventColor(task.status),
          textColor: "#ffffff",
          extendedProps: {
            status: task.status,
          },
        }))
        setEvents(calendarEvents)
      } catch (error) {
        console.error("Failed to fetch tasks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const getEventColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "#10b981" // green
      case "in-progress":
        return "#f59e0b" // amber
      case "pending":
        return "#ef4444" // red
      default:
        return "#6366f1" // indigo
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-amber-500" />
      case "pending":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Circle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "in-progress":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
      case "pending":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((task) => task.status.toLowerCase() === "completed").length,
    inProgress: tasks.filter((task) => task.status.toLowerCase() === "in-progress").length,
    pending: tasks.filter((task) => task.status.toLowerCase() === "pending").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
      </div>

      <SidebarProvider>
        <div className="flex min-w-screen min-h-screen relative">
          <AppSidebar user={null} />

          <div className="flex-1 flex flex-col">
            <header className="flex h-20 items-center justify-between border-b border-slate-200/60 px-8 bg-white/80 backdrop-blur-xl dark:bg-zinc-900 dark:border-zinc-700 shadow-sm">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg p-2 transition-colors" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                      Task Calendar
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 -mt-1">
                      View and manage your tasks in calendar format
                    </p>
                  </div>
                </div>
              </div>
              <ModeToggle />
            </header>

            <main className="p-8 flex-1 dark:bg-zinc-900 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-zinc-800/80">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Tasks</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">{taskStats.total}</p>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-zinc-800/80">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{taskStats.completed}</p>
                      </div>
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-zinc-800/80">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">In Progress</p>
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{taskStats.inProgress}</p>
                      </div>
                      <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-zinc-800/80">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending</p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{taskStats.pending}</p>
                      </div>
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Calendar */}
                <div className="xl:col-span-3">
                  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-zinc-800/80">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Calendar View
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        View all your tasks organized by date
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="flex items-center justify-center h-96">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      ) : (
                        <div className="calendar-container">
                          <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            events={events}
                            headerToolbar={{
                              left: "prev,next today",
                              center: "title",
                              right: "dayGridMonth,dayGridWeek",
                            }}
                            height="auto"
                            dayMaxEvents={3}
                            moreLinkClick="popover"
                            eventDisplay="block"
                            displayEventTime={false}
                            eventClassNames="rounded-md text-xs font-medium px-2 py-1"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Task List Sidebar */}
                <div className="xl:col-span-1">
                  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-zinc-800/80">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white">
                        Recent Tasks
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        Latest tasks overview
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="space-y-3">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                            </div>
                          ))}
                        </div>
                      ) : tasks.length === 0 ? (
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
                          <p className="text-slate-600 dark:text-slate-400 font-medium">No tasks found</p>
                          <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">
                            Create your first task to get started
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {tasks.slice(0, 10).map((task) => (
                            <div
                              key={task._id}
                              className="p-3 rounded-lg bg-slate-50/80 dark:bg-zinc-700/50 border border-slate-200/50 dark:border-slate-600/50 hover:bg-slate-100/80 dark:hover:bg-zinc-700/80 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-slate-800 dark:text-white text-sm truncate">
                                    {task.title}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {new Date(task.dueDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {getStatusIcon(task.status)}
                                  <Badge
                                    variant="secondary"
                                    className={`text-xs px-2 py-1 ${getStatusBadgeColor(task.status)}`}
                                  >
                                    {task.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>

      <style jsx global>{`
        .fc {
          font-family: inherit;
        }
        .fc-theme-standard .fc-scrollgrid {
          border: none;
        }
        .fc-theme-standard td, .fc-theme-standard th {
          border-color: rgb(226 232 240 / 0.5);
        }
        .dark .fc-theme-standard td, .dark .fc-theme-standard th {
          border-color: rgb(63 63 70 / 0.5);
        }
        .fc-daygrid-day-number {
          color: rgb(71 85 105);
          font-weight: 500;
        }
        .dark .fc-daygrid-day-number {
          color: rgb(203 213 225);
        }
        .fc-col-header-cell {
          background: rgb(248 250 252);
          font-weight: 600;
          color: rgb(71 85 105);
        }
        .dark .fc-col-header-cell {
          background: rgb(39 39 42);
          color: rgb(203 213 225);
        }
        .fc-button-primary {
          background: linear-gradient(to right, rgb(59 130 246), rgb(99 102 241));
          border: none;
          font-weight: 500;
        }
        .fc-button-primary:hover {
          background: linear-gradient(to right, rgb(37 99 235), rgb(79 70 229));
        }
        .fc-today-button {
          background: rgb(248 250 252) !important;
          color: rgb(71 85 105) !important;
          border: 1px solid rgb(226 232 240) !important;
        }
        .dark .fc-today-button {
          background: rgb(39 39 42) !important;
          color: rgb(203 213 225) !important;
          border: 1px solid rgb(63 63 70) !important;
        }
        .fc-daygrid-day.fc-day-today {
          background: rgb(239 246 255);
        }
        .dark .fc-daygrid-day.fc-day-today {
          background: rgb(30 58 138 / 0.1);
        }
      `}</style>
    </div>
  )
}
