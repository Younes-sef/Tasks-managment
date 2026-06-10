"use client"

import { useEffect, useState } from "react"
import { getAllFiles, createFile, deleteFile } from "@/lib/files-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, Sparkles, Upload, CheckCircle, X, AlertCircle } from "lucide-react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "../dashboard/__components/Sidebar"
import { ModeToggle } from "../dashboard/__components/Mode"

interface Toast {
  id: string
  title: string
  description: string
  type: "success" | "error" | "info"
}

export default function FilesPage() {
  const [files, setFiles] = useState<any[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (title: string, description: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = { id, title, description, type }

    setToasts((prev) => [...prev, newToast])

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 4000)
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await getAllFiles()
        setFiles(data)
      } catch (err) {
        console.error("Failed to fetch files", err)
      }
    }

    fetchFiles()
  }, [])

  const handleUpload = async () => {
    if (!file) return alert("Please select a file")

    const formData = new FormData()
    formData.append("file", file)

    try {
      setUploading(true)
      await createFile(formData)
      const data = await getAllFiles()
      setFiles(data)

      // Show success toast
      showToast("Upload Successful!", `${file.name} has been uploaded successfully.`, "success")

      setFile(null)
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (err: any) {
      showToast("Upload Failed", err.message || "Failed to upload file", "error")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteFile(id)
      setFiles((prev) => prev.filter((f) => f._id !== id))

      showToast("File Deleted", "File has been deleted successfully.", "success")
    } catch (err: any) {
      showToast("Delete Failed", err.message || "Failed to delete file", "error")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
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
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                      Files Manager
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 -mt-1">Upload and manage your files</p>
                  </div>
                </div>
              </div>
              <ModeToggle />
            </header>

            <main className="p-8 flex-1 grid grid-cols-1 dark:bg-zinc-900 lg:grid-cols-3 gap-6">
              <div className="col-span-1">
                <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-zinc-800/80">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white">Upload File</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      Select a file to upload to your storage
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center space-y-6 pt-4">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center bg-slate-50/50 dark:bg-slate-700/50 hover:border-blue-400 dark:hover:border-blue-500 transition-colors group">
                        {uploading ? (
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        ) : (
                          <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors" />
                        )}
                      </div>
                      {file && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="w-full space-y-4">
                      <Input
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-300"
                        accept="*/*"
                      />

                      {file && (
                        <div className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
                          <p className="font-medium">{file.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-500">
                            {file.type} • {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      )}

                      <Button
                        onClick={handleUpload}
                        disabled={uploading || !file}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Upload File
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-zinc-800/80">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white">
                      Uploaded Files
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      {files.length} {files.length === 1 ? "file" : "files"} in your storage
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {files.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">No files uploaded yet</p>
                        <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">
                          Upload your first file to get started
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {files.map((file) => (
                          <div
                            key={file._id}
                            className="flex items-center justify-between bg-slate-50/80 dark:bg-zinc-700/50 p-4 rounded-xl border border-slate-200/50 dark:border-slate-600/50 hover:bg-slate-100/80 dark:hover:bg-zinc-700/80 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <Upload className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-800 dark:text-white">{file.originalName}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  {file.mimetype} • {(file.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(file._id)}
                              className="hover:bg-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </div>

        {/* Custom Toast Container */}
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`
                flex items-start gap-3 p-4 rounded-lg shadow-lg border backdrop-blur-sm
                transform transition-all duration-300 ease-in-out
                animate-in slide-in-from-right-full
                ${
                  toast.type === "success"
                    ? "bg-green-50/90 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
                    : toast.type === "error"
                      ? "bg-red-50/90 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
                      : "bg-blue-50/90 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200"
                }
              `}
            >
              <div className="flex-shrink-0 mt-0.5">
                {toast.type === "success" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : toast.type === "error" ? (
                  <AlertCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{toast.title}</p>
                <p className="text-sm opacity-90 mt-1">{toast.description}</p>
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="flex-shrink-0 ml-2 hover:opacity-70 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </SidebarProvider>
    </div>
  )
}
