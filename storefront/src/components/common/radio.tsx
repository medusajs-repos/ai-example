import { forwardRef } from "react"

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, checked, ...props }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="radio"
            ref={ref}
            checked={checked}
            className="sr-only"
            {...props}
          />
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              checked
                ? "border-ui-fg-interactive bg-ui-fg-interactive"
                : "border-ui-border-base bg-white"
            } ${className || ''}`}
          >
            {checked && (
              <div className="w-2 h-2 bg-white rounded-full"></div>
            )}
          </div>
        </div>
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="text-ui-fg-base txt-medium-regular cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)

Radio.displayName = "Radio"

export default Radio