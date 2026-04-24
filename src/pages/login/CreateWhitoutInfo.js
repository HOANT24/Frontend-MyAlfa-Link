import React, { useState } from "react";
import {
  ShieldCheck,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";

const CreateWhitoutInfo = ({ close }) => {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    mdp: "",
    confirmMdp: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const passwordsMatch = form.mdp === form.confirmMdp;

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nom", form.nom);
    formData.append("email", form.email);
    formData.append("mdp", form.mdp);

    console.log(Object.fromEntries(formData));

    setSubmitted(true);
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
            Création de votre espace client
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Si vous disposez de ce lien, cela signifie que vous faites déjà
            partie des clients de notre cabinet.Toutefois, votre compte en ligne
            n’a pas encore été activé.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            {/* Nom société */}
            <div className="space-y-2 mb-3">
              <label htmlFor="email" className="text-slate-700 font-medium">
                Nom de votre société (fourni au cabinet)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="nom"
                  placeholder="Dénomination sociale"
                  value={form.nom}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#840040] transition"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2 mb-3">
              <label htmlFor="email" className="text-slate-700 font-medium">
                Adresse e-mail (utilisée avec le cabinet)
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
              disabled={!passwordsMatch}
              className="w-full bg-[#840040] text-white py-3 rounded-lg font-medium 
              hover:bg-[#6a0033] transition-all duration-300 
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
            >
              <span>Créer le compte</span>
            </button>
          </form>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-start gap-4 animate-fade-in">
            <CheckCircle className="text-green-600 w-8 h-8" />
            <div className="text-sm text-green-800 leading-relaxed">
              <p className="font-semibold mb-1">Demande envoyée avec succès</p>
              <p>
                Vos informations ont bien été transmises à notre cabinet. Elles
                seront vérifiées dans les plus brefs délais.
              </p>
              <p className="mt-1">
                Vous serez informé dès la création de votre compte afin de
                pouvoir vous connecter à votre espace client en toute sécurité.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateWhitoutInfo;
