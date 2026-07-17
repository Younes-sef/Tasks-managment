"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AppLayout } from "@/components/app-layout"
import { Task } from "@/types/task"

import {
  TrendingUp,
  Target,
  CheckCircle2,
  BarChart3,
  Calendar,
  Clock,
  AlertCircle,
  Loader2,
  Flag,
  Zap,
} from "lucide-react"
import { useTasks } from "@/hooks/use-tasks"


export default function ProgressTracking() {
  const { tasks, isLoading: loading, error, updateTask } = useTasks()
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)

  const handleToggleTaskStatus = async (task: Task) => {
    setUpdatingTaskId(task._id)
    const newStatus = task.status.toLowerCase() === "completed" ? "pending" : "completed"
    updateTask({ id: task._id, taskData: { status: newStatus } })
    setUpdatingTaskId(null)
  }

  // Calculate statistics
  const completedTasks = tasks.filter((task) => task.status.toLowerCase() === "completed").length
  const inProgressTasks = tasks.filter((task) => task.status.toLowerCase() === "in-progress").length
  const pendingTasks = tasks.filter((task) => task.status.toLowerCase() === "pending").length
  const totalTasks = tasks.length
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Group tasks by priority for progress bars
  const highPriorityTasks = tasks.filter((task) => task.priority.toLowerCase() === "high")
  const mediumPriorityTasks = tasks.filter((task) => task.priority.toLowerCase() === "medium")
  const lowPriorityTasks = tasks.filter((task) => task.priority.toLowerCase() === "low")

  const calculatePriorityProgress = (priorityTasks: Task[]) => {
    if (priorityTasks.length === 0) return 0
    const completed = priorityTasks.filter((task) => task.status.toLowerCase() === "completed").length
    return Math.round((completed / priorityTasks.length) * 100)
  }

  // Group tasks by due date for goals
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingTasks = tasks
    .filter((task) => {
      const dueDate = new Date(task.dueDate)
      dueDate.setHours(0, 0, 0, 0)
      return dueDate >= today && task.status.toLowerCase() !== "completed"
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3) // Get the 3 most upcoming tasks



  const getPriorityBadgeColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
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

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600 dark:text-green-400"
    if (progress >= 50) return "text-amber-600 dark:text-amber-400"
    return "text-red-600 dark:text-red-400"
  }

  const CircularProgress = ({ progress, size = 120 }: { progress: number; size?: number }) => {
    const radius = (size - 8) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-200 dark:text-slate-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-blue-500 transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-slate-800 dark:text-white">{progress}%</span>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading tasks...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-zinc-800/80">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-400">{error.message}</p>
            <Button className="mt-4 w-full" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <AppLayout
      icon={TrendingUp}
      title="Progress Tracking"
      subtitle="Monitor your achievements & momentum"
      iconBgClass="bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20"
    >
      <div className="flex-1 flex flex-col p-8 space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-zinc-800/80">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Overall Progress</p>
                        <p className={`text-2xl font-bold ${getProgressColor(overallProgress)}`}>{overallProgress}%</p>
                      </div>
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-zinc-800/80">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTasks}</p>
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
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{inProgressTasks}</p>
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
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{pendingTasks}</p>
                      </div>
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Progress Bars */}
                <div className="xl:col-span-2 space-y-6">
                  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-zinc-800/80">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Task Progress by Priority
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        Track your tasks grouped by priority level
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* High Priority */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Flag className="w-4 h-4 text-red-500" />
                            <div>
                              <p className="font-medium text-slate-800 dark:text-white">High Priority</p>
                              <Badge variant="secondary" className={`text-xs ${getPriorityBadgeColor("high")}`}>
                                {highPriorityTasks.length} tasks
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-800 dark:text-white">
                              {highPriorityTasks.filter((t) => t.status.toLowerCase() === "completed").length}/
                              {highPriorityTasks.length}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {calculatePriorityProgress(highPriorityTasks)}%
                            </p>
                          </div>
                        </div>
                        <Progress value={calculatePriorityProgress(highPriorityTasks)} className="h-3" />
                      </div>

                      {/* Medium Priority */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Flag className="w-4 h-4 text-amber-500" />
                            <div>
                              <p className="font-medium text-slate-800 dark:text-white">Medium Priority</p>
                              <Badge variant="secondary" className={`text-xs ${getPriorityBadgeColor("medium")}`}>
                                {mediumPriorityTasks.length} tasks
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-800 dark:text-white">
                              {mediumPriorityTasks.filter((t) => t.status.toLowerCase() === "completed").length}/
                              {mediumPriorityTasks.length}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {calculatePriorityProgress(mediumPriorityTasks)}%
                            </p>
                          </div>
                        </div>
                        <Progress value={calculatePriorityProgress(mediumPriorityTasks)} className="h-3" />
                      </div>

                      {/* Low Priority */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Flag className="w-4 h-4 text-green-500" />
                            <div>
                              <p className="font-medium text-slate-800 dark:text-white">Low Priority</p>
                              <Badge variant="secondary" className={`text-xs ${getPriorityBadgeColor("low")}`}>
                                {lowPriorityTasks.length} tasks
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-800 dark:text-white">
                              {lowPriorityTasks.filter((t) => t.status.toLowerCase() === "completed").length}/
                              {lowPriorityTasks.length}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {calculatePriorityProgress(lowPriorityTasks)}%
                            </p>
                          </div>
                        </div>
                        <Progress value={calculatePriorityProgress(lowPriorityTasks)} className="h-3" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Upcoming Tasks */}
                  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-zinc-800/80">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Upcoming Tasks
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        Tasks with upcoming deadlines
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {upcomingTasks.length === 0 ? (
                        <div className="text-center py-8">
                          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                          <p className="text-slate-600 dark:text-slate-400 font-medium">All caught up!</p>
                          <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">
                            No upcoming tasks or all tasks are completed
                          </p>
                        </div>
                      ) : (
                        upcomingTasks.map((task) => (
                          <div
                            key={task._id}
                            className="p-4 rounded-lg bg-slate-50/80 dark:bg-zinc-700/50 border border-slate-200/50 dark:border-slate-600/50"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Flag
                                    className={`w-4 h-4 ${
                                      task.priority.toLowerCase() === "high"
                                        ? "text-red-500"
                                        : task.priority.toLowerCase() === "medium"
                                          ? "text-amber-500"
                                          : "text-green-500"
                                    }`}
                                  />
                                  <h3 className="font-semibold text-slate-800 dark:text-white">{task.title}</h3>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${getPriorityBadgeColor(task.priority)}`}
                                  >
                                    {task.priority}
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{task.description}</p>
                                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                  </span>
                                  <Badge variant="secondary" className={`text-xs ${getStatusBadgeColor(task.status)}`}>
                                    {task.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar with Checklist and Circular Progress */}
                <div className="space-y-6">
                  {/* Circular Progress */}
                  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-zinc-800/80">
                    <CardHeader className="text-center">
                      <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white">
                        Overall Progress
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        Task completion rate
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                      <CircularProgress progress={overallProgress} />
                      <div className="text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {completedTasks} of {totalTasks} tasks completed
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Task Checklist */}
                  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-zinc-800/80">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Task Checklist
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        Mark tasks as completed
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {tasks.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-slate-600 dark:text-slate-400">No tasks available</p>
                        </div>
                      ) : (
                        <div className="max-h-96 overflow-y-auto">
                          {tasks.map((task) => (
                            <div
                              key={task._id}
                              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50/80 dark:hover:bg-zinc-700/50 transition-colors"
                            >
                              {updatingTaskId === task._id ? (
                                <div className="w-4 h-4 flex items-center justify-center">
                                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                </div>
                              ) : (
                                <Checkbox
                                  id={task._id}
                                  checked={task.status.toLowerCase() === "completed"}
                                  onCheckedChange={() => handleToggleTaskStatus(task)}
                                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                />
                              )}
                              <label
                                htmlFor={task._id}
                                className={`flex-1 text-sm cursor-pointer ${
                                  task.status.toLowerCase() === "completed"
                                    ? "line-through text-slate-500 dark:text-slate-400"
                                    : "text-slate-800 dark:text-white"
                                }`}
                              >
                                {task.title}
                              </label>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={`text-xs ${getPriorityBadgeColor(task.priority)}`}>
                                  {task.priority}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>


                </div>
              </div>
      </div>
    </AppLayout>
  )
}
