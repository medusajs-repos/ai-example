import { Link, useLocation } from "@tanstack/react-router"
import ProductCard from "@/components/product/product-card"
import { useLatestProducts } from "@/lib/hooks/static/use-products"
import { getCountryCodeFromPath } from "@/lib/utils/regions/regions"
import { useRegion } from "@/lib/hooks/static/use-region"
import Loading from "@/components/common/loading"
import { Button } from "@/components/common/button"
import { ChevronRight } from "@medusajs/icons"

const FeaturedProducts = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const { data: region } = useRegion({ country_code: countryCode || "" })
  const { data: latestProducts, isLoading } = useLatestProducts({
    region_id: region?.id,
  })

  if (!latestProducts?.products.length && !isLoading) {
    return <></>
  }

  return (
    <section className="py-20 bg-primary-bg mb-16">
      <div className="content-container">
        <div className="text-center mb-16">
          <h2 className="txt-xlarge-plus text-primary-text mb-4">
            Latest Products
          </h2>
          <p className="txt-large text-secondary-text max-w-2xl mx-auto">
            Discover our newest arrivals, carefully curated just for you
          </p>
        </div>
        {isLoading && <Loading rows={4} />}
        <div className="grid grid-cols-1 small:grid-cols-2 lg:grid-cols-4 gap-8">
          {latestProducts?.products.map((product) => (
            <div
              key={product.id}
              className="transform transition-transform duration-300"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to={`/${countryCode}/store` as any}>
            <Button variant="primary">
              View All Products
              <ChevronRight />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
