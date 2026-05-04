import React, { useState } from "react";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";

const CreateWithInfo = ({ userInfo, close }) => {
  const [form, setForm] = useState({
    email: "",
    mdp: "",
    confirmMdp: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setEmailError(false);
  };

  const passwordsMatch = form.mdp === form.confirmMdp;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.email !== userInfo.email) {
      setEmailError(true);
      return;
    }

    if (!passwordsMatch) return;

    setEmailError(false);
    setLoading(true);

    try {
      const res = await fetch(
        `https://backend-myalfa.vercel.app/api/clients/${userInfo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mdp: form.mdp,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }

      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="relative bg-white shadow-2xl rounded-2xl py-8 px-[10%] mx w-[600px] space-y-6 transform transition-all duration-500 hover:scale-[1.01]">
        <button
          onClick={() => close()}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {/* Icône */}
        <div className="flex justify-center">
          <div className="bg-[#840040]/10 p-3 rounded-full animate-pulse">
            <ShieldCheck className="w-10 h-10 text-[#840040]" />
          </div>
        </div>

        {/* Titre */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">
            Vous êtes indentifier entant que <br />
            <span className="text-[#840040]">{userInfo.nom}</span>
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Si vous disposez de ce lien, cela signifie que vous faites déjà
            partie des clients de notre cabinet.Toutefois, votre compte en ligne
            n’a pas encore été activé.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-2 mb-3">
              <label htmlFor="email" className="text-slate-700 font-medium">
                Adresse e-mail (le mail à reçu ce lien)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email "
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#840040] transition"
                  required
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="space-y-2 mt-3">
              <label htmlFor="mdp" className="text-slate-700 font-medium">
                Choisissez un mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="mdp"
                  placeholder="Mot de passe"
                  value={form.mdp}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#840040] transition"
                  required
                />
                <div
                  className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-[#840040]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>

              {/* Confirmation */}
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmMdp"
                  placeholder="Confirmer le mot de passe"
                  value={form.confirmMdp}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none transition ${
                    form.confirmMdp.length > 0 && !passwordsMatch
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-[#840040]"
                  }`}
                  required
                />
                <div
                  className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-[#840040]"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>

            {form.confirmMdp && !passwordsMatch && (
              <p className="text-sm text-red-500 animate-pulse">
                Les mots de passe ne correspondent pas
              </p>
            )}
            <br />
            <button
              type="submit"
              disabled={!passwordsMatch || loading}
              className="w-full bg-[#840040] text-white py-3 rounded-lg font-medium 
    hover:bg-[#6a0033] transition-all duration-300 
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center gap-2"
            >
              {loading ? "Modification en cours..." : "Vérifier le compte"}
            </button>
            {emailError && (
              <p className="text-sm text-red-500 mt-3 text-center animate-pulse">
                L’adresse e-mail saisie est incorrecte ( ne correspondent pas au
                mail du Dossier client)
              </p>
            )}
          </form>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-start gap-4 animate-fade-in">
            <CheckCircle className="text-green-600 w-8 h-8" />

            <div className="text-sm text-green-800 leading-relaxed">
              <p className="font-semibold mb-1">Compte créé avec succès</p>

              <p className="text-xs text-green-700">
                Vous pouvez désormais vous connecter depuis l’écran d’accueil.{" "}
                <br />
                Veuillez ne jamais divulguer vos identifiants confidentiels.
              </p>

              <div className="mt-5 space-y-0.5">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-green-700" />
                  <span className="font-mono text-gray-700">
                    Adresse email : {form.email}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-green-700" />
                  <span className="font-mono text-gray-700">
                    Mot de passe : {form.mdp}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateWithInfo;
