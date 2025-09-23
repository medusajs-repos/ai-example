import { useLoaderData } from "@tanstack/react-router"
import ProductListing from "@/components/product/product-listing"

const Category = () => {
  const {
    category,
    region
  } = useLoaderData({
    from: "/$countryCode/categories/$handle",
  })

  const categoryDisplayName =
    category?.name ||
    "Category"

  return (
    <ProductListing 
      region={region} 
      title={categoryDisplayName} 
      queryParams={{
        category_id: category?.id,
      }}
    />
  )
}

export default Category
