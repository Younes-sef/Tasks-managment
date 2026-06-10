'use client'
import { Calendar, Home, Inbox, Search, Settings, User } from "lucide-react"
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
import { isUserLoggedIn } from "@/lib/auth"
import { useEffect, useState } from "react"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "files",
    url: "/files",
    icon: Inbox,
  },
  {
    title: "calendarview",
    url: "/calendarview",
    icon: Calendar,
  },
  {
    title: "progress-tracking",
    url: "/progresstracking",
    icon: Search,
  },
  
]

interface User {
  name: string
  email: string
  role: string
}

interface AppSidebarProps {
  user: User | null
}

export function AppSidebar({ user }: AppSidebarProps) {
  const [isRegistered, setIsRegistered] = useState(false)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userRole, setUserRole] = useState("")
  const pathname = usePathname()

  useEffect(() => {
    const loggedIn = isUserLoggedIn();
    setIsRegistered(loggedIn);
    
    // Set the user data if user is logged in
    if (loggedIn) {
      const name = localStorage.getItem('name') || 'User';
      const email = localStorage.getItem('email') || '';
      const role = localStorage.getItem('role') || '';
      
      setUserName(name);
      setUserEmail(email);
      setUserRole(role);
    }
  }, []);

  return (
    <Sidebar className="border-r bg-white dark:bg-zinc-900 transition-colors duration-300">
      <SidebarHeader className="border-b border-slate-200 dark:border-zinc-700">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate font-bold text-lg text-slate-900 dark:text-white">
              TaskManagement
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <SidebarGroup className="px-0">
          <SidebarGroupContent className="px-2 py-2">
            <SidebarMenu className="gap-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium flex items-center gap-3 ${
                      pathname === item.url
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-l-4 border-blue-500"
                        : "hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
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
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors duration-200 flex items-center gap-3"
            >
              <a href="/profile">
              <User className="size-4 text-slate-600 dark:text-slate-300" />
              {isRegistered ? (
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-medium text-slate-800 dark:text-white text-sm">
                    {userName}
                  </span>
                  <span className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {userEmail}
                  </span>
                  <span className="truncate text-xs text-slate-400 dark:text-slate-500 capitalize">
                    {userRole}
                  </span>
                </div>
              ) : (
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-sm text-slate-500 dark:text-slate-400">
                    Not logged in
                  </span>
                </div>
              )}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}