import { ReactNode, createContext, useContext, useState } from "react"
import { Link, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region/get-country-code-from-path"
import { XMarkMini } from "@medusajs/icons"

type NavbarContextType = {
  // Mobile state
  isMobileMenuOpen: boolean
  activeSubmenuId: string | null

  // Actions
  openMobileMenu: () => void
  closeMobileMenu: () => void
  openSubmenu: (id: string) => void
  closeSubmenu: () => void

  // Location
  baseHref: string

  // Item registration for mobile rendering
  menuItems: Map<string, { label: ReactNode; dropdown: ReactNode }>
  registerMenuItem: (id: string, label: ReactNode, dropdown: ReactNode | null) => void
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined)

export const useNavbar = () => {
  const context = useContext(NavbarContext)
  if (!context) {
    throw new Error("Navbar components must be used within Navbar")
  }
  return context
}

export const Navbar = ({ children }: { children: ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSubmenuId, setActiveSubmenuId] = useState<string | null>(null)
  const [menuItems] = useState(new Map<string, { label: ReactNode; dropdown: ReactNode }>())

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

  const registerMenuItem = (id: string, label: ReactNode, dropdown: ReactNode | null) => {
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
          <nav className="content-container txt-xsmall-plus text-secondary-text flex items-center justify-between w-full h-full">
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
                  <span className="text-primary-text txt-large uppercase">Menu</span>
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
              <div className="flex-1 overflow-y-auto">
                {children}
              </div>
            </div>
          </div>
        )}
      </div>
    </NavbarContext.Provider>
  )
}

// Logo component - centered (only in main navbar, not in mobile overlay)
Navbar.Logo = ({ to, children }: { to: string; children: ReactNode }) => {
  const { isMobileMenuOpen } = useNavbar()

  // Don't render in mobile overlay
  if (isMobileMenuOpen) {
    return null
  }

  return (
    <div className="flex items-center h-full absolute left-1/2 transform -translate-x-1/2">
      <Link
        to={to}
        className="txt-xlarge-plus hover:text-primary-text-hover uppercase"
        data-testid="nav-store-link"
      >
        {children}
      </Link>
    </div>
  )
}

// Menu container - left side on desktop, full screen on mobile
Navbar.Menu = ({ children }: { children: ReactNode }) => {
  const { isMobileMenuOpen, currentMobileView } = useNavbar()

  return (
    <>
      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-x-6 h-full flex-1 basis-0">
        {children}
      </div>

      {/* Mobile: Hamburger Button */}
      {!isMobileMenuOpen && <MobileHamburger />}

      {/* Mobile: Menu Items (rendered in overlay) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden w-full">
          <div className="flex flex-col py-6">
            {children}
          </div>
        </div>
      )}
    </>
  )
}

// Actions container - right side (only in main navbar, not in mobile overlay)
Navbar.Actions = ({ children }: { children: ReactNode }) => {
  const { isMobileMenuOpen } = useNavbar()

  // Don't render in mobile overlay
  if (isMobileMenuOpen) {
    return null
  }

  return (
    <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
      {children}
    </div>
  )
}

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
