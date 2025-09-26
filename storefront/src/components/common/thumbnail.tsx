import { clx } from "@medusajs/ui"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for displaying product images throughout the storefront
 * - Product cards: show product thumbnails in grid layouts
 * - Cart items: display small product images in cart
 * - Order history: show product images in order details
 * - Product galleries: thumbnail navigation in image galleries
 * - Search results: display product images in search listings
 * - Related products: show thumbnails for recommended items
 * 
 * ECOMMERCE CONTEXT:
 * - Essential for product visual identification
 * - Critical for user experience and product discovery
 * - Used in shopping cart and checkout flow
 * - Important for order confirmation and history
 * - Required for product comparison and selection
 * - Used in recommendation systems and cross-selling
 * 
 * FALLBACK HANDLING:
 * - Shows "No image" placeholder when thumbnail is missing
 * - Maintains consistent layout even without images
 * - Provides visual feedback for missing product images
 * 
 * COMMON PATTERNS:
 * - Product card thumbnails (20x20 default size)
 * - Cart item thumbnails (smaller size)
 * - Order line item thumbnails
 * - Product gallery thumbnails
 * - Search result thumbnails
 * 
 * EXAMPLES:
 * - <Thumbnail thumbnail={product.thumbnail} alt={product.title} />
 * - <Thumbnail thumbnail={item.thumbnail} alt={item.name} className="w-16 h-16" />
 * - <Thumbnail thumbnail={null} alt="Product image" />
 */

type ThumbnailProps = {
  thumbnail?: string | null;
  alt: string;
  className?: string;
}

export const Thumbnail = ({ thumbnail, alt, className }: ThumbnailProps) => {
  return (
    <>
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={alt}
          className={clx(
            "w-20 h-20 object-cover bg-secondary-bg",
            className
          )}
        />
      ) : (
        <div className={clx(
          "w-20 h-20 bg-secondary-bg flex items-center justify-center",
          className
        )}>
          <span className="txt-xsmall text-secondary-text">No image</span>
        </div>
      )}
    </>
  )
}