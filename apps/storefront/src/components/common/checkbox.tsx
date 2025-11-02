import { Check } from "@medusajs/icons";
import { clsx } from "clsx";
import { forwardRef } from "react";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for form inputs that require single or multiple selections
 * - Checkout forms: terms and conditions, newsletter signup
 * - Product filters: category, brand, feature selections
 * - Account settings: notification preferences, privacy settings
 * - Cart management: select multiple items for bulk actions
 * - Search filters: advanced search option selections
 *
 * ECOMMERCE CONTEXT:
 * - Essential for form validation and user input
 * - Critical for checkout flow and terms acceptance
 * - Important for product filtering and search
 * - Required for account preferences and settings
 * - Used in cart management and bulk operations
 * - Important for compliance and legal requirements
 *
 * CHECKBOX FEATURES:
 * - Custom styled checkbox with check icon
 * - Accessible keyboard navigation
 * - Visual feedback for checked/unchecked states
 * - Form integration with validation
 * - Responsive design for mobile/desktop
 *
 * COMMON PATTERNS:
 * - Terms and conditions acceptance
 * - Newsletter subscription opt-in
 * - Product filter selections
 * - Account preference settings
 * - Bulk cart item selection
 *
 * EXAMPLES:
 * - <Checkbox checked={acceptedTerms} onChange={handleTermsChange} />
 * - <Checkbox checked={newsletter} onChange={handleNewsletterChange} />
 * - <Checkbox checked={filterActive} onChange={handleFilterChange} />
 */

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onChange, checked, ...props }, ref) => {
    const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
    };

    return (
      <div className="relative inline-block w-4 h-4">
        <input
          ref={ref}
          type="checkbox"
          className={clsx(
            "appearance-none shadow-none outline-none focus:outline-none",
            "border border-primary-border",
            "rounded-none",
            "text-base font-medium text-primary-text",
            "w-full h-full",
            "bg-primary-bg",
            "absolute top-0 left-0 z-10",
            className
          )}
          checked={checked}
          onChange={handleCheck}
          {...props}
        />
        <span
          className={clsx(
            "absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none",
            "z-20",
            {
              "opacity-0": !checked,
              "opacity-100": checked,
            }
          )}
        >
          <Check className="text-primary-text" />
        </span>
      </div>
    );
  }
);
