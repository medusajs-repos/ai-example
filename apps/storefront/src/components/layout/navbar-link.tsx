import { Link } from "@tanstack/react-router";
import { clsx } from "clsx";

type NavbarLinkProps = {
  to: string;
  children: React.ReactNode;
  className?: string;
};

export const NavbarLink = ({ to, children, className }: NavbarLinkProps) => {
  return (
    <Link
      to={to}
      className={clsx(
        "text-secondary-text hover:text-secondary-text-hover",
        className
      )}
    >
      {children}
    </Link>
  );
};
