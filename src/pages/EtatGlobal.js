import React, { createContext, useState, useEffect, useCallback } from "react";

export const EtatGlobalContext = createContext();

export const EtatGlobalProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [clientSelect, setClientSelect] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 documents globaux
  const [documents, setDocuments] = useState([]);
  const [loadingDocument, setLoadingDocument] = useState(true);
  const [demandes, setDemandes] = useState([]);
  const [loadingDemandes, setLoadingDemandes] = useState(true);
  const [rdvs, setRdv] = useState([]);
  const [loadingRdv, setLoadingRdv] = useState(true);

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

  // 🔥 Charger les documents depuis l’API
  const fetchDocuments = async (clientId) => {
    try {
      setLoadingDocument(true);
      const res = await fetch(
        `https://backend-myalfa.vercel.app/api/documents-ged/client/${clientId}`
      );
      const data = await res.json();

      // tri par date décroissante
      const sorted = data.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );

      setDocuments(sorted);
    } catch (error) {
      console.error("Erreur chargement documents :", error);
    } finally {
      setLoadingDocument(false);
    }
  };

  // 🔄 recharger quand le client change
  useEffect(() => {
    if (clientSelect?.id) {
      fetchDocuments(clientSelect.id);
    }
  }, [clientSelect]);

  const fetchDemandes = async (clientId) => {
    if (!clientId) return;

    try {
      setLoadingDemandes(true);
      const res = await fetch(
        `https://backend-myalfa.vercel.app/api/demande/client/${clientId}`
      );
      const data = await res.json();
      setDemandes(data);
    } catch (error) {
      console.error("Erreur chargement demandes :", error);
    } finally {
      setLoadingDemandes(false);
    }
  };

  useEffect(() => {
    if (clientSelect?.id) {
      fetchDemandes(clientSelect.id);
    }
  }, [clientSelect]);

  const fetchRdv = useCallback(
    async (clientId) => {
      if (!clientId) return;

      try {
        setLoadingRdv(true);
        const res = await fetch(
          `https://backend-myalfa.vercel.app/api/rdv/client/${clientId}`
        );
        const data = await res.json();
        setRdv(data);
      } catch (error) {
        console.error("Erreur chargement Rdv :", error);
      } finally {
        setLoadingRdv(false);
      }
    },
    [setRdv]
  );

  useEffect(() => {
    if (clientSelect?.id) {
      fetchRdv(clientSelect.id);
    }
  }, [clientSelect, fetchRdv]);

  return (
    <EtatGlobalContext.Provider
      value={{
        loading,
        //
        clients,
        setClients,
        clientSelect,
        setClientSelect,
        //
        documents,
        setDocuments,
        fetchDocuments,
        loadingDocument,
        //
        demandes,
        setDemandes,
        fetchDemandes,
        loadingDemandes,
        //
        rdvs,
        setRdv,
        fetchRdv,
        loadingRdv,
        //
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </EtatGlobalContext.Provider>
  );
};
