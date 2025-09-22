import { HttpTypes } from "@medusajs/types";
import { Heading, Text } from "@medusajs/ui";
import LineItemPrice from "../cart/line-item-price";
import { Price } from "../common/price";

interface CheckoutSummaryProps {
  cart: HttpTypes.StoreCart;
}

const CheckoutSummary = ({ cart }: CheckoutSummaryProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-ui-border-base h-fit sticky top-6">
      <Heading level="h3" className="mb-6">
        Order Summary
      </Heading>
      
      <div className="space-y-4 mb-6">
        {cart.items?.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="w-16 h-16 bg-ui-bg-subtle rounded-lg overflow-hidden">
              {item.thumbnail ? (
                <img
                  src={item.thumbnail || ''}
                  alt={item.product?.title || 'Product'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-ui-fg-subtle txt-xsmall">
                  No image
                </div>
              )}
            </div>
            <div className="flex-1">
              <Text className="txt-medium-plus">
                {item.product?.title}
              </Text>
              <Text className="text-ui-fg-subtle txt-small">
                Qty: {item.quantity}
              </Text>
            </div>
            <LineItemPrice
              item={item}
              currencyCode={cart.currency_code}
              className="txt-small"
            />
          </div>
        ))}
      </div>

      <div className="border-t border-ui-border-base pt-4 space-y-2">
        <div className="flex justify-between">
          <Text>Subtotal</Text>
          <Price
            price={cart.subtotal}
            currencyCode={cart.currency_code}
            textClassName="txt-medium"
          />
        </div>
        {cart.shipping_total > 0 && (
          <div className="flex justify-between">
            <Text>Shipping</Text>
            <Price
              price={cart.shipping_total}
              currencyCode={cart.currency_code}
              textClassName="txt-medium"
            />
          </div>
        )}
        <div className="flex justify-between txt-large-plus pt-2 border-t border-ui-border-base">
          <Text>Total</Text>
          <Price
            price={cart.total}
            currencyCode={cart.currency_code}
            textClassName="txt-medium"
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
