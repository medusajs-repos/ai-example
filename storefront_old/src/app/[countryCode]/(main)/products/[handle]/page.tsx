import { retrieveCustomer } from "@lib/data/customer" // Import customer retrieval function
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"

// INSTRUCTIONS:
// - Fetches the logged-in customer using `retrieveCustomer`.
// - Passes the `customer` data to the `ProductTemplate`.

type Props = {
  params: { countryCode: string; handle: string } // Changed params to be direct object, not Promise
}

// generateStaticParams remains the same
export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    // Fetching a limited number of product handles for static generation
    const products = await listProducts({
      countryCode: "us", // Use a default country for handle fetching
      queryParams: { fields: "handle", limit: 100 }, // Limit the number fetched
    }).then(({ response }) => response.products)

    return countryCodes
      .map((countryCode) =>
        products.map((product) => ({
          countryCode,
          handle: product.handle,
        }))
      )
      .flat()
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

// generateMetadata remains the same
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle, countryCode } = params
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | Medusa Store`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Medusa Store`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  // Fetch product and customer data in parallel
  const [pricedProduct, customer] = await Promise.all([
    listProducts({
      countryCode: params.countryCode,
      queryParams: { handle: params.handle },
    }).then(({ response }) => response.products[0]),
    retrieveCustomer(), // Fetch the logged-in customer
  ])

  if (!pricedProduct) {
    notFound()
  }

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={params.countryCode}
      customer={customer} // Pass customer data to the template
    />
  )
}
