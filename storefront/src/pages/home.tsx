import Hero from "@/components/layout/hero"
import { lazy, Suspense } from "react"
import Loading from "@/components/common/loading"

const FeaturedProducts = lazy(() => import("@/components/product/featured-products"))

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use as the main landing page for the storefront
 * - Homepage: primary entry point for customers
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for first impressions and brand positioning
 * - Essential for conversion optimization and sales
 * - Important for SEO and organic traffic
 * - Used in marketing campaigns and promotions
 * - Required for customer engagement and retention
 * - Important for mobile commerce experience
 * 
 * PAGE STRUCTURE:
 * - Hero section: main banner with call-to-action
 * - Featured products: curated product recommendations
 * - Lazy loading: performance optimization for heavy components
 * - Responsive design: mobile-first approach
 * 
 * KEY FEATURES:
 * - Hero banner with marketing messaging
 * - Featured products section with lazy loading
 * - Performance optimization with Suspense
 * - Responsive layout for all devices
 * - SEO-friendly structure
 * 
 * COMMON PATTERNS:
 * - Seasonal homepage variations
 * - A/B testing for conversion optimization
 * - Personalization based on user behavior
 * - Mobile commerce optimization
 * - Accessibility compliance
 * 
 * EXAMPLES:
 * - Homepage with seasonal hero banner
 * - Featured products for new arrivals
 * - Marketing campaign landing page
 * - Mobile-optimized homepage
 */

const Home = () => {
  return (
    <>
      <Hero />
      <div className="lg:min-h-[50vh]">
        <Suspense fallback={<Loading />}>
          <FeaturedProducts />
        </Suspense>
      </div>
    </>
  )
}

export default Home
