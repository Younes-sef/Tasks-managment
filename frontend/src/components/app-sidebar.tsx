'use client'

import { useSidebar } from './ui/sidebar'

export function AppSidebar() {
  const { open: isOpen } = useSidebar()

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transition-transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4 font-bold text-lg border-b border-gray-700">
        TaskFlow
      </div>
      <nav className="p-4 space-y-2">
        <a href="/dashboard" className="block hover:text-blue-400">Dashboard</a>
        <a href="/tasks" className="block hover:text-blue-400">Tasks</a>
        <a href="/profile" className="block hover:text-blue-400">Profile</a>
      </nav>
    </aside>
  )
}