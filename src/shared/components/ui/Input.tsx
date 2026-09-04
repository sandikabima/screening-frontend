import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}) => {
  return (
    <div className="font-mono text-xs w-full space-y-1">
      {label && (
        <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
          {label}
        </label>
      )}

      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none">
            {leftIcon}
          </div>
        )}

        <input
          className={`w-full py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all ${
            leftIcon ? "pl-9" : "px-3.5"
          } ${rightIcon ? "pr-9" : "pr-3.5"} ${
            error ? "border-red-600 ring-1 ring-red-600" : ""
          } ${className}`}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <span className="text-[10px] text-red-500 font-semibold block">
          {error}
        </span>
      )}
    </div>
  );
};
