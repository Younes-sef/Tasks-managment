"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Edit } from "lucide-react"
import { useTasks } from "@/hooks/use-tasks"

interface Task {
  _id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate: string
}

interface EditModalProps {
  task: Task
  onUpdate?: (updatedTask: Task) => void
}

export function EditModal({ task, onUpdate }: EditModalProps) {
  const [open, setOpen] = useState(false)
  const { updateTask } = useTasks()
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate.split('T')[0], // Format date for input
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    updateTask({
      id: task._id,
      taskData: {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate,
      }
    })
    
    if (onUpdate) {
      onUpdate({ ...task, ...formData })
    }
    setOpen(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="size-4 mr-1" />
          Edit
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[500px] border-l border-border bg-background/90 backdrop-blur-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Task</SheetTitle>
          <SheetDescription>
            Make changes to your task here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter task title"
                required
                className="bg-background/50 border-border"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter task description"
                rows={5}
                className="bg-background/50 border-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="bg-background/50 border-border">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger className="bg-background/50 border-border">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-dueDate">Due Date</Label>
              <Input
                id="edit-dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                required
                className="bg-background/50 border-border"
              />
            </div>
          </div>
          <SheetFooter className="mt-8">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}