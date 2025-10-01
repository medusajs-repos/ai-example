import RegisterForm from "@/components/account/register-form"

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for customer registration pages in the storefront
 * - Registration pages: customer account creation and signup
 * - User onboarding: new customer account setup
 * - Mobile commerce: mobile-optimized registration experience
 * - Account creation: customer account registration
 * - User experience: clear and easy registration process
 *
 * ECOMMERCE CONTEXT:
 * - Critical for customer acquisition and conversion
 * - Essential for user onboarding and engagement
 * - Important for customer data collection and profiling
 * - Required for personalized shopping experiences
 * - Used in customer retention and loyalty programs
 * - Important for mobile commerce experience
 *
 * REGISTRATION PAGE FEATURES:
 * - Customer registration form
 * - Account creation and validation
 * - Form validation and error handling
 * - Loading states during registration
 * - Professional registration presentation
 * - Responsive design for mobile/desktop
 *
 * PAGE STRUCTURE:
 * - Registration form with validation
 * - Clear registration instructions and messaging
 * - Professional registration presentation
 * - Mobile-optimized registration experience
 *
 * COMMON PATTERNS:
 * - Customer registration pages
 * - Mobile registration optimization
 * - Account creation forms
 * - User onboarding pages
 * - Customer acquisition interface
 *
 * EXAMPLES:
 * - Customer registration page
 * - Mobile registration experience
 * - Account creation form
 * - User onboarding page
 */
export default function Register() {
  return (
    <div className="content-container py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="txt-xlarge-plus text-primary-text mb-2">
            Sign Up
          </h1>
          <p className="text-secondary-text">
            Create a new account to get started.
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  )
}