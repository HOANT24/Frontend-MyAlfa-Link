import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { EtatGlobalContext } from "../EtatGlobal";
import { Loader2, ShieldCheck } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { clients, loading } = useContext(EtatGlobalContext);

  // ⏳ Tant que le localStorage n'est pas lu

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-2xl rounded-2xl p-10 w-[400px] text-center space-y-6">
          {/* Icône principale */}
          <div className="flex justify-center">
            <div className="bg-[#840040]/10 p-4 rounded-full">
              <ShieldCheck className="w-10 h-10 text-[#840040]" />
            </div>
          </div>

          {/* Titre */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Vérification en cours
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Nous vérifions vos informations utilisateur...
            </p>
          </div>

          {/* Loader */}
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 text-[#840040] animate-spin" />
          </div>
        </div>
      </div>
    );

  // 🔒 Aucune donnée → login
  if (!clients || clients.length === 0) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
