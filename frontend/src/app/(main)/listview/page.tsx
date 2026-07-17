"use client"

import { useState, useMemo } from "react"
import { useTasks } from "@/hooks/use-tasks"
import { AppLayout } from "@/components/app-layout"
import { Task } from "@/types/task"
import { List, ArrowUpDown, Trash2, CheckSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"


export default function ListView() {
  const { tasks, isLoading: loading, updateTaskAsync, deleteTaskAsync } = useTasks()
  
  // Sorting state
  const [sortField, setSortField] = useState<keyof Task | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  
  // Filtering state
  const [statusFilter, setStatusFilter] = useState<string>("all")
  
  // Selection state for bulk actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const handleSort = (field: keyof Task) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleAll = () => {
    if (selectedIds.size === filteredAndSortedTasks.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredAndSortedTasks.map(t => t._id)))
    }
  }

  const bulkUpdateStatus = async (newStatus: string) => {
    const promises = Array.from(selectedIds).map(id => 
      updateTaskAsync({ id, taskData: { status: newStatus } })
    )
    await Promise.all(promises)
    setSelectedIds(new Set())
  }

  const bulkDelete = async () => {
    if (!confirm("Are you sure you want to delete selected tasks?")) return
    const promises = Array.from(selectedIds).map(id => deleteTaskAsync(id))
    await Promise.all(promises)
    setSelectedIds(new Set())
  }

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks]
    
    // Filter
    if (statusFilter !== "all") {
      result = result.filter(t => t.status.toLowerCase() === statusFilter)
    }
    
    // Sort
    if (sortField) {
      result.sort((a, b) => {
        const valA = a[sortField] || ""
        const valB = b[sortField] || ""
        
        if (sortField === 'dueDate') {
          return sortDirection === 'asc' 
            ? new Date(valA as string).getTime() - new Date(valB as string).getTime()
            : new Date(valB as string).getTime() - new Date(valA as string).getTime()
        }
        
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }
    
    return result
  }, [tasks, sortField, sortDirection, statusFilter])

  return (
    <AppLayout
      icon={List}
      title="List View"
      iconBgClass="bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/20"
    >
      <div className="flex-1 flex flex-col p-8 overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm rounded-lg px-3 py-2"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {selectedIds.size > 0 && (
                  <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-900/50">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                      {selectedIds.size} selected
                    </span>
                    <div className="h-4 w-px bg-blue-200 dark:bg-blue-800"></div>
                    <button onClick={() => bulkUpdateStatus("completed")} className="text-sm flex items-center gap-1 text-green-600 hover:text-green-700 font-medium">
                      <CheckSquare className="w-4 h-4" /> Mark Complete
                    </button>
                    <button onClick={bulkDelete} className="text-sm flex items-center gap-1 text-red-600 hover:text-red-700 font-medium">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 dark:bg-zinc-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 w-12 text-center">
                          <input 
                            type="checkbox" 
                            checked={filteredAndSortedTasks.length > 0 && selectedIds.size === filteredAndSortedTasks.length}
                            onChange={toggleAll}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                        </th>
                        <th className="px-4 py-3 font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800" onClick={() => handleSort('title')}>
                          <div className="flex items-center gap-1">Task Title <ArrowUpDown className="w-3 h-3" /></div>
                        </th>
                        <th className="px-4 py-3 font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800" onClick={() => handleSort('status')}>
                          <div className="flex items-center gap-1">Status <ArrowUpDown className="w-3 h-3" /></div>
                        </th>
                        <th className="px-4 py-3 font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800" onClick={() => handleSort('priority')}>
                          <div className="flex items-center gap-1">Priority <ArrowUpDown className="w-3 h-3" /></div>
                        </th>
                        <th className="px-4 py-3 font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800" onClick={() => handleSort('dueDate')}>
                          <div className="flex items-center gap-1">Due Date <ArrowUpDown className="w-3 h-3" /></div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-slate-500">Loading tasks...</td>
                        </tr>
                      ) : filteredAndSortedTasks.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-slate-500">No tasks found</td>
                        </tr>
                      ) : (
                        filteredAndSortedTasks.map((task) => (
                          <tr 
                            key={task._id} 
                            className={`border-b border-slate-100 dark:border-zinc-800/50 hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors ${selectedIds.has(task._id) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                          >
                            <td className="px-4 py-3 text-center">
                              <input 
                                type="checkbox" 
                                checked={selectedIds.has(task._id)}
                                onChange={() => toggleSelection(task._id)}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-medium text-slate-900 dark:text-slate-100">{task.title}</div>
                              {task.tags && task.tags.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                  {task.tags.map(tag => (
                                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 capitalize">
                              <Badge variant="outline" className={`text-xs font-medium border-0 ${
                                task.status.toLowerCase() === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                task.status.toLowerCase() === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                              }`}>
                                {task.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 capitalize">
                              <Badge variant="outline" className={`text-xs font-medium border-0 ${
                                task.priority.toLowerCase() === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                task.priority.toLowerCase() === 'medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                              }`}>
                                {task.priority}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                              {new Date(task.dueDate).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
      </div>
    </AppLayout>
  )
}
