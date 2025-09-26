import { ChevronLeft, ChevronRight } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { useState, useCallback } from "react"
import { Button } from "@/components/common/button"

/**
 * AI AGENT USAGE GUIDE:
 * 
 * WHEN TO USE:
 * - Use for displaying product images in the storefront
 * - Product detail pages: show multiple product images with navigation
 * - Product galleries: image browsing with zoom and navigation
 * - Mobile commerce: mobile-optimized image viewing
 * - Product showcases: highlight product features and details
 * - Image carousels: rotating product image displays
 * 
 * ECOMMERCE CONTEXT:
 * - Critical for product visualization and conversion
 * - Essential for product detail and information
 * - Important for user experience and engagement
 * - Required for product comparison and selection
 * - Used in product recommendation systems
 * - Important for mobile commerce experience
 * 
 * GALLERY FEATURES:
 * - Multiple image display with navigation
 * - Previous/next navigation arrows
 * - Smooth transitions between images
 * - Responsive design for mobile/desktop
 * - Lazy loading for performance
 * - Accessibility support for navigation
 * 
 * IMAGE HANDLING:
 * - Supports multiple product images
 * - Handles missing or broken images gracefully
 * - Optimized loading for performance
 * - Responsive image sizing
 * - Aspect ratio maintenance
 * 
 * COMMON PATTERNS:
 * - Product detail image galleries
 * - Mobile product image browsing
 * - Product showcase galleries
 * - Image carousel displays
 * - Product comparison galleries
 * 
 * EXAMPLES:
 * - <ImageGallery images={product.images} />
 * - Product detail page with image gallery
 * - Mobile product image browsing
 * - Product showcase with multiple angles
 */

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  if (images.length === 0) return null

  return (
    <div className="flex items-start relative">
      <div className="flex-1 sm:mx-16 relative">
        <div className="relative aspect-[29/34] w-full overflow-hidden bg-secondary-bg p-0">
          <div 
            className="flex transition-transform duration-300 ease-in-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => {
              return (
                <div
                  key={image.id}
                  className="w-full h-full flex-shrink-0 relative"
                >
                  {!!image.url && (
                    <img
                      src={image.url}
                      className="absolute inset-0 w-full h-full object-cover"
                      alt={`Product image ${index + 1}`}
                      loading={index <= 2 ? "eager" : "lazy"}
                    />
                  )}
                </div>
              )
            })}
          </div>
          
          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <Button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hover:bg-transparent active:bg-transparent cursor-pointer"
                aria-label="Previous image"
                variant="transparent"
                size="fit"
              >
                <ChevronLeft />
              </Button>
              
              <Button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hover:bg-transparent active:bg-transparent cursor-pointer"
                aria-label="Next image"
                variant="transparent"
                size="fit"
              >
                <ChevronRight />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageGallery