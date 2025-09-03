import { HttpTypes } from "@medusajs/types"

interface CountrySelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  region?: HttpTypes.StoreRegion | null
}

const CountrySelect = ({ 
  className, 
  label = "Country", 
  region, 
  ...props 
}: CountrySelectProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={props.id || props.name}
        className="text-ui-fg-base txt-medium-regular"
      >
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        className={`
          w-full px-3 py-2 border border-ui-border-base rounded
          focus:outline-none focus:border-ui-border-interactive
          disabled:bg-ui-bg-disabled disabled:text-ui-fg-disabled
          ${className || ''}
        `}
        {...props}
      >
        <option value="">Select a country</option>
        {region?.countries?.map((country) => (
          <option key={country.iso_2} value={country.iso_2}>
            {country.display_name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CountrySelect