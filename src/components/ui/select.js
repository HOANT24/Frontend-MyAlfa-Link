import * as React from "react";

export function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`bg-white border border-gray-300 rounded-md px-3 py-2 h-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      style={{ width: "100%" }}
      {...props} // ici on passe name, value, onChange, etc.
    >
      {children}
    </select>
  );
}
