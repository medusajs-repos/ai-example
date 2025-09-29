import { Outlet } from "@tanstack/react-router"
import ErrorBoundary from "@/components/common/error-boundary"
import Footer from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { Toaster } from "@medusajs/ui"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use as the main layout wrapper for the storefront
 * - Site layout: provides consistent structure across all pages
 * - Mobile commerce: responsive layout for mobile devices
 * - Error handling: wraps all pages with error boundaries
 * - Navigation: provides consistent header and footer
 * - Toast notifications: global notification system
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for consistent user experience
 * - Essential for site navigation and structure
 * - Important for error handling and recovery
 * - Required for responsive design and mobile commerce
 * - Used in global notification and feedback systems
 * - Important for brand consistency and presentation
 * 
 * LAYOUT FEATURES:
 * - Consistent header navigation
 * - Main content area with error boundaries
 * - Footer with links and information
 * - Global toast notification system
 * - Responsive design for mobile/desktop
 * - Error handling and recovery
 * 
 * STRUCTURE:
 * - Header: navigation and branding
 * - Main: page content with error boundaries
 * - Footer: links and company information
 * - Toaster: global notifications
 * 
 * COMMON PATTERNS:
 * - Ecommerce site layout
 * - Mobile commerce layout
 * - Responsive design layout
 * - Error handling layout
 * - Global notification layout
 * 
 * EXAMPLES:
 * - <Layout><PageContent /></Layout>
 * - Mobile-optimized layout
 * - Error handling layout
 * - Global notification layout
 */

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
  )
}

export default Layout
