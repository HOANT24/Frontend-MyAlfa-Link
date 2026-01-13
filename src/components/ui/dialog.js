"use client";

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => onOpenChange(false)}
      />
      {children}
    </div>
  );
}

export function DialogContent({ children, className = "" }) {
  return (
    <div
      className={`fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl ${className}`}
    >
      {children}
    </div>
  );
}

export function DialogHeader({ children }) {
  return (
    <div className="mb-4 flex items-center justify-between">{children}</div>
  );
}

export function DialogTitle({ children }) {
  return <h2 className="text-lg font-semibold text-slate-800">{children}</h2>;
}
