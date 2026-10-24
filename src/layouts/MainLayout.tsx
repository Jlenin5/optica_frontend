import { Sidebar } from "@/components/ui/Sidebar"
import { Header } from "@/components/ui/Header"
import { SidebarProvider } from "@/contexts/SidebarContext"
import '@styles/layout.scss'

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  
  return (
    <SidebarProvider>
      <div className="main-layout">
        <Sidebar />
        <div className="main-layout__content">
          <Header />
          <main className="main-layout__main">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}