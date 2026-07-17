'use client'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"


export const LoadingSkeleton = ()=>{
    
      return (
        <SidebarProvider>
          <div className="flex min-h-screen">
            <AppSidebar />
            <div className="flex-1">
              <header className="flex h-16 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <h1 className="text-lg font-bold">Your Tasks</h1>
              </header>
              <main className="p-6 space-y-6 grid grid-cols-4 gap-4 animate-pulse">
                {[...Array(12)].map((_, idx) => (
                  <div key={idx} className="border border-gray-200 rounded p-6 bg-white shadow-sm space-y-4">
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/4 mt-4" />
                    <div className="flex gap-4 mt-6">
                      <div className="h-10 w-28 bg-gray-200 rounded" />
                      <div className="h-10 w-28 bg-gray-300 rounded" />
                    </div>
                  </div>
                ))}
              </main>
            </div>
          </div>
        </SidebarProvider>
      )
    
}