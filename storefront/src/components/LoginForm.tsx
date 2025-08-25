import { getCountryCodeFromPath } from "@/lib/util/regions";
import { useLogin } from "@lib/hooks/useAuth";
import { useLocation, useRouter } from "@tanstack/react-router";
import { useState } from "react";

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

const LoginForm = ({ onSuccess, onSwitchToRegister }: LoginFormProps) => {
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname) || "dk";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    login.mutate(
      { email, password },
      {
        onSuccess: () => {
          router.navigate({
            to: "/$countryCode/account",
            params: { countryCode },
          });
          onSuccess?.();
        },
        onError: (error) => {
          setError("Invalid email or password");
          console.error("Login error:", error);
        },
      }
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            required
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={login.isPending}
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
        >
          {login.isPending ? "Signing in..." : "Sign In"}
        </button>

        {onSwitchToRegister && (
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:underline"
            >
              Sign up
            </button>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
