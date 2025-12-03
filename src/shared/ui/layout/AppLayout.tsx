import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useAuthContext } from "../../../features/auth/hooks/useAuth"
import styled from "styled-components"
import { CustomProvider, DatePicker, Stack } from "rsuite"
import { Icon } from '@iconify/react'
import { useState } from "react"
import { esES } from "rsuite/esm/locales"
import "rsuite/dist/rsuite.min.css"

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  padding-top: 90px; /* espacio para el header fijo */
`

const Header = styled.header`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  text-align: center;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  .logo-container {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
  }

  .logo {
    color: white;
    font-size: 30px;
    font-weight: 600;
    margin: 0;
  }

  .menu-toggle {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    cursor: pointer;
    border-radius: 8px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.05);
    }
  }

  .fecha {
    align-items: flex-start;
  }
`

const Sidebar = styled.aside<{ $collapsed: boolean }>`
  width: ${({ $collapsed }) => ($collapsed ? '0' : '280px')};
  background: linear-gradient(180deg, #2c3e50 0%, #1a252f 100%);
  /* fijamos el sidebar debajo del header para que no afecte al navbar */
  position: fixed;
  top: 90px;
  left: 0;
  height: calc(100vh - 90px);
  transition: width 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
  box-shadow: ${({ $collapsed }) => ($collapsed ? 'none' : '2px 0 10px rgba(0, 0, 0, 0.1)')};
  opacity: ${({ $collapsed }) => ($collapsed ? '0' : '1')};
  overflow: hidden;
  z-index: 900;
`

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  padding-top: 70px; /* baja los items para dejar espacio al botón de cierre */
`

const MenuSection = styled.div`
  margin-bottom: 8px;
`

const MenuButton = styled.button<{ $active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: ${({ $active }) => ($active ? 'rgba(102, 126, 234, 0.2)' : 'transparent')};
  border: none;
  color: white;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.3);
  }
  
  .menu-icon {
    margin-right: 12px;
    font-size: 20px;
  }
  
  .arrow-icon {
    margin-left: auto;
    transition: transform 0.3s ease;
    transform: ${({ $active }) => ($active ? 'rotate(90deg)' : 'rotate(0deg)')};
  }
`

const MenuItemContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`

const Submenu = styled.div<{ $isOpen: boolean }>`
  max-height: ${({ $isOpen }) => ($isOpen ? '500px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease;
`

const SubmenuItem = styled.div<{ $active?: boolean }>`
  padding: 10px 20px 10px 48px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  background: ${({ $active }) => ($active ? 'rgba(102, 126, 234, 0.3)' : 'transparent')};
  
  &:hover {
    background: rgba(102, 126, 234, 0.2);
    color: white;
    padding-left: 56px;
  }
`

const MainContent = styled.div<{ $collapsed: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
  margin-left: ${({ $collapsed }) => ($collapsed ? '0' : '280px')}; /* evita que el sidebar sobreponga el contenido */
`

const ContentWrapper = styled.main`
  flex: 1;
  padding: 20px;
  background: #f5f7fa;
  min-height: 0;
  overflow-y: auto;
`

const Footer = styled.footer`
  background: white;
  padding: 15px 20px;
  text-align: center;
  color: #666;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  width: 100%;
  margin-top: auto;
`

const ToggleButton = styled.button`
  position: absolute;
  top: 18px; /* cerca de la parte superior del sidebar */
  right: 16px;
  width: 36px;
  height: 36px;
  background: rgba(102, 126, 234, 0.9);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 950; /* sobre el sidebar para permanecer clickable */

  &:hover {
    background: rgba(118, 75, 162, 0.95);
    transform: scale(1.05);
  }
`

interface MenuItemProps {
  title: string
  icon: string
  submenus: { name: string; route: string }[]
  isOpen: boolean
  onToggle: () => void
  onSubmenuClick: (route: string) => void
  currentPath: string
}

const MenuItem: React.FC<MenuItemProps> = ({
  title,
  icon,
  submenus,
  isOpen,
  onToggle,
  onSubmenuClick,
  currentPath
}) => {
  return (
    <MenuSection>
      <MenuButton $active={isOpen} onClick={onToggle}>
        <MenuItemContent>
          <Icon icon={icon} className="menu-icon" />
          <span>{title}</span>
        </MenuItemContent>
        <Icon icon="mdi:chevron-right" className="arrow-icon" />
      </MenuButton>
      <Submenu $isOpen={isOpen}>
        {submenus.map((submenu, index) => (
          <SubmenuItem
            key={index}
            $active={currentPath === submenu.route}
            onClick={() => onSubmenuClick(submenu.route)}
          >
            {submenu.name}
          </SubmenuItem>
        ))}
      </Submenu>
    </MenuSection>
  )
}

const CustomIconCalendar = () => (
  <Icon icon="guidance:calendar" width="24" height="24" />
)

const UserMenuContainer = styled.div`
  position: relative;
`

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`

const UserDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1000;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: translateY(${props => props.$isOpen ? '8px' : '0'});
  transition: all 0.2s ease;
`

const UserInfo = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
`

const UserName = styled.div`
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
`

const UserEmail = styled.div`
  font-size: 0.875rem;
  color: #718096;
`

const MenuOption = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: #4a5568;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f7fafc;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuthContext()

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
  }

  return (
    <UserMenuContainer>
      <UserButton onClick={() => setIsOpen(!isOpen)}>
        <Icon icon="mdi:account-circle" width="32" height="32" />
        <span>{user?.full_name || 'Usuario'}</span>
        <Icon icon={isOpen ? "mdi:chevron-up" : "mdi:chevron-down"} />
      </UserButton>

      <UserDropdown $isOpen={isOpen}>
        <UserInfo>
          <UserName>{user?.full_name}</UserName>
          <UserEmail>{user?.email}</UserEmail>
        </UserInfo>

        <MenuOption onClick={() => setIsOpen(false)}>
          <Icon icon="mdi:account-cog" />
          Configuración
        </MenuOption>

        <MenuOption onClick={handleLogout}>
          <Icon icon="mdi:logout" />
          Cerrar Sesión
        </MenuOption>
      </UserDropdown>
    </UserMenuContainer>
  )
}

