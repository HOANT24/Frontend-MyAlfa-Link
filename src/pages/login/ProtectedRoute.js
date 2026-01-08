import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { EtatGlobalContext } from "../EtatGlobal";

const ProtectedRoute = ({ children }) => {
  const { clients, loading } = useContext(EtatGlobalContext);

  // ⏳ Tant que le localStorage n'est pas lu
  if (loading) {
    return <div>Chargement...</div>;
  }

  // 🔒 Aucune donnée → login
  if (!clients || clients.length === 0) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
