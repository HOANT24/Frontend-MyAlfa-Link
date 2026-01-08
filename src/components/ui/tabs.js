import React, { createContext, useContext } from "react";

// Contexte pour gérer l'onglet actif
const TabsContext = createContext();

export const Tabs = ({ value, onValueChange, children }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className }) => {
  return (
    <div className={`inline-flex bg-slate-100 rounded-full p-1 ${className}`}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, children, className }) => {
  const { value: activeValue, onValueChange } = useContext(TabsContext);
  const isActive = activeValue === value;

  return (
    <button
      onClick={() => onValueChange(value)}
      className={`
          ${className} 
          ${isActive ? "bg-white font-semibold" : "text-gray-500"} 
          px-4 py-2 rounded-full transition-colors duration-200 flex items-center
        `}
    >
      {children}
    </button>
  );
};
