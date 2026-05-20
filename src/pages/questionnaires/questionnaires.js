import { useState, useContext } from "react";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  Inbox,
  X,
  Calendar,
  Loader2,
} from "lucide-react";
import { EtatGlobalContext } from "../EtatGlobal";

export default function Questionnaires() {
  const { questionnaires, loadingQuestionnaires, fetchQuestionnaires } =
    useContext(EtatGlobalContext);

  const [activeTab, setActiveTab] = useState("EN_ATTENTE");
  const [selectedQ, setSelectedQ] = useState(null);
  const [reponse, setReponse] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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
    if (q.status === "completed") return;
    setSelectedQ(q);
    setReponse("");
    setSubmitted(false);
    setSubmitError(null);
  };

  const closeOverlay = () => {
    setSelectedQ(null);
    setReponse("");
    setSubmitted(false);
    setSubmitError(null);
  };

  const handleSubmit = async () => {
    if (!reponse.trim() || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch(
        `https://backend-myalfa.vercel.app/api/Questionnaire/${selectedQ.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "completed", answer: reponse }),
        }
      );
      if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);
      setSubmitted(true);
      await fetchQuestionnaires();
    } catch (error) {
      setSubmitError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingQuestionnaires) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" color="#981845" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">
            Questionnaires
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            Répondez aux demandes d'informations du cabinet
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm p-2 sm:p-4 mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-100 p-1 w-full flex items-center">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-white flex-1 flex items-center justify-center gap-1 text-[11px] sm:text-sm px-1 sm:px-3 py-1.5"
              >
                <ClipboardList className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 hidden sm:block" />
                <span className="truncate">
                  Tous{" "}
                  <span className="text-slate-400">
                    ({questionnaires.length})
                  </span>
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="EN_ATTENTE"
                className="data-[state=active]:bg-white flex-1 flex items-center justify-center gap-1 text-[11px] sm:text-sm px-1 sm:px-3 py-1.5"
              >
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 hidden sm:block" />
                <span className="truncate">
                  À compléter{" "}
                  <span className="text-slate-400">({EN_ATTENTECount})</span>
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="completed"
                className="data-[state=active]:bg-white flex-1 flex items-center justify-center gap-1 text-[11px] sm:text-sm px-1 sm:px-3 py-1.5"
              >
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 hidden sm:block" />
                <span className="truncate">
                  Complétés{" "}
                  <span className="text-slate-400">({completedCount})</span>
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* List */}
        {filteredQuestionnaires.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-slate-800">
              Aucun questionnaire
            </h3>
            <p className="text-sm text-slate-500 mt-1">
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
                className={`bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-transparent transition-all duration-200 ${
                  q.status === "completed"
                    ? "opacity-60 cursor-default"
                    : "hover:border-slate-200 hover:shadow-md cursor-pointer"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-semibold text-sm mb-1 truncate ${
                        q.status === "completed"
                          ? "text-slate-500"
                          : "text-slate-800"
                      }`}
                    >
                      {q.title}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2">
                      {q.description}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 sm:px-3 py-1 rounded-full flex-shrink-0 ${
                      q.status === "EN_ATTENTE"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {q.status === "EN_ATTENTE" ? "En attente" : "Complété"}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-2 sm:mt-3">
                  {q.status === "EN_ATTENTE"
                    ? `À compléter avant le ${new Date(
                        q.dueDate
                      ).toLocaleDateString("fr-FR")}`
                    : `✓ Complété le ${new Date(
                        q.completedAt
                      ).toLocaleDateString("fr-FR")}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Overlay — bottom sheet sur mobile, modal centré sur sm+ */}
      {selectedQ && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(4px)",
          }}
          onClick={(e) => e.target === e.currentTarget && closeOverlay()}
        >
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto">
            {/* Top bar */}
            <div className="flex items-start justify-between gap-3 p-4 sm:p-6 pb-3 sm:pb-4 border-b border-slate-100">
              <h2 className="text-base sm:text-lg font-semibold text-slate-800 leading-snug">
                {selectedQ.title}
              </h2>
              <button
                onClick={closeOverlay}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-4 sm:mb-5">
                {selectedQ.description}
              </p>

              {/* Meta chips */}
              <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5">
                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-60" />
                  Échéance :{" "}
                  {new Date(selectedQ.dueDate).toLocaleDateString("fr-FR")}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium bg-blue-50 border border-blue-100 text-blue-600 rounded-lg px-2.5 py-1.5">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  En attente
                </div>
              </div>

              {/* Bannière succès */}
              {submitted && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 mb-4 sm:mb-5 text-emerald-700 text-xs sm:text-sm font-medium">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Votre réponse a bien été envoyée !
                </div>
              )}

              {/* Bannière erreur */}
              {submitError && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 mb-4 sm:mb-5 text-red-600 text-xs sm:text-sm font-medium">
                  <X className="w-4 h-4 flex-shrink-0" />
                  {submitError}
                </div>
              )}

              {/* Textarea */}
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Réponse
              </label>
              <p className="text-xs text-slate-400 mb-2">
                Saisissez votre réponse ci-dessous
              </p>
              <textarea
                value={reponse}
                onChange={(e) => setReponse(e.target.value)}
                disabled={submitted || submitting}
                placeholder="Écrivez votre réponse ici…"
                rows={4}
                className="w-full border border-slate-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white resize-y transition-all disabled:opacity-60 placeholder:text-slate-400"
              />
              <p className="text-xs text-slate-400 text-right mt-1 mb-4 sm:mb-5">
                {reponse.length} caractères
              </p>

              {/* Buttons */}
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={closeOverlay}
                  disabled={submitting}
                  className="flex-1 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitted || submitting || !reponse.trim()}
                  className="flex-[2] py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Envoi…
                    </>
                  ) : submitted ? (
                    "Réponse envoyée ✓"
                  ) : (
                    "Envoyer ma réponse"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
