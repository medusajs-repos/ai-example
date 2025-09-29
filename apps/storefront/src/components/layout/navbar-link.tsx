import { clx } from "@medusajs/ui"
import { Link } from "@tanstack/react-router"

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for navigation links in the storefront header
 * - Header navigation: primary site navigation links
 * - Mobile commerce: mobile-optimized navigation links
 * - Site navigation: consistent navigation styling
 * - User experience: clear navigation and routing
 * - Brand navigation: logo and brand links
 *
 * ECOMMERCE CONTEXT:
 * - Critical for site navigation and user experience
 * - Essential for user orientation and navigation
 * - Important for brand identity and recognition
 * - Required for consistent navigation styling
 * - Used in header and navigation components
 * - Important for mobile commerce experience
 *
 * NAVBAR LINK FEATURES:
 * - Consistent navigation link styling
 * - Hover states and visual feedback
 * - Responsive design for mobile/desktop
 * - Professional navigation presentation
 * - Clear navigation identification
 * - Accessible navigation links
 *
 * NAVIGATION STYLING:
 * - Secondary text color with hover states
 * - Consistent link styling across navigation
 * - Professional navigation presentation
 * - Responsive design for all screen sizes
 * - Clear visual feedback for interactions
 *
 * COMMON PATTERNS:
 * - Header navigation links
 * - Mobile navigation links
 * - Site navigation styling
 * - Brand navigation links
 * - User navigation links
 *
 * EXAMPLES:
 * - <NavbarLink to="/store">Store</NavbarLink>
 * - <NavbarLink to="/account">Account</NavbarLink>
 * - Header navigation links
 * - Mobile navigation links
 */
type NavbarLinkProps = {
  to: string;
  children: React.ReactNode;
  className?: string;
};

export const NavbarLink = ({ to, children, className }: NavbarLinkProps) => {
  return <Link to={to} className={clx(
    "text-secondary-text hover:text-secondary-text-hover",
    className
  )}>{children}</Link>
}