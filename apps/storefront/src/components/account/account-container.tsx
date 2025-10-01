import { type ReactNode } from "react"

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for account page containers in the storefront
 * - Account pages: consistent layout for customer account sections
 * - Customer dashboard: structured layout for account management
 * - Mobile commerce: mobile-optimized account layout
 * - Account navigation: provides consistent account page structure
 * - Customer service: includes customer service information and links
 *
 * ECOMMERCE CONTEXT:
 * - Critical for customer account management
 * - Essential for user experience and navigation
 * - Important for customer retention and loyalty
 * - Required for account security and access
 * - Used in customer service and support
 * - Important for mobile commerce experience
 *
 * ACCOUNT CONTAINER FEATURES:
 * - Consistent account page layout
 * - Page title and description display
 * - Back navigation link support
 * - Responsive design for mobile/desktop
 * - Professional account presentation
 * - Consistent branding and styling
 *
 * CONTAINER STRUCTURE:
 * - Header: title, description, and back link
 * - Content: main account information and forms
 * - Layout: consistent spacing and structure
 * - Responsive: mobile-optimized layout
 *
 * COMMON PATTERNS:
 * - Customer account pages
 * - Mobile account layout
 * - Account navigation layout
 * - Customer service layout
 * - Account management interface
 *
 * EXAMPLES:
 * - <AccountContainer title="Profile" description="Manage your profile information"><ProfileForm /></AccountContainer>
 * - Mobile account layout
 * - Customer dashboard layout
 * - Account navigation layout
 */
interface AccountContainerProps {
  title: string;
  description: string;
  children: ReactNode;
  backLink?: {
    href: string;
    label: string;
  };
}

const AccountContainer = ({
  title,
  description,
  children,
  backLink,
}: AccountContainerProps) => {
  return (
    <div className="px-6 py-2 sm:px-8 sm:py-2 max-w-4xl mx-auto">
      <div className="mb-12 flex flex-col gap-y-6">
        {backLink && (
          <a
            href={backLink.href}
            className="text-accent-text hover:text-accent-text-hover txt-small inline-flex items-center gap-x-2 w-fit group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {backLink.label}
          </a>
        )}

        <h1 className="txt-xlarge text-primary-text">{title}</h1>
        <p className="txt-large text-secondary-text max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>

      <div className="space-y-12">{children}</div>
    </div>
  )
}

export default AccountContainer
