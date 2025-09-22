import { clx } from "@medusajs/ui";
import { Link } from "@tanstack/react-router";

type NavbarLinkProps = {
  to: string;
  children: React.ReactNode;
  className?: string;
};

export const NavbarLink = ({ to, children, className }: NavbarLinkProps) => {
  return <Link to={to} className={clx(
    "hover:text-ui-fg-subtle",
    className
  )}>{children}</Link>;
};