import { useLoaderData } from "@tanstack/react-router"
import ProductListing from "@/components/product/product-listing"

const Store = () => {
  const { region: defaultRegion } = useLoaderData({
    from: "/$countryCode/store"
  })

  return <ProductListing region={defaultRegion} title="All Products" />
}

export default Store
