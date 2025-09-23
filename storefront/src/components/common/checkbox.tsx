import { forwardRef } from "react"

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          ref={ref}
          className={`
            w-4 h-4 text-ui-fg-interactive border-ui-border-base rounded
            focus:ring-ui-border-interactive focus:ring-2
            ${className || ""}
          `}
          {...props}
        />
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

Checkbox.displayName = "Checkbox"

export default Checkbox