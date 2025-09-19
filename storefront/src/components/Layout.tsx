import { useCart } from "@/lib/hooks/dynamic/use-cart";
import { useRegions } from "@/lib/hooks/static/use-region";
import { getCountryCodeFromPath } from "@/lib/utils/regions";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import CartDropdown from "@/components/cart-dropdown";
import ErrorBoundary from "@/components/error-boundary";
import Footer from "@/components/footer";
import SideMenu from "@/components/side-menu";

const Layout = () => {
  const { data: cart } = useCart();
  const { data: regions } = useRegions();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const itemCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  const location = useLocation();

  // Get country code from URL path
  const countryCode = getCountryCodeFromPath(location.pathname);
  const baseHref = countryCode ? `/${countryCode}` : "";

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsCartOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsCartOpen(false);
    }, 150); // Small delay to allow moving cursor to dropdown
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div>
      <div className="sticky top-0 inset-x-0 z-50 group">
        <header className="relative h-16 mx-auto border-b duration-200 bg-ui-bg-base border-ui-border-base">
          <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full">
            <div className="flex-1 basis-0 h-full flex items-center">
              <div className="h-full">
                <SideMenu regions={regions || []} />
              </div>
            </div>

            <div className="flex items-center h-full">
              <Link
                to={baseHref || "/"}
                className="txt-xlarge font-semibold hover:text-ui-fg-subtle uppercase"
                data-testid="nav-store-link"
              >
                Medusa Store
              </Link>
            </div>

            <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
              <div className="hidden small:flex items-center gap-x-6 h-full">
                <Link
                  className="hover:text-ui-fg-subtle"
                  to={`${baseHref}/account`}
                  data-testid="nav-account-link"
                >
                  Account
                </Link>
              </div>
              <div
                ref={cartRef}
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  className="hover:text-ui-fg-subtle flex gap-2"
                  to={`${baseHref}/cart`}
                  data-testid="nav-cart-link"
                >
                  Cart ({itemCount})
                </Link>

                {isCartOpen && (
                  <div
                    className="absolute top-full right-0 z-50 pt-2"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <CartDropdown />
                  </div>
                )}
              </div>
            </div>
          </nav>
        </header>
      </div>

      <main className="relative">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
