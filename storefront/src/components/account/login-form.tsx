import { getCountryCodeFromPath } from "@/lib/utils/region/get-country-code-from-path"
import { useLogin } from "@/lib/hooks/dynamic/use-auth"
import { useLocation, useRouter } from "@tanstack/react-router"
import { useState } from "react"
import { Input, Label } from "@medusajs/ui"
import { Button } from "@/components/common/button"

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

const LoginForm = ({ onSuccess, onSwitchToRegister }: LoginFormProps) => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname) || "dk"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const router = useRouter()
  const login = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    login.mutate(
      { email, password },
      {
        onSuccess: () => {
          router.navigate({
            to: "/$countryCode/account",
            params: { countryCode },
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
          <Label
            htmlFor="email"
            className="block txt-small-plus text-secondary-text mb-2"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label
            htmlFor="password"
            className="block txt-small-plus text-secondary-text mb-2"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="text-error-text txt-small">{error}</div>}

        <Button
          type="submit"
          disabled={login.isPending}
          variant="primary"
        >
          {login.isPending ? "Signing in..." : "Sign In"}
        </Button>

        {onSwitchToRegister && (
          <p className="text-center txt-small text-secondary-text">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-accent-text hover:text-accent-text-hover"
            >
              Sign up
            </button>
          </p>
        )}
      </form>
    </div>
  )
}

export default LoginForm
