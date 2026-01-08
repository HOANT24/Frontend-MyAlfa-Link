import * as React from "react";

export function Button({
  variant = "primary",
  className = "",
  disabled = false,
  children,
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "h-12 bg-gradient-to-r from-[#8B1538] to-[#A91D4D] hover:from-[#7A1230] hover:to-[#981845] text-white rounded-2xl shadow-lg shadow-[#8B1538]/25 hover:shadow-xl hover:shadow-[#8B1538]/30 hover:-translate-y-0.5",
    outline:
      "h-12 px-6 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50",
  };

  return (
    <button
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
