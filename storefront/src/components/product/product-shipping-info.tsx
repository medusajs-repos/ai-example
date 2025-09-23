const ProductShippingInfo = () => {
  const policies = [
    { label: "Delivery", value: "3-5 business days" },
    { label: "Returns", value: "30 days free returns" },
    { label: "Exchanges", value: "Size exchanges available" },
  ]

  return (
    <div className="space-y-3">
      {policies.map((policy, index) => (
        <div key={index} className="flex justify-between items-center py-1">
          <span className="text-ui-fg-muted txt-small">{policy.label}</span>
          <span className="text-ui-fg-base txt-small font-medium">{policy.value}</span>
        </div>
      ))}
      
      <div className="pt-4 mt-6 border-t border-ui-border-base">
        <p className="text-ui-fg-subtle txt-small">
          Questions about shipping or returns? <a href="/contact" className="text-ui-fg-interactive hover:underline">Contact us</a>
        </p>
      </div>
    </div>
  )
}

export default ProductShippingInfo