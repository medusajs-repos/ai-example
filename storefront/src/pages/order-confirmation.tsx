import { useLoaderData } from "@tanstack/react-router";
import { Heading } from "@medusajs/ui";
import OrderDetails from "@/components/order/order-details";

const OrderConfirmationPage = () => {
  const { order } = useLoaderData({
    from: "/$countryCode/order/$orderId/confirmed"
  });

  return (
    <div className="content-container py-12 max-w-2xl mx-auto">
      <Heading level="h1" className="mb-8">Order Confirmation</Heading>
      <OrderDetails order={order} />
    </div>
  )
};

export default OrderConfirmationPage;
