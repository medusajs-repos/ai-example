import AccountLayout from "@components/account/AccountLayout";
import OrderDetailsTemplate from "@components/account/OrderDetailsTemplate";
import { useCustomer } from "@lib/hooks/useAuth";
import { useOrder } from "@lib/hooks/useOrders";
import { Navigate, useParams } from "@tanstack/react-router";

const OrderDetails = () => {
  const { data: customer, isLoading: isLoadingCustomer } = useCustomer();
  const params = useParams({ strict: false });

  const orderId = params.id || params.orderId;
  const { data: order, isLoading: isLoadingOrder, error } = useOrder(orderId);

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
            <div className="text-sm text-ui-fg-subtle">Order ID: {orderId}</div>
            {error && (
              <div className="text-sm text-red-500">Error: {String(error)}</div>
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
