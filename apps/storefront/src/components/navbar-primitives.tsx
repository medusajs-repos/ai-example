import { NavbarContext, useNavbar } from "@/lib/context/navbar"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { XMarkMini } from "@medusajs/icons"
import { Link, useLocation } from "@tanstack/react-router"
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useId,
  useState,
} from "react"

export const Navbar = ({ children }: { children: ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSubmenuId, setActiveSubmenuId] = useState<string | null>(null)
  const [menuItems] = useState(
    new Map<string, { label: ReactNode; dropdown: ReactNode }>()
  )

  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""

  const openMobileMenu = () => setIsMobileMenuOpen(true)

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setActiveSubmenuId(null)
  }

  const openSubmenu = (id: string) => {
    setActiveSubmenuId(id)
  }

  const closeSubmenu = () => {
    setActiveSubmenuId(null)
  }

  const registerMenuItem = (
    id: string,
    label: ReactNode,
    dropdown: ReactNode | null
  ) => {
    if (dropdown) {
      menuItems.set(id, { label, dropdown })
    }
  }

  return (
    <NavbarContext.Provider
      value={{
        isMobileMenuOpen,
        activeSubmenuId,
        openMobileMenu,
        closeMobileMenu,
        openSubmenu,
        closeSubmenu,
        baseHref,
        menuItems,
        registerMenuItem,
      }}
    >
      <div className="sticky top-0 inset-x-0 z-50">
        <header className="relative h-16 mx-auto border-b duration-200 bg-primary-bg border-primary-border">
          <nav className="content-container text-sm font-medium text-secondary-text flex items-center justify-between w-full h-full">
            {children}
          </nav>
        </header>

        {/* Mobile Fullscreen Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-primary-bg z-50 lg:hidden">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between h-16 px-6 border-b border-primary-border">
                {activeSubmenuId ? (
                  <button
                    onClick={closeSubmenu}
                    className="text-secondary-text hover:text-secondary-text-hover flex items-center gap-2"
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
                  <span className="text-primary-text text-large uppercase">
                    Menu
                  </span>
                )}
                <button
                  onClick={closeMobileMenu}
                  className="text-secondary-text hover:text-secondary-text-hover flex items-center"
                  aria-label="Close menu"
                >
                  <XMarkMini />
                </button>
              </div>

              {/* Mobile Menu Content - rendered by Navbar.Menu */}
              <div className="flex-1 overflow-y-auto">{children}</div>
            </div>
          </div>
        )}
      </div>
    </NavbarContext.Provider>
  )
}

// Logo component - centered (only in main navbar, not in mobile overlay)
const NavbarLogo = ({ to, children }: { to: string; children: ReactNode }) => {
  const { isMobileMenuOpen } = useNavbar()

  // Don't render in mobile overlay
  if (isMobileMenuOpen) {
    return null
  }

  return (
    <div className="flex items-center h-full absolute left-1/2 transform -translate-x-1/2">
      <Link
        to={to}
        className="text-xlarge font-bold hover:text-primary-text-hover uppercase"
        data-testid="nav-store-link"
      >
        {children}
      </Link>
    </div>
  )
}

