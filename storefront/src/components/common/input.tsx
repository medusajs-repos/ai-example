import { forwardRef } from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="text-ui-fg-base txt-medium"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-3 py-2 border border-ui-border-base rounded
            focus:outline-none focus:border-ui-border-interactive
            disabled:bg-ui-bg-disabled disabled:text-ui-fg-disabled
            ${error ? "border-red-500" : ""}
            ${className || ""}
          `}
          {...props}
        />
        {error && (
          <span className="text-red-500 txt-small">{error}</span>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input