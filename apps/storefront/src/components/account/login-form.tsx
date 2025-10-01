import { getCountryCodeFromPath } from "@/lib/utils/region/get-country-code-from-path"
import { useLogin } from "@/lib/hooks/dynamic/use-auth"
import { Link, useLocation, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { Button } from "@/components/common/button"
import { Input } from "@/components/common/input"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for customer authentication in the storefront
 * - Login pages: customer account access and authentication
 * - Checkout flow: guest checkout with optional login
 * - Account management: secure access to customer accounts
 * - Mobile commerce: mobile-optimized login experience
 * - Social commerce: integration with social login providers
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for customer account management
 * - Essential for personalized shopping experiences
 * - Important for order history and tracking
 * - Required for saved addresses and preferences
 * - Used in checkout flow optimization
 * - Important for customer retention and loyalty
 * 
 * AUTHENTICATION FEATURES:
 * - Email and password authentication
 * - Form validation and error handling
 * - Loading states during authentication
 * - Success/error feedback to users
 * - Redirect to account page after login
 * - Link to registration for new users
 * 
 * FORM VALIDATION:
 * - Required field validation
 * - Email format validation
 * - Password requirements
 * - Error message display
 * - Form submission handling
 * 
 * COMMON PATTERNS:
 * - Customer login forms
 * - Checkout login integration
 * - Mobile login optimization
 * - Social login integration
 * 
 * EXAMPLES:
 * - <LoginForm onSuccess={() => navigate('/account')} />
 * - <LoginForm /> // Basic login form
 * - <LoginForm onSuccess={handleLoginSuccess} />
 */

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname) || ""
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const loginMutation = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    loginMutation.mutate(
      { email: formData.email, password: formData.password },
      {
        onSuccess: () => {
          navigate({
            to: `/${countryCode}/account` as any,
            reloadDocument: true
          })
          onSuccess?.()
        },
        onError: (error) => {
          setError("Invalid email or password")
          console.error("Login error:", error)
        },
      }
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block txt-small-plus text-secondary-text mb-2"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Email"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block txt-small-plus text-secondary-text mb-2"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            autoComplete="current-password"
            placeholder="Password"
          />
        </div>

        {error && <div className="text-error-text txt-small">{error}</div>}

        <div className="flex items-center justify-center">
          <Button
            type="submit"
            disabled={loginMutation.isPending}
            variant="primary"
          >
            Sign In
          </Button>
        </div>

        <p className="text-center txt-small text-secondary-text">
          Don't have an account?{" "}
          <Link 
            to={`/${countryCode}/register` as any} 
            className="text-accent-text hover:text-accent-text-hover"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}

export default LoginForm
