import { useLoaderData } from "@tanstack/react-router";
import ProductListing from "@/components/product/product-listing";

const Category = () => {
  const {
    category,
    products,
    region
  } = useLoaderData({
    from: "/$countryCode/categories/$handle",
  });

  const categoryDisplayName =
    category?.name ||
    "Category";

  return (
    <ProductListing products={products} region={region} title={categoryDisplayName} />
  )
};

export default Category;
