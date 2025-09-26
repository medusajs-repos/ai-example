import { useLoaderData } from "@tanstack/react-router"
import OrderDetails from "@/components/order/order-details"

const OrderConfirmationPage = () => {
  const { order } = useLoaderData({
    from: "/$countryCode/order/$orderId/confirmed"
  })

  return (
    <div className="content-container py-12 max-w-2xl mx-auto gap-8 flex flex-col">
      <div className="flex flex-col gap-2">
        <h1 className="text-primary-text txt-xlarge">Order Confirmation</h1>
        <p className="txt-medium text-secondary-text">
          Thank you for your order! You will receive an email with your order details.
        </p>
      </div>
      <OrderDetails order={order} />
    </div>
  )
}

export default OrderConfirmationPage
