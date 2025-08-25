import { HttpTypes } from "@medusajs/types"

const compareAddresses = (
  address1: HttpTypes.StoreCartAddress,
  address2: HttpTypes.StoreCartAddress
): boolean => {
  if (!address1 || !address2) {
    return false
  }

  const fieldsToCompare = [
    "first_name",
    "last_name",
    "address_1",
    "address_2",
    "city",
    "country_code",
    "postal_code",
    "province",
    "company",
    "phone",
  ] as const

  return fieldsToCompare.every(
    (field) => address1[field] === address2[field]
  )
}

export default compareAddresses