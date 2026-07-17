"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CreateModal } from "./__components/CreateModel";
import { Sparkles, Bell } from "lucide-react";
import { KanbanBoard } from "./__components/KanbanBoard";
import { AppLayout } from "@/components/app-layout";

export default function Page() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const handleTaskCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  const headerActions = (
    <div className="flex-1 max-w-md mx-8 hidden md:block">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-border rounded-xl leading-5 bg-background/50 backdrop-blur-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 sm:text-sm"
          placeholder="Search tasks, tags, or projects... (Cmd+K)"
        />
      </div>
    </div>
  );

  return (
    <AppLayout
      icon={Sparkles}
      title="Dashboard"
      subtitle="Manage your tasks efficiently"
      iconBgClass="bg-primary"
      headerActions={
        <div className="flex items-center gap-3 w-full">
          {headerActions}
          <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted ml-auto">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
          </button>
        </div>
      }
    >
      <div className="flex-1 relative w-full h-full">
        <KanbanBoard searchQuery={searchQuery} />
      </div>

      {/* Floating Create Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur-lg opacity-30 animate-pulse pointer-events-none" />
          <CreateModal onTaskCreated={handleTaskCreated} />
        </div>
      </div>
    </AppLayout>
  );
}
