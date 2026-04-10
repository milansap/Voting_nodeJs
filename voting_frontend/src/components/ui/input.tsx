import * as React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-[#D1D5DB] dark:border-[#4B5563] bg-white dark:bg-[#111827] px-3 py-2 text-sm text-[#111827] dark:text-white placeholder:text-[#9CA3AF] dark:placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#059669] dark:focus:ring-[#10B981] focus:border-transparent dark:focus:border-[#10B981] disabled:cursor-not-allowed disabled:opacity-50 ${
        className || ""
      }`}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = "Input"

export { Input }
