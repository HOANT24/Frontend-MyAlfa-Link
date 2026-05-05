import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  Inbox,
  X,
  Calendar,
} from "lucide-react";

export default function Questionnaires() {
  const [questionnaires, setQuestionnaires] = useState([
    {
      id: 1,
      title: "Mise à jour des informations fiscales",
      description:
        "Merci de vérifier et compléter vos informations fiscales pour l'année en cours.",
      status: "EN_ATTENTE",
      createdAt: "2026-04-20",
      dueDate: "2026-05-10",
      completedAt: null,
    },
    {
      id: 2,
      title: "Évaluation de situation patrimoniale",
      description:
        "Analyse complète de votre patrimoine afin de proposer des optimisations.",
      status: "completed",
      createdAt: "2026-03-15",
      dueDate: "2026-04-01",
      completedAt: "2026-03-28",
    },
    {
      id: 3,
      title: "Questionnaire KYC (Know Your Customer)",
      description:
        "Collecte d'informations obligatoires pour conformité réglementaire.",
      status: "EN_ATTENTE",
      createdAt: "2026-04-25",
      dueDate: "2026-05-08",
      completedAt: null,
    },
    {
      id: 4,
      title: "Préparation déclaration annuelle",
      description:
        "Merci de fournir les éléments nécessaires à votre déclaration annuelle.",
      status: "completed",
      createdAt: "2026-02-10",
      dueDate: "2026-03-01",
      completedAt: "2026-02-25",
    },
  ]);

  const [activeTab, setActiveTab] = useState("EN_ATTENTE");
  const [selectedQ, setSelectedQ] = useState(null);
  const [reponse, setReponse] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filteredQuestionnaires = questionnaires.filter((q) => {
    if (activeTab === "all") return true;
    return q.status === activeTab;
  });

  const EN_ATTENTECount = questionnaires.filter(
    (q) => q.status === "EN_ATTENTE"
  ).length;
  const completedCount = questionnaires.filter(
    (q) => q.status === "completed"
  ).length;

  const openOverlay = (q) => {
    if (q.status === "completed") return; // bloquer si complété
    setSelectedQ(q);
    setReponse("");
    setSubmitted(false);
  };

  const closeOverlay = () => {
    setSelectedQ(null);
    setReponse("");
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (!reponse.trim()) return;
    setQuestionnaires((prev) =>
      prev.map((q) =>
        q.id === selectedQ.id
          ? {
              ...q,
              status: "completed",
              completedAt: new Date().toISOString().split("T")[0],
            }
          : q
      )
    );
    setSubmitted(true);
    setTimeout(() => closeOverlay(), 1800);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-800">
            Questionnaires
          </h1>
          <p className="text-slate-500 mt-1">
            Répondez aux demandes d'informations du cabinet
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-100 p-1">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-white gap-2"
              >
                <ClipboardList className="w-4 h-4" />
                Tous ({questionnaires.length})
              </TabsTrigger>
              <TabsTrigger
                value="EN_ATTENTE"
                className="data-[state=active]:bg-white gap-2"
              >
                <Clock className="w-4 h-4" />À compléter ({EN_ATTENTECount})
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="data-[state=active]:bg-white gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Complétés ({completedCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* List */}
        {filteredQuestionnaires.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-800">
              Aucun questionnaire
            </h3>
            <p className="text-slate-500 mt-1">
              {activeTab === "EN_ATTENTE"
                ? "Vous êtes à jour !"
                : "Aucun questionnaire disponible"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredQuestionnaires.map((q) => (
              <div
                key={q.id}
                onClick={() => openOverlay(q)}
                className={`bg-white rounded-xl p-5 shadow-sm border border-transparent transition-all duration-200 ${
                  q.status === "completed"
                    ? "opacity-60 cursor-default"
                    : "hover:border-slate-200 hover:shadow-md cursor-pointer"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p
                      className={`font-semibold text-sm mb-1 ${
                        q.status === "completed"
                          ? "text-slate-500"
                          : "text-slate-800"
                      }`}
                    >
                      {q.title}
                    </p>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {q.description}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${
                      q.status === "EN_ATTENTE"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {q.status === "EN_ATTENTE" ? "En attente" : "Complété"}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-3">
                  {q.status === "EN_ATTENTE"
                    ? `À compléter avant le ${q.dueDate}`
                    : `✓ Complété le ${q.completedAt}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Overlay */}
      {selectedQ && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(4px)",
          }}
          onClick={(e) => e.target === e.currentTarget && closeOverlay()}
        >
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Top bar */}
            <div className="flex items-start justify-between gap-3 p-6 pb-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800 leading-snug">
                {selectedQ.title}
              </h2>
              <button
                onClick={closeOverlay}
                className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="p-6">
              {/* Description */}
              <p className="text-sm text-slate-500 leading-relaxed mb-5">
                {selectedQ.description}
              </p>

              {/* Meta chips */}
              <div className="flex flex-wrap gap-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                  <Calendar className="w-3.5 h-3.5 opacity-60" />
                  Échéance : {selectedQ.dueDate}
                </div>
                <div className="flex items-center gap-2 text-xs font-medium bg-blue-50 border border-blue-100 text-blue-600 rounded-lg px-3 py-2">
                  <Clock className="w-3.5 h-3.5" />
                  En attente
                </div>
              </div>

              {/* Success banner */}
              {submitted && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-5 text-emerald-700 text-sm font-medium">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  Votre réponse a bien été envoyée !
                </div>
              )}

              {/* Response field */}
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Réponse
              </label>
              <p className="text-xs text-slate-400 mb-2">
                Saisissez votre réponse ci-dessous
              </p>
              <textarea
                value={reponse}
                onChange={(e) => setReponse(e.target.value)}
                disabled={submitted}
                placeholder="Écrivez votre réponse ici…"
                rows={5}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white resize-y transition-all disabled:opacity-60 placeholder:text-slate-400"
              />
              <p className="text-xs text-slate-400 text-right mt-1 mb-5">
                {reponse.length} caractères
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={closeOverlay}
                  className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitted || !reponse.trim()}
                  className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitted ? "Réponse envoyée ✓" : "Envoyer ma réponse"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
