import { clx, Button as UiButton } from "@medusajs/ui"

type ButtonProps = React.ComponentProps<typeof UiButton>

export const Button = (props: ButtonProps) => {
  return (
    <UiButton 
      {...props}
      className={clx({
        "bg-button-primary-bg text-button-primary-text hover:bg-button-primary-hover active:bg-button-primary-pressed shadow-button-primary active:shadow-button-primary-pressed": props.variant === "primary",
        "bg-button-secondary-bg text-button-secondary-text hover:bg-button-secondary-hover active:bg-button-secondary-pressed shadow-button-secondary active:shadow-button-secondary-pressed": props.variant === "secondary",
        "bg-button-error-bg text-button-error-text hover:bg-button-error-hover active:bg-button-error-pressed shadow-button-error active:shadow-button-error-pressed": props.variant === "danger",
      }, props.className)}
    />
  )
}