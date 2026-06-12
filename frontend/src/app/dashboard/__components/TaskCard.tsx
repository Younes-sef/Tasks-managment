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
  tags?: string[]
}

interface TaskCardProps {
  task: Task
  onDelete: () => void
  onUpdate: (updatedTask: Task) => void
}

import { motion } from "framer-motion"

export function TaskCard({ task, onDelete, onUpdate }: TaskCardProps) {


  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-500/10 text-red-700 border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
      case "medium":
        return "bg-orange-500/10 text-orange-700 border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20"
      case "low":
        return "bg-slate-500/10 text-slate-700 border-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/20"
      default:
        return "bg-slate-500/10 text-slate-700 border-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/20"
    }
  }

  const getDueDateColor = (dueDate: string, status: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diff = due.getTime() - now.getTime()
    const days = diff / (1000 * 3600 * 24)

    if (status.toLowerCase() === "completed") {
      return "text-slate-500 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-700/50 line-through opacity-70"
    }
    if (days < 0) {
      return "text-red-700 dark:text-red-400 bg-red-500/10 dark:bg-red-500/20 border-red-500/30 font-semibold"
    } else if (days < 1) {
      return "text-orange-700 dark:text-orange-400 bg-orange-500/10 dark:bg-orange-500/20 border-orange-500/30 font-semibold"
    }
    return "text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-700/50"
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="w-full"
    >
      <Card className="group relative w-full border border-slate-200/60 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden rounded-xl">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-3">
            {/* Header: Title and Actions */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[15px] font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {task.title}
              </h3>
              
              {/* Action buttons (instead of dropdown for simplicity, styled minimally) */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <EditModal task={task} onUpdate={onUpdate} />
                <DeleteModal onConfirm={onDelete} />
              </div>
            </div>

            {/* Description */}
            {task.description && (
              <p className="text-slate-500 dark:text-slate-400 text-[13px] leading-relaxed line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge
                variant="outline"
                className={`text-[11px] font-semibold border-none px-2 py-0.5 rounded-md ${getPriorityColor(task.priority)}`}
              >
                <Flag className="size-3 mr-1.5 opacity-70" />
                <span className="capitalize">{task.priority}</span>
              </Badge>
              {task.tags && task.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-[11px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-none px-2 py-0.5 rounded-md"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Due Date */}
            <div className={`flex items-center text-[12px] pt-1 font-medium ${getDueDateColor(task.dueDate, task.status).split('bg-')[0]}`}>
              <Calendar className="size-3.5 mr-1.5 text-red-500" />
              <span className={getDueDateColor(task.dueDate, task.status).includes('red') ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}>
                Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
