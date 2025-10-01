import LoginForm from "@/components/account/login-form"

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for customer login pages in the storefront
 * - Authentication pages: customer account access and login
 * - User authentication: secure customer login process
 * - Mobile commerce: mobile-optimized login experience
 * - Account access: customer account authentication
 * - User experience: clear and secure login process
 *
 * ECOMMERCE CONTEXT:
 * - Critical for customer authentication and access
 * - Essential for personalized shopping experiences
 * - Important for customer account management
 * - Required for order history and tracking
 * - Used in customer retention and loyalty
 * - Important for mobile commerce experience
 *
 * LOGIN PAGE FEATURES:
 * - Customer authentication form
 * - Email and password login
 * - Form validation and error handling
 * - Loading states during authentication
 * - Professional login presentation
 * - Responsive design for mobile/desktop
 *
 * PAGE STRUCTURE:
 * - Login form with authentication
 * - Clear login instructions and messaging
 * - Professional login presentation
 * - Mobile-optimized login experience
 *
 * COMMON PATTERNS:
 * - Customer login pages
 * - Mobile login optimization
 * - Authentication forms
 * - Account access pages
 * - User authentication interface
 *
 * EXAMPLES:
 * - Customer login page
 * - Mobile login experience
 * - Authentication form
 * - Account access page
 */
const Login = () => {
  return (
    <div className="content-container py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="txt-xlarge-plus text-primary-text mb-2">
            Sign In
          </h1>
          <p className="text-secondary-text">
            Welcome back! Please sign in to your account.
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}

export default Login
