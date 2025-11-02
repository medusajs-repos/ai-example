import { ReactNode, createContext, useContext } from "react";

type NavbarContextType = {
  // Mobile state
  isMobileMenuOpen: boolean;
  activeSubmenuId: string | null;

  // Actions
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  openSubmenu: (id: string) => void;
  closeSubmenu: () => void;

  // Location
  baseHref: string;

  // Item registration for mobile rendering
  menuItems: Map<string, { label: ReactNode; dropdown: ReactNode }>;
  registerMenuItem: (
    id: string,
    label: ReactNode,
    dropdown: ReactNode | null
  ) => void;
};

export const NavbarContext = createContext<NavbarContextType | undefined>(
  undefined
);

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error("Navbar components must be used within Navbar");
  }
  return context;
};
