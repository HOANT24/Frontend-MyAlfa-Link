import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { EtatGlobalContext } from "../EtatGlobal";

const ProtectedRoute = ({ children }) => {
  const { clients } = useContext(EtatGlobalContext);

  // Si clients est vide ou null → redirige vers login
  if (!clients || clients.length === 0) {
    return <Navigate to="/login" replace />;
  }

  // Sinon on affiche le composant demandé
  return children;
};

export default ProtectedRoute;
