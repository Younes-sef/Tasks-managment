"use client"

import { useMemo, useState } from "react"
import { useTasks } from "@/hooks/use-tasks"
import { Task } from "@/types/task"
import { TaskCard } from "./TaskCard"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates, SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Loader2 } from "lucide-react"

const COLUMNS = ["Pending", "In Progress", "Completed"]

interface ColumnProps {
  id: string
  title: string
  tasks: Task[]
  onDelete: (id: string) => void
  onUpdate: (task: Task) => void
}

function Column({ id, title, tasks, onDelete, onUpdate }: ColumnProps) {
  const { setNodeRef } = useSortable({
    id: id,
    data: {
      type: "Column",
      title: title,
    },
  })

  const getColumnBorderColor = (title: string) => {
    switch (title) {
      case "Pending":
        return "border-t-orange-500"
      case "In Progress":
        return "border-t-blue-500"
      case "Completed":
        return "border-t-green-500"
      default:
        return "border-t-slate-200"
    }
  }

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 border-t-[3px] ${getColumnBorderColor(title)} rounded-xl p-4 min-h-[500px] w-full shadow-sm transition-all duration-300 relative`}
    >
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-bold text-[15px] text-slate-800 dark:text-slate-100">{title}</h3>
        <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex flex-col gap-3 flex-1">
        <SortableContext items={tasks.map((t) => t._id)}>
          {tasks.map((task) => (
            <SortableTaskCard key={task._id} task={task} onDelete={() => onDelete(task._id)} onUpdate={onUpdate} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center opacity-70 min-h-[200px]">
            <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center ${
              title === 'Pending' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-500' :
              title === 'In Progress' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500' :
              'bg-green-50 dark:bg-green-900/20 text-green-500'
            }`}>
              {/* Simple generic icon for empty state */}
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm mb-1">
              No {title.toLowerCase()} tasks
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-[200px]">
              Drag tasks here to start working on them
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button className="flex items-center justify-center w-full py-2 text-sm font-semibold text-primary/80 hover:text-primary transition-colors">
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </button>
      </div>
    </div>
  )
}

function SortableTaskCard({ task, onDelete, onUpdate }: { task: Task; onDelete: () => void; onUpdate: (task: Task) => void }) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task._id,
    data: {
      type: "Task",
      task,
    },
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-50 w-full h-[180px] rounded-xl border-2 border-dashed border-blue-500/50 bg-blue-50/50 dark:bg-blue-900/20"
      />
    )
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
      {/* Wrapper to handle click propagation issues if TaskCard has buttons */}
      <div onPointerDown={(e) => {
        // Prevent drag when clicking on interactive elements
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('[role="dialog"]')) {
          e.stopPropagation();
        }
      }}>
        <TaskCard task={task} onDelete={onDelete} onUpdate={onUpdate} />
      </div>
    </div>
  )
}

export function KanbanBoard() {
  const { tasks, isLoading, error, updateTask, deleteTask } = useTasks()
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const columns = useMemo(() => {
    const cols = {
      Pending: tasks.filter((t) => t.status.toLowerCase() === "pending"),
      "In Progress": tasks.filter((t) => t.status.toLowerCase() === "in progress" || t.status.toLowerCase() === "in-progress"),
      Completed: tasks.filter((t) => t.status.toLowerCase() === "completed"),
    }
    return cols
  }, [tasks])

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Loading board...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 shadow-sm">
        <p className="font-medium">Failed to load tasks</p>
      </div>
    )
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task)
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const activeTask = active.data.current?.task as Task | undefined
    if (!activeTask) return

    const overData = over.data.current

    let newStatus = activeTask.status

    if (overData?.type === "Column") {
      newStatus = overData.title === "In Progress" ? "in-progress" : overData.title.toLowerCase()
    } else if (overData?.type === "Task") {
      newStatus = overData.task.status
    }

    if (newStatus && newStatus !== activeTask.status) {
      // Optimistically update via React Query mutation
      updateTask({ id: activeTask._id, taskData: { status: newStatus } })
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="flex flex-col gap-6">
        {/* Top Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 w-12 h-12 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Tasks</p>
              <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">{tasks.length}</h4>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-500 w-12 h-12 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">In Progress</p>
              <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">{columns["In Progress"]?.length || 0}</h4>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-500 w-12 h-12 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending</p>
              <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">{columns["Pending"]?.length || 0}</h4>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <div className="bg-green-50 dark:bg-green-900/20 text-green-500 w-12 h-12 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Completed</p>
              <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">{columns["Completed"]?.length || 0}</h4>
            </div>
          </div>
        </div>

        {/* Board Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 overflow-x-auto pb-4">
          {COLUMNS.map((colTitle) => (
            <Column
              key={colTitle}
              id={colTitle}
              title={colTitle}
              tasks={columns[colTitle as keyof typeof columns] || []}
              onDelete={(id) => deleteTask(id)}
              onUpdate={(task) => updateTask({ id: task._id, taskData: task })}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 opacity-90 scale-105 cursor-grabbing shadow-2xl">
            <TaskCard task={activeTask} onDelete={() => {}} onUpdate={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