// Menu container - left side on desktop, full screen on mobile
const NavbarMenu = ({ children }: { children: ReactNode }) => {
  const { isMobileMenuOpen } = useNavbar()

  return (
    <>
      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-x-6 h-full">
        {children}
      </div>

      {/* Mobile: Hamburger Button */}
      {!isMobileMenuOpen && <MobileHamburger />}

      {/* Mobile: Menu Items (rendered in overlay) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden w-full">
          <div className="flex flex-col py-6">{children}</div>
        </div>
      )}
    </>
  )
}

// Actions container - right side (only in main navbar, not in mobile overlay)
const NavbarActions = ({ children }: { children: ReactNode }) => {
  const { isMobileMenuOpen } = useNavbar()

  // Don't render in mobile overlay
  if (isMobileMenuOpen) {
    return null
  }

  return (
    <div className="flex items-center gap-x-6 h-full justify-end">
      {children}
    </div>
  )
}

Navbar.Logo = NavbarLogo
Navbar.Menu = NavbarMenu
Navbar.Actions = NavbarActions

// Mobile hamburger button
const MobileHamburger = () => {
  const { openMobileMenu } = useNavbar()

  return (
    <button
      className="lg:hidden text-secondary-text hover:text-secondary-text-hover"
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

// MenuItem Context
type MenuItemContextType = {
  id: string
  isDesktopOpen: boolean
  setIsDesktopOpen: (open: boolean) => void
  hasDropdown: boolean
  setHasDropdown: (has: boolean) => void
  dropdownContent: ReactNode | null
  setDropdownContent: (content: ReactNode | null) => void
  labelContent: ReactNode | null
  setLabelContent: (content: ReactNode | null) => void
}

const MenuItemContext = createContext<MenuItemContextType | undefined>(
  undefined
)

const useMenuItem = () => {
  const context = useContext(MenuItemContext)
  if (!context) {
    throw new Error("MenuItem sub-components must be used within MenuItem")
  }
  return context
}

export const MenuItem = ({ children }: { children: ReactNode }) => {
  const id = useId()
  const [isDesktopOpen, setIsDesktopOpen] = useState(false)
  const [hasDropdown, setHasDropdown] = useState(false)
  const [dropdownContent, setDropdownContent] = useState<ReactNode | null>(
    null
  )
  const [labelContent, setLabelContent] = useState<ReactNode | null>(null)
  const { registerMenuItem, isMobileMenuOpen, activeSubmenuId } = useNavbar()

  // Register this item with navbar for mobile rendering
  useEffect(() => {
    if (hasDropdown && labelContent && dropdownContent) {
      registerMenuItem(id, labelContent, dropdownContent)
    }
  }, [id, hasDropdown, labelContent, dropdownContent, registerMenuItem])

  const contextValue: MenuItemContextType = {
    id,
    isDesktopOpen,
    setIsDesktopOpen,
    hasDropdown,
    setHasDropdown,
    dropdownContent,
    setDropdownContent,
    labelContent,
    setLabelContent,
  }

  return (
    <MenuItemContext.Provider value={contextValue}>
      {isMobileMenuOpen ? (
        // Mobile - render as full-width item
        <div className="w-full">{children}</div>
      ) : (
        // Desktop - render with relative positioning
        <div className="relative h-full">{children}</div>
      )}
    </MenuItemContext.Provider>
  )
}

// Label - button (with dropdown) or link (without dropdown)
MenuItem.Label = ({ children, to }: { children: ReactNode; to?: string }) => {
  const { id, setIsDesktopOpen, hasDropdown, setHasDropdown, setLabelContent } =
    useMenuItem()
  const { isMobileMenuOpen, activeSubmenuId, openSubmenu, closeMobileMenu } =
    useNavbar()

  // Register label content for mobile rendering
  useEffect(() => {
    setLabelContent(children)
  }, [children, setLabelContent])

  // Check if there's a sibling Dropdown
  useEffect(() => {
    setHasDropdown(!to)
  }, [to, setHasDropdown])

  // Mobile view
  if (isMobileMenuOpen) {
    // Don't render label when ANY submenu is active
    if (activeSubmenuId !== null) {
      return null
    }

    if (hasDropdown) {
      // Mobile button with arrow
      return (
        <button
          onClick={() => openSubmenu(id)}
          className="flex items-center justify-between px-6 py-4 w-full text-left text-primary-text hover:bg-secondary-bg text-large transition-colors"
        >
          {children}
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

    // Mobile flat link
    if (to) {
      return (
        <Link
          to={to}
          onClick={closeMobileMenu}
          className="flex items-center px-6 py-4 text-primary-text hover:bg-secondary-bg text-large transition-colors"
        >
          {children}
        </Link>
      )
    }
  }

  // Desktop view
  if (hasDropdown) {
    // Desktop hover button
    return (
      <button
        className="text-secondary-text hover:text-secondary-text-hover h-full"
        onMouseEnter={() => setIsDesktopOpen(true)}
      >
        {children}
      </button>
    )
  }

  // Desktop flat link
  if (to) {
    return (
      <Link
        to={to}
        className="text-secondary-text hover:text-secondary-text-hover h-full flex items-center"
      >
        {children}
      </Link>
    )
  }

  return null
}

// Dropdown - mega menu on desktop, submenu on mobile
MenuItem.Dropdown = ({ children }: { children: ReactNode }) => {
  const { id, isDesktopOpen, setIsDesktopOpen, setDropdownContent } =
    useMenuItem()
  const { isMobileMenuOpen, activeSubmenuId } = useNavbar()

  // Register that this item has a dropdown
  useEffect(() => {
    setDropdownContent(children)
  }, [children, setDropdownContent])

  // Mobile submenu view - only render if THIS item is the active submenu
  if (isMobileMenuOpen) {
    if (activeSubmenuId === id) {
      return <div className="flex flex-col">{children}</div>
    }
    return null // Hide if no submenu or different submenu is active
  }

  // Desktop mega menu
  return (
    <div
      className={`fixed left-0 right-0 top-16 bg-primary-bg border-b border-primary-border shadow-lg z-40 transition-all duration-300 ${
        isDesktopOpen
          ? "translate-y-0 opacity-100 visible"
          : "-translate-y-4 opacity-0 invisible pointer-events-none"
      }`}
      onMouseEnter={() => setIsDesktopOpen(true)}
      onMouseLeave={() => setIsDesktopOpen(false)}
    >
      <div className="content-container py-12">{children}</div>
    </div>
  )
}

// Link within dropdown - responsive styling
MenuItem.Link = ({ to, children }: { to: string; children: ReactNode }) => {
  const { isMobileMenuOpen, closeMobileMenu } = useNavbar()

  // Mobile dropdown link
  if (isMobileMenuOpen) {
    return (
      <Link
        to={to}
        onClick={closeMobileMenu}
        className="text-primary-text hover:bg-secondary-bg text-base font-medium transition-colors"
      >
        {children}
      </Link>
    )
  }

  // Desktop dropdown link
  return (
    <Link
      to={to}
      className="text-secondary-text hover:text-secondary-text-hover text-base font-medium transition-colors"
    >
      {children}
    </Link>
  )
}
