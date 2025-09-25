import RegisterForm from "@/components/account/register-form"

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