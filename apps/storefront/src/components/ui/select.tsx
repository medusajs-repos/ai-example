import { ChevronDown } from "@medusajs/icons";
import { clsx } from "clsx";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = ({ className, ...props }: SelectProps) => {
  return (
    <div className="relative">
      <select
        className={clsx(
          "appearance-none shadow-none outline-none focus:outline-none",
          "border border-primary-border",
          "rounded-none",
          "text-base font-medium text-primary-text",
          "px-4 py-2 w-full",
          "bg-primary-bg",
          "placeholder:text-secondary-text",
          "pr-10",
          className
        )}
        {...props}
      />
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-primary-text" />
    </div>
  );
};
