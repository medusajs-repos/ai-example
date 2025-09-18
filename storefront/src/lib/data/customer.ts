import { sdk } from "@/lib/config";
import {
  getCartId,
  removeAuthToken,
  removeCartId,
  setAuthToken,
} from "@/lib/utils/cookies";
import { HttpTypes } from "@medusajs/types";

export const loginCustomer = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ token: string }> => {
  const token = (await sdk.auth.login("customer", "emailpass", {
    email,
    password,
  })) as string;

  if (!token) {
    throw new Error("Login failed");
  }

  if (token) {
    setAuthToken(token);
  }

  // Transfer anonymous cart to authenticated user
  const cartId = getCartId();
  if (cartId && token) {
    try {
      await sdk.store.cart.transferCart(cartId, {});
      removeCartId();
    } catch (error) {
      console.warn("Failed to transfer cart:", error);
    }
  }

  return {
    token: token,
  };
};

export const registerCustomer = async ({
  email,
  password,
  firstName,
  lastName,
}: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<{ customer: HttpTypes.StoreCustomer; token: string }> => {
  try {
    const customerForm = {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    };

    // Step 1: Register via auth
    const registrationToken = await sdk.auth.register("customer", "emailpass", {
      email: customerForm.email,
      password: password,
    });

    // Step 2: Create customer record (without password)
    const { customer: createdCustomer } = await sdk.store.customer.create(
      {
        first_name: firstName,
        last_name: lastName,
        email: email,
      },
      {},
      { authorization: `Bearer ${registrationToken}` }
    );

    // Step 3: Login to get proper session token
    const loginToken = (await sdk.auth.login("customer", "emailpass", {
      email: customerForm.email,
      password,
    })) as string;

    // Step 4: Set auth token
    setAuthToken(loginToken);

    // Step 5: Transfer cart
    const cartId = getCartId();
    if (cartId) {
      try {
        const authHeaders = { authorization: `Bearer ${loginToken}` };
        await sdk.store.cart.transferCart(cartId, {}, authHeaders);
        removeCartId();
      } catch (error) {
        console.warn("Failed to transfer cart:", error);
      }
    }

    return { customer: createdCustomer, token: loginToken };
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

export const retrieveCustomer =
  async (): Promise<HttpTypes.StoreCustomer | null> => {
    try {
      const response = await sdk.store.customer.retrieve();
      return response.customer;
    } catch (error) {
      console.error("Failed to retrieve customer:", error);
      removeAuthToken();
      return null;
    }
  };

export const logoutCustomer = async (): Promise<void> => {
  try {
    await sdk.auth.logout();
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    removeAuthToken();
  }
};

export const updateCustomer = async (
  updates: Partial<
    Pick<HttpTypes.StoreCustomer, "first_name" | "last_name" | "phone">
  >
): Promise<HttpTypes.StoreCustomer> => {
  try {
    const response = await sdk.store.customer.update(updates);

    return response.customer;
  } catch (error) {
    console.error("Failed to update customer:", error);
    // If auth fails, remove the token
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      error.status === 401
    ) {
      removeAuthToken();
    }
    throw error;
  }
};
