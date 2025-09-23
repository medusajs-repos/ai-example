export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") {
    return null
  }

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null
  }
  return null
}

export const setCookie = (
  name: string,
  value: string,
  options: {
    maxAge?: number;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
    path?: string;
  } = {}
) => {
  if (typeof document === "undefined") {
    return
  }

  const {
    maxAge = 60 * 60 * 24 * 7, // 7 days default
    secure = true,
    sameSite = "lax",
    path = "/",
  } = options

  let cookieString = `${name}=${value}; path=${path}; max-age=${maxAge}; samesite=${sameSite}`

  if (secure) {
    cookieString += "; secure"
  }

  document.cookie = cookieString
}

export const removeCookie = (name: string) => {
  if (typeof document === "undefined") {
    return
  }

  // More aggressive cookie removal
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure`
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`
}

export const getCartId = (): string | null => {
  const cartId = getCookie("_medusa_cart_id")

  return cartId
}

export const setCartId = (cartId: string) => {
  setCookie("_medusa_cart_id", cartId, {
    maxAge: 60 * 60 * 24 * 7,
    secure: location.protocol === "https:", // Only secure in production
    sameSite: "lax",
  })
}

export const removeCartId = () => {
  removeCookie("_medusa_cart_id")
}