export const AppLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [collapsed, setCollapsed] = useState(true)
  const [openMenus, setOpenMenus] = useState<Record<number, boolean>>({})

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date)
  }

  const toggleMenu = (index: number) => {
    setOpenMenus(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const handleSubmenuClick = (route: string) => {
    navigate(route)
    setCollapsed(true) // Cerrar sidebar en móvil después de navegar
  }

  const menuItems = [
    {
      title: 'Registro y Transacciones',
      icon: 'mdi:file-document-edit',
      submenus: [
        { name: 'Registro de partidas', route: '/asientos' },
        { name: 'Partidas pendientes', route: '/' }
      ]
    },
    {
      title: 'Administración y Catálogo',
      icon: 'mdi:folder-cog',
      submenus: [
        { name: 'Nomenclatura Contable', route: '/nomenclatura' },
        { name: 'Libro mayor', route: '/libro-mayor' }
      ]
    },
    {
      title: 'Informes y Análisis',
      icon: 'mdi:chart-line',
      submenus: [
        { name: 'Balance general', route: '/balance-general' },
        { name: 'Estado de resultados', route: '/' },
        { name: 'Balanza de comprobación', route: '/' }
      ]
    },
    {
      title: 'Fin de Período',
      icon: 'mdi:calendar-month',
      submenus: [
        { name: 'Proceso de cierre', route: '/cierre-contable' },
        { name: 'Asiento de apertura', route: '/cierre-contable' }
      ]
    }
  ]

  return (
    <CustomProvider locale={esES}>
      <LayoutContainer>
        <Sidebar $collapsed={collapsed}>
          <SidebarContent>
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                title={item.title}
                icon={item.icon}
                submenus={item.submenus}
                isOpen={openMenus[index] || false}
                onToggle={() => toggleMenu(index)}
                onSubmenuClick={handleSubmenuClick}
                currentPath={location.pathname}
              />
            ))}
          </SidebarContent>
          <ToggleButton onClick={() => setCollapsed(true)}>
            <Icon icon="mdi:close" width="20" height="20" />
          </ToggleButton>
        </Sidebar>
        <MainContent $collapsed={collapsed}>
          <Header>
            <div className="logo-container">
              <button className="menu-toggle" onClick={() => setCollapsed(!collapsed)}>
                <Icon icon="mdi:menu" width="24" height="24" />
              </button>
              <div onClick={() => navigate('/')}>
                <h1 className="logo">SolContables</h1>
              </div>
            </div>
            <div>
              <Stack direction="row" spacing={10} className="fecha">
                <DatePicker
                  format="MMM yyyy"
                  value={selectedDate}
                  onChange={handleDateChange}
                  caretAs={CustomIconCalendar}
                  cleanable={false}
                  oneTap
                  style={{ width: 150 }}
                />
              </Stack>
            </div>
            <UserMenu />
          </Header>
          <ContentWrapper>
            <Outlet />
          </ContentWrapper>
          <Footer>
            <p>© 2024 SolCont - Sistema Contable</p>
          </Footer>
        </MainContent>
      </LayoutContainer>
    </CustomProvider>
  )
}