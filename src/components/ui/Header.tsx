import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useSidebar } from "@/contexts/SidebarContext";
import "@styles/header.scss";
import MuiSvgIcon from "@components/MuiSvgIcon";
import { useLocation, useNavigate } from "react-router-dom";
import { ROLES } from "@/app/auth/roles";
import { hasRole } from "@/app/auth/hasRole";
import navigationConfig from "@/app/config/navigationConfig";
import { getAppMode, setAppMode, type AppMode } from "@/services/appMode";

const api = import.meta.env.VITE_MEDIA_BASE_URL;
const findPageTitle = (pathname: string) => {
  const walk = (items: typeof navigationConfig): string | undefined => {
    for (const item of items) {
      if (item.url && pathname === item.url) return item.label;
      const nested = item.children && walk(item.children);
      if (nested) return nested;
    }
    return undefined;
  };
  return walk(navigationConfig);
};

export const Header = () => {
  const { user, logout } = useAuth();
  const { isCollapsed, toggleSidebar, isMobile } = useSidebar();
  const [open, setOpen] = useState(false);
  const [appMode, setAppModeState] = useState<AppMode>(getAppMode());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const canViewPlan = hasRole((user?.role?.name)?.toLowerCase(), [
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
  ]);
  const pageTitle =
    location.pathname === "/"
      ? "Resumen general"
      : findPageTitle(location.pathname) || "Óptica ERP";
  const avatarPath = user?.avatar?.replace(`${api}/media/`, "");
  const avatarUrl = user?.avatar ? `${api}/media/${avatarPath}` : null;
  const closeMenu = () => setOpen(false);
  const toggleAppMode = () => {
    const next: AppMode = appMode === "demo" ? "production" : "demo";
    setAppMode(next);
    setAppModeState(next);
    window.location.reload();
  };

  return (
    <header
      className={`header ${isCollapsed && !isMobile ? "header--sidebar-collapsed" : ""}`}
    >
      <div className="header__left">
        <button
          className="header__menu-btn"
          onClick={toggleSidebar}
          aria-label="Abrir o cerrar navegación"
        >
          <MuiSvgIcon size={22}>lucide:menu</MuiSvgIcon>
        </button>
        <div className="header__heading">
          <span className="header__eyebrow">Óptica ERP</span>
          <h1>{pageTitle}</h1>
        </div>
      </div>
      <div className="header__context">
        {user?.branch_office?.name && (
          <div className="header__context-item">
            <MuiSvgIcon size={16}>lucide:map-pin</MuiSvgIcon>
            <span>{user.branch_office.name}</span>
          </div>
        )}
      </div>
      <div className="header__mode">
        <button
          type="button"
          className={`header__mode-btn header__mode-btn--${appMode}`}
          onClick={toggleAppMode}
          title="Cambiar entre datos de prueba y backend"
        >
          <MuiSvgIcon size={15}>
            {appMode === "demo" ? "lucide:flask-conical" : "lucide:database"}
          </MuiSvgIcon>
          <span>{appMode === "demo" ? "Datos prueba" : "Producción"}</span>
        </button>
      </div>
      <div className="header__right" ref={dropdownRef}>
        <button
          className="header__user"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Abrir menú de usuario"
        >
          <div className="header__user-avatar">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="header__user-avatar-img" />
            ) : (
              <MuiSvgIcon size={19}>heroicons-outline:user</MuiSvgIcon>
            )}
          </div>
          {!isMobile && (
            <div className="header__user-info">
              <span className="header__user-name">
                {user?.username || "Usuario"}
              </span>
              <span className="header__user-role">
                {user?.role?.name?.replace(/[-_]/g, " ") || "Sin rol"}
              </span>
            </div>
          )}
          <MuiSvgIcon
            className={`header__chevron ${open ? "header__chevron--open" : ""}`}
            size={18}
          >
            lucide:chevron-down
          </MuiSvgIcon>
        </button>
        {open && (
          <div className="dropdown">
            <div className="dropdown__header">
              <div className="dropdown__user">
                <div className="dropdown__user-avatar">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt=""
                      className="header__user-avatar-img"
                    />
                  ) : (
                    <MuiSvgIcon size={20}>heroicons-outline:user</MuiSvgIcon>
                  )}
                </div>
                <div className="dropdown__user-info">
                  <p className="dropdown__name">
                    {user?.username || "Usuario"}
                  </p>
                  <p className="dropdown__email">
                    {user?.email || "usuario@ejemplo.com"}
                  </p>
                  {user?.company?.name && (
                    <p className="dropdown__company">{user.company.name}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="dropdown__divider" />
            <div className="dropdown__section">
              <button
                className="dropdown__item"
                onClick={() => {
                  closeMenu();
                  navigate("/profile");
                }}
              >
                <MuiSvgIcon size={18}>lucide:user</MuiSvgIcon>
                <span>Mi perfil</span>
              </button>
              {canViewPlan && (
                <button
                  className="dropdown__item"
                  onClick={() => {
                    closeMenu();
                    navigate("/settings");
                  }}
                >
                  <MuiSvgIcon size={18}>lucide:settings</MuiSvgIcon>
                  <span>Configuración</span>
                </button>
              )}
            </div>
            <div className="dropdown__divider" />
            <div className="dropdown__section">
              <button
                className="dropdown__item dropdown__item--danger"
                onClick={logout}
              >
                <MuiSvgIcon size={18}>lucide:log-out</MuiSvgIcon>
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
