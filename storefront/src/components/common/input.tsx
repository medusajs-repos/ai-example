import { clx } from "@medusajs/ui"

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = ({
  className,
  ...props
}: InputProps) => {
  return (
    <input
      className={clx(
        "appearance-none shadow-none outline-none focus:outline-none",
        "border border-primary-border",
        "rounded-none",
        "txt-medium text-primary-text",
        "px-4 py-2 w-full",
        "bg-primary-bg",
        "placeholder:text-secondary-text",
        className
      )}
      {...props}
    />
  )
}