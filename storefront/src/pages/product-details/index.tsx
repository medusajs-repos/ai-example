import { lazy, Suspense } from "react";
import { useLoaderData } from "@tanstack/react-router";
import { Loading } from "@/components/common";
import ProductDetailsLoading from "./loading";

// Dynamic imports for heavy components
const ErrorBoundary = lazy(() => import("@/components/error-boundary"));
const ImageGallery = lazy(() => import("@/components/common/image-gallery"));
const ProductActions = lazy(() => import("@/components/product/product-actions"));
const ProductInfo = lazy(() => import("@/components/product/product-info"));
const ProductTabs = lazy(() => import("@/components/product/product-tabs"));
const RelatedProducts = lazy(() => import("@/components/product/related-products"));

const ProductDetails = () => {
  const { product, region: defaultRegion, handle } = useLoaderData({
    from: "/$countryCode/products/$handle"
  });

  if (!handle) {
    return (
      <div className="content-container py-8">
        <div className="text-center text-red-600">
          <p className="txt-xlarge mb-4">Invalid product URL</p>
          <a href="/store" className="text-blue-600 hover:underline">
            Return to store
          </a>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="content-container py-8">
        <div className="text-center text-red-600">
          <p className="txt-xlarge mb-4">Product not found</p>
          <a href="/store" className="text-blue-600 hover:underline">
            Return to store
          </a>
        </div>
      </div>
    );
  }

  if (!defaultRegion) {
    return (
      <div className="content-container py-8">
        <div className="text-center text-red-600">
          No regions available. Please check your Medusa backend connection.
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<ProductDetailsLoading />}>
      <ErrorBoundary>
        {/* Original three-column layout */}
        <div
          className="content-container flex flex-col lg:flex-row gap-6 py-6 relative"
          data-testid="product-container"
        >
          {/* Left Column - Product Info & Details */}
          <div className="flex-1 flex flex-col gap-y-6">
            <ErrorBoundary fallback={<div className="text-ui-fg-muted">Failed to load product info</div>}>
              <Suspense fallback={<Loading />}>
                <ProductInfo product={product} />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback={<div className="text-ui-fg-muted">Failed to load product details</div>}>
              <Suspense fallback={<Loading />}>
                <ProductTabs product={product} />
              </Suspense>
            </ErrorBoundary>
          </div>

          {/* Center Column - Image Gallery */}
          <div className="flex-[2]">
            <ErrorBoundary
              fallback={
                <div className="aspect-[29/34] w-full bg-ui-bg-subtle flex items-center justify-center">
                  <span className="text-ui-fg-muted">Failed to load images</span>
                </div>
              }
            >
              <Suspense fallback={
                <div className="aspect-[29/34] w-full bg-ui-bg-subtle flex items-center justify-center">
                  <Loading height="h-8" width="w-8" />
                </div>
              }>
                <ImageGallery images={product?.images || []} />
              </Suspense>
            </ErrorBoundary>
          </div>

          {/* Right Column - Actions & CTA */}
          <div className="flex-1 flex flex-col gap-y-6">
            <ErrorBoundary
              fallback={
                <div className="text-ui-fg-muted">
                  Failed to load product actions
                </div>
              }
            >
              <Suspense fallback={<Loading />}>
                <ProductActions handle={product.handle} region={defaultRegion} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>

        {/* Related Products Section */}
        <div
          className="content-container my-16 small:my-32"
          data-testid="related-products-container"
        >
          <ErrorBoundary
            fallback={
              <div className="text-center text-ui-fg-muted">
                Failed to load related products
              </div>
            }
          >
            <RelatedProducts product={product} region={defaultRegion} />
          </ErrorBoundary>
        </div>
      </ErrorBoundary>
    </Suspense>
  );
};

export default ProductDetails;
