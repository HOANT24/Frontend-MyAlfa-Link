import React, { useState, useContext } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { EtatGlobalContext } from "../EtatGlobal";
import logo from "../../assets/images/logo.webp";
import ImageLogin from "../../assets/images/LoginImage.webp";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Lock, Eye, EyeOff, Mail, ArrowRight } from "lucide-react";

function Login() {
  const { setClients, setClientSelect } = useContext(EtatGlobalContext);
  const navigate = useNavigate(); // <-- hook pour rediriger

  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // <-- on active le loading

    try {
      const response = await fetch(
        "https://backend-myalfa.vercel.app/api/clients/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, mdp }),
        }
      );

      const data = await response.json();

      if (!data || data.length === 0) {
        setError("Email ou mot de passe incorrect");
        return;
      }

      // On extrait uniquement [id, nom]
      const clientsTable = data.map((client) => ({
        id: client.id,
        nom: client.nom,
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

      // Stockage localStorage
      localStorage.setItem("clients", JSON.stringify(clientsTable));

      // ✅ Redirection automatique vers /home
      navigate("/home", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la connexion");
      setLoading(false); // <-- on désactive le loading
    }
  };

  return (
    <div className="LoginContainer">
      <form
        className="login w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-12"
        autoComplete="on"
        onSubmit={handleLogin}
      >
        <img src={logo} alt="Logo" className="logoLogin" />
        <br />
        <div className="text-center mb-2">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="text-center">
              <h1 className="font-semibold text-slate-900">MyALFA Link</h1>
              <p className="text-slate-500 text-xs tracking-widest uppercase">
                Comptabilité
              </p>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight text-center">
            Accédez à votre espace client
          </h2>
          <p className="text-slate-500 mt-3 leading-relaxed text-center">
            Vos données comptables et financières sont strictement
            confidentielles et protégées.
          </p>
        </div>

        {/* Formulaire */}
        <div className="space-y-5" style={{ width: "80%" }}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-slate-700 font-medium">
              Adresse email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="votre@email.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-12 bg-white border-slate-200 focus:border-[#840040] focus:ring-[#840040]/20 rounded-xl text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-slate-700 font-medium">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                value={mdp}
                onChange={(e) => setMdp(e.target.value)}
                className="pl-12 pr-12 h-12 bg-white border-slate-200 focus:border-[#840040] focus:ring-[#840040]/20 rounded-xl text-slate-900 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <a
              href="https://alfacomptabilite.com/"
              className="text-sm text-[#840040] hover:text-[#6a0033] font-medium transition-colors"
            >
              Mot de passe oublié ?
            </a>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#840040] hover:bg-[#6a0033] text-white rounded-xl font-medium text-base transition-all duration-200 shadow-lg shadow-[#840040]/25 hover:shadow-xl hover:shadow-[#840040]/30"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                Connexion en cours ...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Se connecter
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>

          {error && <p className="TextInfo">{error}</p>}
        </div>

        <div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <p className="text-slate-500 text-sm">
            Besoin d'aide ?{" "}
            <a
              href="https://alfacomptabilite.com/"
              className="text-[#840040] hover:text-[#6a0033] font-medium transition-colors"
            >
              Contactez votre cabinet
            </a>
          </p>
        </div>

        {/* Footer mobile */}
        <div>
          <br />
          <br />
          <br />
          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} ALFA Comptabilité. Tous droits
            réservés.
          </p>
        </div>
      </form>

      <div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className=" ContainerLoginImage hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden"
      >
        <div className="  absolute inset-0 bg-gradient-to-br from-[#840040] via-[#840040] to-[#840040]">
          {/* Motif géométrique abstrait */}
          <img src={ImageLogin} alt="Logo" className=" relative ImageLogin" />
          <div className="absolute inset-0 opacity-10">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern
                  id="grid"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>

          {/* Cercles décoratifs */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white/3 rounded-full blur-2xl" />
        </div>
      </div>
    </div>
  );
}

export default Login;
