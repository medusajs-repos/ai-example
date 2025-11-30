import { CartDropdown } from "@/components/cart"
import { useCategories } from "@/lib/hooks/use-categories"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { XMarkMini } from "@medusajs/icons"
import { Link, useLocation } from "@tanstack/react-router"
import { ReactNode, createContext, useContext, useState } from "react"

// Mobile menu context - only needed for mobile overlay behavior
type MobileMenuContextType = {
  isMobileMenuOpen: boolean
  activeSubmenuId: string | null
  openMobileMenu: () => void
  closeMobileMenu: () => void
  openSubmenu: (id: string) => void
  closeSubmenu: () => void
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(
  undefined
)

const useMobileMenu = () => {
  const context = useContext(MobileMenuContext)
  if (!context) {
    throw new Error("Mobile menu components must be used within Navbar")
  }
  return context
}

// Mobile hamburger button
const MobileHamburger = () => {
  const { openMobileMenu } = useMobileMenu()

  return (
    <button
      className="lg:hidden text-zinc-600 hover:text-zinc-500"
      onClick={openMobileMenu}
      aria-label="Open menu"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
    </button>
  )
}

// Mobile fullscreen overlay
const MobileMenuOverlay = ({ children }: { children: ReactNode }) => {
  const { isMobileMenuOpen, activeSubmenuId, closeMobileMenu, closeSubmenu } =
    useMobileMenu()

  if (!isMobileMenuOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-white z-50 lg:hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-zinc-200">
          {activeSubmenuId ? (
            <button
              onClick={closeSubmenu}
              className="text-zinc-600 hover:text-zinc-500 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              Back
            </button>
          ) : (
            <span className="text-zinc-900 text-lg uppercase">Menu</span>
          )}
          <button
            onClick={closeMobileMenu}
            className="text-zinc-600 hover:text-zinc-500 flex items-center"
            aria-label="Close menu"
          >
            <XMarkMini />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col py-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

// Mobile menu item with optional submenu
const MobileMenuItem = ({
  label,
  to,
  submenuId,
  children,
}: {
  label: string
  to?: string
  submenuId?: string
  children?: ReactNode
}) => {
  const { activeSubmenuId, openSubmenu, closeMobileMenu } = useMobileMenu()

  // If we're viewing a submenu, only show that submenu's content
  if (activeSubmenuId !== null) {
    if (activeSubmenuId === submenuId && children) {
      return <div className="flex flex-col">{children}</div>
    }
    return null
  }

  // Main menu view
  if (submenuId && children) {
    return (
      <button
        onClick={() => openSubmenu(submenuId)}
        className="flex items-center justify-between px-6 py-4 w-full text-left text-zinc-900 hover:bg-zinc-50 text-lg transition-colors"
      >
        {label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    )
  }

  if (to) {
    return (
      <Link
        to={to}
        onClick={closeMobileMenu}
        className="flex items-center px-6 py-4 text-zinc-900 hover:bg-zinc-50 text-lg transition-colors"
      >
        {label}
      </Link>
    )
  }

  return null
}

const MobileMenuLink = ({ to, children }: { to: string; children: ReactNode }) => {
  const { closeMobileMenu } = useMobileMenu()

  return (
    <Link
      to={to}
      onClick={closeMobileMenu}
      className="text-zinc-900 hover:bg-zinc-50 px-6 py-3 text-base font-medium transition-colors"
    >
      {children}
    </Link>
  )
}

// Navbar component using Radix Navigation Menu
export const Navbar = ({ children }: { children: ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSubmenuId, setActiveSubmenuId] = useState<string | null>(null)

  const openMobileMenu = () => setIsMobileMenuOpen(true)
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setActiveSubmenuId(null)
  }
  const openSubmenu = (id: string) => setActiveSubmenuId(id)
  const closeSubmenu = () => setActiveSubmenuId(null)

  return (
    <MobileMenuContext.Provider
      value={{
        isMobileMenuOpen,
        activeSubmenuId,
        openMobileMenu,
        closeMobileMenu,
        openSubmenu,
        closeSubmenu,
      }}
    >
      <div className="sticky top-0 inset-x-0 z-40">
        <header className="relative h-16 mx-auto border-b duration-200 bg-white border-zinc-200">
          <nav className="content-container text-sm font-medium text-zinc-600 flex items-center justify-between w-full h-full">
            {children}
          </nav>
        </header>
      </div>
    </MobileMenuContext.Provider>
  )
}

// Desktop navigation using Radix
const NavbarMenu = ({ children }: { children: ReactNode }) => {
  const { isMobileMenuOpen } = useMobileMenu()

  return (
    <>
      {/* Desktop: Radix Navigation Menu */}
      <NavigationMenu.Root className="hidden lg:flex items-center h-full">
        <NavigationMenu.List className="flex items-center gap-x-6 h-full">
          {children}
        </NavigationMenu.List>

        {/* Viewport renders dropdown content - positioned relative to Root */}
        <NavigationMenu.Viewport
          className="absolute top-full bg-white border-b border-zinc-200 shadow-lg
            overflow-hidden
            data-[state=open]:animate-[dropdown-open_300ms_ease-out]
            data-[state=closed]:animate-[dropdown-close_300ms_ease-out]"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            width: "100vw",
          }}
        />
      </NavigationMenu.Root>

      {/* Mobile: Hamburger Button */}
      {!isMobileMenuOpen && <MobileHamburger />}
    </>
  )
}

const NavbarLogo = ({ to, children }: { to: string; children: ReactNode }) => {
  const { isMobileMenuOpen } = useMobileMenu()

  if (isMobileMenuOpen) {
    return null
  }

  return (
    <div className="flex items-center h-full absolute left-1/2 transform -translate-x-1/2">
      <Link
        to={to}
        className="text-xl font-bold hover:text-zinc-600 uppercase"
        data-testid="nav-store-link"
      >
        {children}
      </Link>
    </div>
  )
}

const NavbarActions = ({ children }: { children: ReactNode }) => {
  const { isMobileMenuOpen } = useMobileMenu()

  if (isMobileMenuOpen) {
    return null
  }

  return (
    <div className="flex items-center gap-x-6 h-full justify-end">
      {children}
    </div>
  )
}

Navbar.Menu = NavbarMenu
Navbar.Logo = NavbarLogo
Navbar.Actions = NavbarActions

// Menu item with optional dropdown (desktop uses Radix, mobile uses context)
export const MenuItem = ({
  children,
  label,
}: {
  children?: ReactNode
  label: string
}) => {
  const hasDropdown = !!children

  if (hasDropdown) {
    return (
      <NavigationMenu.Item className="h-full flex items-center">
        <NavigationMenu.Trigger className="text-zinc-600 hover:text-zinc-500 h-full flex items-center gap-1 select-none">
          {label}
        </NavigationMenu.Trigger>
        <NavigationMenu.Content className="content-container py-12">
          {children}
        </NavigationMenu.Content>
      </NavigationMenu.Item>
    )
  }

  return (
    <NavigationMenu.Item className="h-full flex items-center">
      <NavigationMenu.Link asChild>
        <span className="text-zinc-600 hover:text-zinc-500 h-full flex items-center">
          {label}
        </span>
      </NavigationMenu.Link>
    </NavigationMenu.Item>
  )
}

// Link item (no dropdown)
export const MenuItemLink = ({
  to,
  children,
}: {
  to: string
  children: ReactNode
}) => {
  return (
    <NavigationMenu.Item className="h-full flex items-center">
      <NavigationMenu.Link asChild>
        <Link
          to={to}
          className="text-zinc-600 hover:text-zinc-500 h-full flex items-center"
        >
          {children}
        </Link>
      </NavigationMenu.Link>
    </NavigationMenu.Item>
  )
}

// Link within dropdown
export const DropdownLink = ({
  to,
  children,
}: {
  to: string
  children: ReactNode
}) => {
  return (
    <NavigationMenu.Link asChild>
      <Link
        to={to}
        className="text-zinc-600 hover:text-zinc-500 text-base font-medium transition-colors"
      >
        {children}
      </Link>
    </NavigationMenu.Link>
  )
}

/**
 * Full navbar content with categories
 */
export const NavbarContent = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""

  const { data: topLevelCategories } = useCategories({
    fields: "id,name,handle,parent_category_id",
    queryParams: {
      parent_category_id: "null",
    },
  })

  const categoryLinks = [
    { id: "shop-all", name: "Shop all", to: `${baseHref}/store` },
    ...(topLevelCategories?.map((cat) => ({
      id: cat.id,
      name: cat.name,
      to: `${baseHref}/categories/${cat.handle}`,
    })) ?? []),
  ]

  return (
    <Navbar>
      <Navbar.Menu>
        <MenuItem label="Shop">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex flex-col gap-6">
              <h3 className="text-zinc-900 text-base font-medium uppercase">
                Categories
              </h3>
              <div className="flex flex-col gap-3">
                {categoryLinks.map((link) => (
                  <DropdownLink key={link.id} to={link.to}>
                    {link.name}
                  </DropdownLink>
                ))}
              </div>
            </div>

            <div className="hidden lg:grid grid-cols-2 gap-6">
              {Array.from({ length: 2 }, (_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-zinc-50 flex items-center justify-center"
                >
                  <span className="text-zinc-600 text-sm">
                    Image Placeholder
                  </span>
                </div>
              ))}
            </div>
          </div>
        </MenuItem>
      </Navbar.Menu>

      <Navbar.Logo to={baseHref}>Bloom</Navbar.Logo>

      <Navbar.Actions>
        <CartDropdown />
      </Navbar.Actions>

      {/* Mobile menu overlay */}
      <MobileMenuOverlay>
        <MobileMenuItem label="Shop" submenuId="shop">
          <div className="flex flex-col gap-6 px-6 py-6">
            <h3 className="text-zinc-900 text-base font-medium uppercase">
              Categories
            </h3>
            <div className="flex flex-col">
              {categoryLinks.map((link) => (
                <MobileMenuLink key={link.id} to={link.to}>
                  {link.name}
                </MobileMenuLink>
              ))}
            </div>
          </div>
        </MobileMenuItem>
      </MobileMenuOverlay>
    </Navbar>
  )
}
