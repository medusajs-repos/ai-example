import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-primary-border relative bg-secondary-bg">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-8">
        <div>
          <Heading
            level="h1"
            className="text-3xl small:text-4xl text-primary-text mb-4"
          >
            Ecommerce Starter Template
          </Heading>
          <Heading
            level="h2"
            className="!txt-xlarge small:text-2xl text-secondary-text"
          >
            Powered by Medusa and TanStack
          </Heading>
        </div>
        <a
          href="https://github.com/medusajs/nextjs-starter-medusa"
          target="_blank"
        >
          <Button variant="secondary" className="px-6 py-3">
            View on GitHub
            <Github className="ml-2" />
          </Button>
        </a>
      </div>
    </div>
  )
}

export default Hero
