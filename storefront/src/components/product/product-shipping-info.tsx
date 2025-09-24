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
          <span className="text-secondary-text txt-small">{policy.label}</span>
          <span className="text-primary-text txt-small-plus">{policy.value}</span>
        </div>
      ))}
      
      <div className="pt-4 mt-6 border-t border-secondary-border">
        <p className="text-secondary-text txt-small">
          Questions about shipping or returns? <a href="/contact" className="text-accent-text hover:underline">Contact us</a>
        </p>
      </div>
    </div>
  )
}

export default ProductShippingInfo