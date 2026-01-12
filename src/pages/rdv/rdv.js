import React, { useEffect, useState, useCallback, useContext } from "react";
import { EtatGlobalContext } from "../EtatGlobal";
import { Plus, Calendar, MapPin, Video, Phone, Clock } from "lucide-react";
import { Button } from "../../components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const typeIcons = {
  "Au cabinet": MapPin,
  Téléphonique: Phone,
  visio: Video,
};

function RDV() {
  const { clientSelect } = useContext(EtatGlobalContext);
  const clientId = clientSelect?.id;

  const [rdvs, setRdvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);

  const [formData, setFormData] = useState({
    type: "Au cabinet",
    dateRdv: "",
    heureRdv: "",
    objetRdv: "",
    note: "",
  });

  // 🔄 Récupération des RDV
  const fetchRdvs = useCallback(() => {
    if (!clientId) return;

    setLoading(true);
    fetch(`https://backend-myalfa.vercel.app/api/rdv/client/${clientId}`)
      .then((res) => res.json())
      .then((data) => {
        setRdvs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [clientId]);

  useEffect(() => {
    fetchRdvs();
  }, [fetchRdvs]);

  // ➕ Ajouter un RDV
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoadingForm(true);

    fetch("https://backend-myalfa.vercel.app/api/rdv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        clientId,
        dateRdv: new Date(
          `${formData.dateRdv}T${formData.heureRdv}:00`
        ).toISOString(),
      }),
    })
      .then(() => {
        fetchRdvs();
        setShowForm(false);
        setFormData({
          type: "Au Cabinet",
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Mes rendez-vous
            </h1>
            <p className="text-slate-500 mt-1">
              Prenez rendez-vous avec votre expert-comptable
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#840040] hover:bg-[#a00050] gap-2"
            style={{ paddingLeft: "16px", paddingRight: "16px" }}
          >
            <Plus className="w-4 h-5" />
            Nouveau rendez-vous
          </Button>
        </div>

        {loading && <p>Chargement des rendez-vous...</p>}

        {!loading && (
          <div className="space-y-10">
            {sortedAppointments.length > 0 ? (
              <Section title="À venir" rdvs={sortedAppointments} />
            ) : (
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-800">
                  Aucun rendez-vous
                </h3>
                <p className="text-slate-500 mt-1">
                  Prenez votre premier rendez-vous
                </p>
              </div>
            )}
          </div>
        )}

        {/* Modal formulaire */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-5"
            >
              <h2 className="text-xl font-semibold text-center">
                Nouveau rendez-vous
              </h2>

              {/* Type */}
              <div>
                <label className="text-sm font-medium">
                  Type de rendez-vous
                </label>

                <div className="relative mt-1">
                  {/* Icône à gauche */}
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    {formData.type === "visio" && (
                      <Video className="w-4 h-4 text-gray-500" />
                    )}
                    {formData.type === "Téléphonique" && (
                      <Phone className="w-4 h-4 text-gray-500" />
                    )}
                    {formData.type === "Au cabinet" && (
                      <MapPin className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <select
                    className="w-full border rounded-xl p-2 pl-10"
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

              {/* Date & heure */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <input
                    type="date"
                    className="w-full border rounded-xl p-2"
                    value={formData.dateRdv}
                    onChange={(e) =>
                      setFormData({ ...formData, dateRdv: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Heure</label>
                  <input
                    type="time"
                    className="w-full border rounded-xl p-2"
                    value={formData.heureRdv}
                    onChange={(e) =>
                      setFormData({ ...formData, heureRdv: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Objet */}
              <div>
                <label className="text-sm font-medium">Objet</label>
                <input
                  type="text"
                  className="w-full border rounded-xl p-2"
                  value={formData.objetRdv}
                  onChange={(e) =>
                    setFormData({ ...formData, objetRdv: e.target.value })
                  }
                  required
                />
              </div>

              {/* Note */}
              <div>
                <label className="text-sm font-medium">Notes (optionnel)</label>
                <textarea
                  className="w-full border rounded-xl p-2 resize-none"
                  rows="3"
                  value={formData.note}
                  placeholder="Déatils ou question à aborder..."
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border rounded-xl py-2"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loadingForm}
                  className="flex-1 bg-[#840040] text-white rounded-xl py-2"
                >
                  {loadingForm ? "Enregistrement..." : "Demander"}
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
        className={`
          inline-flex items-center
          px-3 py-1
          text-xs font-medium
          rounded-full
          whitespace-nowrap
          ${badge.className}
        `}
      >
        {badge.label}
      </span>
    );
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-800 mb-4">{title}</h2>
      <div className="grid gap-4">
        {rdvs.map((appt) => {
          const TypeIcon = typeIcons[appt.type] || Calendar;
          const date = new Date(appt.dateRdv);

          return (
            <div
              key={appt.id}
              className={`p-5 border-0 bg-white shadow-sm ${
                faded ? "opacity-75" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#840040] bg-opacity-10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TypeIcon className="w-6 h-6 text-[#840040]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {appt.objetRdv}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        {format(date, "d MMMM yyyy", { locale: fr })}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-slate-500" />
                        {format(date, "HH:mm")}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-slate-600">
                      {appt.type}
                    </div>
                    <div className="mt-3 text-sm text-slate-600">
                      {appt.note}
                    </div>
                  </div>
                </div>
                {getStatusBadge(appt.etat)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RDV;
