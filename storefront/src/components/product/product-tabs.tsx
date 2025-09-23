import { HttpTypes } from "@medusajs/types"
import { useState } from "react"
import { clx } from "@medusajs/ui"
import ProductShippingInfo from "./product-shipping-info"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<string>("details")

  const tabs = [
    {
      id: "details",
      label: "Details",
      component: <ProductInfoTab product={product} />,
    },
    {
      id: "shipping",
      label: "Shipping",
      component: <ProductShippingInfo product={product} />,
    },
  ]

  return (
    <div className="w-full">
      {/* Minimal tab headers */}
      <div className="flex border-b border-ui-border-base">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={clx(
              "px-4 py-3 txt-small font-medium transition-colors relative",
              {
                "text-ui-fg-base": activeTab === tab.id,
                "text-ui-fg-muted hover:text-ui-fg-subtle": activeTab !== tab.id,
              }
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ui-fg-base" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-6">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>
    </div>
  )
}

const ProductInfoTab = ({ product }: { product: HttpTypes.StoreProduct }) => {
  const details = [
    { label: "Material", value: product.material },
    { label: "Origin", value: product.origin_country },
    { label: "Type", value: product.type?.value },
    { label: "Weight", value: product.weight ? `${product.weight}g` : null },
    { 
      label: "Dimensions", 
      value: product.length && product.width && product.height 
        ? `${product.length}×${product.width}×${product.height}` 
        : null 
    },
  ].filter(item => item.value) // Only show items that have values

  if (details.length === 0) {
    return (
      <div className="text-ui-fg-subtle txt-small">
        No additional product details available.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {details.map((detail, index) => (
        <div key={index} className="flex justify-between items-center py-1">
          <span className="text-ui-fg-muted txt-small">{detail.label}</span>
          <span className="text-ui-fg-base txt-small font-medium">{detail.value}</span>
        </div>
      ))}
    </div>
  )
}

export default ProductTabs