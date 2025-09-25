export const formatOrderId = (orderId: string) => {
  return `#${orderId.padStart(6, "0")}`
}