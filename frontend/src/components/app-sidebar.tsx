'use client'
import { Calendar, Home, Inbox, Search, User } from "lucide-react"
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Show, SignInButton } from "@clerk/nextjs"
import { useState } from "react"

const viewItems = [
  { title: "Board View", url: "/dashboard", icon: Home },
  { title: "Calendar View", url: "/calendarview", icon: Calendar },
  { title: "List View", url: "/listview", icon: Inbox },
  { title: "Progress Tracking", url: "/progresstracking", icon: Search },
]

const filterItems = [
  { title: "Due Today", url: "/dashboard?filter=due-today", icon: Calendar },
  { title: "High Priority", url: "/dashboard?filter=high-priority", icon: Home },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [isViewsOpen, setIsViewsOpen] = useState(true)
  const [isFiltersOpen, setIsFiltersOpen] = useState(true)

  return (
    <Sidebar className="border-r border-border bg-background/60 backdrop-blur-2xl transition-all duration-300 shadow-[4px_0_24px_rgb(0,0,0,0.02)] dark:shadow-none">
      <SidebarHeader className="border-b border-border/50 bg-transparent">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate font-bold text-xl tracking-tight text-foreground">
              TaskFlow
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-2 bg-transparent pt-4 overflow-y-auto">
        <SidebarGroup className="px-2">
          <button 
            onClick={() => setIsViewsOpen(!isViewsOpen)}
            className="flex items-center justify-between w-full px-2 text-xs font-semibold text-muted-foreground hover:text-foreground uppercase tracking-wider mb-2 transition-colors cursor-pointer"
          >
            <span>Views</span>
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${isViewsOpen ? 'rotate-180' : ''}`} 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ${isViewsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {viewItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`px-3 py-2 rounded-xl transition-all duration-300 text-sm font-medium flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-md ${
                        pathname === item.url || (pathname === '/dashboard' && item.url === '/dashboard' && typeof window !== 'undefined' && !window.location.search)
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                          : "hover:bg-accent hover:text-accent-foreground text-muted-foreground border border-transparent"
                      }`}
                    >
                      <a href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </div>
        </SidebarGroup>

        <SidebarGroup className="px-2 mt-4">
          <button 
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center justify-between w-full px-2 text-xs font-semibold text-muted-foreground hover:text-foreground uppercase tracking-wider mb-2 transition-colors cursor-pointer"
          >
            <span>Quick Filters</span>
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${isFiltersOpen ? 'rotate-180' : ''}`} 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ${isFiltersOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {filterItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`px-3 py-2 rounded-xl transition-all duration-300 text-sm font-medium flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-md ${
                        typeof window !== 'undefined' && window.location.search === item.url.split('?')[1]
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "hover:bg-accent hover:text-accent-foreground text-muted-foreground border border-transparent"
                      }`}
                    >
                      <a href={item.url}>
                        <div className="size-2 rounded-full bg-primary/60" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200/50 dark:border-zinc-700/50 bg-transparent">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="px-3 py-2.5 flex items-center gap-3">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                    <User className="size-4" />
                    Sign In
                  </button>
                </SignInButton>
              </Show>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}