import { Button } from "@/components/common/button";
import { getCountryCodeFromPath } from "@/lib/utils/region/get-country-code-from-path";
import { Link, useLocation } from "@tanstack/react-router";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for homepage hero sections in the storefront
 * - Homepage: main banner with brand messaging and CTAs
 * - Landing pages: promotional banners and announcements
 * - Marketing campaigns: featured promotions and offers
 * - Mobile commerce: mobile-optimized hero sections
 * - Brand storytelling: company mission and values
 *
 * ECOMMERCE CONTEXT:
 * - Critical for first impressions and brand positioning
 * - Essential for conversion optimization and sales
 * - Important for user engagement and retention
 * - Required for marketing campaigns and promotions
 * - Used in brand storytelling and messaging
 * - Important for mobile commerce experience
 *
 * HERO FEATURES:
 * - Large banner with brand messaging
 * - Call-to-action buttons for conversion
 * - Responsive design for mobile/desktop
 * - Professional brand presentation
 * - Clear navigation to key sections
 * - Engaging visual design
 *
 * MESSAGING:
 * - Brand name and identity
 * - Value proposition and benefits
 * - Clear call-to-action buttons
 * - Navigation to key sections
 * - Professional presentation
 *
 * COMMON PATTERNS:
 * - Homepage hero banners
 * - Marketing campaign banners
 * - Mobile hero sections
 * - Brand storytelling banners
 * - Promotional announcements
 *
 * EXAMPLES:
 * - <Hero /> // Homepage hero section
 * - Marketing campaign hero
 * - Mobile-optimized hero banner
 * - Brand storytelling hero section
 */

const Hero = () => {
  const location = useLocation();
  // Get country code from URL path
  const countryCode = getCountryCodeFromPath(location.pathname);
  const baseHref = countryCode ? `/${countryCode}` : "";

  return (
    <div className="h-[75vh] w-full border-b border-primary-border relative bg-secondary-bg">
      <div className="w-full h-full flex flex-col justify-center items-center text-center sm:p-32 gap-8">
        <div>
          <h1 className="text-3xl sm:text-4xl text-primary-text mb-4">
            Medusa Store
          </h1>
          <h2 className="!txt-xlarge sm:text-2xl text-secondary-text sm:max-w-sm text-pretty">
            Your modern commerce solution for exceptional shopping experiences.
          </h2>
        </div>
        <div className="flex gap-4">
          <Link to={`${baseHref}/store` as string}>
            <Button variant="primary">View Products</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
