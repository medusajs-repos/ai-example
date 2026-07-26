import { useNavigate, useSearch } from "@tanstack/react-router"
import { clsx } from "clsx"
import { OptionsPicker } from "@/components/options-picker"
import {
  OPTION_VALUE_QUERY_KEY,
  parseOptionValueIds,
} from "@/lib/utils/option-value-query"

type FilterSidebarProps = {
  className?: string
  /**
   * Hide the global options picker. Defaults to false (i.e. show on global
   * all-products route). Pass true on category/collection routes.
   */
  hideOptionsPicker?: boolean
}

export const FilterSidebar = ({
  className,
  hideOptionsPicker = false,
}: FilterSidebarProps) => {
  const navigate = useNavigate()
  // Read whatever search params exist on the current route; we only care
  // about the option-value key.
  const search = useSearch({ strict: false }) as Record<
    string,
    string | string[] | undefined
  >
  const selectedValueIds = parseOptionValueIds(search)

  const updateFilters = (next: string[]) => {
    const nextValue =
      next.length === 0 ? undefined : next.length === 1 ? next[0] : next

    const currentRaw = search[OPTION_VALUE_QUERY_KEY]
    const currentNormalised = Array.isArray(currentRaw)
      ? currentRaw.length === 1
        ? currentRaw[0]
        : currentRaw
      : currentRaw

    const isSame =
      JSON.stringify(currentNormalised ?? null) ===
      JSON.stringify(nextValue ?? null)

    if (isSame) return

    navigate({
      to: ".",
      search: (prev: Record<string, unknown>) => {
        const { page: _page, ...rest } = prev ?? {}
        return {
          ...rest,
          [OPTION_VALUE_QUERY_KEY]: nextValue,
        }
      },
      replace: false,
    })
  }

  if (hideOptionsPicker) {
    return null
  }

  return (
    <aside className={clsx("flex flex-col gap-6 w-full md:w-56", className)}>
      <div>
        <h2 className="text-sm font-medium text-zinc-900 mb-2">Filters</h2>
        <OptionsPicker
          selectedValueIds={selectedValueIds}
          onChange={updateFilters}
        />
      </div>
    </aside>
  )
}
