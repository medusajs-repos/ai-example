import ErrorBoundary from "@/components/common/error-boundary";
import Footer from "@/components/layout/footer";
import { NavbarContent } from "@/components/layout/navbar";
import { CartProvider } from "@/lib/context/cart";
import { ToastProvider } from "@/lib/context/toast-context";
import { Outlet } from "@tanstack/react-router";

const Layout = () => {
  return (
    <ToastProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <NavbarContent />

          <main className="relative flex-1">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>

          <Footer />
        </div>
      </CartProvider>
    </ToastProvider>
  );
};

export default Layout;
