"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/app/dashboard/__components/Mode";
import { UserButton } from "@clerk/nextjs";

interface AppLayoutProps {
  children: React.ReactNode;
  icon: React.ElementType;
  iconBgClass?: string;
  title: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

export function AppLayout({
  children,
  icon: Icon,
  iconBgClass = "bg-primary",
  title,
  subtitle,
  headerActions,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 transition-all duration-500 overflow-x-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
      </div>

      <SidebarProvider>
        <div className="flex min-w-[100vw] min-h-screen relative z-10">
          <AppSidebar />

          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <header className="flex h-20 items-center justify-between border-b border-white/20 dark:border-zinc-700/50 px-4 sm:px-8 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl shadow-[0_4px_30px_rgb(0,0,0,0.02)] sticky top-0 z-40">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1 hover:bg-white/60 dark:hover:bg-zinc-800/60 rounded-xl p-2 transition-all hover:scale-105" />
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg ${iconBgClass}`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {title}
                    </h1>
                    {subtitle && (
                      <p className="text-xs text-muted-foreground -mt-0.5">{subtitle}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Optional custom actions like Search input or specific buttons */}
              <div className="flex-1 flex justify-end px-4">
                {headerActions}
              </div>

              <div className="flex items-center gap-3">
                <ModeToggle />
                <div className="pl-2 border-l border-border/50">
                  <UserButton 
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-9 h-9 border border-border/50 shadow-sm",
                      }
                    }}
                  />
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 relative dark:bg-zinc-900 overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
