import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import logo from "../../assets/images/logo.webp";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [mdp, setMdp] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showMdp, setShowMdp] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mdp.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (mdp !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://backend-myalfa.vercel.app/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, mdp }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Lien invalide ou expiré.");
        return;
      }

      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch {
      setError("Erreur lors de la réinitialisation. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Lien invalide ou manquant.</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 text-sm text-[#840040] hover:underline"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-slate-900">Nouveau mot de passe</h1>
          <p className="text-sm text-slate-500 mt-2">Choisissez un mot de passe sécurisé.</p>
        </div>

        {success ? (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-slate-700 font-medium">Mot de passe mis à jour !</p>
            <p className="text-sm text-slate-400 mt-1">Redirection vers la connexion...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Nouveau mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type={showMdp ? "text" : "password"}
                  placeholder="••••••••••"
                  value={mdp}
                  onChange={(e) => setMdp(e.target.value)}
                  required
                  className="pl-12 pr-12 h-12 bg-white border-slate-200 focus:border-[#840040] focus:ring-[#840040]/20 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowMdp(!showMdp)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showMdp ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="pl-12 pr-12 h-12 bg-white border-slate-200 focus:border-[#840040] focus:ring-[#840040]/20 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#840040] hover:bg-[#6a0033] text-white rounded-xl font-medium text-base transition-all duration-200 shadow-lg shadow-[#840040]/25"
            >
              {loading ? "Mise à jour..." : "Réinitialiser le mot de passe"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                Retour à la connexion
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
