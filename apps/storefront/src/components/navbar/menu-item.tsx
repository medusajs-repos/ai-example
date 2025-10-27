import { ReactNode, createContext, useContext, useState, useEffect, useId } from "react"
import { Link } from "@tanstack/react-router"
import { useNavbar } from "./navbar"

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

const MenuItemContext = createContext<MenuItemContextType | undefined>(undefined)

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
  const [dropdownContent, setDropdownContent] = useState<ReactNode | null>(null)
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
  const {
    id,
    setIsDesktopOpen,
    hasDropdown,
    setHasDropdown,
    setLabelContent,
  } = useMenuItem()
  const { isMobileMenuOpen, activeSubmenuId, openSubmenu, closeMobileMenu } = useNavbar()

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
          className="flex items-center justify-between px-6 py-4 w-full text-left text-primary-text hover:bg-secondary-bg txt-large transition-colors"
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
          className="flex items-center px-6 py-4 text-primary-text hover:bg-secondary-bg txt-large transition-colors"
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
  const { id, isDesktopOpen, setIsDesktopOpen, setDropdownContent } = useMenuItem()
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
    return null  // Hide if no submenu or different submenu is active
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
        className="text-primary-text hover:bg-secondary-bg txt-medium transition-colors"
      >
        {children}
      </Link>
    )
  }

  // Desktop dropdown link
  return (
    <Link
      to={to}
      className="text-secondary-text hover:text-secondary-text-hover txt-medium transition-colors"
    >
      {children}
    </Link>
  )
}
