import { clx } from "@medusajs/ui"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for all interactive buttons in the storefront
 * - Primary buttons: "Add to Cart", "Buy Now", "Checkout", "Place Order"
 * - Secondary buttons: "View Details", "Continue Shopping", "Back to Cart"
 * - Danger buttons: "Remove from Cart", "Delete Address", "Cancel Order"
 * - Transparent buttons: "Learn More", "View All", navigation links styled as buttons
 * 
 * ECOMMERCE CONTEXT:
 * - Primary variant: Main call-to-action buttons that drive conversions
 * - Secondary variant: Supporting actions that don't interrupt the main flow
 * - Danger variant: Destructive actions that require user confirmation
 * - Transparent variant: Subtle actions or links that look like buttons
 * 
 * SIZE GUIDELINES:
 * - "full": Use for checkout buttons, add to cart in product pages, form submissions
 * - "fit": Use for inline actions, quantity selectors, small action buttons
 * 
 * EXAMPLES:
 * - <Button variant="primary" size="full">Add to Cart</Button>
 * - <Button variant="secondary" size="fit">View Details</Button>
 * - <Button variant="danger" size="fit">Remove</Button>
 */

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement
> & {
  variant?: "primary" | "secondary" | "danger" | "transparent"
  size?: "full" | "fit"
}

export const Button = ({
  variant = "primary",
  className,
  size = "full",
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={clx(
        "cursor-pointer disabled:cursor-default", 
        "inline-flex items-center justify-center gap-2 px-4 py-2",
        "rounded-none shadow-none appearance-none border",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "txt-medium",
        size === "full" && "w-full",
        size === "fit" && "w-fit",
        {
          "bg-button-primary-bg text-button-primary-text hover:bg-button-primary-hover active:bg-button-primary-pressed border-button-primary-border": variant === "primary",
          "bg-button-secondary-bg text-button-secondary-text hover:bg-button-secondary-hover active:bg-button-secondary-pressed border-button-secondary-border": variant === "secondary",
          "bg-button-error-bg text-button-error-text hover:bg-button-error-hover active:bg-button-error-pressed border-button-error-border": variant === "danger",
          "bg-transparent text-primary-text hover:bg-transparent active:bg-transparent border-transparent": variant === "transparent",
        }, 
        className
      )}
    />
  )
}