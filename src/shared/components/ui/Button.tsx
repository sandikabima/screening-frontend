import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "outline"
    | "ghost"
    | "disconnect";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  loading = false,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-mono font-bold uppercase tracking-wider rounded transition-all duration-200 cursor-pointer select-none border disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:scale-95 shrink-0";

  const sizeStyles = {
    sm: "px-3 py-1 text-[10px] gap-1.5",
    md: "px-4 py-2 text-[11px] gap-2",
    lg: "px-5 py-2.5 text-xs gap-2",
  };

  const variantStyles = {
    primary:
      "bg-red-600 hover:bg-red-700 text-white border-transparent shadow-[0_0_15px_rgba(220,38,38,0.4)]",

    secondary:
      "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-800 hover:border-zinc-700 shadow-inner hover:shadow-[0_0_10px_rgba(255,255,255,0.05)]",

    danger:
      "bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 border-red-900/80 hover:border-red-700/90 shadow-[0_0_10px_rgba(153,27,27,0.2)]",

    success:
      "bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 hover:text-emerald-200 border-emerald-900/80 hover:border-emerald-700/90 shadow-[0_0_10px_rgba(6,95,70,0.2)]",

    outline:
      "bg-black/60 hover:bg-zinc-900 text-zinc-300 hover:text-white border-zinc-800 hover:border-zinc-600 backdrop-blur-sm",

    ghost:
      "bg-transparent border-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/40",

    disconnect:
      "bg-zinc-950/90 hover:bg-red-950/80 text-zinc-400 hover:text-red-400 border-zinc-900 hover:border-red-600/80 shadow-[0_0_10px_rgba(0,0,0,0.8)] hover:shadow-[0_0_20px_rgba(220,38,38,0.45)] group transition-all duration-200",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-500" />
          <span>MEMPROSES...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
