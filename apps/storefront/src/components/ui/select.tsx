import { ChevronDown } from "@medusajs/icons";
import { clsx } from "clsx";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = ({ className, ...props }: SelectProps) => {
  return (
    <div className="relative">
      <select
        className={clsx(
          "appearance-none shadow-none outline-none focus:outline-none",
          "border border-zinc-200",
          "rounded-none",
          "text-base font-medium text-zinc-900",
          "px-4 py-2 w-full",
          "bg-white",
          "placeholder:text-zinc-600",
          "pr-10",
          className
        )}
        {...props}
      />
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-zinc-900" />
    </div>
  );
};
