import { clx } from "@medusajs/ui"

/**
 * A simple skeleton loading component that shows rows of pulsing divs
 * 
 * @example
 * // Basic skeleton with 3 rows
 * <Loading />
 * 
 * @example
 * // Custom number of rows
 * <Loading rows={5} />
 * 
 * @example
 * // Custom height and width
 * <Loading rows={2} height="h-6" width="w-3/4" />
 */
interface LoadingProps {
  /**
   * Number of skeleton rows to display
   */
  rows?: number;
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
  height = "h-4",
  width = "w-full",
  className,
}: LoadingProps) => {
  return (
    <div className={clx("space-y-2 p-2", className)}>
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className={clx(
            "animate-pulse rounded bg-ui-bg-switch-off",
            height,
            width
          )}
        />
      ))}
    </div>
  )
}

export default Loading
