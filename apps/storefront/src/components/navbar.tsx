import { CartDropdown } from "@/components/cart"
import { useCategories } from "@/lib/hooks/use-categories"
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

// Navbar Context
type NavbarContextType = {
  isMobileMenuOpen: boolean
  activeSubmenuId: string | null
  openMobileMenu: () => void
  closeMobileMenu: () => void
  openSubmenu: (id: string) => void
  closeSubmenu: () => void
  baseHref: string
  menuItems: Map<string, { label: ReactNode; dropdown: ReactNode }>
  registerMenuItem: (
    id: string,
    label: ReactNode,
    dropdown: ReactNode | null
  ) => void
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined)

export const useNavbar = () => {
  const context = useContext(NavbarContext)
  if (!context) {
    throw new Error("Navbar components must be used within Navbar")
  }
  return context
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

// Mobile hamburger button
const MobileHamburger = () => {
  const { openMobileMenu } = useNavbar()

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

// Navbar component
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
      <div className="sticky top-0 inset-x-0 z-40">
        <header className="relative h-16 mx-auto border-b duration-200 bg-white border-zinc-200">
          <nav className="content-container text-sm font-medium text-zinc-600 flex items-center justify-between w-full h-full">
            {children}
          </nav>
        </header>

        {/* Mobile Fullscreen Overlay */}
        {isMobileMenuOpen && (
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
                  <span className="text-zinc-900 text-lg uppercase">
                    Menu
                  </span>
                )}
                <button
                  onClick={closeMobileMenu}
                  className="text-zinc-600 hover:text-zinc-500 flex items-center"
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

const NavbarLogo = ({ to, children }: { to: string; children: ReactNode }) => {
  const { isMobileMenuOpen } = useNavbar()

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

const NavbarActions = ({ children }: { children: ReactNode }) => {
  const { isMobileMenuOpen } = useNavbar()

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

export const MenuItem = ({ children }: { children: ReactNode }) => {
  const id = useId()
  const [isDesktopOpen, setIsDesktopOpen] = useState(false)
  const [hasDropdown, setHasDropdown] = useState(false)
  const [dropdownContent, setDropdownContent] = useState<ReactNode | null>(
    null
  )
  const [labelContent, setLabelContent] = useState<ReactNode | null>(null)
  const { registerMenuItem, isMobileMenuOpen } = useNavbar()

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
        <div className="w-full">{children}</div>
      ) : (
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

  useEffect(() => {
    setLabelContent(children)
  }, [children, setLabelContent])

  useEffect(() => {
    setHasDropdown(!to)
  }, [to, setHasDropdown])

  if (isMobileMenuOpen) {
    if (activeSubmenuId !== null) {
      return null
    }

    if (hasDropdown) {
      return (
        <button
          onClick={() => openSubmenu(id)}
          className="flex items-center justify-between px-6 py-4 w-full text-left text-zinc-900 hover:bg-zinc-50 text-lg transition-colors"
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

    if (to) {
      return (
        <Link
          to={to}
          onClick={closeMobileMenu}
          className="flex items-center px-6 py-4 text-zinc-900 hover:bg-zinc-50 text-lg transition-colors"
        >
          {children}
        </Link>
      )
    }
  }

  if (hasDropdown) {
    return (
      <button
        className="text-zinc-600 hover:text-zinc-500 h-full"
        onMouseEnter={() => setIsDesktopOpen(true)}
      >
        {children}
      </button>
    )
  }

  if (to) {
    return (
      <Link
        to={to}
        className="text-zinc-600 hover:text-zinc-500 h-full flex items-center"
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

  useEffect(() => {
    setDropdownContent(children)
  }, [children, setDropdownContent])

  if (isMobileMenuOpen) {
    if (activeSubmenuId === id) {
      return <div className="flex flex-col">{children}</div>
    }
    return null
  }

  return (
    <div
      className={`fixed left-0 right-0 top-16 bg-white border-b border-zinc-200 shadow-lg z-40 transition-all duration-300 ${isDesktopOpen
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
MenuItem.DropdownLink = ({ to, children }: { to: string; children: ReactNode }) => {
  const { isMobileMenuOpen, closeMobileMenu } = useNavbar()

  if (isMobileMenuOpen) {
    return (
      <Link
        to={to}
        onClick={closeMobileMenu}
        className="text-zinc-900 hover:bg-zinc-50 text-base font-medium transition-colors"
      >
        {children}
      </Link>
    )
  }

  return (
    <Link
      to={to}
      className="text-zinc-600 hover:text-zinc-500 text-base font-medium transition-colors"
    >
      {children}
    </Link>
  )
}

/**
 * Usage:
 * <Navbar /> for main navbar structure
 *   <Navbar.Actions /> for action items (e.g., cart, search, account)
 *   <Navbar.Logo /> for store logo
 *   <Navbar.Menu /> for menu items
 *     <MenuItem /> for individual menu items
 *       <MenuItem.Label /> for menu item label use to={link} for direct links or omit for dropdowns
 *       <MenuItem.Dropdown /> for menu item dropdown content
   *       <MenuItem.DropdownLink to={link} /> for links within dropdowns
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
        <MenuItem>
          <MenuItem.Label>Store</MenuItem.Label>
          <MenuItem.Dropdown>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 py-6 lg:px-0 lg:py-0">
              <div className="flex flex-col gap-6">
                <h3 className="text-zinc-900 text-base font-medium uppercase">
                  Categories
                </h3>
                <div className="flex flex-col gap-3">
                  {categoryLinks.map((link) => (
                    <MenuItem.DropdownLink key={link.id} to={link.to}>
                      {link.name}
                    </MenuItem.DropdownLink>
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
          </MenuItem.Dropdown>
        </MenuItem>
      </Navbar.Menu>

      <Navbar.Logo to={baseHref}>Medusa Store</Navbar.Logo>

      <Navbar.Actions>
        <CartDropdown />
      </Navbar.Actions>
    </Navbar>
  )
}
