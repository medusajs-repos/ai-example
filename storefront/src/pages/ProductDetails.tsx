import ErrorBoundary from "@components/ErrorBoundary";
import ImageGallery from "@components/ImageGallery";
import ProductActionsClient from "@components/ProductActionsClient";
import ProductInfo from "@components/ProductInfo";
import ProductTabs from "@components/ProductTabs";
import RelatedProducts from "@components/RelatedProducts";
import { useLoaderData } from "@tanstack/react-router";

const ProductDetails = () => {
  // Access the loader data from the route - this works with SSR
  const { product, region: defaultRegion, handle, countryCode } = useLoaderData({
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
    <ErrorBoundary>
      {/* Original three-column layout */}
      <div
        className="content-container flex flex-col lg:flex-row gap-6 py-6 relative"
        data-testid="product-container"
      >
        {/* Left Column - Product Info & Details */}
        <div className="flex-1 flex flex-col gap-y-6">
          <ErrorBoundary fallback={<div className="text-ui-fg-muted">Failed to load product info</div>}>
            <ProductInfo product={product} />
          </ErrorBoundary>
          <ErrorBoundary fallback={<div className="text-ui-fg-muted">Failed to load product details</div>}>
            <ProductTabs product={product} />
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
            <ImageGallery images={product?.images || []} />
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
            <ProductActionsClient product={product} region={defaultRegion} />
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
  );
};

export default ProductDetails;
