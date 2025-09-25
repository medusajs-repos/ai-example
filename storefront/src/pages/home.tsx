import Hero from "@/components/layout/hero"
import { lazy, Suspense } from "react"
import Loading from "@/components/common/loading"

const FeaturedProducts = lazy(() => import("@/components/product/featured-products"))

const Home = () => {
  return (
    <>
      <Hero />
      <div className="lg:min-h-[50vh]">
        <Suspense fallback={<Loading />}>
          <FeaturedProducts />
        </Suspense>
      </div>
    </>
  )
}

export default Home
