import CartTotals from "@components/CartTotals";
import { HttpTypes } from "@medusajs/types";
import { Heading } from "@medusajs/ui";

interface CheckoutSummaryProps {
  cart: HttpTypes.StoreCart;
}

const CheckoutSummary = ({ cart }: CheckoutSummaryProps) => {
  return (
    <div className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0">
      <div className="w-full bg-white flex flex-col">
        <div className="border-b border-ui-border-base my-6 small:hidden" />
        <Heading
          level="h2"
          className="flex flex-row txt-xlarge-plus-regular items-baseline"
        >
          In your Cart
        </Heading>
        <div className="border-b border-ui-border-base my-6" />
        <CartTotals cart={cart} />

        {/* Cart Items Preview */}
        <div className="flex flex-col gap-y-4 mt-6">
          {cart.items?.map((item) => (
            <div key={item.id} className="flex items-center gap-x-4">
              <div className="relative w-16 h-16 flex-shrink-0">
                {item.variant?.product?.thumbnail || item.thumbnail ? (
                  <img
                    src={
                      item.variant?.product?.thumbnail || item.thumbnail || ""
                    }
                    alt={item.title}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-ui-bg-subtle rounded flex items-center justify-center">
                    <span className="txt-xsmall text-ui-fg-muted">No image</span>
                  </div>
                )}
                <span className="absolute -top-2 -right-2 bg-ui-fg-base text-white txt-xsmall rounded-full w-5 h-5 flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="txt-medium-regular text-ui-fg-base">
                  {item.title}
                </h3>
                {item.variant && (
                  <p className="txt-smallall-regular text-ui-fg-subtle">
                    {item.variant.title !== "Default" ? item.variant.title : ""}
                  </p>
                )}
              </div>
              <div className="txt-medium-regular text-ui-fg-base">
                {item.total
                  ? `$${item.total.toFixed(2)}`
                  : `$${(
                      ((item.unit_price || 0) * item.quantity) /
                      100
                    ).toFixed(2)}`}
              </div>
            </div>
          ))}
        </div>

        {/* Discount Code Section - Placeholder for now */}
        <div className="my-6">
          <div className="flex flex-col gap-2">
            <label className="txt-smallall-regular text-ui-fg-base">
              Discount code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter discount code"
                className="flex-1 px-3 py-2 border border-ui-border-base rounded focus:outline-none focus:border-ui-border-interactive"
              />
              <button
                type="button"
                className="px-4 py-2 bg-ui-bg-base text-ui-fg-base border border-ui-border-base rounded hover:bg-ui-bg-subtle"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
