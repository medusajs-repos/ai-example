import OrderDetails from "@/components/order/order-details";
import { useLoaderData } from "@tanstack/react-router";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for order confirmation pages in the storefront
 * - Order completion: final order confirmation and details
 * - Order success: order placement confirmation
 * - Mobile commerce: mobile-optimized order confirmation
 * - Customer experience: order completion and satisfaction
 * - Order tracking: order details and next steps
 *
 * ECOMMERCE CONTEXT:
 * - Critical for order completion and customer satisfaction
 * - Essential for order confirmation and trust
 * - Important for customer experience and retention
 * - Required for order details and tracking
 * - Used in order fulfillment and communication
 * - Important for mobile commerce experience
 *
 * ORDER CONFIRMATION FEATURES:
 * - Order confirmation messaging and details
 * - Complete order information display
 * - Order tracking and next steps
 * - Professional order presentation
 * - Responsive design for mobile/desktop
 * - Clear order completion communication
 *
 * PAGE STRUCTURE:
 * - Order confirmation header and messaging
 * - Complete order details display
 * - Order tracking and next steps
 * - Professional order presentation
 *
 * COMMON PATTERNS:
 * - Order confirmation pages
 * - Mobile order confirmation
 * - Order completion pages
 * - Order success pages
 * - Order tracking pages
 *
 * EXAMPLES:
 * - Order confirmation page
 * - Mobile order confirmation
 * - Order completion page
 * - Order success page
 */
const OrderConfirmationPage = () => {
  const { order } = useLoaderData({
    from: "/$countryCode/order/$orderId/confirmed",
  });

  return (
    <div className="content-container py-12 max-w-2xl mx-auto gap-8 flex flex-col">
      <div className="flex flex-col gap-2">
        <h1 className="text-primary-text text-xlarge">Order Confirmation</h1>
        <p className="text-base font-medium text-secondary-text">
          Thank you for your order! You will receive an email with your order
          details.
        </p>
      </div>
      <OrderDetails order={order} />
    </div>
  );
};

export default OrderConfirmationPage;
