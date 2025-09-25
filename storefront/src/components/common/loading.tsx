import { clx } from "@medusajs/ui"

/**
 * A simple skeleton loading component that shows rows of pulsing divs
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
    <div className={clx("space-y-2 p-2", className)}>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {Array.from({ length: columns }, (_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={clx(
                "animate-pulse rounded bg-loading-bg flex-1",
                height,
                width
              )}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Loading
