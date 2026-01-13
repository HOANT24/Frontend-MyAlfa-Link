import React, { createContext, useState, useEffect } from "react";

export const EtatGlobalContext = createContext();

export const EtatGlobalProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [clientSelect, setClientSelect] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Ajouter l'état global pour currentPage
  const [currentPage, setCurrentPage] = useState("Documents");

  useEffect(() => {
    const storedClients = localStorage.getItem("clients");

    if (storedClients) {
      const parsedClients = JSON.parse(storedClients);
      setClients(parsedClients);

      if (parsedClients.length > 0) {
        setClientSelect(parsedClients[0]);
      }
    }

    setLoading(false);
  }, []);

  return (
    <EtatGlobalContext.Provider
      value={{
        clients,
        setClients,
        clientSelect,
        setClientSelect,
        loading,
        currentPage, // ✅ exposer currentPage
        setCurrentPage, // ✅ exposer setCurrentPage
      }}
    >
      {children}
    </EtatGlobalContext.Provider>
  );
};
