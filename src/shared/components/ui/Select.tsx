import React from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  options: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  leftIcon,
  options,
  className = "",
  ...props
}) => {
  return (
    <div className="font-mono text-xs w-full space-y-1 select-none">
      {label && (
        <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
          {label}
        </label>
      )}

      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none z-10">
            {leftIcon}
          </div>
        )}

        <select
          className={`w-full py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all appearance-none cursor-pointer font-mono ${
            leftIcon ? "pl-9" : "px-3.5"
          } pr-8 ${
            error ? "border-red-600 ring-1 ring-red-600" : ""
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-zinc-950 text-zinc-200 py-1"
            >
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom Terminal Arrow Indicator */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none text-[10px]">
          ▼
        </div>
      </div>

      {error && (
        <span className="text-[10px] text-red-500 font-semibold block">
          {error}
        </span>
      )}
    </div>
  );
};

export default Select;
