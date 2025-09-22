import { Outlet } from "@tanstack/react-router";
import ErrorBoundary from "@/components/common/error-boundary";
import Footer from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar"
import { Toaster } from "@medusajs/ui";

const Layout = () => {

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <main className="relative flex-1">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      <Footer />
      <Toaster />
    </div>
  );
};

export default Layout;
