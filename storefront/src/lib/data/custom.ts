import { FetchArgs } from "@medusajs/js-sdk"
import { sendRequest } from "./common"

export const sendGetRequest = async<T = unknown> (
  url: string,
  data?: FetchArgs
): Promise<T> => {
  return sendRequest<T>(url, {
    method: "GET",
    ...data
  })
}

export const sendPostRequest = async<T = unknown> (
  url: string,
  data?: FetchArgs
): Promise<T> => {
  return sendRequest<T>(url, {
    method: "POST",
    ...data
  })
}

export const sendDeleteRequest = async<T = unknown> (
  url: string,
  data?: FetchArgs
): Promise<T> => {
  return sendRequest<T>(url, {
    method: "DELETE",
    ...data
  })
}