import React, { useState, useContext } from "react";
import { EtatGlobalContext } from "../EtatGlobal";
import {
  Plus,
  Calendar,
  MapPin,
  Video,
  Phone,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const typeIcons = {
  "Au cabinet": MapPin,
  Téléphonique: Phone,
  visio: Video,
};

function RDV() {
  const { clientSelect, rdvs, loadingRdv, fetchRdv } =
    useContext(EtatGlobalContext);
  const clientId = clientSelect?.id;

  const [showForm, setShowForm] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);

  const [formData, setFormData] = useState({
    type: "Au cabinet",
    dateRdv: "",
    heureRdv: "",
    objetRdv: "",
    note: "",
  });

  const OBJETS_RDV = {
    Collab: [
      "Transmission de documents comptables",
      "Question sur ma comptabilité / mes chiffres",
      "Dépôt de pièces manquantes",
      "Suivi de ma mission comptable",
      "Autre question comptable",
    ],
    "Collab social": [
      "Question sur un bulletin de paie",
      "Embauche / départ d'un salarié",
      "Contrat de travail / avenant",
      "Absence, arrêt maladie, congés",
      "Autre question sociale",
    ],
    "Expert-comptable": [
      "Question fiscale ou patrimoniale",
      "Arbitrage ou décision stratégique",
      "Situation exceptionnelle",
      "Validation ou avis de l'expert",
      "Autre demande nécessitant l'expert",
    ],
  };

  const getEmailByObjet = (objet, client) => {
    if (OBJETS_RDV["Expert-comptable"].includes(objet))
      return client.email_collaborateur || client.email_expertComptable;
    if (OBJETS_RDV["Collab social"].includes(objet))
      return client.email_collaborateur || client.email_expertComptable;
    if (OBJETS_RDV["Collab"].includes(objet))
      return client.email_collaborateur || client.email_expertComptable;
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoadingForm(true);
    const emailObjet = getEmailByObjet(formData.objetRdv, clientSelect);
    const emailsInvites = [clientSelect.email, emailObjet].filter(Boolean);

    fetch("https://backend-myalfa.vercel.app/api/rdv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: formData.type,
        dateRdv: new Date(
          `${formData.dateRdv}T${formData.heureRdv}:00`
        ).toISOString(),
        heureRdv: formData.heureRdv,
        objetRdv: formData.objetRdv,
        note: formData.note,
        clientId,
        client: clientSelect.nom,
        emailsInvites,
      }),
    })
      .then(() => {
        fetchRdv(clientSelect.id);
        setShowForm(false);
        setFormData({
          type: "Au cabinet",
          dateRdv: "",
          heureRdv: "",
          objetRdv: "",
          note: "",
        });
      })
      .finally(() => setLoadingForm(false));
  };

  const sortedAppointments = [...rdvs].sort(
    (a, b) => new Date(b.dateRdv) - new Date(a.dateRdv)
  );

  if (loadingRdv) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" color="#981845" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* px réduit sur mobile : 3 au lieu de 4+ */}
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header compact sur mobile */}
        <div className="flex items-center justify-between gap-2 mb-4 sm:mb-8">
          <div className="min-w-0">
            <h1 className="text-base sm:text-2xl font-semibold text-slate-800 truncate">
              Mes rendez-vous
            </h1>
            <p className="text-xs sm:text-base text-slate-500 mt-0.5 hidden sm:block">
              Prenez rendez-vous avec votre expert-comptable
            </p>
          </div>
          {/* Bouton compact sur mobile : icône seule */}
          <Button
            onClick={() => setShowForm(true)}
            className="flex-shrink-0 flex items-center gap-1.5 bg-[#840040] hover:bg-[#a00050] text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Nouveau rendez-vous</span>
            <span className="sm:hidden">Nouveau</span>
          </Button>
        </div>

        {/* Liste */}
        <div className="space-y-4 sm:space-y-6">
          {sortedAppointments.length > 0 ? (
            <Section title="À venir" rdvs={sortedAppointments} />
          ) : (
            <div className="text-center py-10 sm:py-16">
              <Calendar className="w-10 h-10 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm sm:text-lg font-medium text-slate-800">
                Aucun rendez-vous
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Prenez votre premier rendez-vous
              </p>
            </div>
          )}
        </div>

        {/* Modal — bottom sheet mobile */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg max-h-[88vh] overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-5"
            >
              {/* Titre + fermer */}
              <div className="flex items-center justify-between">
                <h2 className="text-sm sm:text-xl font-semibold">
                  Nouveau rendez-vous
                </h2>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-6 h-6 sm:w-7 sm:h-7 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 text-xs transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Type */}
              <div>
                <label className="text-xs sm:text-sm font-medium text-slate-700">
                  Type de rendez-vous
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    {formData.type === "visio" && (
                      <Video className="w-3.5 h-3.5 text-gray-400" />
                    )}
                    {formData.type === "Téléphonique" && (
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                    )}
                    {formData.type === "Au cabinet" && (
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </div>
                  <select
                    className="w-full border rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#840040]"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value="Au cabinet">Au cabinet</option>
                    <option value="visio">Visio</option>
                    <option value="Téléphonique">Téléphonique</option>
                  </select>
                </div>
              </div>

              {/* Objet */}
              <div>
                <label className="text-xs sm:text-sm font-medium text-slate-700">
                  Objet
                </label>
                <select
                  className="w-full border rounded-xl py-2 px-3 mt-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#840040]"
                  value={formData.objetRdv}
                  onChange={(e) =>
                    setFormData({ ...formData, objetRdv: e.target.value })
                  }
                  required
                >
                  <option value="">Sélectionner un objet</option>
                  {Object.values(OBJETS_RDV).map((items, index) => (
                    <React.Fragment key={index}>
                      {items.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                      {index < Object.values(OBJETS_RDV).length - 1 && (
                        <option disabled value={`separator-${index}`}>
                          ────────────────
                        </option>
                      )}
                    </React.Fragment>
                  ))}
                </select>
              </div>

              {/* Date & heure côte à côte même sur mobile (inputs courts) */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-slate-700">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full border rounded-xl py-2 px-2 sm:px-3 mt-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#840040]"
                    value={formData.dateRdv}
                    onChange={(e) =>
                      setFormData({ ...formData, dateRdv: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-slate-700">
                    Heure
                  </label>
                  <input
                    type="time"
                    className="w-full border rounded-xl py-2 px-2 sm:px-3 mt-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#840040]"
                    value={formData.heureRdv}
                    onChange={(e) =>
                      setFormData({ ...formData, heureRdv: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="text-xs sm:text-sm font-medium text-slate-700">
                  Notes (optionnel)
                </label>
                <textarea
                  className="w-full border rounded-xl py-2 px-3 mt-1 text-xs sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#840040]"
                  rows="2"
                  value={formData.note}
                  placeholder="Détails ou questions à aborder..."
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 sm:gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border rounded-xl py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loadingForm}
                  className="flex-1 bg-[#840040] text-white rounded-xl py-2 text-xs sm:text-sm font-medium hover:bg-[#a00050] disabled:opacity-50 transition-colors"
                >
                  {loadingForm ? "..." : "Demander"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, rdvs, faded = false }) {
  const getStatusBadge = (status) => {
    const config = {
      EN_ATTENTE: {
        label: "En attente",
        className: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
      },
      CONFIRME: {
        label: "Confirmé",
        className: "bg-green-100 text-green-800 ring-1 ring-green-200",
      },
      PASSÉ: {
        label: "Passé",
        className: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
      },
      ANNULE: {
        label: "Annulé",
        className: "bg-red-100 text-red-800 ring-1 ring-red-200",
      },
      TERMINE: {
        label: "Terminé",
        className: "bg-blue-100 text-blue-800 ring-1 ring-blue-200",
      },
    };
    const badge = config[status] || {
      label: status,
      className: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
    };
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full whitespace-nowrap ${badge.className}`}
      >
        {badge.label}
      </span>
    );
  };

  return (
    <div>
      <h2 className="text-xs sm:text-base font-semibold text-slate-500 uppercase tracking-wide mb-2 sm:mb-4">
        {title}
      </h2>
      <div className="grid gap-2 sm:gap-4">
        {rdvs.map((appt) => {
          const TypeIcon = typeIcons[appt.type] || Calendar;
          const date = new Date(appt.dateRdv);

          return (
            <div
              key={appt.id}
              className={`p-3 sm:p-5 bg-white shadow-sm rounded-xl sm:rounded-2xl ${
                faded ? "opacity-75" : ""
              }`}
            >
              <div className="flex items-start gap-2.5 sm:gap-4">
                {/* Icône type */}
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-[#840040]/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <TypeIcon className="w-4 h-4 sm:w-6 sm:h-6 text-[#840040]" />
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-xs sm:text-base text-slate-800 leading-snug line-clamp-2 flex-1">
                      {appt.objetRdv}
                    </h3>
                    {getStatusBadge(appt.etat)}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 mt-1 text-[11px] sm:text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                      {format(date, "d MMM yyyy", { locale: fr })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                      {format(date, "HH:mm")}
                    </span>
                    <span className="text-slate-400">{appt.type}</span>
                  </div>

                  {appt.note && (
                    <p className="mt-1 text-[11px] sm:text-sm text-slate-400 line-clamp-1">
                      {appt.note}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RDV;
