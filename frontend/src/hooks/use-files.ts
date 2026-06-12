import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAllFiles, createFile, deleteFile, downloadFile } from "@/lib/files-api"
import { toast } from "sonner"

export interface FileRecord {
  _id: string
  originalName: string
  filename: string
  mimetype: string
  size: number
}

export function useFiles() {
  const queryClient = useQueryClient()

  const {
    data: files = [],
    isLoading,
    error,
  } = useQuery<FileRecord[]>({
    queryKey: ["files"],
    queryFn: getAllFiles,
  })

  const createFileMutation = useMutation({
    mutationFn: createFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] })
    },
    onError: () => {
      toast.error("Failed to upload file. Please try again.")
    }
  })

  const deleteFileMutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] })
    },
    onError: () => {
      toast.error("Failed to delete file. Please try again.")
    }
  })

  const downloadFileMutation = useMutation({
    mutationFn: downloadFile,
    onError: () => {
      toast.error("Failed to download file. Please try again.")
    }
  })

  return {
    files,
    isLoading,
    error,
    createFile: createFileMutation.mutate,
    createFileAsync: createFileMutation.mutateAsync,
    deleteFile: deleteFileMutation.mutate,
    deleteFileAsync: deleteFileMutation.mutateAsync,
    downloadFile: downloadFileMutation.mutate,
    downloadFileAsync: downloadFileMutation.mutateAsync,
  }
}
