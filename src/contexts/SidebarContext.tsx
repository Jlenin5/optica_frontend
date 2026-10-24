import React, { createContext, useContext, useState, useEffect } from 'react'

interface SidebarContextType {
  isCollapsed: boolean
  isMobileOpen: boolean
  toggleSidebar: () => void
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
  setCollapsed: (collapsed: boolean) => void
  isMobile: boolean
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider')
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Recuperar estado del localStorage solo para escritorio
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved ? JSON.parse(saved) : false
  })
  
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      
      // Cerrar sidebar mobile automáticamente al pasar a escritorio
      if (!mobile && isMobileOpen) {
        setIsMobileOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobileOpen])

  const toggleSidebar = () => {
    if (isMobile) {
      // En mobile: abrir/cerrar el sidebar (overlay)
      setIsMobileOpen(!isMobileOpen)
    } else {
      // En escritorio: colapsar/expandir
      setIsCollapsed((prev: boolean) => {
        const newState = !prev
        localStorage.setItem('sidebar-collapsed', JSON.stringify(newState))
        return newState
      })
    }
  }

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  const closeMobileSidebar = () => {
    setIsMobileOpen(false)
  }

  const setCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed)
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed))
  }

  return (
    <SidebarContext.Provider value={{ 
      isCollapsed, 
      isMobileOpen, 
      toggleSidebar, 
      toggleMobileSidebar, 
      closeMobileSidebar, 
      setCollapsed,
      isMobile 
    }}>
      {children}
    </SidebarContext.Provider>
  )
}