"use client"

import { Star } from "@medusajs/icons"
import { clx } from "@medusajs/ui"

// INSTRUCTIONS:
// - A simple component to display a star rating (read-only).
// - Takes a rating number (0-5) and optional size/color.

type StarRatingProps = {
  rating: number
  size?: number
  className?: string
}

const StarRating = ({ rating, size = 16, className }: StarRatingProps) => {
  const fullStars = Math.floor(rating)
  const halfStar = rating % 1 >= 0.5 // Decide if you want half-star logic
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

  return (
    <div className={clx("flex items-center gap-x-1", className)}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          className="text-ui-tag-orange-icon"
          size={size}
          fill="currentColor"
        />
      ))}
      {/* Optional: Add half-star rendering logic here if desired */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          className="text-ui-fg-muted"
          size={size}
          fill="currentColor"
        />
      ))}
    </div>
  )
}

export default StarRating
