import React, { forwardRef } from "react";

const Input = forwardRef(({
  label,
  type = "text",
  placeholder = "",
  error = "",
  className = "",
  ...props
}, ref) => {
  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1.5 pl-1">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        ref={ref}
        className={`w-full px-4 py-3 rounded-lg glass-effect text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-white/5 transition-all duration-300 ${
          error ? "border-red-500 focus:ring-red-500/50" : "hover:border-white/10"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-red-400 text-xs mt-1.5 pl-1">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
