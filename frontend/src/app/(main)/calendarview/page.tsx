"use client"

import { useState, useMemo, useCallback } from "react"
import { useTasks } from "@/hooks/use-tasks"
import { AppLayout } from "@/components/app-layout"
import { Task } from "@/types/task"
import { getStatusCfg, getPriorityCfg } from "@/config/task-config"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  CalendarDays,
  GripVertical,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
]
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}


export default function TaskCalendar() {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const { tasks, isLoading: loading, updateTask } = useTasks()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [direction, setDirection] = useState(0) // -1 = prev, +1 = next
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null)
  const [dragOverDate, setDragOverDate] = useState<string | null>(null)

  // ─── Month navigation ─────────────────────────────────────────────────────
  const goToPrevMonth = useCallback(() => {
    setDirection(-1)
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
    setSelectedDate(null)
  }, [currentMonth])

  const goToNextMonth = useCallback(() => {
    setDirection(1)
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
    setSelectedDate(null)
  }, [currentMonth])

  const goToToday = useCallback(() => {
    const t = new Date()
    setDirection(t.getMonth() > currentMonth || t.getFullYear() > currentYear ? 1 : -1)
    setCurrentYear(t.getFullYear())
    setCurrentMonth(t.getMonth())
    setSelectedDate(t)
  }, [currentMonth, currentYear])

  // ─── Build calendar grid ──────────────────────────────────────────────────
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
    const prevMonthDays = getDaysInMonth(
      currentMonth === 0 ? currentYear - 1 : currentYear,
      currentMonth === 0 ? 11 : currentMonth - 1
    )

    const days: { date: Date; isCurrentMonth: boolean }[] = []

    // previous month fill
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(
          currentMonth === 0 ? currentYear - 1 : currentYear,
          currentMonth === 0 ? 11 : currentMonth - 1,
          prevMonthDays - i
        ),
        isCurrentMonth: false,
      })
    }

    // current month
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ date: new Date(currentYear, currentMonth, d), isCurrentMonth: true })
    }

    // next month fill — up to 42 total (6 rows)
    const remaining = 42 - days.length
    for (let d = 1; d <= remaining; d++) {
      days.push({
        date: new Date(
          currentMonth === 11 ? currentYear + 1 : currentYear,
          currentMonth === 11 ? 0 : currentMonth + 1,
          d
        ),
        isCurrentMonth: false,
      })
    }

    return days
  }, [currentYear, currentMonth])

  // ─── Tasks grouped by date key ────────────────────────────────────────────
  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {}
    tasks.forEach((t) => {
      if (!t.dueDate) return
      const key = new Date(t.dueDate).toDateString()
      ;(map[key] ??= []).push(t)
    })
    return map
  }, [tasks])

  // tasks for a specific date
  const getTasksForDate = (d: Date) => tasksByDate[d.toDateString()] ?? []

  // Selected-date tasks
  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : []

  // ─── Upcoming tasks (next 7 days, limited to 6) ───────────────────────────
  const upcomingTasks = useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const weekLater = new Date(now)
    weekLater.setDate(weekLater.getDate() + 7)

    return tasks
      .filter((t) => {
        if (!t.dueDate) return false
        const d = new Date(t.dueDate)
        return d >= now && d <= weekLater && t.status.toLowerCase() !== "completed"
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 6)
  }, [tasks])

  // ─── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.status.toLowerCase() === "completed").length
    const inProgress = tasks.filter((t) => t.status.toLowerCase() === "in-progress").length
    const pending = tasks.filter((t) => t.status.toLowerCase() === "pending").length
    return { total, completed, inProgress, pending }
  }, [tasks])

  // ─── Drag & drop handlers ─────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragStart = (e: any, taskId: string) => {
    setDraggingTaskId(taskId)
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move"
      e.dataTransfer.setData("text/plain", taskId)
    }
  }

  const handleDragOver = (e: React.DragEvent, dateKey: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverDate(dateKey)
  }

  const handleDragLeave = () => {
    setDragOverDate(null)
  }

  const handleDrop = async (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault()
    setDragOverDate(null)
    const taskId = e.dataTransfer.getData("text/plain")
    if (!taskId) return

    const newDueDate = targetDate.toISOString().split("T")[0]

    updateTask({ id: taskId, taskData: { dueDate: newDueDate } })
    setDraggingTaskId(null)
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <AppLayout
      icon={CalendarDays}
      title="Calendar"
      subtitle="Visualize your tasks over time"
      iconBgClass="bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-violet-500/20"
    >
      {/* ── Stats row ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total", value: stats.total, icon: Sparkles, gradient: "from-indigo-500 to-blue-600", shadow: "shadow-indigo-500/15" },
          { label: "Completed", value: stats.completed, icon: CheckCircle2, gradient: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-500/15" },
          { label: "In Progress", value: stats.inProgress, icon: Clock, gradient: "from-amber-500 to-orange-600", shadow: "shadow-amber-500/15" },
          { label: "Pending", value: stats.pending, icon: AlertCircle, gradient: "from-rose-500 to-pink-600", shadow: "shadow-rose-500/15" },
        ].map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-2xl bg-white/70 dark:bg-zinc-800/60 backdrop-blur-xl border border-white/50 dark:border-zinc-700/50 p-4 shadow-lg ${s.shadow} hover:shadow-xl transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-bold text-foreground mt-0.5">{loading ? "—" : s.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-md`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            {/* decorative bar */}
            <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${s.gradient}`} style={{ width: loading ? "0%" : `${stats.total ? (s.value / stats.total) * 100 : 0}%`, transition: "width 0.8s ease" }} />
          </motion.div>
        ))}
      </div>

      {/* ── Calendar + sidebar grid ─────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* ── Calendar Card ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white/70 dark:bg-zinc-800/60 backdrop-blur-xl border border-white/50 dark:border-zinc-700/50 shadow-xl overflow-hidden"
        >
          {/* Month header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-zinc-700/60">
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevMonth}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-700/60 text-muted-foreground hover:text-foreground transition-all active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-700/60 text-muted-foreground hover:text-foreground transition-all active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-lg font-bold text-foreground tracking-tight">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h2>

            <button
              onClick={goToToday}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-zinc-600 bg-white/80 dark:bg-zinc-700/60 hover:bg-slate-50 dark:hover:bg-zinc-600/60 text-muted-foreground hover:text-foreground transition-all active:scale-95"
            >
              Today
            </button>
          </div>

          {/* Day-of-week header */}
          <div className="grid grid-cols-7 border-b border-slate-100 dark:border-zinc-700/60">
            {DAY_NAMES.map((d) => (
              <div
                key={d}
                className="py-3 text-center text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70 select-none"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          {loading ? (
            <div className="flex items-center justify-center h-[420px]">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-[3px] border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Loading tasks…</p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${currentYear}-${currentMonth}`}
                initial={{ x: direction * 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction * -60, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="grid grid-cols-7"
              >
                {calendarDays.map(({ date, isCurrentMonth }, idx) => {
                  const dateKey = date.toDateString()
                  const dayTasks = getTasksForDate(date)
                  const isToday = isSameDay(date, today)
                  const isSelected = selectedDate ? isSameDay(date, selectedDate) : false
                  const isDragOver = dragOverDate === dateKey

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedDate(date)}
                      onDragOver={(e) => handleDragOver(e, dateKey)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, date)}
                      className={`
                        relative min-h-[90px] p-1.5 border-b border-r border-slate-100/80 dark:border-zinc-700/40 cursor-pointer
                        transition-all duration-200 group
                        ${!isCurrentMonth ? "bg-slate-50/40 dark:bg-zinc-900/30" : "hover:bg-slate-50/80 dark:hover:bg-zinc-700/30"}
                        ${isSelected ? "bg-primary/[0.06] dark:bg-primary/[0.08] ring-2 ring-inset ring-primary/30" : ""}
                        ${isDragOver ? "bg-primary/10 dark:bg-primary/15 ring-2 ring-inset ring-primary/50" : ""}
                      `}
                    >
                      {/* Day number */}
                      <div className="flex items-center justify-between px-1">
                        <span
                          className={`
                            inline-flex items-center justify-center text-sm font-semibold leading-none select-none
                            ${isToday
                              ? "w-7 h-7 rounded-full bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                              : isCurrentMonth
                                ? "text-foreground/80"
                                : "text-muted-foreground/40"
                            }
                          `}
                        >
                          {date.getDate()}
                        </span>
                        {dayTasks.length > 0 && (
                          <span className="text-[10px] font-semibold text-muted-foreground/50">
                            {dayTasks.length}
                          </span>
                        )}
                      </div>

                      {/* Task dots / pills */}
                      <div className="mt-1 space-y-0.5 px-0.5">
                        {dayTasks.slice(0, 3).map((task) => {
                          const cfg = getStatusCfg(task.status)
                          return (
                            <div
                              key={task._id}
                              draggable
                              onDragStart={(e) => {
                                e.stopPropagation()
                                handleDragStart(e, task._id)
                              }}
                              className={`
                                flex items-center gap-1.5 px-1.5 py-0.5 rounded-md text-[11px] font-medium leading-tight truncate
                                border cursor-grab active:cursor-grabbing
                                ${cfg.bg} ${cfg.darkBg} ${cfg.color}
                                hover:shadow-sm transition-shadow
                                ${draggingTaskId === task._id ? "opacity-40" : ""}
                              `}
                              title={task.title}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor} flex-shrink-0`} />
                              <span className="truncate">{task.title}</span>
                            </div>
                          )
                        })}
                        {dayTasks.length > 3 && (
                          <p className="text-[10px] font-semibold text-muted-foreground pl-1">
                            +{dayTasks.length - 3} more
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>

        {/* ── Right sidebar ─────────────────────────────────── */}
        <div className="space-y-6">
          {/* Selected-date panel */}
          <AnimatePresence mode="wait">
            {selectedDate && (
              <motion.div
                key={selectedDate.toDateString()}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="rounded-2xl bg-white/70 dark:bg-zinc-800/60 backdrop-blur-xl border border-white/50 dark:border-zinc-700/50 shadow-xl overflow-hidden"
              >
                {/* selected-date header */}
                <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-700/60 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
                    <Calendar className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{formatDate(selectedDate)}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {selectedTasks.length === 0 ? "No tasks" : `${selectedTasks.length} task${selectedTasks.length > 1 ? "s" : ""}`}
                    </p>
                  </div>
                </div>

                {/* task list */}
                <div className="p-3 max-h-[340px] overflow-y-auto space-y-2 scrollbar-thin">
                  {selectedTasks.length === 0 ? (
                    <div className="text-center py-10">
                      <CalendarDays className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No tasks on this day</p>
                    </div>
                  ) : (
                    selectedTasks.map((task, i) => {
                      const sCfg = getStatusCfg(task.status)
                      const pCfg = getPriorityCfg(task.priority)
                      const StatusIcon = sCfg.icon
                      const PriorityIcon = pCfg.icon
                      return (
                        <motion.div
                          key={task._id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          draggable
                          onDragStart={(e: unknown) => handleDragStart(e, task._id)}
                          className={`
                            p-3 rounded-xl border cursor-grab active:cursor-grabbing
                            ${sCfg.bg} ${sCfg.darkBg}
                            hover:shadow-md transition-shadow group/task
                          `}
                        >
                          <div className="flex items-start gap-2">
                            <GripVertical className="w-3.5 h-3.5 mt-0.5 text-muted-foreground/30 group-hover/task:text-muted-foreground/60 transition-colors flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate">{task.title}</p>
                              {task.description && (
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{task.description}</p>
                              )}
                              <div className="flex items-center gap-3 mt-2">
                                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${sCfg.color}`}>
                                  <StatusIcon className="w-3 h-3" />
                                  {sCfg.label}
                                </span>
                                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${pCfg.color}`}>
                                  <PriorityIcon className="w-3 h-3" />
                                  {pCfg.label}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upcoming tasks panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white/70 dark:bg-zinc-800/60 backdrop-blur-xl border border-white/50 dark:border-zinc-700/50 shadow-xl overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-700/60">
              <p className="text-sm font-bold text-foreground">Upcoming</p>
              <p className="text-[11px] text-muted-foreground">Next 7 days</p>
            </div>
            <div className="p-3 space-y-2 max-h-[320px] overflow-y-auto scrollbar-thin">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : upcomingTasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">All clear!</p>
                  <p className="text-[11px] text-muted-foreground/70">No upcoming tasks this week</p>
                </div>
              ) : (
                upcomingTasks.map((task, i) => {
                  const cfg = getStatusCfg(task.status)
                  const dueDate = new Date(task.dueDate)
                  const isTaskToday = isSameDay(dueDate, today)
                  const isTomorrow = isSameDay(dueDate, new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1))

                  return (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.05 }}
                      onClick={() => {
                        setCurrentYear(dueDate.getFullYear())
                        setCurrentMonth(dueDate.getMonth())
                        setSelectedDate(dueDate)
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-700/40 transition-colors cursor-pointer group/up"
                    >
                      <span className={`w-2 h-2 rounded-full ${cfg.dotColor} flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover/up:text-primary transition-colors">{task.title}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {isTaskToday ? (
                            <span className="text-amber-500 font-semibold">Today</span>
                          ) : isTomorrow ? (
                            <span className="text-blue-500 font-semibold">Tomorrow</span>
                          ) : (
                            dueDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
                          )}
                        </p>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover/up:text-primary/60 transition-colors" />
                    </motion.div>
                  )
                })
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  )
}
