import { useState } from "react"
import { useRegister } from "@/lib/hooks/dynamic/use-auth"
import { Button, Input, Label } from "@medusajs/ui"

interface RegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

const RegisterForm = ({ onSuccess, onSwitchToLogin }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [error, setError] = useState("")
  
  const register = useRegister()

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

    register.mutate(
      {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password
      },
      {
        onSuccess: () => {
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
            <Label htmlFor="firstName" className="block txt-small-plus text-secondary-text mb-2">
              First Name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="lastName" className="block txt-small-plus text-secondary-text mb-2">
              Last Name
            </Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="block txt-small-plus text-secondary-text mb-2">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="password" className="block txt-small-plus text-secondary-text mb-2">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="block txt-small-plus text-secondary-text mb-2">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {error && (
          <div className="text-error-text txt-small">{error}</div>
        )}

        <Button
          type="submit"
          disabled={register.isPending}
          variant="primary"
        >
          {register.isPending ? "Creating Account..." : "Create Account"}
        </Button>

        {onSwitchToLogin && (
          <p className="text-center txt-small text-secondary-text">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-accent-text hover:text-accent-text-hover"
            >
              Sign in
            </button>
          </p>
        )}
      </form>
    </div>
  )
}

export default RegisterForm