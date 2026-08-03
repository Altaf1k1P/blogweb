import React from "react";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  onClick,
  ...props
}) {
  const baseStyle = "px-5 py-2.5 rounded-lg font-medium transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#0b0f19]";
  
  const variants = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30",
    secondary: "glass-effect hover:bg-white/10 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    outline: "border border-purple-500 text-purple-400 hover:bg-purple-500/10",
  };

  return (
    <button
      type={type}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
