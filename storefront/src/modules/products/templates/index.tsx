import React, { Suspense } from "react"

import ImageGallery from "../components/image-gallery"
import ProductActions from "../components/product-actions"
import ProductOnboardingCta from "../components/product-onboarding-cta"
import ProductTabs from "../components/product-tabs"
import RelatedProducts from "../components/related-products"
import ProductInfo from "./product-info"
import SkeletonRelatedProducts from "../../skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"

// INSTRUCTIONS:
// - Added `customer` prop to `ProductTemplateProps`.
// - Passed the `customer` prop down to `ProductTabs`.

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  customer: Omit<HttpTypes.StoreCustomer, "password_hash"> | null // Add customer prop
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  customer, // Destructure customer prop
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <div
        className="content-container flex flex-col small:flex-row small:items-start py-6 relative"
        data-testid="product-container"
      >
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-6">
          <ProductInfo product={product} />
          {/* Pass customer to ProductTabs */}
          <ProductTabs product={product} customer={customer} />
        </div>
        <div className="block w-full relative">
          <ImageGallery images={product?.images || []} />
        </div>
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-12">
          <ProductOnboardingCta />
          <Suspense
            fallback={
              <ProductActions
                disabled={true}
                product={product}
                region={region}
              />
            }
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>
        </div>
      </div>
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
