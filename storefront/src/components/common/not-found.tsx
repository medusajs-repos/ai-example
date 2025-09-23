import { Button, Heading } from "@medusajs/ui"
import { Link, useLocation } from "@tanstack/react-router"

const NotFound = () => {
  const location = useLocation()

  return (
    <div className="content-container py-12">
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
        <div className="max-w-md space-y-6">
          {/* Large 404 */}
          <h1 className="text-8xl font-light text-ui-fg-base">404</h1>
          
          {/* Main message */}
          <div className="space-y-2">
            <Heading
              level="h1"
              className="txt-xlarge-plus text-ui-fg-base"
            >
              Page not found
            </Heading>
            <p className="text-ui-fg-subtle">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Current path */}
          <div className="px-4 py-2 bg-ui-bg-subtle rounded-md font-mono txt-small text-ui-fg-subtle">
            {location.pathname}
          </div>

          {/* Action button */}
          <Link to="/">
            <Button className="px-6 py-3">
              Go home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound