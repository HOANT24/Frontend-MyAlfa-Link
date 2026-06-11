import { Trash2, Mail, ChevronLeft, AlertCircle } from "lucide-react";

export default function DeleteAccount() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400 leading-none">ALFA Partenaires</p>
              <h1 className="text-sm font-semibold text-slate-800 leading-tight">
                Suppression de compte
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Avertissement */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700 mb-1">
              Action irréversible
            </p>
            <p className="text-sm text-red-600 leading-relaxed">
              La suppression de votre compte MyALFA Link entraîne la suppression définitive
              de vos accès à l'espace client. Vos documents comptables restent conservés
              par ALFA Partenaires conformément aux obligations légales.
            </p>
          </div>
        </div>

        {/* Procédure */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-4">
            Comment demander la suppression de votre compte
          </h2>
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#840040] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <p>Envoyez un email à <strong>contact@alfa-partenaires.com</strong> avec l'objet <strong>"Suppression de compte MyALFA Link"</strong>.</p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#840040] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <p>Indiquez l'adresse email associée à votre compte ainsi que votre nom et prénom pour vérification.</p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#840040] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <p>Notre équipe traitera votre demande dans un délai de <strong>30 jours</strong> et vous enverra une confirmation.</p>
            </div>
          </div>
        </div>

        {/* Données supprimées */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-3">
            Données supprimées
          </h2>
          <ul className="space-y-2 text-sm text-slate-600">
            {[
              "Identifiants de connexion (email, mot de passe)",
              "Code PIN de l'application",
              "Données de session et préférences",
              "Historique de connexion",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Données conservées */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-3">
            Données conservées (obligations légales)
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            Conformément aux obligations légales comptables et fiscales françaises,
            les données suivantes sont conservées pendant la durée légale requise :
          </p>
          <ul className="space-y-2 text-sm text-slate-600">
            {[
              "Documents comptables et fiscaux (10 ans)",
              "Bulletins de paie et documents sociaux (5 ans)",
              "Documents juridiques (5 ans minimum)",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5 text-[#840040]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">ALFA Partenaires</p>
            <p className="text-sm text-slate-500">contact@alfa-partenaires.com</p>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400 pb-4">
          © 2026 ALFA Partenaires — Tous droits réservés
        </div>
      </div>
    </div>
  );
}
