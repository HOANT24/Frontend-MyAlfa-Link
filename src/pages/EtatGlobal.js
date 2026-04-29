import React, { createContext, useState, useEffect, useCallback } from "react";

export const EtatGlobalContext = createContext();

export const EtatGlobalProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [clientSelect, setClientSelect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasFetchedByEmail, setHasFetchedByEmail] = useState(false);
  // 🔥 documents globaux
  const [documents, setDocuments] = useState([]);
  const [loadingDocument, setLoadingDocument] = useState(true);
  const [demandes, setDemandes] = useState([]);
  const [loadingDemandes, setLoadingDemandes] = useState(true);
  const [rdvs, setRdv] = useState([]);
  const [loadingRdv, setLoadingRdv] = useState(true);
  const [dataDashboard, setDataDashboard] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  const [currentPage, setCurrentPage] = useState("Dashboard");

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

  useEffect(() => {
    if (!clientSelect?.email || hasFetchedByEmail) return;

    const fetchClientsByEmail = async () => {
      try {
        const res = await fetch(
          "https://backend-myalfa.vercel.app/api/clients/email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: clientSelect.email,
            }),
          }
        );

        const data = await res.json();

        if (!data || data.length === 0) {
          console.warn(
            "Aucun client trouvé pour cet email :",
            clientSelect.email
          );
          return;
        }

        // On extrait uniquement [id, nom]
        const clientsTable = data.map((client) => ({
          id: client.id,
          nom: client.nom,
          email: client.email,
          email_expertComptable: client.email_expertComptable,
          email_superviseur: client.email_superviseur,
          email_collaborateur: client.email_collaborateur,
          email_collaborateur_niv2: client.email_collaborateur_niv2,
          email_social: client.email_social,
        }));

        // Stockage global (Context)
        setClients(clientsTable);

        // ✅ Sélection automatique du premier client
        setClientSelect(clientsTable[0] || null);
      } catch (error) {
        console.error("Erreur récupération clients par email :", error);
      } finally {
        setHasFetchedByEmail(true);
      }
    };

    fetchClientsByEmail();
  }, [clientSelect?.email, hasFetchedByEmail]);
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

  const fetchDashboard = async (clientId) => {
    if (!clientId) return;

    try {
      setLoadingDashboard(true);
      const res = await fetch(
        `https://backend-myalfa.vercel.app/api/clients/${clientId}`
      );
      const data = await res.json();

      setDataDashboard(data);
    } catch (error) {
      console.error("Erreur chargement dashboard :", error);
    } finally {
      setLoadingDashboard(false);
    }
  };

  useEffect(() => {
    if (clientSelect?.id) {
      fetchDashboard(clientSelect.id);
    }
  }, [clientSelect]);

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
        //
        dataDashboard,
        loadingDashboard,
      }}
    >
      {children}
    </EtatGlobalContext.Provider>
  );
};
