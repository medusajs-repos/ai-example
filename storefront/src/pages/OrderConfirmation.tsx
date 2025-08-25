import { getCountryCodeFromPath } from "@lib/util/regions";
import { CheckCircleSolid, ShoppingBag } from "@medusajs/icons";
import { Button, Heading, Text } from "@medusajs/ui";
import { Link, useLocation, useParams } from "@tanstack/react-router";

const OrderConfirmation = () => {
  const params = useParams({ strict: false });
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname);
  const baseHref = countryCode ? `/${countryCode}` : "";

  // Get order ID from params - could be from either route pattern
  const orderId = params.orderId;

  return (
    <div className="content-container py-12 max-w-2xl mx-auto">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleSolid className="text-green-500" />
          </div>
          <Heading
            level="h1"
            className="text-3xl font-bold text-ui-fg-base mb-4"
          >
            Order Confirmed!
          </Heading>
          <Text className="text-lg text-ui-fg-subtle mb-6">
            Thank you for your purchase. Your order has been successfully
            placed.
          </Text>
        </div>

        <div className="bg-ui-bg-subtle p-6 rounded-lg mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShoppingBag className="w-5 h-5 text-ui-fg-base" />
            <Text className="font-medium text-ui-fg-base">Order Number</Text>
          </div>
          <Text className="txt-small-plus text-ui-fg-base">#{orderId}</Text>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={`${baseHref}/store`}>
            <Button variant="secondary" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
