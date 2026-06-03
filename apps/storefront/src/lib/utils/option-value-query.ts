/**
 * Utilities for reading/writing the option-value filter from query strings.
 *
 * The picker stores selected product-option-value IDs under
 * `OPTION_VALUE_QUERY_KEY`. Multiple values are encoded as repeated keys
 * (?optionValueIds=a&optionValueIds=b). A comma-separated single value
 * (?optionValueIds=a,b) is also accepted for compatibility.
 */
export const OPTION_VALUE_QUERY_KEY = "optionValueIds"

type SearchParamsRecord = Record<string, string | string[] | undefined>

const dedupe = (values: string[]): string[] =>
  Array.from(new Set(values.filter((v) => v && v.length > 0)))

export const parseOptionValueIds = (
  input: URLSearchParams | SearchParamsRecord | undefined | null,
): string[] => {
  if (!input) return []

  if (input instanceof URLSearchParams) {
    const all = input.getAll(OPTION_VALUE_QUERY_KEY)
    if (all.length > 1) {
      return dedupe(all)
    }
    if (all.length === 1) {
      return dedupe(all[0].split(","))
    }
    return []
  }

  const raw = input[OPTION_VALUE_QUERY_KEY]
  if (Array.isArray(raw)) {
    return dedupe(raw.flatMap((v) => v.split(",")))
  }
  if (typeof raw === "string") {
    return dedupe(raw.split(","))
  }
  return []
}
