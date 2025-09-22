import Hero from "@/components/layout/hero";
import { lazy } from "react";

const FeaturedProducts = lazy(() => import("@/components/product/featured-products"));

const Home = () => {
  return (
    <>
      <Hero />
      <FeaturedProducts />
    </>
  );
};

export default Home;
