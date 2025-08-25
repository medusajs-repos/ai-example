import { Github } from "@medusajs/icons";
import { Button, Heading } from "@medusajs/ui";

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-gray-200 relative bg-white">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-8">
        <div>
          <Heading
            level="h1"
            className="text-4xl sm:text-5xl font-semibold text-gray-900 mb-4"
          >
            Ecommerce Starter Template
          </Heading>
          <Heading
            level="h2"
            className="text-xl sm:text-2xl text-gray-600 font-normal"
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
  );
};

export default Hero;
