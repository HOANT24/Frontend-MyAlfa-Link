import React, { createContext, useState, useEffect } from "react";

export const EtatGlobalContext = createContext();

export const EtatGlobalProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [clientSelect, setClientSelect] = useState(null); // client sélectionné

  // Chargement depuis le localStorage au démarrage
  useEffect(() => {
    const storedClients = localStorage.getItem("clients");
    if (storedClients) {
      const parsedClients = JSON.parse(storedClients);
      setClients(parsedClients);

      // Sélectionner automatiquement le premier client si existant
      if (parsedClients.length > 0) {
        setClientSelect(parsedClients[0]);
      }
    }
  }, []); // [] pour exécuter seulement au montage

  return (
    <EtatGlobalContext.Provider
      value={{ clients, setClients, clientSelect, setClientSelect }}
    >
      {children}
    </EtatGlobalContext.Provider>
  );
};
