import React, { useRef } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

interface DateInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  error?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
  label,
  error,
  className = "",
  value,
  onChange,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.showPicker?.();
    }
  };

  return (
    <div className="font-mono text-xs w-full space-y-1 select-none">
      {label && (
        <label className="block text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
          {label}
        </label>
      )}

      <div
        onClick={handleContainerClick}
        className="relative w-full cursor-pointer group"
      >
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-red-500 transition-colors pointer-events-none z-10">
          <CalendarIcon className="h-3.5 w-3.5" />
        </div>

        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={onChange}
          className={`w-full py-2 pl-9 pr-3.5 bg-zinc-950/80 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-mono text-xs cursor-pointer [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:hidden ${
            error ? "border-red-600 ring-1 ring-red-600" : ""
          } ${className}`}
          {...props}
        />
      </div>

      {error && (
        <span className="text-[10px] text-red-500 font-semibold block">
          {error}
        </span>
      )}
    </div>
  );
};

export default DateInput;
