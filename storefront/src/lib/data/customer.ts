import { sdk } from "@/lib/sdk"
import {
  getStoredCart,
  removeStoredCart,
} from "@/lib/utils/cart/stored-cart"
import { HttpTypes } from "@medusajs/types"

export const loginCustomer = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ token: string }> => {
  const token = await sdk.auth.login("customer", "emailpass", {
    email,
    password,
  })

  if (typeof token !== "string") {
    throw new Error("Login failed")
  }

  // Transfer anonymous cart to authenticated user
  const cartId = getStoredCart()
  if (cartId && token) {
    await sdk.store.cart.transferCart(cartId, {})
    removeStoredCart()
  }

  return {
    token,
  }
}

export const registerCustomer = async ({
  email,
  password,
  first_name,
  last_name,
}: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}): Promise<{ customer: HttpTypes.StoreCustomer; token: string }> => {
  const customerForm = {
    email,
    password,
    first_name,
    last_name,
  }

  // Step 1: Register via auth
  await sdk.auth.register("customer", "emailpass", {
    email: customerForm.email,
    password: password,
  })

  // Step 2: Create customer record (without password)
  const { customer: createdCustomer } = await sdk.store.customer.create(
    {
      first_name,
      last_name,
      email,
    },
  )

  // Step 3: Login to get proper session token
  const { token } = await loginCustomer({
    email: customerForm.email,
    password: password,
  })

  return { customer: createdCustomer, token }
}

export const retrieveCustomer = async ({
  fields,
}: {
  fields?: string;
}): Promise<HttpTypes.StoreCustomer | null> => {
  const response = await sdk.store.customer.retrieve({ fields })
  return response.customer
}

export const logoutCustomer = async (): Promise<void> => {
  await sdk.auth.logout()
}

export const updateCustomer = async ({
  updates,
}: {
  updates: HttpTypes.StoreUpdateCustomer;
}): Promise<HttpTypes.StoreCustomer> => {
  const { customer } = await sdk.store.customer.update(updates)

  return customer
}

export const createCustomerAddress = async ({
  address,
}: {
  address: HttpTypes.StoreCreateCustomerAddress;
}): Promise<HttpTypes.StoreCustomer> => {
  const { customer } = await sdk.store.customer.createAddress(address)
  return customer
}

export const updateCustomerAddress = async ({
  address_id,
  address,
}: {
  address_id: string;
  address: HttpTypes.StoreUpdateCustomerAddress;
}): Promise<HttpTypes.StoreCustomer> => {
  const { customer } = await sdk.store.customer.updateAddress(
    address_id,
    address
  )
  return customer
}

export const deleteCustomerAddress = async ({
  address_id,
}: {
  address_id: string;
}): Promise<HttpTypes.StoreCustomer | undefined> => {
  const { parent: customer } = await sdk.store.customer.deleteAddress(address_id)

  return customer
}