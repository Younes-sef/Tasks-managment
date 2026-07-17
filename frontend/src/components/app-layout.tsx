"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/app/(main)/dashboard/__components/Mode";
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
    <>
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
    </>
  );
}
