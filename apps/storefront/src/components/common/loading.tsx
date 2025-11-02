import { clsx } from "clsx";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use during data loading states in storefront
 * - Checkout pages: while processing payment information
 * - Search results: while filtering and searching products
 * - Account pages: while loading user data and order history
 *
 * ECOMMERCE CONTEXT:
 * - Essential for improving perceived performance during API calls
 * - Prevents layout shifts while content loads
 * - Provides visual feedback during slow network requests
 * - Critical for user experience during checkout flow
 * - Used in product discovery and browsing
 * - Important for account management and order history
 *
 * EXAMPLES:
 * - <Loading rows={3} columns={4} /> // Product grid
 * - <Loading rows={2} columns={1} /> // Product card
 * - <Loading rows={1} columns={1} /> // Single item
 *
 * @example
 * // Basic skeleton with 3 rows and 1 column
 * <Loading />
 *
 * @example
 * // Custom number of rows
 * <Loading rows={5} />
 *
 * @example
 * // Custom number of columns
 * <Loading columns={3} />
 *
 * @example
 * // Custom height and width
 * <Loading rows={2} columns={2} height="h-6" width="w-3/4" />
 */
interface LoadingProps {
  /**
   * Number of skeleton rows to display
   */
  rows?: number;
  /**
   * Number of skeleton columns to display
   */
  columns?: number;
  /**
   * Custom height class for each skeleton row
   */
  height?: string;
  /**
   * Custom width class for each skeleton row
   */
  width?: string;
  /**
   * Custom className for styling
   */
  className?: string;
}

const Loading = ({
  rows = 3,
  columns = 1,
  height = "h-4",
  width = "w-full",
  className,
}: LoadingProps) => {
  return (
    <div className={clsx("space-y-2 p-2", className)}>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {Array.from({ length: columns }, (_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={clsx(
                "animate-pulse bg-loading-bg flex-1",
                height,
                width
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Loading;
