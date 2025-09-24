const CART_KEY = "medusa_cart"

export const getStoredCart = () => {
  return localStorage.getItem(CART_KEY) || undefined
}

export const setStoredCart = (cart: string) => {
  localStorage.setItem(CART_KEY, cart)
}

export const removeStoredCart = () => {
  localStorage.removeItem(CART_KEY)
}