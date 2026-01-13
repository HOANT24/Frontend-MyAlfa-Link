import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export function Select({ value, onValueChange, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const enhancedChildren = React.Children.toArray(children).map((child) => {
    if (!child) return null;

    // Trigger : ajoute l'onClick
    if (child.type === SelectTrigger) {
      return React.cloneElement(child, {
        onClick: () => setOpen((o) => !o),
      });
    }

    // Content : ouvre le menu et gère la sélection
    if (child.type === SelectContent) {
      const enhancedItems = React.Children.toArray(child.props.children).map(
        (item) =>
          React.cloneElement(item, {
            selected: item.props.value === value,
            onSelect: (val) => {
              onValueChange(val);
              setOpen(false);
            },
          })
      );
      return React.cloneElement(child, { open, children: enhancedItems });
    }

    // Value : injecte la valeur
    if (child.type === SelectValue) {
      return React.cloneElement(child, { value });
    }

    return child;
  });

  return (
    <div ref={ref} className="relative">
      {enhancedChildren}
    </div>
  );
}

export function SelectTrigger({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800"
    >
      {children}
      <ChevronDown className="h-4 w-4 text-slate-500" />
    </button>
  );
}

export function SelectValue({ placeholder, value }) {
  return (
    <span className={!value ? "text-slate-400" : ""}>
      {value || placeholder}
    </span>
  );
}

export function SelectContent({ open, children }) {
  if (!open) return null;
  return (
    <div className="absolute z-50 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg">
      {children}
    </div>
  );
}

export function SelectItem({ value, selected, onSelect, children }) {
  return (
    <div
      onClick={() => onSelect(value)}
      className={`flex cursor-pointer items-center justify-between px-3 py-2 text-sm hover:bg-slate-100 ${
        selected ? "bg-slate-100 font-medium" : ""
      }`}
    >
      {children}
      {selected && <Check className="h-4 w-4 text-[#840040]" />}
    </div>
  );
}
