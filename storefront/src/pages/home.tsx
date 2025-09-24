import Hero from "@/components/layout/hero"
import { lazy, Suspense } from "react"
import Loading from "@/components/common/loading"

const FeaturedProducts = lazy(() => import("@/components/product/featured-products"))

const Home = () => {
  return (
    <>
      <Hero />
      <Suspense fallback={<Loading />}>
        <FeaturedProducts />
      </Suspense>
    </>
  )
}

export default Home
