import { FetchArgs } from "@medusajs/js-sdk"
import { sdk } from "../sdk"

export const sendRequest = async <T = unknown> (
  url: string,
  data: FetchArgs
): Promise<T> => {
  return sdk.client.fetch(url, data)
}