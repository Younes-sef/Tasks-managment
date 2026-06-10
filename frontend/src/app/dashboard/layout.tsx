import { ThemeProvider } from "./__components/theme-provider"
import { AppSidebar } from "./__components/Sidebar" 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      
          {children}
  </main>
  )
}