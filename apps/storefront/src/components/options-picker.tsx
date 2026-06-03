import { useQuery } from "@tanstack/react-query"
import { clsx } from "clsx"
import { useMemo, useState } from "react"
import { sdk } from "@/lib/utils/sdk"
import { HttpTypes } from "@medusajs/types"

type StoreProductOption = HttpTypes.StoreProductOption & {
  is_exclusive?: boolean
}

type OptionsPickerProps = {
  selectedValueIds: string[]
  onChange: (next: string[]) => void
  className?: string
}

type ProductOptionsResponse = {
  product_options: StoreProductOption[]
}

const fetchGlobalProductOptions = async () => {
  return sdk.client.fetch<ProductOptionsResponse>("/store/product-options", {
    method: "GET",
    query: {
      is_exclusive: false,
      fields: "*values",
      limit: 100,
    },
  })
}

/**
 * Sidebar widget that lets shoppers narrow the global product list by the
 * values of any non-exclusive (i.e. shared/global) product option.
 *
 * Render this only on the global all-products route; categories and
 * collections opt out via `hideOptionsPicker` on the page template.
 */
export const OptionsPicker = ({
  selectedValueIds,
  onChange,
  className,
}: OptionsPickerProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["product-options", "global"],
    queryFn: fetchGlobalProductOptions,
  })

  const options = data?.product_options ?? []
  const selectedSet = useMemo(() => new Set(selectedValueIds), [selectedValueIds])

  const toggle = (valueId: string) => {
    const next = new Set(selectedSet)
    if (next.has(valueId)) {
      next.delete(valueId)
    } else {
      next.add(valueId)
    }
    onChange(Array.from(next))
  }

  if (isLoading) {
    return (
      <div className={clsx("text-sm text-zinc-500", className)}>
        Loading filters...
      </div>
    )
  }

  if (!options.length) {
    return null
  }

  return (
    <div className={clsx("flex flex-col gap-4", className)}>
      {options.map((option) => (
        <OptionGroup
          key={option.id}
          option={option}
          selectedSet={selectedSet}
          onToggle={toggle}
        />
      ))}
    </div>
  )
}

const OptionGroup = ({
  option,
  selectedSet,
  onToggle,
}: {
  option: StoreProductOption
  selectedSet: Set<string>
  onToggle: (valueId: string) => void
}) => {
  const [open, setOpen] = useState(true)
  const values = option.values ?? []

  return (
    <div className="border-b border-zinc-200 pb-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-2 text-left text-sm font-medium text-zinc-900"
        aria-expanded={open}
      >
        <span>{option.title}</span>
        <span aria-hidden className="text-zinc-500">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="mt-2 flex flex-wrap gap-2">
          {values.map((value) => {
            const isSelected = selectedSet.has(value.id)
            return (
              <button
                key={value.id}
                type="button"
                onClick={() => onToggle(value.id)}
                aria-pressed={isSelected}
                className={clsx(
                  "inline-flex items-center px-3 py-1 text-sm border",
                  "rounded-none cursor-pointer transition-colors",
                  isSelected
                    ? "bg-zinc-800 text-white border-zinc-800"
                    : "bg-white text-zinc-900 border-zinc-300 hover:bg-zinc-100"
                )}
              >
                {value.value}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
