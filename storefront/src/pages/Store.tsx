import { useLoaderData } from "@tanstack/react-router";
import ProductListing from "../components/product/product-listing";

const Store = () => {
  const { region: defaultRegion, products } = useLoaderData({
    from: "/$countryCode/store"
  });

  return <ProductListing products={products} region={defaultRegion} title="All Products" />
};

export default Store;
