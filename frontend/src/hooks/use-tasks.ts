import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getTasks, updateTask, deleteTask, createTask } from "@/lib/tasks-api"
import { toast } from "sonner"

import { Task } from "@/types/task"

export function useTasks() {
  const queryClient = useQueryClient()

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: getTasks,
  })

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, taskData }: { id: string; taskData: Partial<Task> }) =>
      updateTask(id, taskData as Task),
    // Optimistic update
    onMutate: async ({ id, taskData }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] })

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"])

      // Optimistically update to the new value
      queryClient.setQueryData<Task[]>(["tasks"], (old) =>
        old?.map((task) =>
          task._id === id ? { ...task, ...taskData } : task
        )
      )

      // Return a context object with the snapshotted value
      return { previousTasks }
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      toast.error("Failed to update task. Please try again.")
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks)
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast.success("Task deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
    onError: () => {
      toast.error("Failed to delete task. Please try again.")
    }
  })

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      toast.success("Task created successfully")
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
    onError: () => {
      toast.error("Failed to create task. Please try again.")
    }
  })

  return {
    tasks,
    isLoading,
    error,
    updateTask: updateTaskMutation.mutate,
    updateTaskAsync: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutate,
    deleteTaskAsync: deleteTaskMutation.mutateAsync,
    createTask: createTaskMutation.mutate,
    createTaskAsync: createTaskMutation.mutateAsync,
  }
}
