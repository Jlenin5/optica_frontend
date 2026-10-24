import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState, type MouseEvent } from 'react'
import { useFilteredNavigation } from '@/hooks/useFilteredNavigation'
import MuiSvgIcon from '@components/MuiSvgIcon'
import type { NavItemType } from '@/app/types/navItemType.types'
import { useSidebar } from '@/contexts/SidebarContext'
import '@styles/sidebar.scss'

interface SidebarItemProps { item: NavItemType; isActive: boolean; level?: number }

const SidebarItem = ({ item, isActive, level = 0 }: SidebarItemProps) => {
  const location = useLocation()
  const { isCollapsed, isMobile, closeMobileSidebar } = useSidebar()
  const hasChildren = Boolean(item.children?.length)
  const childActive = item.children?.some(child => child.url && location.pathname === child.url) ?? false
  const collapsedDesktop = isCollapsed && !isMobile
  const [isOpen, setIsOpen] = useState(childActive)
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false)
  const [flyoutTop, setFlyoutTop] = useState(8)
  const label = item.label ?? 'Sección'
  const icon = item.icon ?? 'lucide:circle'
  const url = item.url ?? '#'

  useEffect(() => {
    if (collapsedDesktop) {
      setIsOpen(false)
    } else if (childActive) {
      setIsOpen(true)
    }
  }, [collapsedDesktop, childActive])

  useEffect(() => {
    setIsFlyoutOpen(false)
  }, [location.pathname, collapsedDesktop])

  const handleParentClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (collapsedDesktop) {
      const rect = event.currentTarget.getBoundingClientRect()
      setFlyoutTop(Math.max(8, Math.min(rect.top, window.innerHeight - 420)))
      setIsFlyoutOpen(value => !value)
      return
    }
    setIsOpen(value => !value)
  }

  const handleLinkClick = () => {
    if (isMobile) closeMobileSidebar()
  }

  const renderIcon = (name: string) => <MuiSvgIcon className="sidebar__link__icon" size={22}>{name}</MuiSvgIcon>

  if (hasChildren) {
    return (
      <li className={`sidebar__nav-item ${collapsedDesktop && isFlyoutOpen ? 'sidebar__nav-item--flyout-open' : ''}`}>
        <button
          type="button"
          className={`sidebar__link sidebar__link--parent ${isActive || childActive ? 'sidebar__link--active' : ''}`}
          onClick={handleParentClick}
          style={{ paddingLeft: collapsedDesktop ? undefined : `${12 + level * 16}px` }}
          title={collapsedDesktop ? label : undefined}
          aria-expanded={collapsedDesktop ? isFlyoutOpen : isOpen}
          aria-haspopup={collapsedDesktop}
        >
          {renderIcon(icon)}
          {!collapsedDesktop && <span className="sidebar__link__label">{label}</span>}
          {!collapsedDesktop && <MuiSvgIcon className={`sidebar__chevron ${isOpen ? 'sidebar__chevron--open' : ''}`} size={18}>lucide:chevron-down</MuiSvgIcon>}
        </button>

        {!collapsedDesktop && isOpen && (
          <ul className="sidebar__submenu">
            {item.children?.map(child => <SidebarItem key={child.id} item={child} isActive={Boolean(child.url && location.pathname === child.url)} level={level + 1} />)}
          </ul>
        )}

        {collapsedDesktop && isFlyoutOpen && (
          <div className="sidebar__flyout" role="menu" aria-label={label} style={{ top: flyoutTop }}>
            <div className="sidebar__flyout-title">{label}</div>
            {item.children?.map(child => child.url ? (
              <Link key={child.id} to={child.url} className={`sidebar__flyout-link ${location.pathname === child.url ? 'sidebar__flyout-link--active' : ''}`} onClick={handleLinkClick} role="menuitem">
                <MuiSvgIcon size={18}>{child.icon ?? 'lucide:circle'}</MuiSvgIcon><span>{child.label ?? 'Sección'}</span>
              </Link>
            ) : null)}
          </div>
        )}
      </li>
    )
  }

  return (
    <li className="sidebar__nav-item">
      <Link to={url} className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`} style={{ paddingLeft: collapsedDesktop ? undefined : `${12 + level * 16}px` }} title={collapsedDesktop ? label : undefined} onClick={handleLinkClick}>
        {renderIcon(icon)}
        {!collapsedDesktop && <span className="sidebar__link__label">{label}</span>}
      </Link>
    </li>
  )
}

export const Sidebar = () => {
  const location = useLocation()
  const filteredNavigation = useFilteredNavigation()
  const { isCollapsed, isMobileOpen, isMobile, closeMobileSidebar } = useSidebar()
  const sidebarClasses = ['sidebar', isCollapsed && !isMobile ? 'sidebar--collapsed' : '', isMobile && isMobileOpen ? 'sidebar--mobile-open' : ''].filter(Boolean).join(' ')

  return (
    <>
      {isMobile && isMobileOpen && <div className="sidebar__overlay" onClick={closeMobileSidebar} aria-hidden="true" />}
      <aside className={sidebarClasses}>
        <div className="sidebar__header">
          <div className="sidebar__logo"><MuiSvgIcon className="sidebar__logo-icon" size={30}>heroicons-outline:eye</MuiSvgIcon>{(!isCollapsed || isMobile) && <h2>Óptica ERP</h2>}</div>
          {isMobile && isMobileOpen && <button type="button" className="sidebar__close-btn" onClick={closeMobileSidebar} aria-label="Cerrar navegación"><MuiSvgIcon size={22}>lucide:x</MuiSvgIcon></button>}
        </div>
        <nav className="sidebar__nav" aria-label="Navegación principal"><ul className="sidebar__nav-list">{filteredNavigation.map(item => <SidebarItem key={item.id} item={item} isActive={Boolean(item.url && location.pathname === item.url)} />)}</ul></nav>
      </aside>
    </>
  )
}
