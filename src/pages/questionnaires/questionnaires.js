import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ClipboardList, Clock, CheckCircle, Inbox } from "lucide-react";

export default function Questionnaires() {
  const [questionnaires] = useState([]); // on met juste un tableau vide pour l'instant
  const [activeTab, setActiveTab] = useState("pending");

  const filteredQuestionnaires = questionnaires.filter((q) => {
    if (activeTab === "all") return true;
    return q.status === activeTab;
  });

  const pendingCount = questionnaires.filter(
    (q) => q.status === "pending"
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
                value="pending"
                className="data-[state=active]:bg-white gap-2"
              >
                <Clock className="w-4 h-4" />À compléter ({pendingCount})
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
              {activeTab === "pending"
                ? "Vous êtes à jour !"
                : "Aucun questionnaire disponible"}
            </p>
          </div>
        ) : (
          <div>
            {/* Ici tu pourras afficher la liste des questionnaires quand elle existera */}
            {filteredQuestionnaires.map((q, index) => (
              <div key={index} className="bg-white p-4 rounded-lg mb-2 shadow">
                <p>{q.title || "Questionnaire sans titre"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
