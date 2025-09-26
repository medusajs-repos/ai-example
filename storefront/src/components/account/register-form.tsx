import { useState } from "react"
import { useRegister } from "@/lib/hooks/dynamic/use-auth"
import { Button } from "@/components/common/button"
import { Link, useLocation, useNavigate } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region/get-country-code-from-path"
import { Input } from "@/components/common/input"

interface RegisterFormProps {
  onSuccess?: () => void
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname) || ""
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [error, setError] = useState("")
  const navigate = useNavigate()
  
  const registerMutation = useRegister()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    registerMutation.mutate(
      {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password
      },
      {
        onSuccess: () => {
          navigate({
            to: `/${countryCode}/account` as any,
            reloadDocument: true
          })
          onSuccess?.()
        },
        onError: (error) => {
          setError("Registration failed. Email may already be in use.")
          console.error("Registration error:", error)
        }
      }
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block txt-small-plus text-secondary-text mb-2">
              First Name
            </label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block txt-small-plus text-secondary-text mb-2">
              Last Name
            </label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block txt-small-plus text-secondary-text mb-2">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="password" className="block txt-small-plus text-secondary-text mb-2">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block txt-small-plus text-secondary-text mb-2">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />
        </div>

        {error && (
          <div className="text-error-text txt-small">{error}</div>
        )}

        <div className="flex items-center justify-center">
          <Button
            type="submit"
            disabled={registerMutation.isPending}
            variant="primary"
          >
            Create Account
          </Button>
        </div>

        <p className="text-center txt-small text-secondary-text">
          Already have an account?{" "}
          <Link 
            to={`/${countryCode}/login` as any} 
            className="text-accent-text hover:text-accent-text-hover"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}

export default RegisterForm