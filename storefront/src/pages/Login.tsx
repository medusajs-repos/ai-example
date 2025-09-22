import LoginForm from "@/components/login-form";
import RegisterForm from "@/components/register-form";
import { useCustomer } from "@/lib/hooks/dynamic/use-auth";
import { Navigate } from "@tanstack/react-router";
import { useState } from "react";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { data: customer } = useCustomer();

  // Redirect if already logged in
  if (customer) {
    return <Navigate to="/account" />;
  }

  return (
    <div className="content-container py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="txt-xlarge-plus text-ui-fg-base mb-2">
            {isLogin ? "Sign In" : "Create Account"}
          </h1>
          <p className="text-ui-fg-subtle">
            {isLogin
              ? "Welcome back! Please sign in to your account."
              : "Create a new account to get started."}
          </p>
        </div>

        {isLogin ? (
          <LoginForm
            onSwitchToRegister={() => setIsLogin(false)}
          />
        ) : (
          <RegisterForm
            onSuccess={() => {
              alert("Account created successfully! You can now sign in.");
              setIsLogin(true);
            }}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
};

export default Login;
