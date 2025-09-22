import Hero from "@/components/hero";
import { lazy } from "react";

const FeaturedProducts = lazy(() => import("@/components/featured-products"));

const Home = () => {
  return (
    <>
      <Hero />
      <FeaturedProducts />
    </>
  );
};

export default Home;
