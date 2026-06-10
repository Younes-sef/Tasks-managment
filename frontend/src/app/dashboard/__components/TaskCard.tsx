"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Flag } from "lucide-react"
import { DeleteModal } from "./DeleteModel"
import { EditModal } from "./EditModel"

interface Task {
  _id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate: string
}

interface TaskCardProps {
  task: Task
  onDelete: () => void
  onUpdate: (updatedTask: Task) => void
}

export function TaskCard({ task, onDelete, onUpdate }: TaskCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/50"
      case "in-progress":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800/50"
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800/50"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700/50"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800/50"
      case "medium":
        return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-800/50"
      case "low":
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700/50"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700/50"
    }
  }

  return (
    <Card className="group relative w-[380px] border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-lg hover:shadow-slate-200/50 dark:border-slate-800/60 dark:bg-slate-900/80 dark:hover:shadow-slate-900/50 transition-all duration-300 hover:-translate-y-1">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent dark:from-slate-800/20 dark:to-transparent rounded-lg pointer-events-none" />

      <CardContent className="relative p-6">
        <div className="flex flex-col space-y-4">
          {/* Header with title and badges */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                {task.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
                {task.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={`text-xs font-medium border backdrop-blur-sm ${getStatusColor(task.status)} transition-all duration-200 hover:scale-105`}
              >
                {task.status}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs font-medium border backdrop-blur-sm ${getPriorityColor(task.priority)} transition-all duration-200 hover:scale-105`}
              >
                <Flag className="size-3 mr-1" />
                {task.priority}
              </Badge>
            </div>
          </div>

          {/* Due date with enhanced styling */}
          <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm bg-slate-50/50 dark:bg-slate-800/30 rounded-lg px-3 py-2 border border-slate-200/50 dark:border-slate-700/50">
            <Calendar className="size-4 mr-2 text-slate-500 dark:text-slate-400" />
            <span className="font-medium">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          </div>

          {/* Action buttons with improved spacing */}
          <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/50">
            <EditModal task={task} onUpdate={onUpdate} />
            <DeleteModal onConfirm={onDelete} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
