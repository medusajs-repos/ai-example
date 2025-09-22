import AccountLayout from "@/components/account/account-layout";
import OrderDetailsTemplate from "@/components/account/order-details-template";
import { useCustomer } from "@/lib/hooks/dynamic/use-auth";
import { useOrder } from "@/lib/hooks/static/use-orders";
import { Navigate, useParams } from "@tanstack/react-router";

const OrderDetails = () => {
  const { data: customer, isLoading: isLoadingCustomer } = useCustomer();
  const params = useParams({ strict: false });

  const orderId = params.orderId!
  const { data: order, isLoading: isLoadingOrder, error } = useOrder({ order_id: orderId });

  if (isLoadingCustomer || isLoadingOrder) {
    return (
      <div className="content-container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-ui-fg-muted">
            Loading order details...
          </div>
        </div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!customer) {
    return <Navigate to="/login" />;
  }

  if (!order && !isLoadingOrder) {
    return (
      <div className="content-container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="text-lg text-ui-fg-muted">Order not found</div>
            <div className="txt-small text-ui-fg-subtle">Order ID: {orderId}</div>
            {error && (
              <div className="txt-small text-red-500">Error: {String(error)}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AccountLayout customer={customer}>
      <OrderDetailsTemplate order={order} />
    </AccountLayout>
  );
};

export default OrderDetails;
