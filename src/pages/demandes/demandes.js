import React, { useState, useContext } from "react";
import { EtatGlobalContext } from "../EtatGlobal";
import { Plus, Send, Clock, CheckCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Loader2,
  FileText,
  Shield,
  Receipt,
  CreditCard,
  BarChart3,
  HelpCircle,
  Zap,
  Inbox,
} from "lucide-react";

import { format } from "date-fns";
import { fr } from "date-fns/locale"; // <-- add this import

const typeConfig = {
  kbis: { label: "Extrait K-bis", icon: FileText },
  attestation_vigilance: { label: "Attestation de vigilance", icon: Shield },
  attestation_fiscale: { label: "Attestation fiscale", icon: Receipt },
  RIB: { label: "RIB", icon: CreditCard },
  situation_comptable: { label: "Situation comptable", icon: BarChart3 },
  autre: { label: "Autre demande", icon: HelpCircle },
};

const statusConfig = {
  pending: {
    label: "En attente",
    color: "bg-slate-100 text-slate-600",
    icon: Clock,
  },
  in_progress: {
    label: "En cours",
    color: "bg-blue-100 text-blue-700",
    icon: Loader2,
  },
  completed: {
    label: "Terminée",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
};

function Demandes() {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [loadingForm, setLoadingForm] = useState(false);
  const { clientSelect, demandes, loadingDemandes, fetchDemandes } =
    useContext(EtatGlobalContext);

  const requestTypes = [
    {
      value: "kbis",
      label: "Extrait K-bis",
      icon: FileText,
      description: "Document officiel d'immatriculation",
    },
    {
      value: "attestation_vigilance",
      label: "Attestation de vigilance",
      icon: Shield,
      description: "URSSAF - Situation à jour",
    },
    {
      value: "attestation_fiscale",
      label: "Attestation fiscale",
      icon: Receipt,
      description: "Impôts et taxes",
    },
    {
      value: "RIB",
      label: "RIB",
      icon: CreditCard,
      description: "Relevé d'identité bancaire",
    },
    {
      value: "situation_comptable",
      label: "Situation comptable",
      icon: BarChart3,
      description: "État financier actuel",
    },
    {
      value: "autre",
      label: "Autre demande",
      icon: HelpCircle,
      description: "Demande personnalisée",
    },
  ];

  const [formData, setFormData] = useState({
    type: "",
    urgence: "Normal",
    details: "",
  });

  console.log(clientSelect.email_expertComptable);
  console.log(clientSelect.email_collaborateur);
  console.log(clientSelect.email_collaborateur_niv2);
  console.log(clientSelect.email_social);
  console.log(clientSelect.nom);
  // 🔄 Récupération des demande

  const getEmailByType = (type) => {
    switch (type) {
      case "attestation_vigilance":
        return clientSelect.email_social;

      case "kbis":
      case "RIB":
      case "attestation_fiscale":
        return clientSelect.email_collaborateur;

      case "situation_comptable":
      case "autre":
        return clientSelect.email_expertComptable;

      default:
        return null;
    }
  };

  // ➕ Ajouter une demande
  const handleSubmit = (e) => {
    setLoadingForm(true);
    e.preventDefault();

    fetch("https://backend-myalfa.vercel.app/api/demande", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        etat: "En cours",
        clientId: clientSelect.id,
        email: getEmailByType(formData.type),
        client: clientSelect.nom,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchDemandes(clientSelect.id); // 🔄 recharger depuis l’API
        setShowForm(false);
        setFormData({ type: "rib", urgence: "Normal", details: "" });
        setActiveTab("all");
      });

    setLoadingForm(false);
  };

  // 📌 Filtres
  const enCours = demandes.filter((d) => d.etat === "En cours");
  const terminees = demandes.filter((d) => d.etat === "Terminés");

  const getDemandesByTab = () => {
    if (activeTab === "en_cours") return enCours;
    if (activeTab === "terminees") return terminees;
    return demandes;
  };

  const renderTypeLabel = (type) => {
    switch (type) {
      case "kbis":
        return "Extrait K-bis";
      case "attestation_vigilance":
        return "Attestation de vigilance";
      case "attestation_fiscale":
        return "Attestation fiscale";
      case "rib":
        return "RIB";
      case "situation_comptable":
        return "Situation comptable";
      case "autre":
        return "Autre demande";
      default:
        return type;
    }
  };

  if (loadingDemandes) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2
          className="w-8 h-8 animate-spin text-slate-400"
          color="#981845"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Mes demandes
            </h1>
            <p className="text-slate-500 mt-1">
              Demandez vos documents administratifs
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#840040] hover:bg-[#a00050] gap-2"
            style={{ paddingLeft: "16px", paddingRight: "16px" }}
          >
            <Plus className="w-4 h-5" />
            Nouvelle demande
          </Button>
        </div>

        {/* Onglets */}
        {!loadingDemandes && (
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-slate-100 p-1">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-white gap-2"
                >
                  <Send className="w-4 h-4" />
                  Toutes ({demandes.length})
                </TabsTrigger>

                <TabsTrigger
                  value="en_cours"
                  className="data-[state=active]:bg-white gap-2"
                >
                  <Clock className="w-4 h-4" />
                  En cours ({enCours.length})
                </TabsTrigger>

                <TabsTrigger
                  value="terminees"
                  className="data-[state=active]:bg-white gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Terminées ({terminees.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        <Section
          demandes={getDemandesByTab()}
          renderTypeLabel={renderTypeLabel}
        />

        {/* Formulaire */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] p-8 overflow-y-auto flex flex-col">
              {/* Titre */}
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Nouvelle demande
              </h2>

              {/* Type en grid 2x3 avec icônes et descriptions */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Type de demande
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {requestTypes.map((reqType) => (
                    <button
                      key={reqType.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, type: reqType.value })
                      }
                      className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-105 ${
                        formData.type === reqType.value
                          ? "border-slate-800 bg-slate-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <reqType.icon
                          className={`w-5 h-5 ${
                            formData.type === reqType.value
                              ? "text-slate-800"
                              : "text-slate-400"
                          }`}
                        />
                        <span className="font-medium text-sm text-slate-800">
                          {reqType.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {reqType.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Urgence */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Urgence
                </label>
                <div className="flex gap-4">
                  {["Normal", "Urgent"].map((level) => (
                    <label
                      key={level}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="urgence"
                        value={level}
                        checked={formData.urgence === level}
                        onChange={(e) =>
                          setFormData({ ...formData, urgence: e.target.value })
                        }
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm flex items-center gap-1">
                        {level === "Urgent" && (
                          <Zap className="w-4 h-4 text-amber-500" />
                        )}
                        {level}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Détails */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Notes complémentaires (optionnel)
                </label>
                <textarea
                  className="w-full border rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows="4"
                  placeholder="Précisions sur votre demande..."
                  value={formData.details}
                  onChange={(e) =>
                    setFormData({ ...formData, details: e.target.value })
                  }
                />
              </div>

              {/* Boutons */}
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border rounded-xl text-slate-700 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={!formData.type || loadingForm}
                  className="flex-1 px-4 py-2 rounded-xl bg-[#840040] text-white hover:bg-[#a00050] disabled:opacity-50"
                >
                  {loadingForm ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Envoi...
                    </div>
                  ) : (
                    "Envoyer la demande"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 🧱 Liste des demandes
function Section({ demandes, renderTypeLabel }) {
  if (demandes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Inbox className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-800">Aucune demande</h3>
        <p className="text-slate-500 mt-1">Aucune demande pour l'instant</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {demandes.map((d) => {
        const type = typeConfig[d.type] || typeConfig.autre;
        const status = statusConfig[d.urgence] || statusConfig.pending;
        const Icon = type.icon;
        const StatusIcon = status.icon;

        return (
          <li
            key={d.id}
            className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              {/* Icône type */}
              <div className="p-3 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center">
                <Icon className="w-5 h-5 text-slate-600" />
              </div>

              <div className="flex-1 min-w-0">
                {/* Header avec type et urgence */}
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-medium text-slate-800">
                    {renderTypeLabel(d.type)}
                  </h4>
                  {d.urgence.toLowerCase() === "urgent" && (
                    <div className="flex items-center gap-1 text-amber-700 bg-amber-100 text-xs px-2 py-1 rounded-full font-medium">
                      <Zap className="w-3 h-3" />
                      Urgent
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <div
                    variant="secondary"
                    className={`${status.color} flex items-center gap-1 text-amber-700 bg-amber-100 text-xs px-2 py-1 rounded-full font-medium`}
                  >
                    <StatusIcon
                      className={`w-3 h-3 ${
                        status.icon === Loader2 ? "animate-spin" : ""
                      }`}
                    />
                    {status.label}
                  </div>
                  <span className="text-xs text-slate-400">
                    {format(new Date(d.createdAt), "d MMM yyyy", {
                      locale: fr,
                    })}
                  </span>
                </div>

                {/* Détails */}
                {d.details && (
                  <p className="text-sm text-slate-500 mt-2">{d.details}</p>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
export default Demandes;
