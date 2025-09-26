import { Button } from "@/components/common/button"
import { Link } from "@tanstack/react-router"

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-primary-border relative bg-secondary-bg">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center sm:p-32 gap-8">
        <div>
          <h1
            className="text-3xl sm:text-4xl text-primary-text mb-4"
          >
            Medusa Store
          </h1>
          <h2
            className="!txt-xlarge sm:text-2xl text-secondary-text sm:max-w-sm text-pretty"
          >
            Your modern commerce solution for exceptional shopping experiences.
          </h2>
        </div>
        <div className="flex gap-4">
          <Link to="/store">
            <Button variant="primary">
              View Products
            </Button>
          </Link>
          <a
            href="https://medusajs.com"
            target="_blank"
          >
            <Button variant="secondary">
              Learn about Medusa
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Hero
