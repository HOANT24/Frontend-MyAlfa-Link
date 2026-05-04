import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ClipboardList, Clock, CheckCircle, Inbox } from "lucide-react";

export default function Questionnaires() {
  const [questionnaires] = useState([
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-800">
            Questionnaires
          </h1>
          <p className="text-slate-500 mt-1">
            Répondez aux demandes d'informations du cabinet
          </p>
        </div>

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
          <div>
            {/* Ici tu pourras afficher la liste des questionnaires quand elle existera */}
            {filteredQuestionnaires.map((q, index) => (
              <div key={q.id} className="bg-white p-4 rounded-lg mb-2 shadow">
                <p className="font-medium">{q.title}</p>
                <p className="text-sm text-slate-500">{q.description}</p>
                <div className="text-xs text-slate-400 mt-2">
                  {q.status === "EN_ATTENTE"
                    ? `À compléter avant le ${q.dueDate}`
                    : `Complété le ${q.completedAt}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
