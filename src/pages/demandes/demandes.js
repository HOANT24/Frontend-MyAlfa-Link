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
import { fr } from "date-fns/locale";

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

  const getEmailByType = (type) => {
    switch (type) {
      case "attestation_vigilance":
        return clientSelect.email_social || clientSelect.email_expertComptable;
      case "kbis":
      case "RIB":
      case "attestation_fiscale":
        return (
          clientSelect.email_collaborateur || clientSelect.email_expertComptable
        );
      case "situation_comptable":
      case "autre":
        return clientSelect.email_expertComptable;
      default:
        return null;
    }
  };

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
        fetchDemandes(clientSelect.id);
        setShowForm(false);
        setFormData({ type: "rib", urgence: "Normal", details: "" });
        setActiveTab("all");
      });

    setLoadingForm(false);
  };

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">
              Mes demandes
            </h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              Demandez vos documents administratifs
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#840040] hover:bg-[#a00050] gap-2 w-full sm:w-auto"
            style={{ paddingLeft: "16px", paddingRight: "16px" }}
          >
            <Plus className="w-4 h-4" />
            Nouvelle demande
          </Button>
        </div>

        {/* Onglets — scroll horizontal sur très petit écran */}
        {!loadingDemandes && (
          <div className="bg-white rounded-2xl shadow-sm p-2 sm:p-4 mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-slate-100 p-1 w-full flex items-center">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-white flex-1 flex items-center justify-center gap-1 text-[11px] sm:text-sm px-1 sm:px-3 py-1.5"
                >
                  <Send className="w-3 h-3 flex-shrink-0 hidden sm:block" />
                  <span className="truncate">
                    Toutes{" "}
                    <span className="text-slate-400">({demandes.length})</span>
                  </span>
                </TabsTrigger>

                <TabsTrigger
                  value="en_cours"
                  className="data-[state=active]:bg-white flex-1 flex items-center justify-center gap-1 text-[11px] sm:text-sm px-1 sm:px-3 py-1.5"
                >
                  <Clock className="w-3 h-3 flex-shrink-0 hidden sm:block" />
                  <span className="truncate">
                    En cours{" "}
                    <span className="text-slate-400">({enCours.length})</span>
                  </span>
                </TabsTrigger>

                <TabsTrigger
                  value="terminees"
                  className="data-[state=active]:bg-white flex-1 flex items-center justify-center gap-1 text-[11px] sm:text-sm px-1 sm:px-3 py-1.5"
                >
                  <CheckCircle className="w-3 h-3 flex-shrink-0 hidden sm:block" />
                  <span className="truncate">
                    Terminées{" "}
                    <span className="text-slate-400">({terminees.length})</span>
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        <Section
          demandes={getDemandesByTab()}
          renderTypeLabel={renderTypeLabel}
        />

        {/* Formulaire modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[90vh] p-5 sm:p-8 overflow-y-auto flex flex-col">
              {/* Titre + bouton fermer */}
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-semibold">
                  Nouvelle demande
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-700 text-xl leading-none"
                >
                  ✕
                </button>
              </div>

              {/* Type — 1 colonne sur mobile, 2 colonnes sur sm+ */}
              <div className="mb-5 sm:mb-6">
                <label className="block text-sm font-medium mb-2">
                  Type de demande
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {requestTypes.map((reqType) => (
                    <button
                      key={reqType.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, type: reqType.value })
                      }
                      className={`p-3 sm:p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02] ${
                        formData.type === reqType.value
                          ? "border-slate-800 bg-slate-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <reqType.icon
                          className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${
                            formData.type === reqType.value
                              ? "text-slate-800"
                              : "text-slate-400"
                          }`}
                        />
                        <span className="font-medium text-xs sm:text-sm text-slate-800">
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
              <div className="mb-5 sm:mb-6">
                <label className="block text-sm font-medium mb-2">
                  Urgence
                </label>
                <div className="flex gap-4 sm:gap-6">
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
              <div className="mb-5 sm:mb-6">
                <label className="block text-sm font-medium mb-2">
                  Notes complémentaires (optionnel)
                </label>
                <textarea
                  className="w-full border rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  rows="3"
                  placeholder="Précisions sur votre demande..."
                  value={formData.details}
                  onChange={(e) =>
                    setFormData({ ...formData, details: e.target.value })
                  }
                />
              </div>

              {/* Boutons */}
              <div className="flex gap-3 mt-auto">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2.5 border rounded-xl text-slate-700 hover:bg-slate-100 text-sm font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={!formData.type || loadingForm}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#840040] text-white hover:bg-[#a00050] disabled:opacity-50 text-sm font-medium"
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
      <div className="text-center py-12 sm:py-16">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Inbox className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-800">Aucune demande</h3>
        <p className="text-slate-500 mt-1 text-sm">
          Aucune demande pour l'instant
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3 sm:space-y-4">
      {demandes.map((d) => {
        const type = typeConfig[d.type] || typeConfig.autre;
        const status = statusConfig[d.urgence] || statusConfig.pending;
        const Icon = type.icon;
        const StatusIcon = status.icon;

        return (
          <li
            key={d.id}
            className="bg-white rounded-2xl shadow-sm p-3 sm:p-4 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Icône type */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              </div>

              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-medium text-slate-800 text-sm sm:text-base">
                    {renderTypeLabel(d.type)}
                  </h4>
                  {d.urgence.toLowerCase() === "urgent" && (
                    <div className="flex items-center gap-1 text-amber-700 bg-amber-100 text-xs px-2 py-0.5 rounded-full font-medium">
                      <Zap className="w-3 h-3" />
                      Urgent
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1.5 sm:mt-2 flex-wrap">
                  <div
                    className={`${status.color} flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium`}
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

                {d.details && (
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 sm:mt-2 line-clamp-2">
                    {d.details}
                  </p>
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
