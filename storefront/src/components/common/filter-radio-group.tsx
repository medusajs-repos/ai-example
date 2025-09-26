import { EllipseMiniSolid } from "@medusajs/icons"
import { clx } from "@medusajs/ui"

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: any
  onChange: (value: string) => void
  "data-testid"?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  onChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className="flex gap-x-3 flex-col gap-y-3">
      <span className="txt-xsmall font-medium text-ui-fg-subtle">{title}</span>
      <div data-testid={dataTestId} className="flex flex-col gap-y-1">
        {items?.map((i) => (
          <div
            key={i.value}
            className={clx("flex gap-x-2 items-center", {
              "ml-[-23px]": i.value === value,
            })}
          >
            {i.value === value && <EllipseMiniSolid />}
            <label
              htmlFor={i.value}
              className={clx(
                "txt-small hover:cursor-pointer",
                {
                  "text-primary-text font-medium": i.value === value,
                  "text-secondary-text": i.value !== value,
                }
              )}
              data-testid="radio-label"
              data-active={i.value === value}
            >
              {i.label}
            </label>
            <input
              checked={i.value === value}
              className="hidden peer"
              id={i.value}
              value={i.value}
              onChange={() => onChange(i.value)}
              type="radio"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default FilterRadioGroup