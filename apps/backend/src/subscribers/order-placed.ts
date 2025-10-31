import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";

const ORDER_FIELDS = process.env.ORDER_PLACED_FIELDS?.split(",") || [
  "id",
  "email",
  "display_id",
  "created_at",

  // Customer
  "customer.first_name",

  // Items
  "items.id",
  "items.product_title",
  "items.variant_title",
  "items.quantity",
  "items.total",

  // Shipping address
  "shipping_address.first_name",
  "shipping_address.last_name",
  "shipping_address.address_1",
  "shipping_address.address_2",
  "shipping_address.city",
  "shipping_address.postal_code",
  "shipping_address.country_code",

  // Totals
  "subtotal",
  "shipping_total",
  "discount_total",
  "tax_total",
  "total",
];

type OrderPlacedData = {
  id: string;
};

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<OrderPlacedData>) {
  const query = container.resolve("query");

  const {
    data: [order],
  } = await query.graph({
    entity: "order",
    fields: ORDER_FIELDS,
    filters: {
      id: data.id,
    },
  });

  if (!order) {
    return;
  }

  const notificationModule = container.resolve("notification");

  await notificationModule.createNotifications({
    to: order.email,
    channel: "email",
    template: "medusa-cloud-order-placed",
    data: {
      order,
    },
    content: {
      subject: "Thank you for your order",
    },
  });
}

export const config: SubscriberConfig = {
  event: "order.placed",
};
