import { clx } from "@medusajs/ui"
import { Link } from "@tanstack/react-router"

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